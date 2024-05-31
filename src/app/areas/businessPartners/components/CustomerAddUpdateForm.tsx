/* eslint-disable */

import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useForm } from 'react-hook-form';
import { KTIcon } from '../../../../_sitecommon/helpers';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';

interface CustomerAddUpdateFormInterface {
    isOpen: boolean,
    closeModal: any,
    defaultValues: any,
    onSubmit: any
}



const CustomerAddUpdateForm: React.FC<CustomerAddUpdateFormInterface> = ({
    isOpen,
    closeModal,
    defaultValues,
    onSubmit
}) => {

    const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isEditCase, setIsEditCase] = useState(false);


    const onSubmitCategoryForm = (data: any) => {
        onSubmit(data);
        // reset(); // Clear the form after submission
    };

    useEffect(() => {
        if (defaultValues && defaultValues.busnPartnerIdEditForm && defaultValues.busnPartnerIdEditForm > 0) {
            setIsEditCase(true);
        }
    }, [])




    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            className={"admin-medium-modal"}
            shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
        >


            <div className='admin-modal-area'>
                <div className='admin-modal-header'>
                    <h2>
                        {isEditCase ? 'Update Customer' : 'Create Customer'}
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


                            <input type='hidden' id="busnPartnerIdEditForm" {...register("busnPartnerIdEditForm", { required: false })} />
                            <input type='hidden' id="profilePictureId" {...register("profilePictureId", { required: false })} />

                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">First Name</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.firstName ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="firstName" {...register("firstName", { required: true })}

                                        placeholder="Enter first name"
                                    />
                                    {errors.firstName && <SiteErrorMessage errorMsg='First name is required' />}
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Last Name</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.lastName ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="lastName" {...register("lastName", { required: true })}

                                        placeholder="Enter last name"
                                    />
                                    {errors.lastName && <SiteErrorMessage errorMsg='Last name is required' />}
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Email Address</label>
                                    <input
                                        type="email"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.emailAddress ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="emailAddress" {...register("emailAddress", { required: true })}
                                        readOnly={isEditCase} // Apply readOnly conditionally
                                        placeholder="Enter email address"
                                    />
                                    {errors.emailAddress && <SiteErrorMessage errorMsg='Enter valid email address' />}
                                </div>
                            </div>
                           


                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Status </label>
                                    <select aria-label="Select example"
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.isActive ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="isActive" {...register("isActive", { required: true })}

                                    >

                                        <option value="1">Active</option>
                                        <option value="0">In Active</option>

                                    </select>
                                    {errors.isActive && <SiteErrorMessage errorMsg='Status is required' />}
                                </div>
                            </div>



                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Mobile/Phone No</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.phoneNo ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="phoneNo" {...register("phoneNo", { required: true })}

                                        placeholder="Enter mobile/phone no"
                                    />
                                    {errors.phoneNo && <SiteErrorMessage errorMsg='Mobile no is required' />}
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

export default CustomerAddUpdateForm;