/* eslint-disable */

import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useForm } from 'react-hook-form';
import { KTIcon } from '../../../../_sitecommon/helpers';
import SiteErrorMessage from '../../common/components/shared/SiteErrorMessage';
import ReactSelect from 'react-select';
import { gerProductionEntryListBySearchTermApi, getJobCardDetailByIdForEditApi, getProductDetailById } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { showErrorMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import { makeAnyStringShortAppendDots } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { MachineTypesEnum, sqlDeleteTypesConst } from '../../../../_sitecommon/common/enums/GlobalEnums';
import { convertToTwoDecimalFloat, generateUniqueIdWithDate } from '../../../../_sitecommon/common/helpers/global/GlobalHelper';
import { calculateTaxValueNewFunc } from '../../../../_sitecommon/common/helpers/global/OrderHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DeliveryChallanUnits } from '../../../../_sitecommon/common/constants/DeliveryChallanUnits';

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
    const [selectedOptionBagRoll, setselectedOptionBagRoll] = useState("Bag");

    const [deliveryChallanLineItems, setDeliveryChallanLineItems] = useState<any>([]);




    try {
        const total_bags_local = watch("total_bags") || 0;
        const quantity_local = watch("quantity") || 0;
        const net_weight_local = watch("net_weight") || 0;
        const tare_value_local = watch("tare_value") || 0;
        const dispatch_unit_id_local = watch("dispatch_unit_id")
        const netTotalValue = convertToTwoDecimalFloat(total_bags_local) * convertToTwoDecimalFloat(quantity_local);
       
        if(selectedOptionBagRoll == 'Roll'){
            setValue("total_value", (convertToTwoDecimalFloat(net_weight_local) - convertToTwoDecimalFloat(tare_value_local)));
        } else if(selectedOptionBagRoll == 'Bag' && dispatch_unit_id_local == 1){
            setValue("total_value", netTotalValue);
        } else if(selectedOptionBagRoll == 'Bag' && dispatch_unit_id_local == 2){
            setValue("total_value", (convertToTwoDecimalFloat(net_weight_local) - convertToTwoDecimalFloat(tare_value_local)));
        }

        if (Boolean(defaultValues.official)) {
            setValue("show_company_detail", true);
        }

    } catch (error) {
        console.error("An error occured in calculating total value: ", error);
    }

    const handleOptionChangeBagType = (e: any) => {
        setselectedOptionBagRoll(e.target.value); // Update the selected option
        // You can use this updated `setselectedOptionBagRoll` in other logic as well
        console.log("Selected option:", e.target.value);
    };

    const onSubmitProductEntryForm = (data: any) => {
        const formData = { ...data };

        if (deliveryChallanLineItems?.length === 0) {
            showErrorMsg("Please add at least one item in the line items!");
            return;
        }

        formData.deliveryChallanLineItems = deliveryChallanLineItems;
      
        if(selectedOptionBagRoll == 'Roll'){
            formData.quantity = 0;
        }

        onSubmit(formData);

        //onSubmit(data);
        // reset(); // Clear the form after submission
    };

    const handleDeleteDeliveryChallanItem = (index: number) => {
        const requiredRow = deliveryChallanLineItems[index];

        const newFields = deliveryChallanLineItems.filter((_: any, i: number) => i !== index);
        setDeliveryChallanLineItems(newFields);

    };

    const handleAddDelieveryChallanItem = () => {

        //-- get values from react hook form here
        const total_bags = getValues('total_bags');
        let quantity = getValues('quantity');
        
        quantity = quantity == undefined || quantity == null || quantity == '' ? 0 : quantity;
        const dispatch_unit_id = getValues('dispatch_unit_id');
        const net_weight = getValues('net_weight');
        const tare_value = getValues('tare_value');



        if (total_bags === null || total_bags === undefined || isNaN(total_bags) || total_bags <= 0) {
            showErrorMsg("Total Bags should be a valid number and greater than 0!")
            return false;
        }


        if(selectedOptionBagRoll == 'Bag'){
            if (quantity === null || quantity === undefined || isNaN(quantity) || quantity <= 0) {
                showErrorMsg("Quantity should be a valid number and greater than 0!")
                return false;
            }
        }


        if (dispatch_unit_id === null || dispatch_unit_id === undefined || stringIsNullOrWhiteSpace(dispatch_unit_id) == true) {
            showErrorMsg("Select valid unit!")
            return false;
        }

        if (net_weight === null || net_weight === undefined || isNaN(net_weight) || net_weight < 0) {
            showErrorMsg("Weight should be a valid number and greater than 0!")
            return false;
        }

        if (tare_value === null || tare_value === undefined || isNaN(tare_value) || tare_value < 0) {
            showErrorMsg("Tare should be a valid number and greater than 0!")
            return false;
        }

        let total_value = 0;
        if(selectedOptionBagRoll == 'Roll'){
             total_value = net_weight - tare_value;
        } else if(selectedOptionBagRoll == 'Bag' && dispatch_unit_id == 1){
             total_value = total_bags * quantity;
        } else if(selectedOptionBagRoll == 'Bag' && dispatch_unit_id == 2){
            total_value = net_weight - tare_value;
       }



       

        const isExistsItemAlready = deliveryChallanLineItems?.filter((x: { total_bags: any; quantity: any; dispatch_unit_id: number }) => x.total_bags == total_bags && x.quantity == quantity && x.dispatch_unit_id == dispatch_unit_id)?.length > 0 ? true : false;
        if (isExistsItemAlready === true) {
            showErrorMsg("Item already exists!")
        } else {
            const unique_kye_new = generateUniqueIdWithDate();
            setDeliveryChallanLineItems([...deliveryChallanLineItems, { total_bags, bagRollType: selectedOptionBagRoll   , quantity, dispatch_unit_id, net_weight, tare_value, total_value, unique_kye_new }]);

            reset({ total_bags: '', quantity: '', dispatch_unit_id: '', net_weight: '', tare_value: '', total_value: '' });

        }
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
                                    <label className="form-label">Date</label>
                                    <input
                                        type="text"
                                        className={`form-control form-control-solid`}
                                        id="item_name"
                                        value={new Date().toISOString().split('T')[0]}
                                        readOnly={true}
                                        placeholder="Enter item"
                                    />

                                    {errors.item_name && <SiteErrorMessage errorMsg='Item is required' />}

                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label">M/s.</label>
                                    <input
                                        type="text"
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.company_name ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="company_name" {...register("company_name", { required: true })}
                                        readOnly={true}
                                        placeholder=""
                                    />

                                    {errors.company_name && <SiteErrorMessage errorMsg='M/s is required' />}

                                </div>
                            </div>

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
                                    <label className="form-label">PO Number</label>
                                    <input
                                        type="text"
                                        className='form-control form-control-solid'
                                        id="po_number" {...register("po_number", { required: true })}
                                        readOnly={true}
                                    />
                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div className="mb-10">
                                    <label className="form-label">TR Number</label>
                                    <input
                                        type="text"
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.tr_number ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="tr_number" {...register("tr_number", { required: false })}
                                        placeholder="Enter TR number"
                                    />
                                </div>
                            </div>


                            <div className='col-lg-4 mt-12'>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox"
                                            id="show_company_detail" {...register("show_company_detail")}
                                        />
                                        <label className="form-check-label" htmlFor="flexCheckChecked">
                                            Official
                                        </label>
                                    </div>
                                    {errors.show_company_detail && <SiteErrorMessage errorMsg='Tax status is required' />}
                            </div>

                            <hr className="my-5" />



                            <div className='col-lg-3'>
                                <div className="mb-10">
                                    {/* Dropdown for selecting Bag or Roll */}
                                    <label className="form-label">Type</label>
                                    <select
                                        value={selectedOptionBagRoll}
                                        onChange={handleOptionChangeBagType}
                                        className="form-control form-control-solid"
                                    >
                                        <option value="Bag">Bag</option>
                                        <option value="Roll">Roll</option>
                                    </select>
                                </div>
                            </div>


                            <div className='col-lg-3'>
                                <div className="mb-10">
                                    <label className="form-label required">Bag/Roll</label>
                                    <input
                                        type="number"
                                        step="any"
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.total_bags ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="total_bags" {...register("total_bags", { required: false })}
                                        min={0}
                                        placeholder="Enter bags/Rolls"
                                    />

                                    {errors.total_bags && <SiteErrorMessage errorMsg='No. of bags is required' />}

                                </div>
                            </div>

                            {
                                selectedOptionBagRoll === 'Bag' &&
                                <div className='col-lg-3'>
                                    <div className="mb-10">
                                        <label className="form-label required">Quantity</label>
                                        <input
                                            type="number"
                                            step="any"
                                            min={1}
                                            className={`form-control form-control-solid ${formSubmitted ? (errors.quantity ? 'is-invalid' : 'is-valid') : ''}`}
                                            id="quantity" {...register("quantity", { required: false })}

                                            placeholder="Enter quantity"
                                        />

                                        {errors.quantity && <SiteErrorMessage errorMsg='Quantity is required' />}

                                    </div>
                                </div>
                            }



                            <div className='col-lg-3'>
                                <div className="mb-10">
                                    <label className="form-label required">Unit</label>
                                    <select
                                        className={`form-select form-select-solid ${formSubmitted ? (errors.dispatch_unit_id ? 'is-invalid' : 'is-valid') : ''}`}

                                        aria-label="Select unit"
                                        id="dispatch_unit_id" {...register("dispatch_unit_id", { required: false })}
                                        disabled={isEditCase}
                                    >
                                        <option value=''>--Select--</option>


                                        {DeliveryChallanUnits?.map((item: any, index: any) => (
                                            <option key={index} value={item.dispatch_unit_id}>
                                                {item.delivery_unit_name}
                                            </option>
                                        ))}

                                    </select>

                                    {errors.dispatch_unit_id && <SiteErrorMessage errorMsg='Unit is required' />}

                                </div>
                            </div>


                            <div className='col-lg-3'>
                                <div className="mb-10">
                                    <label className="form-label required"> Weight</label>
                                    <input
                                        type="number"
                                        step="any"
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.net_weight ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="net_weight" {...register("net_weight", { required: false })}

                                        placeholder="Enter net weight"
                                    />

                                    {errors.net_weight && <SiteErrorMessage errorMsg='Net weight is required' />}

                                </div>
                            </div>

                            <div className='col-lg-3'>
                                <div className="mb-10">
                                    <label className="form-label required"> Tare</label>
                                    <input
                                        type="number"
                                        step="any"
                                        className={`form-control form-control-solid ${formSubmitted ? (errors.tare_value ? 'is-invalid' : 'is-valid') : ''}`}
                                        id="tare_value" {...register("tare_value", { required: false })}

                                        placeholder="Enter net weight"
                                    />

                                    {errors.tare_value && <SiteErrorMessage errorMsg='Tare is required' />}

                                </div>
                            </div>

                            <div className='col-lg-3'>
                                <div className="mb-10">
                                    <label className="form-label required"> Total</label>
                                    <input
                                        type="number"
                                        step="any"
                                        className={`form-control form-control-solid`}
                                        id="total_value" {...register("total_value", { required: false })}
                                        readOnly={true}
                                        placeholder=""
                                    />



                                </div>
                            </div>

                            <div className="col-lg-3">
                                <button className="btn btn-info align-self-end mt-7" type='button' onClick={handleAddDelieveryChallanItem}>
                                    <FontAwesomeIcon icon={faPlus} style={{ marginRight: '4px' }} /> Add

                                </button>
                            </div>

                            <hr className="my-5" />



                        </div>

                        <div className="row">
                            <div className="col-lg-12 col-md-12">
                                <div className='table-responsive'>

                                    <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>

                                        <thead>
                                            <tr className='fw-bold text-muted'>

                                                {/* <th className='min-w-80px'>Product Id</th> */}
                                                <th className='min-w-100px'>Bag/Roll</th>
                                                <th className='min-w-80px'>Qty</th>
                                                <th className='min-w-80px'>Unit</th>
                                                <th className='min-w-80px'>Weight</th>
                                                <th className='min-w-80px'>Tare</th>
                                                <th className='min-w-80px'>Total</th>

                                                <th className='min-w-50px text-start'>Actions</th>

                                            </tr>
                                        </thead>

                                        <tbody>

                                            {
                                                deliveryChallanLineItems != undefined && deliveryChallanLineItems.length > 0
                                                    ?
                                                    <>
                                                        {deliveryChallanLineItems?.map((dispathItem: any, index: number) => (
                                                            <tr key={index}>


                                                                <td role="cell" className="ps-3">
                                                                    <div className='d-flex align-items-center'>

                                                                        <div className='d-flex justify-content-start flex-column'>
                                                                            <a className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                                                {makeAnyStringShortAppendDots(dispathItem?.total_bags, 20)}
                                                                            </a>

                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td role="cell" className="">{dispathItem.quantity}</td>
                                                                <td role="cell" className="">{DeliveryChallanUnits.find((x: { dispatch_unit_id: any; }) => x.dispatch_unit_id == dispathItem.dispatch_unit_id)?.delivery_unit_name}</td>
                                                                <td role="cell" className="">{dispathItem.net_weight}</td>
                                                                <td role="cell" className="">{dispathItem.tare_value}</td>
                                                                <td role="cell" className="">{dispathItem.total_value}</td>



                                                                <td className='text-center min-w-50px pe-3'>

                                                                    <a className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                                                                        onClick={() => handleDeleteDeliveryChallanItem(index)}
                                                                    >
                                                                        <i className="ki-duotone ki-trash fs-2">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                            <span className="path3"></span>
                                                                            <span className="path4"></span>
                                                                            <span className="path5"></span>
                                                                        </i>
                                                                    </a>

                                                                    {/* <a className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm ms-2"
                                                                        onClick={(e) => handleEditFieldDispatchPlace(index)}
                                                                    >
                                                                        <i className="ki-duotone ki-pencil fs-2">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                            <span className="path3"></span>
                                                                            <span className="path4"></span>
                                                                        </i>
                                                                    </a> */}

                                                                </td>

                                                            </tr>
                                                        ))}


                                                    </>
                                                    :
                                                    <tr>
                                                        <td colSpan={10}>
                                                            <div className='d-flex p-5 justify-content-center align-content-center'>
                                                                <h4 className='text-center'>No dispatch found</h4>
                                                            </div>
                                                        </td>


                                                    </tr>
                                            }

                                        </tbody>

                                        <tfoot>
                                            <tr>
                                                <td colSpan={5} className="text-right fw-bold">Grand Total:</td>
                                                <td className="text-right fw-bold">
                                                    {deliveryChallanLineItems?.reduce((total: number, item: { total_value: number; }) => total + item.total_value, 0)}
                                                </td>
                                            </tr>
                                        </tfoot>

                                    </table>

                                </div>

                            </div>

                            {/* <div className="col-lg-12 col-md-12">
                                <div className="d-flex justify-content-end align-content-center">
                                    <button className="btn btn-primary fs-3"
                                        onClick={() => {
                                            if (formRefOrder.current) {
                                                formRefOrder.current.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                                            }
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '4px' }} /> Save
                                    </button>
                                </div>

                            </div> */}
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

