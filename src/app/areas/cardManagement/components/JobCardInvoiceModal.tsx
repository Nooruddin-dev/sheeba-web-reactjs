
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
import { getJobCardDetailByIdForEditApi, getPurchaseOrderDetailsByIdApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';

interface JobCardInvoiceModalInterface {
    isOpen: boolean,
    closeModal: any,
    jobCardDetailForPrinting: any

}



const JobCardInvoiceModal: React.FC<JobCardInvoiceModalInterface> = ({
    isOpen,
    closeModal,
    jobCardDetailForPrinting,

}) => {
    // const [jobCardDetail, setJobCardDetail] = useState<any>({});



    const componentRefForReceipt = useRef(null);
    const handlePrintReceipt = useReactToPrint({
        content: () => componentRefForReceipt.current,
        documentTitle: 'Order Receipt',

    });



    useEffect(() => {
        setTimeout(handlePrintReceipt, 1000); // Delay of 1 second
    }, [])



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
                <h2>Job Card Invoice</h2>

                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={closeModal}>
                    <KTIcon className='fs-1' iconName='cross' />
                </div>

            </div>
            <form

            >
                <div className='modal-body py-lg-10 px-lg-10 custom-modal-height'>


                    <div className="card" ref={componentRefForReceipt}>

                        <div className="card-body py-5">

                            <div className="mw-lg-950px mx-auto w-100">

                                <div className="d-flex justify-content-between flex-column flex-sm-row mb-19">
                                    <h4 className="fw-bolder text-gray-800 fs-2qx pe-5 pb-7">JOB CARD INVOICE</h4>

                                    <div className="text-sm-end">

                                        <a href="#" className="d-block mw-150px ms-sm-auto">


                                            {
                                                (jobCardDetailForPrinting?.show_company_detail == true || jobCardDetailForPrinting?.show_company_detail == 'true' || jobCardDetailForPrinting?.show_company_detail == '1') &&
                                                (
                                                    <img alt="Logo"
                                                        src={toAbsoluteUrl('media/logos/default_dark_2.png')}
                                                        className="w-50"
                                                        height={50}
                                                    />
                                                )
                                            }
                                        </a>

                                        <div className="text-sm-end fw-semibold fs-4 text-muted mt-7">
                                            <div>Sheeba Inventory system, Karachi</div>
                                            {/* <div>Mississippi 96522</div> */}
                                        </div>

                                    </div>
                                </div>

                                <div className="pb-12 printview_jobcard">

                                    <div className="d-flex flex-column gap-7 gap-md-10">


                                        <div className='row'>





                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label  ">Job Card No</label>
                                                    <input
                                                        type="text"

                                                        className={`form-control form-control-solid`}
                                                        id="order_date"
                                                        value={jobCardDetailForPrinting?.job_card_no}

                                                        placeholder="Enter order date"
                                                    />

                                                </div>
                                            </div>

                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label  ">Order Date</label>
                                                    <input
                                                        type="date"

                                                        className={`form-control form-control-solid`}
                                                        id="order_date"
                                                        value={jobCardDetailForPrinting?.order_date}

                                                        placeholder="Enter order date"
                                                    />

                                                </div>
                                            </div>


                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label  ">Dispatch Date</label>
                                                    <input
                                                        type="date"

                                                        className={`form-control form-control-solid`}
                                                        id="dispatch_date"
                                                        value={jobCardDetailForPrinting?.dispatch_date}

                                                        placeholder="Enter dispath date"
                                                    />

                                                </div>
                                            </div>


                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label  ">Company Name</label>
                                                    <input
                                                        type="text"

                                                        className={`form-control form-control-solid `}
                                                        id="company_name"
                                                        value={jobCardDetailForPrinting?.company_name}
                                                        placeholder="Enter company name"
                                                    />

                                                </div>
                                            </div>

                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label  ">Product Name</label>
                                                    <input
                                                        type="text"

                                                        className={`form-control form-control-solid `}
                                                        id="product_name"
                                                        value={jobCardDetailForPrinting?.product_name}
                                                        placeholder="Enter product name"
                                                    />

                                                </div>
                                            </div>


                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label  ">Weight/Quantity</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        step="any"
                                                        className={`form-control form-control-solid`}
                                                        id="weight_qty"
                                                        value={jobCardDetailForPrinting?.weight_qty}
                                                        placeholder="Enter weight/qty"
                                                    />

                                                </div>
                                            </div>

                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label  ">Size</label>
                                                    <input
                                                        type="text"

                                                        className={`form-control form-control-solid `}
                                                        id="job_size"
                                                        value={jobCardDetailForPrinting?.job_size}
                                                        placeholder="Enter size"
                                                    />

                                                </div>
                                            </div>




                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label  ">Micron</label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        className={`form-control form-control-solid `}
                                                        id="micron"
                                                        value={jobCardDetailForPrinting?.micron}
                                                        placeholder="Enter micron"
                                                    />

                                                </div>
                                            </div>

                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label  ">Sealing Method</label>
                                                    <input
                                                        type="text"

                                                        className={`form-control form-control-solid `}
                                                        id="sealing_method"
                                                        value={jobCardDetailForPrinting?.sealing_method}
                                                        placeholder="Enter sealing method"
                                                    />

                                                </div>
                                            </div>

                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label  ">Sales Person</label>
                                                    <input
                                                        type="text"

                                                        className={`form-control form-control-solid `}
                                                        id="job_card_reference"
                                                        value={jobCardDetailForPrinting?.job_card_reference}
                                                        placeholder="Enter reference"
                                                    />

                                                </div>
                                            </div>

                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label  ">PO Reference</label>
                                                    <input
                                                        type="text"

                                                        className={`form-control form-control-solid `}
                                                        id="po_reference"
                                                        value={jobCardDetailForPrinting?.po_reference}
                                                        placeholder="Enter reference"
                                                    />

                                                </div>
                                            </div>


                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label  ">Special Request</label>
                                                    <input
                                                        type="text"

                                                        className={`form-control form-control-solid `}
                                                        id="special_request"
                                                        value={jobCardDetailForPrinting?.special_request}
                                                        placeholder="Enter special request"
                                                    />

                                                </div>
                                            </div>



                                            {/* <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label  ">Rate</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        step="any"
                                                        className={`form-control form-control-solid `}
                                                        id="card_rate"
                                                        value={jobCardDetailForPrinting?.card_rate}
                                                        placeholder="Enter rate"
                                                    />

                                                </div>
                                            </div> */}
                                            {/* 
                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label  ">Amount (Quanity * Rate)</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={jobCardDetailForPrinting?.card_amount}
                                                        className={`form-control form-control-solid `}
                                                        id="card_amount"
                                                        readOnly={true}
                                                        placeholder="Amount (Quantity * Rate)"
                                                    />

                                                </div>
                                            </div> */}

                                            {/* 
                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label ">Tax Amount</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={jobCardDetailForPrinting?.card_tax_amount}
                                                        className={`form-control form-control-solid`}
                                                        id="card_tax_amount"
                                                        readOnly={true}
                                                        placeholder="Tax Amount"
                                                    />

                                                </div>
                                            </div> */}

                                            {/* <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <label className="form-label  ">Total Rate Amount after Tax</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        className={`form-control form-control-solid`}
                                                        id="card_total_amount"
                                                        readOnly={true}
                                                        placeholder="Total Rate Amount after Tax"
                                                        value={jobCardDetailForPrinting?.card_total_amount}
                                                    />

                                                </div>
                                            </div> */}





                                        </div>


                                        <div className="separator"></div>

                                        <div className="row">
                                            <div className="col-lg-12 col-md-12">
                                                <div className='table-responsive'>

                                                    <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>

                                                        <thead>
                                                            <tr className='fw-bold text-muted'>

                                                                {/* <th className='min-w-80px'>Product Id</th> */}
                                                                <th className='width-25'>Dispatch Place</th>
                                                                <th className='width-75'>Weight/Quantity</th>


                                                            </tr>
                                                        </thead>

                                                        <tbody>

                                                            {
                                                                jobCardDetailForPrinting?.jobDistributionFields != undefined && jobCardDetailForPrinting?.jobDistributionFields.length > 0
                                                                    ?
                                                                    <>
                                                                        {jobCardDetailForPrinting?.jobDistributionFields?.map((dispathItem: any, index: number) => (
                                                                            <tr key={index}>


                                                                                <td role="cell" className="ps-3">
                                                                                    <div className='d-flex align-items-center'>

                                                                                        <div className='d-flex justify-content-start flex-column'>
                                                                                            <a className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                                                                {makeAnyStringShortAppenDots(dispathItem?.dispatch_place, 20)}
                                                                                            </a>

                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td role="cell" className="">{dispathItem.dispatch_weight_quantity}</td>

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

                                                    </table>

                                                </div>

                                            </div>


                                        </div>

                                        <div className="separator"></div>

                                        <div className="d-flex justify-content-between flex-column">
                                            <div>
                                                <h3>Selected Materials</h3>
                                            </div>


                                            <div className="table-responsive border-bottom mb-9">
                                                <table className="table align-middle table-row-dashed fs-6 gy-5 mb-0">
                                                    <thead>
                                                        <tr className="border-bottom fs-6 fw-bold text-muted bg-light">
                                                            <th className=" width-25">Product Name</th>
                                                            <th className="width-75">Code</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="fw-semibold text-gray-600">

                                                        {
                                                            jobCardDetailForPrinting?.jobCardAllProducts != undefined && jobCardDetailForPrinting?.jobCardAllProducts?.length > 0
                                                                ?
                                                                jobCardDetailForPrinting?.jobCardAllProducts?.map((productItem: any) => (
                                                                    <tr>
                                                                        <td className="width-25">{productItem.product_name}</td>


                                                                        <td className="width-75">{productItem.sku}</td>
                                                                    </tr>
                                                                ))
                                                                :
                                                                <tr>
                                                                    <td colSpan={20}>
                                                                        <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                                                                            No matching records found
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                        }






                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>


                                        <div className="separator"></div>





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

export default JobCardInvoiceModal;