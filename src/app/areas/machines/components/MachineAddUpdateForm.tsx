/* eslint-disable */

import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useForm } from 'react-hook-form';
import { KTIcon } from '../../../../_sitecommon/helpers';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';

interface MachineAddUpdateFormInterface {
    isOpen: boolean,
    closeModal: any,
    defaultValues: any,
    onSubmit: any,
    allMachineTypes: any
}



const MachineAddUpdateForm: React.FC<MachineAddUpdateFormInterface> = ({
    isOpen,
    closeModal,
    defaultValues,
    onSubmit,
    allMachineTypes
}) => {

    const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isEditCase, setIsEditCase] = useState(false);


    const onSubmitCategoryForm = (data: any) => {
        onSubmit(data);
        // reset(); // Clear the form after submission
    };

    useEffect(() => {
        if (defaultValues && defaultValues.machine_idEditForm && defaultValues.machine_idEditForm > 0) {
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
                        {isEditCase ? 'Update Machine' : 'Create Machine'}
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


                            <input type='hidden' id="machine_idEditForm" {...register("machine_idEditForm", { required: false })} />
                           
                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Machine Name</label>
                                    <input
                                        type="text"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.machine_name ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="machine_name" {...register("machine_name", { required: true })}

                                        placeholder="Enter machine name"
                                    />
                                    {errors.machine_name && <SiteErrorMessage errorMsg='Machine name is required' />}
                                </div>
                            </div>
                            
                           


                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required">Machine type </label>
                                    <select
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.machine_type_id ? 'is-invalid' : 'is-valid') : ''}`}

                                        aria-label="Select example"
                                        id="machine_type_id" {...register("machine_type_id", { required: true })}
                                        disabled={isEditCase}
                                    >
                                        <option value=''>--Select--</option>

                                        {allMachineTypes?.map((item: any, index: any) => (
                                            <option key={index} value={item.machine_type_id}>
                                                {item.machine_type_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.machine_type_id && <SiteErrorMessage errorMsg='Machine type is required' />}
                                </div>
                            </div>

                            
                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required ">Status </label>
                                    <select aria-label="Select example"
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.is_active ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="is_active" {...register("is_active", { required: true })}

                                    >

                                        <option value="1">Active</option>
                                        <option value="0">In Active</option>

                                    </select>
                                    {errors.is_active && <SiteErrorMessage errorMsg='Status is required' />}
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

export default MachineAddUpdateForm;