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
import { useParams } from 'react-router';
import { InventoryApi } from '../../../../_sitecommon/common/api/inventory.api';
import { debounceClick } from '../../../../_sitecommon/common/helpers/global/GlobalHelper';
import { toast } from 'react-toastify';

export default function ManageProductPage() {
    const { id } = useParams();
    const { register, getValues, setValue, trigger, formState: { errors } } = useForm();
    const [isUpdate] = useState<boolean>(id ? true : false);
    const [units, setUnits] = useState<any>([]);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [isProductTypeRollSelected, setIsProductTypeRollSelected] = useState<boolean>(false);

    useEffect(() => {
        getUnits();
        trySetUpdateFormData();
    }, []);

    const onProductTypeChange = (data: any) => {
        if (data === ProductTypeEnum.Roll) {
            setIsProductTypeRollSelected(true);
        } else {
            setIsProductTypeRollSelected(false);
        }
    }

    const onSubmit = async () => {
        setFormSubmitted(true);
        const isValid = await trigger();
        if (isValid) {
            const formValue = getValues();
            const payload = {
                name: formValue.productName,
                shortDescription: formValue.shortDescription,
                sku: formValue.sku,
                quantity: formValue.quantity,
                weight: formValue.weight,
                weightUnitId: formValue.weightUnitId,
                type: formValue.type,
                source: formValue.source,
                ...(isProductTypeRollSelected && {
                    width: formValue.width,
                    widthUnitId: formValue.widthUnitId,
                    length: formValue.length,
                    lengthUnitId: formValue.lengthUnitId,
                    micron: formValue.micron,
                })
            };
            InventoryApi.create(payload)
                .then((response) => { toast.success(response.data.message) })
                .catch((response) => { toast.error(response.data.message) })
        }
    }

    function getUnits(): void {
        InventoryApi.getUnits()
            .then((response) => {
                console.log(response.data.data);
                setUnits(response.data.data);
            })
            .catch((response) => { toast.error(response.data.message) })
    }

    function trySetUpdateFormData(): void {
        if (id && isUpdate) {
            InventoryApi.getById(parseInt(id, 10))
                .then((response) => {
                    const data = response.data;
                    setValue('productName', data.name);
                    setValue('shortDescription', data.shortDescription);
                    setValue('sku', data.sku);
                    setValue('quantity', parseFloat(data.quantity));
                    setValue('weight', parseFloat(data.weight));
                    setValue('weightUnitId', parseInt(data.weightUnitId));
                    setValue('type', data.type);
                    setValue('source', data.source);
                    if (data.type.toString() === ProductTypeEnum.Roll) {
                        setIsProductTypeRollSelected(true);
                        setValue('width', parseFloat(data.width));
                        setValue('widthUnitId', parseInt(data.widthUnitId));
                        setValue('length', parseFloat(data.length));
                        setValue('lengthUnitId', parseInt(data.lengthUnitId));
                        setValue('micron', parseFloat(data.micron));
                    }
                })
                .catch((response) => { toast.error(response.data.message) })
        }
    }

    return (
        <AdminLayout>
            <AdminPageHeader
                title={isUpdate ? 'Update Product' : 'Add Product'}
                pageDescription={isUpdate ? 'Update product details' : 'Add new product'}
                addNewClickType={'link'}
                newLink='site/products/create'
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
                                            <label className="form-label required">Source</label>
                                            <select
                                                id="source"
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.source ? 'is-invalid' : 'is-valid') : ''}`}
                                                disabled={isUpdate}
                                                {...register("source", { required: true })}>
                                                <option value="" disabled selected>Select source</option>
                                                <option value={ProductSourceEnum.Internal}>Internal</option>
                                                <option value={ProductSourceEnum.External}>External </option>
                                            </select>
                                            {errors.source && <SiteErrorMessage errorMsg='Source is required' />}
                                        </div>
                                    </div>
                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <label className="form-label required">Type</label>
                                            <select
                                                id="type"
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.type ? 'is-invalid' : 'is-valid') : ''}`}
                                                disabled={isUpdate}
                                                {...register("type", { required: true })}
                                                onChange={(e) => onProductTypeChange(e.target.value)}>
                                                <option value="" disabled selected>Select type</option>
                                                <option value={ProductTypeEnum.Solvent}>Solvent</option>
                                                <option value={ProductTypeEnum.Granule}>Granule</option>
                                                <option value={ProductTypeEnum.Roll}>Roll</option>
                                            </select>
                                            {errors.type && <SiteErrorMessage errorMsg='Type is required' />}
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
                                            <label className="form-label  ">Short Description</label>
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
                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <label className="form-label required">SKU</label>
                                            <input
                                                id="sku"
                                                type="text"
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.sku ? 'is-invalid' : 'is-valid') : ''}`}
                                                placeholder="Enter SKU"
                                                readOnly={isUpdate}
                                                {...register("sku", { required: true })} />
                                            {errors.sku && <SiteErrorMessage errorMsg='SKU is required' />}
                                        </div>
                                    </div>
                                    <div className='col-lg-6'>
                                        <div className="mb-10">
                                            <label className="form-label required ">Quantity</label>
                                            <input
                                                id="quantity"
                                                type="number"
                                                min={0}
                                                step={0.1}
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.quantity ? 'is-invalid' : 'is-valid') : ''}`}
                                                placeholder="Enter quantity"
                                                readOnly={isUpdate}
                                                {...register("quantity", { required: true })} />
                                            {errors.quantity && <SiteErrorMessage errorMsg='Quantity is required!' />}
                                        </div>
                                    </div>
                                    <div className='col-lg-3'>
                                        <div className="mb-10">
                                            <label className="form-label required">Weight</label>
                                            <input
                                                id="weight"
                                                type="number"
                                                min={0}
                                                step={0.1}
                                                className={`form-control form-control-solid ${formSubmitted ? (errors.weight ? 'is-invalid' : 'is-valid') : ''}`}
                                                placeholder="Enter weight"
                                                readOnly={isUpdate}
                                                {...register("weight", { required: true })}
                                            />
                                            {errors.weight && <SiteErrorMessage errorMsg='Weight is required!' />}
                                        </div>
                                    </div>
                                    <div className='col-lg-3'>
                                        <div className="mb-10">
                                            <label className="form-label required">Weight Unit</label>
                                            <select
                                                id="weight-unit"
                                                className={`form-select form-select-solid ${formSubmitted ? (errors.weightUnitId ? 'is-invalid' : 'is-valid') : ''}`}
                                                disabled={isUpdate}
                                                {...register("weightUnitId", { required: true })}>
                                                <option value="" disabled selected>Select weight unit</option>
                                                {units.map((unit: any) => (<option key={unit.id} value={unit.id}>{unit.shortName}</option>))}
                                            </select>
                                            {errors.weightUnitId && <SiteErrorMessage errorMsg='Weight unit is required' />}
                                        </div>
                                    </div>
                                    {
                                        isProductTypeRollSelected ?
                                            <>
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
                                                            readOnly={isUpdate}
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
                                                            disabled={isUpdate}
                                                            {...register("widthUnitId", { required: true })}>
                                                            <option value="" disabled selected>Select width unit</option>
                                                            {units.map((unit: any) => (<option key={unit.id} value={unit.id}>{unit.shortName}</option>))}
                                                        </select>
                                                        {errors.widthUnitId && <SiteErrorMessage errorMsg='Width unit is required' />}
                                                    </div>
                                                </div>
                                                <div className='col-lg-3'>
                                                    <div className="mb-10">
                                                        <label className="form-label required">Length</label>
                                                        <input
                                                            id="length"
                                                            type="number"
                                                            min={0}
                                                            step={0.1}
                                                            className={`form-control form-control-solid ${formSubmitted ? (errors.length ? 'is-invalid' : 'is-valid') : ''}`}
                                                            placeholder="Enter length"
                                                            readOnly={isUpdate}
                                                            {...register("length", { required: true })}
                                                        />
                                                        {errors.length && <SiteErrorMessage errorMsg='Length is required!' />}
                                                    </div>
                                                </div>
                                                <div className='col-lg-3'>
                                                    <div className="mb-10">
                                                        <label className="form-label required">Length Unit</label>
                                                        <select
                                                            id="length-unit"
                                                            className={`form-select form-select-solid ${formSubmitted ? (errors.lengthUnitId ? 'is-invalid' : 'is-valid') : ''}`}
                                                            aria-label="Select example"
                                                            disabled={isUpdate}
                                                            {...register("lengthUnitId", { required: true })}>
                                                            <option value="" disabled selected>Select length unit</option>
                                                            {units.map((unit: any) => (<option key={unit.id} value={unit.id}>{unit.shortName}</option>))}
                                                        </select>
                                                        {errors.lengthUnitId && <SiteErrorMessage errorMsg='Length unit is required' />}
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
                                                            readOnly={isUpdate}
                                                            {...register("micron", { required: true })}
                                                        />
                                                        {errors.micron && <SiteErrorMessage errorMsg='Micron is required!' />}
                                                    </div>
                                                </div>
                                            </>
                                            : null
                                    }
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                                <div className="d-flex justify-content-start align-content-center">
                                    <button type="button" className="btn btn-primary fs-3" onClick={debounceClick(onSubmit)}>
                                        <FontAwesomeIcon icon={faPaperPlane} /> {isUpdate ? 'Update' : 'Save'}
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