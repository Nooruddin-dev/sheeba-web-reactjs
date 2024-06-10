
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
import { getPurchaseOrderDetailsByIdApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';

interface PurchaseOrderStatusFormInterface {
    isOpen: boolean,
    closeModal: any,
    orderId: any

}



const PurchaseOrderReceiptModal: React.FC<PurchaseOrderStatusFormInterface> = ({
    isOpen,
    closeModal,
    orderId,

}) => {
    const [orderDetails, setOrderDetails] = useState<any>({});


    const componentRefForReceipt = useRef(null);
    const handlePrintReceipt = useReactToPrint({
        content: () => componentRefForReceipt.current,
        documentTitle: 'Order Receipt',
    });



    useEffect(() => {
        getOrderDetailsByIdService();
    }, [orderId]);

    const getOrderDetailsByIdService = () => {


        getPurchaseOrderDetailsByIdApi(orderId)
            .then((res: any) => {

                const { data } = res;
                if (data) {
                    setOrderDetails(res?.data);
                } else {
                    setOrderDetails({});
                }

            })
            .catch((err: any) => console.log(err, "err"));
    };


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
                    <h2>Purchase Order Receipt</h2>

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
                                        <h4 className="fw-bolder text-gray-800 fs-2qx pe-5 pb-7">PURCHASE ORDER RECEIPT</h4>

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

                                        <div className="d-flex flex-column gap-7 gap-md-10">

                                            {/* <div className="fw-bold fs-2">Dear User,



                                                <br />
                                                <span className="text-muted fs-5">Here are the order details for the selected order.</span>
                                            </div> */}

                                            <div className="separator"></div>

                                            <div className="d-flex flex-column flex-sm-row gap-7 gap-md-10 fw-bold">
                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted"> PO Number:</span>
                                                    <span className="fs-5">{orderDetails?.po_number}</span>
                                                </div>

                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted">  PO Ref:</span>
                                                    <span className="fs-5">{orderDetails?.po_reference}</span>
                                                </div>

                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted">   Delivery Date:</span>
                                                    <span className="fs-5">{getDateCommonFormatFromJsonDate(orderDetails?.delivery_date)}</span>
                                                </div>

                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted">       Company Name:</span>
                                                    <span className="fs-5">{orderDetails?.company_name}</span>
                                                </div>

                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted">Created By</span>
                                                    <span className="fs-5">{orderDetails?.orderMainDetail?.createdByUserName}</span>
                                                </div>






                                            </div>

                                            <div className="d-flex flex-column flex-sm-row gap-7 gap-md-10 fw-bold ">
                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted">      Vendor:</span>
                                                    <span className="fs-5">{orderDetails?.vendor_first_name} {orderDetails?.vendor_last_name}</span>
                                                </div>

                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted">       Sale Representative:</span>
                                                    <span className="fs-5">{orderDetails?.sale_representative_first_name} {orderDetails?.sale_representative_last_name}</span>
                                                </div>

                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted"> Purchaser Name:</span>
                                                    <span className="fs-5">{orderDetails?.purchaser_name}</span>
                                                </div>

                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted"> Payment Terms:</span>
                                                    <span className="fs-5">{orderDetails?.payment_terms}</span>
                                                </div>
                                                <div className="flex-root d-flex flex-column">
                                                    <span className="text-muted">Remarks:</span>
                                                    <span className="fs-5">{orderDetails?.remarks}</span>
                                                </div>






                                            </div>

                                            <div className="d-flex justify-content-between flex-column">

                                                <div className="table-responsive border-bottom mb-9">
                                                    <table className="table align-middle table-row-dashed fs-6 gy-5 mb-0">
                                                        <thead>
                                                            <tr className="border-bottom fs-6 fw-bold text-muted bg-light">
                                                                <th className="min-w-175px pb-2 ps-3 rounded-start">Order Item ID</th>
                                                                <th className="min-w-175px pb-2">Product Name</th>
                                                                <th className="min-w-70px text-end pb-2">Cost</th>
                                                                <th className="min-w-80px text-end pb-2">Quantity</th>
                                                                <th className="min-w-80px text-end pb-2">Amount</th>
                                                                <th className="min-w-80px text-end pb-2">Item Tax</th>
                                                                <th className="min-w-100px text-end pb-2 pe-3 rounded-end">Order Item Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="fw-semibold text-gray-600">

                                                            {
                                                                orderDetails?.order_items != undefined && orderDetails?.order_items?.length > 0
                                                                    ?
                                                                    orderDetails?.order_items?.map((record: any) => (
                                                                        <tr>
                                                                            <td className="text-start">{record.line_item_id}</td>

                                                                            <td className='text-start'>
                                                                                <div className="d-flex align-items-center">

                                                                                    {/* <a href="#" className="symbol symbol-50px">
                                                                                        <span className="symbol-label"
                                                                                            style={{ backgroundImage: `url(${toAbsoluteUrlCustom(record.productDefaultImage)})` }}
                                                                                        ></span>
                                                                                    </a> */}

                                                                                    <div className="ms-5">
                                                                                        <div className="fw-bold">  {record.product_name}</div>
                                                                                        {/* <div className="fs-7 text-muted">Attribute Names Only</div> */}
                                                                                    </div>

                                                                                </div>
                                                                            </td>

                                                                            <td className="text-end">{record.po_rate}</td>
                                                                            <td className="text-end">{record.quantity}</td>
                                                                            <td className="text-end">{record.amount}</td>

                                                                            <td className="text-end">{record.tax_amount}</td>
                                                                            <td className="text-end">{record.item_total}</td>
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




                                                            {/* <tr>
                                                                <td colSpan={4} className="text-end">Subtotal</td>
                                                                <td className="text-end">$264.00</td>
                                                            </tr> */}
                                                            <tr>

                                                                <td colSpan={6} className="fs-3 text-gray-900 fw-bold text-end">Tax</td>
                                                                <td className="text-gray-900 fs-3 fw-bolder text-end">{orderDetails?.order_tax_total}</td>
                                                            </tr>
                                                            {/* <tr>
                                                                <td colSpan={4} className="text-end">Shipping Charges</td>
                                                                <td className="text-end">{GetDefaultCurrencySymbol()}{orderDetails?.orderMainDetail?.orderTotalShippingCharges ?? 0}</td>
                                                            </tr> */}
                                                            <tr>
                                                                <td colSpan={6} className="fs-3 text-gray-900 fw-bold text-end">Grand Total</td>
                                                                <td className="text-gray-900 fs-3 fw-bolder text-end">{orderDetails?.order_total}</td>
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


        </ReactModal>
    )
}

export default PurchaseOrderReceiptModal;