import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { useForm } from 'react-hook-form';
import { KTIcon } from '../../../../_sitecommon/helpers';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';
import { PurchaseOrderStatusTypesEnum } from '../../../../_sitecommon/common/enums/GlobalEnums';


interface OrderStatusCommonFormInterface {
    isOpen: boolean,
    closeModal: any,
    defaultValues: any,
    onSubmit: any
}



const OrderStatusCommonForm: React.FC<OrderStatusCommonFormInterface> = ({
    isOpen,
    closeModal,
    defaultValues,
    onSubmit
}) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const onSubmitOrderStatusForm = (data: any) => {
        onSubmit(data);
        // reset(); // Clear the form after submission
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            className={"admin-small-modal"}
            shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
        >


            <div className='admin-modal-area'>
                <div className='admin-modal-header'>
                    <h2>Update Order Status</h2>

                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                        <KTIcon className='fs-1' iconName='cross' />
                    </div>

                </div>
                <form
                    onSubmit={(e) => {
                        handleSubmit(onSubmitOrderStatusForm)(e);
                        setFormSubmitted(true);
                    }}
                >
                    <div className='modal-body py-lg-10 px-lg-10'>

                        <div className='row'>




                        <input type='hidden' id="orderIdStatusEditForm" {...register("orderIdStatusEditForm", { required: false })} />
                         


                            <div className='col-lg-12'>
                                <div className="mb-10">
                                    <label className="form-label required ">Status </label>
                                    <select aria-label="Select example"
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.orderStatusIdForUpdate ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="orderStatusIdForUpdate" {...register("orderStatusIdForUpdate", { required: true })}

                                    >
                                         <option  value={PurchaseOrderStatusTypesEnum.Complete}>Complete</option>
                                         <option  value={PurchaseOrderStatusTypesEnum.Cancel}>Cancel</option>
                                        



                                    </select>
                                    {errors.orderStatusIdForUpdate && <SiteErrorMessage errorMsg='Status is required' />}
                                </div>
                            </div>


                        </div>

                    </div>

                    <div className='admin-modal-footer'>
                        <button  className="btn btn-light" onClick={closeModal}>Close</button>

                        <button className="btn btn-danger" type='submit'>Update</button>
                    </div>
                </form>
            </div>


        </ReactModal>
    )
}

export default OrderStatusCommonForm;