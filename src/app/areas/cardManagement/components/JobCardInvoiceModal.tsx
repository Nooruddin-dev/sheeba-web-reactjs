
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

    const [jobTablePrintData] = useState([
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
    ]);

    const componentRefForReceipt = useRef(null);
    const handlePrintReceipt = useReactToPrint({
        content: () => componentRefForReceipt.current,
        documentTitle: 'Job Card',

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

                                <div className="d-flex justify-content-between flex-column flex-sm-row">
                                    <h4 className="fw-bolder text-gray-800 fs-2qx pe-5 pb-7">JOB CARD #{jobCardDetailForPrinting?.job_card_no}</h4>
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
                                    </div>
                                </div>
                                <div className="pb-12 printview_jobcard">
                                    <div className="d-flex flex-column gap-md-5">
                                        <div className='row mb-10'>

                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <div className='print-form-section'>
                                                        <div className="print-form-label">Order Date | Dispatch Date</div>
                                                        <div className="print-form-value">{jobCardDetailForPrinting?.order_date} | {jobCardDetailForPrinting?.dispatch_date}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <div className='print-form-section'>
                                                        <div className="print-form-label">Company Name:</div>
                                                        <div className="print-form-value">{jobCardDetailForPrinting?.company_name}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <div className='print-form-section'>
                                                        <div className="print-form-label">Product Name:</div>
                                                        <div className="print-form-value">{jobCardDetailForPrinting?.product_name}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <div className='print-form-section'>
                                                        <div className="print-form-label">Weight/Quantity:</div>
                                                        <div className="print-form-value">{jobCardDetailForPrinting?.weight_qty}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <div className='print-form-section'>
                                                        <div className="print-form-label">Size:</div>
                                                        <div className="print-form-value">{jobCardDetailForPrinting?.job_size}</div>
                                                    </div>
                                                </div>
                                            </div> */}

                                            {/* <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <div className='print-form-section'>
                                                        <div className="print-form-label">Micron:</div>
                                                        <div className="print-form-value">{jobCardDetailForPrinting?.micron}</div>
                                                    </div>
                                                </div>
                                            </div> */}

                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <div className='print-form-section'>
                                                        <div className="print-form-label">Sales Person:</div>
                                                        <div className="print-form-value">{jobCardDetailForPrinting?.job_card_reference}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <div className='print-form-section'>
                                                        <div className="print-form-label">Rate:</div>
                                                        <div className="print-form-value">{jobCardDetailForPrinting?.card_rate}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='col-lg-4'>
                                                <div className="mb-10">
                                                    <div className='print-form-section'>
                                                        <div className="print-form-label">Sealing Method:</div>
                                                        <div className="print-form-value">{jobCardDetailForPrinting?.sealing_method}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='col-lg-4' style={{ width: "66.5%" }}>
                                                <div className="mb-10">
                                                    <div className='print-form-section'>
                                                        <div className="print-form-label">Special Request:</div>
                                                        <div className="print-form-value">{jobCardDetailForPrinting?.special_request}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='col-lg-4' style={{ width: "50%" }}>
                                                <div className="mb-10">
                                                    <div className='print-form-section'>
                                                        <div className="print-form-label">Materials</div>
                                                        {
                                                            jobCardDetailForPrinting?.jobCardAllProducts?.map((product: any) => (
                                                                <div className="print-form-value">{product.product_name}</div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='col-lg-4' style={{ width: "50%" }}>
                                                <div className="mb-10">
                                                    <div className='print-form-section'>
                                                        <div className="print-form-label">Dispatch</div>
                                                        {
                                                            jobCardDetailForPrinting?.jobDistributionFields?.map((item: any) => (
                                                                <div className="print-form-value">{item.dispatch_place}: {item.dispatch_weight_quantity}</div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="row" style={{ direction: 'rtl' }}>
                                            <div className='col-lg-4' style={{ width: "50%" }}>
                                                <div className="mb-10">
                                                    <div className='print-form-section-urdu'>
                                                        <div className="print-form-label print-urdu-label">سائز:</div>
                                                        <div className="print-form-value "></div>
                                                    </div>
                                                </div>
                                                <div className="mb-10">
                                                    <div className='print-form-section-urdu'>
                                                        <div className="print-form-label print-urdu-label" style={{ width: "90px" }}>پیِس کاوزن:</div>
                                                        <div className="print-form-value "></div>
                                                    </div>
                                                </div>
                                                <div className="mb-10">
                                                    <div className='print-form-section-urdu'>
                                                        <div className="print-form-label print-urdu-label">کرنٹ:</div>
                                                        <div className="print-form-value "></div>
                                                    </div>
                                                </div>
                                                <div className="mb-10">
                                                    <div className='print-form-section-urdu'>
                                                        <div className="print-form-label print-urdu-label">وزن:</div>
                                                        <div className="print-form-value "></div>
                                                    </div>
                                                </div>
                                                <div className="mb-10">
                                                    <div className='print-form-section-urdu'>
                                                        <div className="print-form-label print-urdu-label">مائیکرن:</div>
                                                        <div className="print-form-value "></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-4' style={{ width: "50%" }}>
                                                <div className="mb-10">
                                                    <div className='print-form-section-urdu'>
                                                        <div className="print-form-label print-urdu-label">مکسنگ:</div>
                                                        <div className='row'>
                                                            <div className='col-lg-12'>
                                                                <table className="print-job-card-empty-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-12">
                                                <table className="print-job-card-empty-table">
                                                    <thead>
                                                        <tr>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {jobTablePrintData.map((row: any, rowIndex: any) => (
                                                            <tr key={rowIndex}>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
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

export default JobCardInvoiceModal;