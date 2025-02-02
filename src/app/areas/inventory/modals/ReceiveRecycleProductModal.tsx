import { useForm } from "react-hook-form";
import { KTIcon } from "../../../../_sitecommon/helpers";
import { useState } from "react";
import ReactModal from "react-modal";
import SiteErrorMessage from "../../common/components/shared/SiteErrorMessage";
import { InventoryApi } from "../../../../_sitecommon/common/api/inventory.api";
import { showErrorMsg, showSuccessMsg } from "../../../../_sitecommon/common/helpers/global/ValidationHelper";

export default function ReceiveRecycleProductModal(props: any) {
    const { onClose, data } = props
    const { register, trigger, getValues, formState: { errors } } = useForm();
    const [formSubmitted, setFormSubmitted] = useState<Boolean>(false);

    const onSubmit = async () => {
        setFormSubmitted(true);
        const isValid = await trigger();
        if (isValid) {
            const formValue = getValues();
            const payload = {
                quantity: formValue.quantity,
                weight: formValue.weight,
                date: formValue.date
            };
            InventoryApi.addStock(data.id, payload)
                .then((response) => {
                    showSuccessMsg(response.data.message);
                    onClose();
                })
                .catch((error) => { showErrorMsg(error.response.data.message) })
                .finally(() => setFormSubmitted(false))
        }
    }

    return (
        <ReactModal
            isOpen={true}
            onRequestClose={onClose}
            className='admin-medium-modal'
            shouldCloseOnOverlayClick={false}>

            <div className='admin-modal-area'>
                <div className='admin-modal-header'>
                    <h2>Receive {data.sku} -- {data.name}</h2>
                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={onClose}>
                        <KTIcon className='fs-1' iconName='cross' />
                    </div>
                </div>
                <form>
                    <div className='modal-body py-lg-10 px-lg-10 admin-modal-height'>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required">Quantity</label>
                                    <input
                                        id="quantity"
                                        type="number"
                                        step={0.1}
                                        placeholder="Enter quantity"
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.quantity ? 'is-invalid' : 'is-valid') : ''}`}
                                        {...register("quantity", { required: true })} />
                                    {errors.quantity && <SiteErrorMessage errorMsg='Quantity is required' />}
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required">Weight</label>
                                    <input
                                        id="weight"
                                        type="number"
                                        step={0.1}
                                        placeholder="Enter weight"
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.weight ? 'is-invalid' : 'is-valid') : ''}`}
                                        {...register("weight", { required: true })} />
                                    {errors.weight && <SiteErrorMessage errorMsg='Weight is required' />}
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className="mb-10">
                                    <label className="form-label required">Date</label>
                                    <input
                                        id="date"
                                        type="date"
                                        placeholder="Enter date"
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.date ? 'is-invalid' : 'is-valid') : ''}`}
                                        {...register("date", { required: true })} />
                                    {errors.date && <SiteErrorMessage errorMsg='Date is required' />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='admin-modal-footer'>
                        <button className="btn btn-danger" type='button' onClick={onSubmit}>
                            Receive
                        </button>
                    </div>
                </form>
            </div>


        </ReactModal>
    )
}