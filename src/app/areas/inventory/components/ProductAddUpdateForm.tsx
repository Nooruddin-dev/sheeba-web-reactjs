/* eslint-disable */

import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useForm } from 'react-hook-form';
import { KTIcon } from '../../../../_sitecommon/helpers';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';

interface ProductAddUpdateFormInterface {
    isOpen: boolean,
    closeModal: any,
    defaultValues: any,
    onSubmit: any,
    allUnitsList: any

}



const ProductAddUpdateForm: React.FC<ProductAddUpdateFormInterface> = ({
    isOpen,
    closeModal,
    defaultValues,
    onSubmit,
    allUnitsList

}) => {

    const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isEditCase, setIsEditCase] = useState(false);


    const onSubmitCategoryForm = (data: any) => {
        onSubmit(data);
        // reset(); // Clear the form after submission
    };

    useEffect(() => {
        if (defaultValues && defaultValues.productidEditForm && defaultValues.productidEditForm > 0) {
            setIsEditCase(true);
        }
    }, [])




    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            className={"admin-large-modal"}
            shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
        >


            <div className='admin-modal-area'>
                <div className='admin-modal-header'>
                    <h2>
                        {isEditCase ? 'Update Product' : 'Create Product'}
                    </h2>

                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                        <KTIcon className='fs-1' iconName='cross' />
                    </div>

                </div>
                <form
                    onSubmit={(e) => {
                        handleSubmit(onSubmitCategoryForm)(e);
                        setFormSubmitted(true);
                    }}
                >
                    <div className='modal-body py-lg-10 px-lg-10 admin-modal-height'>

                        <div className='row'>


                            <input type='hidden' id="productidEditForm" {...register("productidEditForm", { required: false })} />

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Product Name</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.product_name ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="product_name" {...register("product_name", { required: true })}

                                        placeholder="Enter product name"
                                    />
                                    {errors.product_name && <SiteErrorMessage errorMsg='Product name is required' />}
                                </div>
                            </div>

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label  ">Short Description</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.short_description ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="short_description" {...register("short_description", { required: false })}
                                        readOnly={isEditCase}
                                        placeholder="Enter product name"
                                    />
                                    {errors.short_description && <SiteErrorMessage errorMsg='Short description is required' />}
                                </div>
                            </div>

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label  required">SKU</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.sku ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="sku" {...register("sku", { required: true })}
                                        readOnly={isEditCase}
                                        placeholder="Enter product sku"
                                    />
                                    {errors.sku && <SiteErrorMessage errorMsg='SKU is required' />}
                                </div>
                            </div>



                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Quantity</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.stockquantity ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="stockquantity" {...register("stockquantity", { required: true })}
                                        readOnly={isEditCase}
                                        placeholder="Enter stock quantity"
                                    />
                                    {errors.stockquantity && <SiteErrorMessage errorMsg='Stock quantity is required!' />}
                                </div>
                            </div>

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Cost</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.price ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="price" {...register("price", { required: true })}
                                        readOnly={isEditCase}
                                        placeholder="Enter product cost"
                                    />
                                    {errors.price && <SiteErrorMessage errorMsg='Cost field is required!' />}
                                </div>
                            </div>

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Status </label>
                                    <select aria-label="Select example"
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.is_active ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="is_active" {...register("is_active", { required: true })}
                                        disabled={isEditCase}
                                    >

                                        <option value="1">Active</option>
                                        <option value="0">In Active</option>

                                    </select>
                                    {errors.is_active && <SiteErrorMessage errorMsg='Status is required' />}
                                </div>
                            </div>

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required">Unit </label>
                                    <select
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.unit_id ? 'is-invalid' : 'is-valid') : ''}`}

                                        aria-label="Select example"
                                        id="unit_id" {...register("unit_id", { required: true })}
                                        disabled={isEditCase}
                                    >
                                        <option value=''>--Select--</option>

                                        {allUnitsList?.map((item: any, index: any) => (
                                            <option key={index} value={item.unit_id}>
                                                {item.unit_short_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.unit_id && <SiteErrorMessage errorMsg='Unit is required' />}
                                </div>
                            </div>

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Size</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.size ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="size" {...register("size", { required: true })}
                                        readOnly={isEditCase}
                                        placeholder="Enter size"
                                    />
                                    {errors.size && <SiteErrorMessage errorMsg='Size is required!' />}
                                </div>
                            </div>



                        </div>

                    </div>

                    <div className='admin-modal-footer'>
                        <a href="#" className="btn btn-light" onClick={closeModal}>Close</a>

                        <button className="btn btn-danger" type='submit'>{isEditCase ? 'Update' : 'Save'}</button>
                    </div>
                </form>
            </div>


        </ReactModal>
    )
}

export default ProductAddUpdateForm;