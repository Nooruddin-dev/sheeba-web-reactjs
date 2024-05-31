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

}



const ProductAddUpdateForm: React.FC<ProductAddUpdateFormInterface> = ({
    isOpen,
    closeModal,
    defaultValues,
    onSubmit,

}) => {

    const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isEditCase, setIsEditCase] = useState(false);


    const onSubmitCategoryForm = (data: any) => {
        onSubmit(data);
        // reset(); // Clear the form after submission
    };

    useEffect(() => {
        if (defaultValues && defaultValues.productIdEditForm && defaultValues.productIdEditForm > 0) {
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


                            <input type='hidden' id="productIdEditForm" {...register("productIdEditForm", { required: false })} />

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Product Name</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.productName ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="productName" {...register("productName", { required: true })}

                                        placeholder="Enter product name"
                                    />
                                    {errors.productName && <SiteErrorMessage errorMsg='Product name is required' />}
                                </div>
                            </div>

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label  ">Short Description</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.shortDescription ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="shortDescription" {...register("shortDescription", { required: false })}
                                        readOnly={isEditCase}
                                        placeholder="Enter product name"
                                    />
                                    {errors.shortDescription && <SiteErrorMessage errorMsg='Short description is required' />}
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
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.stockQuantity ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="stockQuantity" {...register("stockQuantity", { required: true })}
                                        readOnly={isEditCase}
                                        placeholder="Enter stock quantity"
                                    />
                                    {errors.stockQuantity && <SiteErrorMessage errorMsg='Stock quantity is required!' />}
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
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.isActive ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="isActive" {...register("isActive", { required: true })}
                                        disabled={isEditCase}
                                    >

                                        <option value="1">Active</option>
                                        <option value="0">In Active</option>

                                    </select>
                                    {errors.isActive && <SiteErrorMessage errorMsg='Status is required' />}
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