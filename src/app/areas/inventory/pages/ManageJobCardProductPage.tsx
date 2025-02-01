import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { KTCard, KTCardBody } from '../../../../_sitecommon/helpers';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';
import { Content } from '../../../../_sitecommon/layout/components/content';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { ProductSourceEnum, ProductTypeEnum } from '../../../../_sitecommon/common/enums/GlobalEnums';
import { useNavigate, useParams } from 'react-router';
import { InventoryApi } from '../../../../_sitecommon/common/api/inventory.api';
import { debounceClick } from '../../../../_sitecommon/common/helpers/global/GlobalHelper';
import { showErrorMsg, showSuccessMsg } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';

export default function ManageJobCardProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, getValues, setValue, trigger, formState: { errors } } = useForm();
    const [units, setUnits] = useState<any>([]);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

    useEffect(() => {
        getUnits();
        trySetUpdateFormData();
    }, []);

    const onSubmit = async () => {
        setFormSubmitted(true);
        const isValid = await trigger();
        if (isValid && id) {
            const formValue = getValues();
            const payload = {
                name: formValue.productName,
                shortDescription: formValue.shortDescription,
                type: ProductTypeEnum.Roll,
                source: ProductSourceEnum.JobCard,
                width: formValue.width,
                widthUnitId: formValue.widthUnitId,
                micron: formValue.micron,
            };
            InventoryApi.update(parseInt(id, 10), payload)
                .then((response) => {
                    showSuccessMsg(response.data.message);
                    navigate('/inventory/job-card');
                })
                .catch((error) => { showErrorMsg(error.response.data.message) })

        }
    }

    function getUnits(): void {
        InventoryApi.getUnits()
            .then((response) => {
                setUnits(response.data.data);
            })
            .catch((error) => { showErrorMsg(error.response.data.message) })
    }

    function trySetUpdateFormData(): void {
        if (id) {
            InventoryApi.getById(parseInt(id, 10))
                .then((response) => {
                    const data = response.data;
                    setValue('sku', data.sku);
                    setValue('productName', data.name);
                    setValue('shortDescription', data.shortDescription);
                    setValue('width', parseFloat(data.width));
                    setValue('widthUnitId', parseInt(data.widthUnitId));
                    setValue('micron', parseFloat(data.micron));
                })
                .catch((error) => { showErrorMsg(error.response.data.message) })
        }
    }

    return (
        <AdminLayout>
            <AdminPageHeader
                title='Update Job Card Product'
                pageDescription='Update product details'
                addNewClickType={'link'}
                newLink=''
                additionalInfo={{ showAddNewButton: false }}
            />
            <Content>
                <KTCard>
                    <KTCardBody className='py-4'>
                        <form
                            onSubmit={(e) => { }}>
                            <div className='py-lg-10 px-lg-10'>
                                <div className='row'>
                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <label className="form-label required ">SKU</label>
                                            <input
                                                id="product-name"
                                                type="text"
                                                className='form-control form-control-solid'
                                                readOnly={true}
                                                {...register("sku", { required: true })} />
                                        </div>
                                    </div>
                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Product Name</label>
                                            <input
                                                id="product-name"
                                                type="text"
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.productName ? 'is-invalid' : 'is-valid') : ''}`}
                                                placeholder="Enter name"
                                                {...register("productName", { required: true })} />
                                            {errors.productName && <SiteErrorMessage errorMsg='Product name is required' />}
                                        </div>
                                    </div>
                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <label className="form-label">Short Description</label>
                                            <input
                                                id="short-description"
                                                type="text"
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.shortDescription ? 'is-invalid' : 'is-valid') : ''}`}
                                                placeholder="Enter short description"
                                                {...register("shortDescription", { required: false })}
                                            />
                                            {errors.shortDescription && <SiteErrorMessage errorMsg='Short description is required' />}
                                        </div>
                                    </div>
                                    <div className='col-lg-3'>
                                        <div className="mb-10">
                                            <label className="form-label required">Width</label>
                                            <input
                                                id="width"
                                                type="number"
                                                min={0}
                                                step={0.1}
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.width ? 'is-invalid' : 'is-valid') : ''}`}
                                                placeholder="Enter width"
                                                {...register("width", { required: true })}
                                            />
                                            {errors.width && <SiteErrorMessage errorMsg='Width is required!' />}
                                        </div>
                                    </div>
                                    <div className='col-lg-3'>
                                        <div className="mb-10">
                                            <label className="form-label required">Width Unit</label>
                                            <select
                                                id="width-unit"
                                                className={`form-select form-select-solid ${formSubmitted ? (errors.widthUnitId ? 'is-invalid' : 'is-valid') : ''}`}
                                                aria-label="Select example"
                                                {...register("widthUnitId", { required: true })}>
                                                <option value="" disabled selected>Select width unit</option>
                                                {units.map((unit: any) => (<option key={unit.id} value={unit.id}>{unit.shortName}</option>))}
                                            </select>
                                            {errors.widthUnitId && <SiteErrorMessage errorMsg='Width unit is required' />}
                                        </div>
                                    </div>
                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <label className="form-label required">Micron</label>
                                            <input
                                                id="micron"
                                                type="number"
                                                min={0}
                                                step={0.1}
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.micron ? 'is-invalid' : 'is-valid') : ''}`}
                                                placeholder="Enter micron"
                                                {...register("micron", { required: true })}
                                            />
                                            {errors.micron && <SiteErrorMessage errorMsg='Micron is required!' />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                                <div className="d-flex justify-content-start align-content-center">
                                    <button type="button" className="btn btn-primary fs-3" onClick={debounceClick(onSubmit)}>
                                        <FontAwesomeIcon icon={faPaperPlane} /> Update
                                    </button>
                                </div>
                            </div>
                        </form>
                    </KTCardBody>
                </KTCard>
            </Content>
        </AdminLayout>
    )
}