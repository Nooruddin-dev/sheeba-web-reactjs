import { useEffect, useState } from 'react';
import { KTCard, KTCardBody } from '../../../../_sitecommon/helpers';
import { Content } from '../../../../_sitecommon/layout/components/content';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import { useNavigate, useParams } from 'react-router';
import { InventoryApi } from '../../../../_sitecommon/common/api/inventory.api';
import ReactSelect from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { JobCardApi } from '../../../../_sitecommon/common/api/job-card.api';
import { MachineApi } from '../../../../_sitecommon/common/api/machine.api';
import { MachineTypesEnum, ProductSourceEnum } from '../../../../_sitecommon/common/enums/GlobalEnums';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';
import { useForm } from 'react-hook-form';
import { showErrorMsg, showSuccessMsg } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import { ProductionEntryApi } from '../../../../_sitecommon/common/api/production-entry.api';

export default function ManageProductionEntry() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { watch, register, getValues, setValue, trigger, formState: { errors } } = useForm({});
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [isUpdate] = useState<boolean>(id ? true : false);
    const [extruderBatchItems, setExtruderBatchItems] = useState<any[]>([]);
    const [material, setMaterial] = useState<any>({});
    const [shouldTakeMaterial, setShouldTakeMaterial] = useState<boolean>(false);
    const [isExtruderMachine, setIsExtruderMachine] = useState<boolean>(false);
    const [jobCards, setJobCards] = useState<any[]>([]);
    const [machines, setMachines] = useState<any[]>([]);
    const [materialOptions, setMaterialOptions] = useState<any[]>([]);

    const grossWeightWatch = watch('grossWeight');
    const wasteWatch = watch('waste');
    const tareWatch = watch('tare')
    const todayDate = new Date();
    const todayFormattedDate = todayDate
        .toLocaleDateString("en-CA")
        .split("/")
        .reverse()
        .join("-");

    useEffect(() => {
        register('jobCard', { required: true });
        register('machine', { required: true });
    })

    useEffect(() => {
        setExtruderBatchItems([{ key: `batch-item-${Math.random()}` }]);
    }, [isExtruderMachine])

    useEffect(() => {
        setValue('netWeight', getNetWeight());
    }, [grossWeightWatch, wasteWatch, tareWatch])

    const onJobCardSelected = (data: any) => {
        if (data) {
            setValue('jobCard', data.value);
        } else {
            setValue('jobCard', undefined);
        }
    }

    const onJobCardChange = (value: string) => {
        JobCardApi.autoComplete(value)
            .then((response) => {
                const jobCards = response.data.map((data: any) => ({
                    label: data.jobCardNo, value: data
                }));
                setJobCards(jobCards);
            })
            .catch(() => { })
    }

    const onMachineSelected = (data: any) => {
        if (data) {
            setValue('machine', data.value);
            setIsExtruderMachine(MachineTypesEnum.Extruder.toString() === data.value.typeId.toString());
            setShouldTakeMaterial([MachineTypesEnum.Lamination, MachineTypesEnum.Printing].includes(parseInt(data.value.typeId, 10)));
        } else {
            setValue('machine', undefined);
            setIsExtruderMachine(false);
            setShouldTakeMaterial(false);
        }
        setMaterial({});
    }

    const onMaterialSelected = (data: any) => {
        if (data) {
            setMaterial({ ...data.value });
        } else {
            setMaterial(undefined);
        }
    }

    const onMachineChange = (value: string) => {
        MachineApi.autoComplete(value)
            .then((response) => {
                const machines = response.data.map((data: any) => ({
                    label: data.name, value: data
                }));
                setMachines(machines);
            })
            .catch(() => { })
    }

    const onMaterialChange = (value: string) => {
        InventoryApi.autoComplete({ value })
            .then((response) => {
                const materials = response.data.map((data: any) => ({
                    label: `${data.sku} -- ${data.name}`, value: data
                }));
                setMaterialOptions(materials);
            })
            .catch(() => { })
    }

    const onAddExtruderBatchItem = () => {
        setExtruderBatchItems(calculateBatchPercentage([
            ...extruderBatchItems,
            { key: `batch-item-${Math.random()}` }
        ]));
    }

    const onRemoveExtruderBatchItem = (index: number) => {
        extruderBatchItems.splice(index, 1);
        setExtruderBatchItems(calculateBatchPercentage([
            ...extruderBatchItems
        ]));
    }

    const onExtruderBatchMaterialSelected = (index: number, value: any) => {
        extruderBatchItems[index].id = value ? value.value.id : undefined;
        setExtruderBatchItems(calculateBatchPercentage(extruderBatchItems));
    }

    const onExtruderBatchFieldChange = (index: number, value: string, fieldName: string) => {
        extruderBatchItems[index][fieldName] = parseFloat(value);
        setExtruderBatchItems(calculateBatchPercentage(extruderBatchItems));
    }

    const onSubmit = async () => {
        setFormSubmitted(true);

        if (!material?.id && shouldTakeMaterial) {
            showErrorMsg('Please select the material');
            return;
        }

        const isValid = await trigger();
        if (isValid) {
            const formValue = getValues();
debugger;
            if (material.source === ProductSourceEnum.JobCard && formValue.jobCard.extruderProductId.toString() !== material.id.toString()) {
                showErrorMsg('Selected material does not belongs to selected job card');
                return;
            }

            let consumedMaterials: any[] = []
            let producedMaterials: any[] = []
            const weightWithoutTare = (parseFloat(formValue.grossWeight) - parseFloat(formValue.tare));

            if (isExtruderMachine) {
                if (!validateBatchItems(extruderBatchItems)) {
                    return;
                }

                consumedMaterials = extruderBatchItems.map((batch) => {
                    const estimatedWeight = weightWithoutTare * (batch.percentage / 100);
                    return {
                        id: batch.id,
                        quantity: 0,
                        grossWeight: estimatedWeight,
                        wasteWeight: 0,
                        tareWeight: 0,
                        weightWithoutTare: estimatedWeight,
                        netWeight: estimatedWeight,
                    }
                });
                producedMaterials = [{
                    id: formValue.jobCard.extruderProductId,
                    quantity: formValue.quantity,
                    grossWeight: formValue.grossWeight,
                    wasteWeight: formValue.waste,
                    tareWeight: formValue.tare,
                    weightWithoutTare: weightWithoutTare,
                    netWeight: formValue.netWeight,
                }]
            } else {
                consumedMaterials = [{
                    id: material.id,
                    quantity: formValue.quantity,
                    grossWeight: formValue.grossWeight,
                    wasteWeight: formValue.waste,
                    tareWeight: formValue.tare,
                    weightWithoutTare: weightWithoutTare,
                    netWeight: formValue.netWeight,
                }]
            }

            const payload = {
                jobCardId: formValue.jobCard.id,
                machineId: formValue.machine.id,
                date: todayDate,
                startTime: formValue.startTime,
                endTime: formValue.endTime,
                consumedMaterials,
                producedMaterials
            }

            ProductionEntryApi.create(payload)
                .then((response) => {
                    showSuccessMsg(response.data.message);
                    navigate('/job-management/production-entries')
                })
                .catch((error) => showErrorMsg(error.response.data.message))
                .finally(() => {
                    setFormSubmitted(false);
                })
        }
    }

    function calculateBatchPercentage(materials: any[]): any[] {
        const sumOfGrossWeight = materials.reduce((sum, item) => {
            return sum + parseFloat(item.weight || 0)
        }, 0);
        return materials.map((material) => {
            const weight = parseFloat(material.weight);
            return {
                ...material,
                percentage: parseFloat(((weight / sumOfGrossWeight * 100) || 0).toFixed(2))
            }
        });
    }

    function getNetWeight(): number {
        const grossWeight = parseFloat(getValues('grossWeight') || 0);
        const waste = parseFloat(getValues('waste') || 0);
        const tare = parseFloat(getValues('tare') || 0);
        return grossWeight - waste - tare;
    }

    function validateBatchItems(materials: any[]): boolean {
        for (let index = 0; index < materials.length; index++) {
            const item = materials[index];

            if (!item.id) {
                showErrorMsg(`Please select materials on batch line #${index + 1}`);
                return false;
            }

            if (item.weight === undefined) {
                showErrorMsg(`Please enter quantity on materials on batch line #${index + 1}`);
                return false;
            }
        }

        return true;
    }

    return (
        <AdminLayout>
            <AdminPageHeader
                title={isUpdate ? 'Update Production Entry' : 'New Production Entry'}
                pageDescription={isUpdate ? 'Update production entries against a job' : 'Add production entries against a job'}
                addNewClickType={'link'}
                newLink='/production-entry'
                additionalInfo={{ showAddNewButton: false }}
            />
            <Content>
                <KTCard>
                    <KTCardBody className='py-4'>
                        <form>
                            <div className='modal-body py-lg-10 px-lg-10'>
                                <div className='row'>
                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <label className="form-label ">Job Card No</label>
                                            <ReactSelect
                                                isMulti={false}
                                                isClearable={true}
                                                placeholder="Search and select job card by number"
                                                className="flex-grow-1"
                                                options={jobCards}
                                                onChange={onJobCardSelected}
                                                onInputChange={onJobCardChange} />
                                            {errors.jobCard && <SiteErrorMessage errorMsg='Job card is required' />}
                                        </div>
                                    </div>
                                    {
                                        getValues('jobCard') ?
                                            <>
                                                <div className='col-lg-6'>
                                                    <div className="mb-10">
                                                        <label className="form-label ">Machine</label>
                                                        <ReactSelect
                                                            isMulti={false}
                                                            isClearable={true}
                                                            placeholder="Search and select machine by name"
                                                            className="flex-grow-1"
                                                            options={machines}
                                                            onChange={onMachineSelected}
                                                            onInputChange={onMachineChange} />
                                                        {errors.machine && <SiteErrorMessage errorMsg='Machine is required' />}
                                                    </div>
                                                </div>
                                                <div className='col-lg-4'>
                                                    <div className="mb-10">
                                                        <label className="form-label ">Company Name</label>
                                                        <input
                                                            id="company-name"
                                                            type="text"
                                                            value={getValues('jobCard')?.companyName}
                                                            readOnly={true}
                                                            className='form-control form-control-solid' />
                                                    </div>
                                                </div>
                                                <div className='col-lg-4'>
                                                    <div className="mb-10">
                                                        <label className="form-label ">Product Name</label>
                                                        <input
                                                            id="product-name"
                                                            type="text"
                                                            value={getValues('jobCard')?.productName}
                                                            readOnly={true}
                                                            className='form-control form-control-solid' />
                                                    </div>
                                                </div>
                                                <div className='col-lg-4'>
                                                    <div className="mb-10">
                                                        <label className="form-label ">Quantity</label>
                                                        <input
                                                            id="quantity"
                                                            type="number"
                                                            value={getValues('jobCard')?.quantity}
                                                            readOnly={true}
                                                            className='form-control form-control-solid' />
                                                    </div>
                                                </div>
                                                <div className='col-lg-4'>
                                                    <div className="mb-10">
                                                        <label className="form-label ">Date</label>
                                                        <input
                                                            id="date"
                                                            type="date"
                                                            value={todayFormattedDate}
                                                            readOnly={true}
                                                            className='form-control form-control-solid' />
                                                    </div>
                                                </div>
                                                <div className='col-lg-4'>
                                                    <div className="mb-10">
                                                        <label className="form-label ">Start Time</label>
                                                        <input
                                                            id="start-time"
                                                            type="time"
                                                            className={`form-control form-control-solid ${formSubmitted ? (errors.startTime ? 'is-invalid' : 'is-valid') : ''}`}
                                                            {...register("startTime", { required: true })} />
                                                        {errors.startTime && <SiteErrorMessage errorMsg='Start time is required' />}
                                                    </div>
                                                </div>
                                                <div className='col-lg-4'>
                                                    <div className="mb-10">
                                                        <label className="form-label ">End Time</label>
                                                        <input
                                                            id="end-time"
                                                            type="time"
                                                            className={`form-control form-control-solid ${formSubmitted ? (errors.endTime ? 'is-invalid' : 'is-valid') : ''}`}
                                                            {...register("endTime", { required: true })} />
                                                        {errors.endTime && <SiteErrorMessage errorMsg='End time is required' />}
                                                    </div>
                                                </div>
                                                {
                                                    shouldTakeMaterial ?
                                                        <div className='col-lg-4'>
                                                            <div className="mb-10">
                                                                <label className="form-label ">Material</label>
                                                                <ReactSelect
                                                                    isMulti={false}
                                                                    isClearable={true}
                                                                    placeholder="Search and select material"
                                                                    className="flex-grow-1"
                                                                    options={materialOptions}
                                                                    onChange={onMaterialSelected}
                                                                    onInputChange={onMaterialChange} />
                                                            </div>
                                                        </div>
                                                        : null

                                                }
                                                <div className='col-lg-4'>
                                                    <div className="mb-10">
                                                        <label className="form-label ">Quantity</label>
                                                        <input
                                                            id="quantity"
                                                            type="number"
                                                            step="0.1"
                                                            className={`form-control form-control-solid ${formSubmitted ? (errors.quantity ? 'is-invalid' : 'is-valid') : ''}`}
                                                            {...register("quantity", { required: true })} />
                                                        {errors.quantity && <SiteErrorMessage errorMsg='Quantity is required' />}
                                                    </div>
                                                </div>
                                                <div className='col-lg-4'>
                                                    <div className="mb-10">
                                                        <label className="form-label ">Gross Weight</label>
                                                        <input
                                                            id="gross-weight"
                                                            type="number"
                                                            step="0.1"
                                                            className={`form-control form-control-solid ${formSubmitted ? (errors.grossWeight ? 'is-invalid' : 'is-valid') : ''}`}
                                                            {...register("grossWeight", { required: true })} />
                                                        {errors.grossWeight && <SiteErrorMessage errorMsg='Gross Weight is required' />}
                                                    </div>
                                                </div>
                                                <div className='col-lg-4'>
                                                    <div className="mb-10">
                                                        <label className="form-label ">Waste</label>
                                                        <input
                                                            id="end-time"
                                                            type="number"
                                                            step="0.1"
                                                            className={`form-control form-control-solid ${formSubmitted ? (errors.waste ? 'is-invalid' : 'is-valid') : ''}`}
                                                            {...register("waste", { required: true })} />
                                                        {errors.waste && <SiteErrorMessage errorMsg='Waste is required' />}
                                                    </div>
                                                </div>
                                                <div className='col-lg-4'>
                                                    <div className="mb-10">
                                                        <label className="form-label ">Tare/Core</label>
                                                        <input
                                                            id="end-time"
                                                            type="number"
                                                            step="0.1"
                                                            className={`form-control form-control-solid ${formSubmitted ? (errors.tare ? 'is-invalid' : 'is-valid') : ''}`}
                                                            {...register("tare", { required: true })} />
                                                        {errors.tare && <SiteErrorMessage errorMsg='Tare/Core is required' />}
                                                    </div>
                                                </div>
                                                <div className='col-lg-4'>
                                                    <div className="mb-10">
                                                        <label className="form-label ">Net Weight</label>
                                                        <input
                                                            id="end-time"
                                                            type="number"
                                                            readOnly={true}
                                                            className='form-control form-control-solid'
                                                            {...register("netWeight", { required: true })} />
                                                    </div>
                                                </div>
                                            </>
                                            : null
                                    }
                                </div>

                                {
                                    isExtruderMachine ?
                                        <>
                                            <hr />

                                            <div className='row'>
                                                <div className='col-lg-6'>
                                                    <h3>Batch</h3>
                                                </div>
                                                <div className='col-lg-12'>
                                                    <table style={{ width: '70%' }}>
                                                        <tbody>
                                                            {
                                                                extruderBatchItems.map((item, index) => (
                                                                    <tr key={item.key}>
                                                                        <td className='px-3'>
                                                                            <ReactSelect
                                                                                isMulti={false}
                                                                                isClearable={true}
                                                                                placeholder="Search and select material"
                                                                                className="flex-grow-1"
                                                                                options={materialOptions}
                                                                                onChange={(value) => onExtruderBatchMaterialSelected(index, value)}
                                                                                onInputChange={onMaterialChange} />
                                                                        </td>
                                                                        <td className='px-5'>
                                                                            <input
                                                                                id={"weight=" + index}
                                                                                type="number"
                                                                                step={0.1}
                                                                                value={item.weight}
                                                                                placeholder="Enter weight"
                                                                                className='form-control form-control-solid'
                                                                                onChange={(e) => onExtruderBatchFieldChange(index, e.target.value, 'weight')} />
                                                                        </td>
                                                                        <td className='px-5 min-w-50px'>
                                                                            {item.percentage}%
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                index === extruderBatchItems.length - 1 ?
                                                                                    <button type='button' className="btn btn-light-secondary fs-3" onClick={onAddExtruderBatchItem}>
                                                                                        <FontAwesomeIcon icon={faPlus} />
                                                                                    </button>
                                                                                    :
                                                                                    <button type='button' className="btn btn-light-secondary fs-3" onClick={() => onRemoveExtruderBatchItem(index)}>
                                                                                        <FontAwesomeIcon icon={faTrashCan} />
                                                                                    </button>
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </>
                                        : null
                                }

                            </div>
                            {
                                getValues('jobCard') ?
                                    <button type='button' className="btn btn-primary fs-3" onClick={onSubmit}>
                                        <FontAwesomeIcon icon={faSave} /> Save
                                    </button>
                                    : null
                            }

                        </form>
                    </KTCardBody>
                </KTCard>
            </Content>
        </AdminLayout >
    )
}