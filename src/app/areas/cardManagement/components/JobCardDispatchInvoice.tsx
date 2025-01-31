
/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import ReactModal from 'react-modal';

import { useForm } from 'react-hook-form';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

import { useReactToPrint } from 'react-to-print';
import { KTIcon, toAbsoluteUrl, toAbsoluteUrlCustom } from '../../../../_sitecommon/helpers';
import { stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import { GetDefaultCurrencySymbol, getOrderDetailStatusBoundaryClass } from '../../../../_sitecommon/common/helpers/global/GlobalHelper';
import { getDateCommonFormatFromJsonDate, makeAnyStringShortAppendDots } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { getJobDispatchReportDataByIdApi, getPurchaseOrderDetailsByIdApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { DeliveryChallanUnits } from '../../../../_sitecommon/common/constants/DeliveryChallanUnits';

interface JobCardDispatchInvoiceInterface {
    isOpen: boolean,
    closeModal: any,
    cardDispatchInfoId: any

}



const JobCardDispatchInvoice: React.FC<JobCardDispatchInvoiceInterface> = ({
    isOpen,
    closeModal,
    cardDispatchInfoId,

}) => {
    const [dispatchInvoiceDetail, setDispatchInvoiceDetail] = useState<any>({});



    const componentRefForReceipt = useRef(null);
    const handlePrintReceipt = useReactToPrint({
        content: () => componentRefForReceipt.current,
        documentTitle: 'Card Dispatch Invoice',

    });



    useEffect(() => {
        getJobDispatchReportDataByIdService();
    }, [cardDispatchInfoId]);

    const getJobDispatchReportDataByIdService = () => {


        getJobDispatchReportDataByIdApi(cardDispatchInfoId)
            .then((res: any) => {

                const { data } = res;
                if (data) {
                    setDispatchInvoiceDetail(res?.data);
                } else {
                    setDispatchInvoiceDetail({});
                }



                setTimeout(handlePrintReceipt, 1000); // Delay of 1 second


            })
            .catch((err: any) => console.log(err, "err"));
    };


    return (
        // <ReactModal
        //     isOpen={isOpen}
        //     onRequestClose={closeModal}
        //     contentLabel="Example Modal"
        //     className={"admin-large-modal"}
        //     shouldCloseOnOverlayClick={false} 
        // >


        <div className='admin-modal-area' style={{ display: 'none' }}>
            <div className='admin-modal-header'>
                <h2>Delivery Challan</h2>

                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                    <KTIcon className='fs-1' iconName='cross' />
                </div>

            </div>
            <form

            >
                <div className='modal-body py-lg-10 px-lg-10 custom-modal-height'>


                    <div className="card printable-area" ref={componentRefForReceipt}>

                        <div className="card-body py-5">

                            <div className="mw-lg-950px mx-auto w-100">

                                <div className="d-flex justify-content-between flex-column flex-sm-row mb-19">
                                    <h4 className="fw-bolder text-gray-800 fs-2qx pe-5 pb-7">Delivery Challan</h4>

                                    <div className="text-sm-end">

                                        <a href="#" className="d-block mw-150px ms-sm-auto">
                                            {
                                                (dispatchInvoiceDetail?.show_company_detail == true || dispatchInvoiceDetail?.show_company_detail == 'true' || dispatchInvoiceDetail?.show_company_detail == '1') &&
                                                (
                                                    <img alt="Logo"
                                                        src={toAbsoluteUrl('media/logos/default_dark_2.png')}
                                                        className="w-50"
                                                        height={50}
                                                    />
                                                )
                                            }

                                        </a>

                                        {
                                            (dispatchInvoiceDetail?.show_company_detail == true || dispatchInvoiceDetail?.show_company_detail == 'true' || dispatchInvoiceDetail?.show_company_detail == '1') &&
                                            (

                                                <div className="text-sm-end fw-semibold fs-4 text-muted mt-7">
                                                    <div>Sheeba Inventory System, Karachi</div>
                                                </div>
                                            )
                                        }


                                    </div>
                                </div>

                                <div className="pb-12">

                                    <div className="row">
                                        <div className="col-lg-6">
                                            <table className="table align-middle table-row-dashed table-striped fs-6 gy-5 mb-0">
                                                {/* <thead>
                                                    <tr className="border-bottom fs-6 fw-bold text-muted bg-light">

                                                        <th className="min-w-175px pb-2 ps-3 rounded-start">GRN Item ID</th>

                                                        <th className="min-w-100px text-end pb-2 pe-3 rounded-end"> Item Total Amount</th>



                                                    </tr>
                                                </thead> */}
                                                <tbody className="fw-semibold text-gray-600 ">
                                                    <tr>
                                                        <td className="text-start bg-light p-3"> Date</td>
                                                        <td className='text-start p-3'>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-5">  <div className="fw-bold">   {getDateCommonFormatFromJsonDate(dispatchInvoiceDetail?.created_on)}</div>   </div>
                                                            </div>
                                                        </td>

                                                    </tr>

                                                    {/* <tr>
                                                        <td className="text-start bg-light p-3">Job Card No</td>
                                                        <td className='text-start p-3'>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-5">  <div className="fw-bold">  {dispatchInvoiceDetail?.job_card_no} </div>   </div>
                                                            </div>
                                                        </td>
                                                    </tr> */}



                                                    <tr>
                                                        <td className="text-start bg-light p-3">M/s.</td>
                                                        <td className='text-start p-3'>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-5">  <div className="fw-bold">  {dispatchInvoiceDetail?.company_name}</div>   </div>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className="text-start bg-light p-3">Item</td>
                                                        <td className='text-start p-3'>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-5">  <div className="fw-bold">  {dispatchInvoiceDetail?.item_name} </div>   </div>
                                                            </div>
                                                        </td>
                                                    </tr>


                                                    <tr>
                                                        <td className="text-start bg-light p-3">Dispatch#</td>
                                                        <td className='text-start p-3'>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-5">  <div className="fw-bold">{dispatchInvoiceDetail?.card_dispatch_no}/{dispatchInvoiceDetail?.job_card_no}</div>   </div>
                                                            </div>
                                                        </td>
                                                    </tr>


                                                </tbody>
                                            </table>
                                        </div>
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



                                                        </tr>
                                                    </thead>

                                                    <tbody>

                                                        {
                                                            dispatchInvoiceDetail?.deliveryChallanLineItems != undefined && dispatchInvoiceDetail?.deliveryChallanLineItems.length > 0
                                                                ?
                                                                <>
                                                                    {dispatchInvoiceDetail?.deliveryChallanLineItems?.map((dispathItem: any, index: number) => (
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
                                                                {dispatchInvoiceDetail?.grand_total}
                                                            </td>
                                                        </tr>
                                                    </tfoot>

                                                </table>

                                            </div>
                                            <div className="global-stamp-sign">
                                                <div className="line">Stamp & Sign</div>
                                            </div>

                                        </div>


                                    </div>

                                </div>



                            </div>

                        </div>

                    </div>


                </div>

                <div className='admin-modal-footer'>
                    <button className="btn btn-light" onClick={closeModal}>Close</button>
                    <button type="button" className="btn btn-success my-1 me-12" onClick={handlePrintReceipt}>

                        <FontAwesomeIcon icon={faPrint} className='me-2' />
                        Print Receipt

                    </button>
                    {/* <button className="btn btn-danger" type='submit'>Update</button> */}
                </div>
            </form>
        </div>


        // </ReactModal>
    )
}

export default JobCardDispatchInvoice;