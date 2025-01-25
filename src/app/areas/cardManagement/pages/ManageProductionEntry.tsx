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
    const { register, getValues, setValue, trigger, formState: { errors } } = useForm({});
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [isUpdate] = useState<boolean>(id ? true : false);
    const [consumedMaterials, setConsumedMaterials] = useState<any[]>([]);
    const [producedMaterial, setProducedMaterial] = useState<any>();
    const [isProducerMachineSelected, setProducerMachineSelected] = useState<boolean>(false);
    const [isConsumerMachineSelected, setConsumerMachineSelected] = useState<boolean>(false);
    const [jobCards, setJobCards] = useState<any[]>([]);
    const [machines, setMachines] = useState<any[]>([]);
    const [internalMaterials, setInternalMaterials] = useState<any[]>([]);
    const [externalMaterials, setExternalMaterials] = useState<any[]>([]);

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
        if (isProducerMachineSelected) {
            const summary = getConsumedMaterialTotal();
            setProducedMaterial({
                quantity: summary.quantity,
                grossWeight: summary.grossWeight,
                wasteWeight: summary.wasteWeight,
                tareWeight: summary.tareWeight,
                netWeight: summary.netWeight,
                percentage: 100
            });
        }
    }, [consumedMaterials])

    useEffect(() => {
        if (isConsumerMachineSelected) {
            onAddConsumedMaterial();
        } else {
            setConsumedMaterials([]);
        }
    }, [isConsumerMachineSelected])

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
            setProducerMachineSelected([MachineTypesEnum.Extruder, MachineTypesEnum.Cutting].includes(parseInt(data.value.typeId, 10)));
            setConsumerMachineSelected([MachineTypesEnum.Extruder, MachineTypesEnum.Lamination, MachineTypesEnum.Printing].includes(parseInt(data.value.typeId, 10)));
        } else {
            setValue('machine', undefined);
            setProducerMachineSelected(false);
            setConsumerMachineSelected(false);
        }
    }

    const onExternalMaterialSelected = (index: number, data: any) => {
        if (data) {
            consumedMaterials[index].id = data.value.id
        } else {
            consumedMaterials[index].id = undefined;
        }
        setConsumedMaterials([...consumedMaterials]);
    }

    const onInternalMaterialSelected = (data: any) => {
        if (data) {
            producedMaterial.id = data.value.id;
        } else {
            producedMaterial.id = undefined;
        }
        setProducedMaterial({ ...producedMaterial });
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

    const onExternalMaterialChange = (value: string) => {
        InventoryApi.autoComplete({ value, source: ProductSourceEnum.External })
            .then((response) => {
                const materials = response.data.map((data: any) => ({
                    label: data.name, value: data
                }));
                setExternalMaterials(materials);
            })
            .catch(() => { })
    }

    const onInternalMaterialChange = (value: string) => {
        InventoryApi.autoComplete({ value, source: ProductSourceEnum.Internal })
            .then((response) => {
                const materials = response.data.map((data: any) => ({
                    label: data.name, value: data
                }));
                setInternalMaterials(materials);
            })
            .catch(() => { })
    }

    const onAddConsumedMaterial = () => {
        setConsumedMaterials(calculateConsumedMaterial([
            ...consumedMaterials,
            {
                percentage: 0
            }
        ]));
    }

    const onRemoveConsumedMaterial = (index: number) => {
        consumedMaterials.splice(index, 1);
        setConsumedMaterials(calculateConsumedMaterial([
            ...consumedMaterials
        ]));
    }

    const onConsumedMaterialChange = (index: number, value: string, fieldName: string) => {
        consumedMaterials[index][fieldName] = parseFloat(value);
        setConsumedMaterials(calculateConsumedMaterial(consumedMaterials));
    }

    const onProducedMaterialChange = (value: string, fieldName: string) => {
        producedMaterial[fieldName] = parseFloat(value);
        setProducedMaterial(calculateProducedMaterialWeight(producedMaterial));
    }

    const onSubmit = async () => {
        setFormSubmitted(true);
        const isValid = await trigger();
        const consumedMaterialsValid = validateMaterial(consumedMaterials, 'consumed');
        const producedMaterialsValid = producedMaterial ? validateMaterial([producedMaterial], 'produced') : true;
        if (isValid && consumedMaterialsValid && producedMaterialsValid) {
            const formValue = getValues();
            const payload = {
                jobCardId: formValue.jobCard.id,
                machineId: formValue.machine.id,
                date: todayDate,
                startTime: formValue.startTime,
                endTime: formValue.endTime,
                consumedMaterials: consumedMaterials.map((material) => ({
                    id: material.id,
                    quantity: material.quantity,
                    grossWeight: material.grossWeight,
                    wasteWeight: material.wasteWeight,
                    tareWeight: material.tareWeight,
                    netWeight: material.netWeight,
                    percentage: material.percentage
                })),
                producedMaterials: [{
                    id: producedMaterial.id,
                    quantity: producedMaterial.quantity,
                    grossWeight: producedMaterial.grossWeight,
                    wasteWeight: producedMaterial.wasteWeight,
                    tareWeight: producedMaterial.tareWeight,
                    netWeight: producedMaterial.netWeight,
                    percentage: producedMaterial.percentage
                }]
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

    function calculateConsumedMaterial(materials: any[]): any[] {
        const sumOfGrossWeight = materials.reduce((sum, item) => {
            return sum + parseFloat(item.grossWeight || 0)
        }, 0);
        return materials.map((material) => {
            const grossWeight = parseFloat(material.grossWeight) || 0;
            const wasteWeight = parseFloat(material.wasteWeight) || 0;
            const tareWeight = parseFloat(material.tareWeight) || 0;
            const netWeight = parseFloat((grossWeight - wasteWeight - tareWeight).toFixed(2));
            return {
                ...material,
                netWeight,
                percentage: parseFloat(((grossWeight / sumOfGrossWeight * 100) || 0).toFixed(2))
            }
        });
    }

    function getConsumedMaterialTotal(): any {
        return consumedMaterials.reduce(
            (totals, material) => {
                totals.quantity += material.quantity || 0;
                totals.wasteWeight += material.wasteWeight || 0;
                totals.tareWeight += material.tareWeight || 0;
                totals.grossWeight += material.grossWeight || 0;
                totals.netWeight += parseFloat(material.netWeight || 0);
                return totals;
            },
            { quantity: 0, wasteWeight: 0, tareWeight: 0, grossWeight: 0, netWeight: 0, }
        );
    }

    function calculateProducedMaterialWeight(material: any): any {
        const grossWeight = parseFloat(material.grossWeight) || 0;
        const wasteWeight = parseFloat(material.wasteWeight) || 0;
        const tareWeight = parseFloat(material.tareWeight) || 0;
        const netWeight = parseFloat((grossWeight - wasteWeight - tareWeight).toFixed(2));
        return {
            ...material,
            netWeight,
        }
    }

    function validateMaterial(materials: any[], type: 'consumed' | 'produced'): any {
        for (let index = 0; index < materials.length; index++) {
            const item = materials[index];
            if (!item.id) {
                showErrorMsg(`Please select ${type} material #${index + 1}`)
                return false;
            }

            if (item.quantity === undefined) {
                showErrorMsg(`Please enter quantity on ${type} material #${index + 1}`)
                return false;
            }

            if (item.grossWeight === undefined) {
                showErrorMsg(`Please enter gross weight on ${type} material #${index + 1}`)
                return false;
            }

            if (item.wasteWeight === undefined) {
                showErrorMsg(`Please enter waste on ${type} material #${index + 1}`)
                return false;
            }

            if (item.tareWeight === undefined) {
                showErrorMsg(`Please enter tare/core on ${type} material #${index + 1}`)
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
                                            {errors.startTime && <SiteErrorMessage errorMsg='Start time is required' />}
                                        </div>
                                    </div>
                                </div>
                                <hr />

                                {
                                    isConsumerMachineSelected ?
                                        <>
                                            <div className='row'>
                                                <div className='col-lg-6'>
                                                    <h3>Material Consumed</h3>
                                                </div>
                                                <div className='col-lg-12'>
                                                    <table style={{ width: '100%' }}>
                                                        <thead>
                                                            <tr>
                                                                <th className='min-w-250px'>Material</th>
                                                                <th className='min-w-50px'>Quantity</th>
                                                                <th className='min-w-50px'>Gross Weight</th>
                                                                <th className='min-w-50px'>Waste Weight</th>
                                                                <th className='min-w-50px'>Tare/Core</th>
                                                                <th className='min-w-150px'>Net Weight</th>
                                                                <th className='min-w-150px'>Percentage</th>
                                                                <th className='min-w-50px'></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                consumedMaterials.map((material, index) => (
                                                                    <tr key={'consumedMaterials-' + index}>
                                                                        <td className='px-3'>
                                                                            <ReactSelect
                                                                                isMulti={false}
                                                                                isClearable={true}
                                                                                placeholder="Search and select material"
                                                                                className="flex-grow-1"
                                                                                options={externalMaterials}
                                                                                onChange={(value) => onExternalMaterialSelected(index, value)}
                                                                                onInputChange={onExternalMaterialChange} />
                                                                        </td>
                                                                        <td className='px-5'>
                                                                            <input
                                                                                id="consumed-material-quantity"
                                                                                type="number"
                                                                                step={0.1}
                                                                                value={material.quantity}
                                                                                className='form-control form-control-solid'
                                                                                onChange={(e) => onConsumedMaterialChange(index, e.target.value, 'quantity')} />
                                                                        </td>
                                                                        <td className='px-5'>
                                                                            <input
                                                                                id="gross-weight"
                                                                                type="number"
                                                                                step={0.1}
                                                                                value={material.grossWeight}
                                                                                className='form-control form-control-solid'
                                                                                onChange={(e) => onConsumedMaterialChange(index, e.target.value, 'grossWeight')} />
                                                                        </td>
                                                                        <td className='px-5'>
                                                                            <input
                                                                                id="waste-weight"
                                                                                type="number"
                                                                                step={0.1}
                                                                                value={material.wasteWeight}
                                                                                className='form-control form-control-solid'
                                                                                onChange={(e) => onConsumedMaterialChange(index, e.target.value, 'wasteWeight')} />
                                                                        </td>
                                                                        <td className='px-5'>
                                                                            <input
                                                                                id="tare-weight"
                                                                                type="number"
                                                                                step={0.1}
                                                                                value={material.tareWeight}
                                                                                className='form-control form-control-solid'
                                                                                onChange={(e) => onConsumedMaterialChange(index, e.target.value, 'tareWeight')} />
                                                                        </td>
                                                                        <td className='px-5'>
                                                                            {material.netWeight}
                                                                        </td>
                                                                        <td className='px-5'>
                                                                            {material.percentage}%
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                index === consumedMaterials.length - 1 ?
                                                                                    <button type='button' className="btn btn-light-secondary fs-3" onClick={onAddConsumedMaterial}>
                                                                                        <FontAwesomeIcon icon={faPlus} />
                                                                                    </button>
                                                                                    :
                                                                                    <button type='button' className="btn btn-light-secondary fs-3" onClick={() => onRemoveConsumedMaterial(index)}>
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
                                            <hr />
                                        </>
                                        : null
                                }

                                {
                                    isProducerMachineSelected ?
                                        <>
                                            <div className='row'>
                                                <div className='col-lg-6'>
                                                    <h3>Material Produced</h3>
                                                </div>
                                                <div className='col-lg-12'>
                                                    <table style={{ width: '100%' }}>
                                                        <thead>
                                                            <tr>
                                                                <th className='min-w-250px'>Material</th>
                                                                <th className='min-w-50px'>Quantity</th>
                                                                <th className='min-w-50px'>Gross Weight</th>
                                                                <th className='min-w-50px'>Waste Weight</th>
                                                                <th className='min-w-50px'>Tare/Core</th>
                                                                <th className='min-w-150px'>Net Weight</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                <tr>
                                                                    <td className='px-3'>
                                                                        <ReactSelect
                                                                            isMulti={false}
                                                                            isClearable={true}
                                                                            placeholder="Search and select material"
                                                                            className="flex-grow-1"
                                                                            options={internalMaterials}
                                                                            onChange={onInternalMaterialSelected}
                                                                            onInputChange={onInternalMaterialChange} />
                                                                    </td>
                                                                    <td className='px-5'>
                                                                        <input
                                                                            id="produced-material-quantity"
                                                                            type="number"
                                                                            step={0.1}
                                                                            value={producedMaterial?.quantity}
                                                                            className='form-control form-control-solid'
                                                                            onChange={(e) => onProducedMaterialChange(e.target.value, 'quantity')} />
                                                                    </td>
                                                                    <td className='px-5'>
                                                                        <input
                                                                            id="gross-weight"
                                                                            type="number"
                                                                            step={0.1}
                                                                            value={producedMaterial?.grossWeight}
                                                                            className='form-control form-control-solid'
                                                                            onChange={(e) => onProducedMaterialChange(e.target.value, 'grossWeight')} />
                                                                    </td>
                                                                    <td className='px-5'>
                                                                        <input
                                                                            id="waste-weight"
                                                                            type="number"
                                                                            step={0.1}
                                                                            value={producedMaterial?.wasteWeight}
                                                                            className='form-control form-control-solid'
                                                                            onChange={(e) => onProducedMaterialChange(e.target.value, 'wasteWeight')} />
                                                                    </td>
                                                                    <td className='px-5'>
                                                                        <input
                                                                            id="tare-weight"
                                                                            type="number"
                                                                            step={0.1}
                                                                            value={producedMaterial?.tareWeight}
                                                                            className='form-control form-control-solid'
                                                                            onChange={(e) => onProducedMaterialChange(e.target.value, 'tareWeight')} />
                                                                    </td>
                                                                    <td className='px-5'>
                                                                        {producedMaterial?.netWeight}
                                                                    </td>
                                                                </tr>
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <hr />
                                        </>
                                        : null
                                }

                            </div>
                            <button type='button' className="btn btn-primary fs-3" onClick={onSubmit}>
                                <FontAwesomeIcon icon={faSave} /> Save
                            </button>
                        </form>
                    </KTCardBody>
                </KTCard>
            </Content>
        </AdminLayout >
    )
}