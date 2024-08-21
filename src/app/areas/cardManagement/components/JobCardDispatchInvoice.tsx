
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
import { getDateCommonFormatFromJsonDate, makeAnyStringShortAppenDots } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { getJobDispatchReportDataByIdApi, getPurchaseOrderDetailsByIdApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';

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
                <h2>Card Dispatch Invoice</h2>

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
                                    <h4 className="fw-bolder text-gray-800 fs-2qx pe-5 pb-7">Card Dispatch Invoice</h4>

                                    <div className="text-sm-end">

                                        <a href="#" className="d-block mw-150px ms-sm-auto">
                                            <img alt="Logo"
                                                src={toAbsoluteUrl('media/svg/brand-logos/lloyds-of-london-logo.svg')}
                                                className="w-100" />
                                        </a>

                                        <div className="text-sm-end fw-semibold fs-4 text-muted mt-7">
                                            <div>Sheeba Inventory system, Karachi</div>
                                            {/* <div>Mississippi 96522</div> */}
                                        </div>

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
                                                        <td className="text-start bg-light p-3">Job Date</td>
                                                        <td className='text-start p-3'>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-5">  <div className="fw-bold">  {dispatchInvoiceDetail?.job_date}</div>   </div>
                                                            </div>
                                                        </td>
                                                    
                                                    </tr>

                                                    <tr>
                                                        <td className="text-start bg-light p-3">Job Card No</td>
                                                        <td className='text-start p-3'>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-5">  <div className="fw-bold">  {dispatchInvoiceDetail?.job_card_no} </div>   </div>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className="text-start bg-light p-3">Dispatch#</td>
                                                        <td className='text-start p-3'>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-5">  <div className="fw-bold"> {dispatchInvoiceDetail?.card_dispatch_no}</div>   </div>
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
                                                        <td className="text-start bg-light p-3">No.Bags</td>
                                                        <td className='text-start p-3'>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-5">  <div className="fw-bold">  {dispatchInvoiceDetail?.total_bags}</div>   </div>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className="text-start bg-light p-3">Quantity</td>
                                                        <td className='text-start p-3'>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-5">  <div className="fw-bold">  {dispatchInvoiceDetail?.quantity}</div>   </div>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className="text-start bg-light p-3">Core</td>
                                                        <td className='text-start p-3'>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-5">  <div className="fw-bold">  {dispatchInvoiceDetail?.core_value}</div>   </div>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className="text-start bg-light p-3">Gross</td>
                                                        <td className='text-start p-3'>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-5">  <div className="fw-bold">  {dispatchInvoiceDetail?.gross_value}</div>   </div>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td className="text-start bg-light p-3">Net Weight</td>
                                                        <td className='text-start p-3'>
                                                            <div className="d-flex align-items-center">
                                                                <div className="ms-5">  <div className="fw-bold">  {dispatchInvoiceDetail?.net_weight}</div>   </div>
                                                            </div>
                                                        </td>
                                                    </tr>


                                                </tbody>
                                            </table>
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