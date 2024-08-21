/* eslint-disable */

import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useForm } from 'react-hook-form';
import { KTIcon } from '../../../../_sitecommon/helpers';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';
import ReactSelect from 'react-select';
import { gerProductionEntryListBySearchTermApi, getJobCardDetailByIdForEditApi, getProductDetailById } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { showErrorMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import { makeAnyStringShortAppenDots } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { MachineTypesEnum } from '../../../../_sitecommon/common/enums/GlobalEnums';
import { convertToTwoDecimalFloat } from '../../../../_sitecommon/common/helpers/global/GlobalHelper';
import { calculateTaxValueNewFunc } from '../../../../_sitecommon/common/helpers/global/OrderHelper';

interface JobCardDispatchAddFormInterface {
    isOpen: boolean,
    closeModal: any,
    defaultValues: any,
    onSubmit: any,


}





const JobCardDispatchAddForm: React.FC<JobCardDispatchAddFormInterface> = ({
    isOpen,
    closeModal,
    defaultValues,
    onSubmit,


}) => {

    const { register, watch, handleSubmit, reset, getValues, setValue, formState: { errors } } = useForm({ defaultValues });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isEditCase, setIsEditCase] = useState(false);

   
    const [card_tax_type, setCard_tax_type] = useState<any>(null);
    const [card_tax_value, setCard_tax_value] = useState<any>(0);
    




    const onSubmitProductEntryForm = (data: any) => {
        const formData = { ...data };

        formData.card_tax_type = card_tax_type,
        formData.card_tax_value = card_tax_value,

        onSubmit(formData);

        //onSubmit(data);
        // reset(); // Clear the form after submission
    };

   




    useEffect(() => {
        if (defaultValues && defaultValues.production_entry_idEditForm && defaultValues.production_entry_idEditForm > 0) {
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
                        {isEditCase ? 'Update Dispatch' : 'Job Dispatch Info'}
                    </h2>

                    <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                        <KTIcon className='fs-1' iconName='cross' />
                    </div>

                </div>
                <form
                    onSubmit={(e) => {
                        handleSubmit(onSubmitProductEntryForm)(e);
                        setFormSubmitted(true);
                    }}
                >
                    <div className='modal-body py-lg-10 px-lg-10 admin-modal-height'>

                        <div className='row'>



                            <input type='hidden' id="job_card_id" {...register("job_card_id", { required: false })} />





                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required">Item</label>
                                    <input
                                        type="text"
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.item_name ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="item_name" {...register("item_name", { required: true })}

                                        placeholder="Enter item"
                                    />

                                    {errors.item_name && <SiteErrorMessage errorMsg='Item is required' />}

                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required">No. Of Bags</label>
                                    <input
                                        type="number"
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.total_bags ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="total_bags" {...register("total_bags", { required: true })}

                                        placeholder="Enter no of bags"
                                    />

                                    {errors.total_bags && <SiteErrorMessage errorMsg='No. of bags is required' />}

                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required">Quantity</label>
                                    <input
                                        type="number"
                                        min={0}
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.quantity ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="quantity" {...register("quantity", { required: true })}

                                        placeholder="Enter quantity"
                                    />

                                    {errors.quantity && <SiteErrorMessage errorMsg='Quantity is required' />}

                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required">Core</label>
                                    <input
                                        type="number"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.core_value ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="core_value" {...register("core_value", { required: true })}

                                        placeholder="Enter core"
                                    />

                                    {errors.core_value && <SiteErrorMessage errorMsg='Core is required' />}

                                </div>
                            </div>

                        

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required">Gross</label>
                                    <input
                                       type="number"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.gross_value ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="gross_value" {...register("gross_value", { required: true })}

                                        placeholder="Enter gross"
                                    />

                                    {errors.gross_value && <SiteErrorMessage errorMsg='Gross is required' />}

                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required">Net Weight</label>
                                    <input
                                      type="number"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.net_weight ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="net_weight" {...register("net_weight", { required: true })}

                                        placeholder="Enter net weight"
                                    />

                                    {errors.net_weight && <SiteErrorMessage errorMsg='Net weight is required' />}

                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required">Grand Total</label>
                                    <input
                                       type="number"

                                        className={`form-control form-control-solid ${formSubmitted ? (errors.grand_total ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="grand_total" {...register("grand_total", { required: true })}

                                        placeholder="Enter grand total"
                                    />

                                    {errors.grand_total && <SiteErrorMessage errorMsg='Grand total is required' />}

                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label required ">Tax</label>
                                    {/* <input
                                                type="text"

                                                className={`form-control form-control-solid ${formSubmitted ? (errors.tax ? 'is-invalid' : 'is-valid') : ''}`}
                                                id="tax" {...register("tax", { required: true })}

                                                placeholder="Enter tax"
                                            /> */}

                                    <div className="tax-container">
                                        <select
                                            value={card_tax_type}
                                            onChange={(e) => setCard_tax_type(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="Percentage">Percentage</option>
                                            <option value="Fixed">Fixed</option>

                                        </select>
                                        <input
                                            className='form-control'
                                            type="number"
                                            min={0}
                                            value={card_tax_value || 0}

                                            onChange={(e) => setCard_tax_value(parseInt(e.target.value, 10))}
                                            placeholder="Enter tax value"
                                        />
                                    </div>


                                    {errors.tax && <SiteErrorMessage errorMsg='Tax is required' />}
                                </div>
                            </div>

                        



                            <div className='col-lg-4 mt-5'>
                                <div className="mb-10">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox"
                                            id="show_company_detail" {...register("show_company_detail")}
                                        />
                                        <label className="form-check-label" htmlFor="flexCheckChecked">
                                            Show Company Detail
                                        </label>
                                    </div>
                                    {errors.show_company_detail && <SiteErrorMessage errorMsg='Tax status is required' />}
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

export default JobCardDispatchAddForm;

