
/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toAbsoluteUrl } from '../../../../_sitecommon/helpers';
import { getDateCommonFormatFromJsonDate } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { getPurchaseOrderDetailsByIdApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { formatNumber } from '../../common/util';


const PurchaseOrderReceiptModal: React.FC<{ afterPrint: any, data?: any, orderId?: string }> = ({
    afterPrint,
    data,
    orderId
}) => {
    const [orderDetails, setOrderDetails] = useState<any>(data);
    const componentRefForReceipt = useRef(null);
    const handlePrintReceipt = useReactToPrint({
        content: () => componentRefForReceipt.current,
        documentTitle: 'Purchase Order',
        onAfterPrint: () => { afterPrint(false); }
    });

    useEffect(() => {
        if (orderDetails) {
            setTimeout(handlePrintReceipt);
        }
    }, [orderDetails])


    useEffect(() => {
        if (orderId) {
            getOrderDetailsById();
        }
    }, [orderId]);

    const getOrderDetailsById = () => {
        getPurchaseOrderDetailsByIdApi(orderId)
            .then((res: any) => {
                const { data } = res;
                if (data) {
                    setOrderDetails(res?.data);
                }
            })
            .catch((err: any) => console.log(err, "err"));
    };

    return (
        <div className='admin-modal-area' style={{ display: 'none' }}>
            <form>
                <div className='modal-body py-lg-10 px-lg-10 custom-modal-height'>
                    <div className="card" ref={componentRefForReceipt}>
                        <div className="card-body py-5">
                            <div className="mw-lg-950px mx-auto w-100">
                                <div className="d-flex justify-content-between flex-column flex-sm-row mb-19">
                                    <h4 className="fw-bolder text-gray-800 fs-2qx pe-5 pb-7">Purchase Order</h4>
                                    <div className="text-sm-end">
                                        <a href="#" className="d-block mw-150px ms-sm-auto">
                                            {
                                                (orderDetails?.show_company_detail == true || orderDetails?.show_company_detail == 'true' || orderDetails?.show_company_detail == '1') &&
                                                (
                                                    <img alt="Logo"
                                                        src={toAbsoluteUrl('media/logos/default_dark_2.png')}
                                                        className="w-50"
                                                        height={50} />
                                                )
                                            }
                                        </a>
                                        {
                                            (orderDetails?.show_company_detail == true || orderDetails?.show_company_detail == 'true' || orderDetails?.show_company_detail == '1') &&
                                            (

                                                <div className="text-sm-end fw-semibold fs-4 text-muted mt-7">
                                                    <div>Sheeba Inventory System, Karachi</div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>

                                <div className="pb-12">
                                    <div className="d-flex flex-column gap-7 gap-md-10">
                                        <div className="separator"></div>
                                        <div className="d-flex flex-column flex-sm-row gap-7 gap-md-10 fw-bold">
                                            <div className="flex-root d-flex flex-column">
                                                <span className="text-muted">PO Number:</span>
                                                <span className="fs-5">{orderDetails?.po_number}</span>
                                            </div>
                                            <div className="flex-root d-flex flex-column">
                                                <span className="text-muted">PO Ref:</span>
                                                <span className="fs-5">{orderDetails?.po_reference}</span>
                                            </div>
                                            <div className="flex-root d-flex flex-column">
                                                <span className="text-muted">Delivery Date:</span>
                                                <span className="fs-5">{getDateCommonFormatFromJsonDate(orderDetails?.delivery_date)}</span>
                                            </div>
                                            <div className="flex-root d-flex flex-column">
                                                <span className="text-muted">Company Name:</span>
                                                <span className="fs-5">{orderDetails?.company_name}</span>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-column flex-sm-row gap-7 gap-md-10 fw-bold ">
                                            <div className="flex-root d-flex flex-column">
                                                <span className="text-muted">Vendor:</span>
                                                <span className="fs-5">{orderDetails?.vendor_first_name} {orderDetails?.vendor_last_name}</span>
                                            </div>

                                            <div className="flex-root d-flex flex-column">
                                                <span className="text-muted">Sale Representative:</span>
                                                <span className="fs-5">{orderDetails?.sale_representative_first_name} {orderDetails?.sale_representative_last_name}</span>
                                            </div>

                                            <div className="flex-root d-flex flex-column">
                                                <span className="text-muted">Purchaser Name:</span>
                                                <span className="fs-5">{orderDetails?.purchaser_name}</span>
                                            </div>

                                            <div className="flex-root d-flex flex-column">
                                                <span className="text-muted">Payment Terms:</span>
                                                <span className="fs-5">{orderDetails?.payment_terms}</span>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between flex-column">
                                            <div className="table-responsive border-bottom mb-9">
                                                <table className="table align-middle table-row-dashed fs-6 gy-5 mb-0">
                                                    <thead>
                                                        <tr className="border-bottom fs-6 fw-bold text-muted bg-light">
                                                            <th className="min-w-175px pb-2 ps-3 rounded-start">Product</th>
                                                            <th className="min-w-70px text-end pb-2">Cost</th>
                                                            <th className="min-w-80px text-end pb-2">Weight</th>
                                                            <th className="min-w-80px text-end pb-2">Subtotal</th>
                                                            <th className="min-w-80px text-end pb-2">Discount</th>
                                                            <th className="min-w-80px text-end pb-2">Sales Tax %</th>
                                                            <th className="min-w-80px text-end pb-2">Further Tax %</th>
                                                            <th className="min-w-80px text-end pb-2">Advance Tax %</th>
                                                            <th className="min-w-100px text-end pb-2 pe-2">Total Tax</th>
                                                            <th className="min-w-100px text-end pb-2 pe-3 rounded-end">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="fw-semibold text-gray-600">
                                                        {
                                                            orderDetails?.order_items != undefined && orderDetails?.order_items?.length > 0
                                                                ?
                                                                orderDetails?.order_items?.map((record: any, index: number) => (
                                                                    <tr key={"order-item-" + index}>
                                                                        <td className='text-start'>
                                                                            <div className="d-flex align-items-center">
                                                                                <div className="ms-5">
                                                                                    <div className="fw-bold">{record.product_name}</div>
                                                                                    <ul>
                                                                                        {record.inventory_units_info?.filter((x: { unit_type: number; }) => x.unit_type == 3)?.map((row: any, index2: number) => (
                                                                                            row.unit_sub_type == "Micron" ?
                                                                                                <div key={"order-unit-" + index + "-" + index2}>
                                                                                                    {row.unit_sub_type}: {row.unit_value} {row.unit_short_name}
                                                                                                </div>
                                                                                                :
                                                                                                <div key={"order-unit-" + index + "-" + index2}>
                                                                                                    {row.unit_sub_type}: {row.unit_value} {row.unit_short_name}
                                                                                                </div>
                                                                                        ))}
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-end">{formatNumber(record.po_rate, 2)}</td>
                                                                        <td className="text-end">{formatNumber(record.weight, 2)}</td>
                                                                        <td className="text-end">{formatNumber(record.subtotal, 2)}</td>
                                                                        <td className="text-end">{formatNumber(record.discount, 2)}</td>
                                                                        <td className="text-end">{formatNumber(record.tax_1_percentage, 2)}</td>
                                                                        <td className="text-end">{formatNumber(record.tax_2_percentage, 2)}</td>
                                                                        <td className="text-end">{formatNumber(record.tax_3_percentage, 2)}</td>
                                                                        <td className="text-end">{formatNumber(record.total_tax, 2)}</td>
                                                                        <td className="text-end">{formatNumber(record.total, 2)}</td>
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
                                                    <tfoot>
                                                        <tr className='border-none'>
                                                            <td colSpan={9} className="fs-4 text-gray-900 fw-bold text-end pb-0 border-none">Subtotal</td>
                                                            <td className="text-gray-900 fs-4 fw-bolder text-end pb-0 border-none">{formatNumber(orderDetails?.order_subtotal, 2)}</td>
                                                        </tr>
                                                        <tr className='border-none'>
                                                            <td colSpan={9} className="fs-4 text-gray-900 fw-bold text-end pb-0 border-none">Discount</td>
                                                            <td className="text-gray-900 fs-4 fw-bolder text-end pb-0 border-none">{formatNumber(orderDetails?.order_discount, 2)}</td>
                                                        </tr>
                                                        <tr className='border-none'>
                                                            <td colSpan={9} className="fs-4 text-gray-900 fw-bold text-end pb-0 border-none">Tax</td>
                                                            <td className="text-gray-900 fs-4 fw-bolder text-end pb-0 border-none">
                                                                <div className='pb-0 border-none'>{formatNumber(orderDetails?.order_tax_amount, 2)}</div>
                                                                <div className='pb-0 border-none' style={{fontSize: "12px !important"}}>({formatNumber(orderDetails?.order_tax_percentage, 2)} %)</div>
                                                            </td>
                                                        </tr>
                                                        <tr className='border-none'>
                                                            <td colSpan={9} className="fs-4 text-gray-900 fw-bold text-end pb-0 border-none">Total Discount</td>
                                                            <td className="text-gray-900 fs-4 fw-bolder text-end pb-0 border-none">{formatNumber(orderDetails?.order_total_discount, 2)}</td>
                                                        </tr>
                                                        <tr className='border-none'>
                                                            <td colSpan={9} className="fs-4 text-gray-900 fw-bold text-end pb-0 border-none">Total Tax</td>
                                                            <td className="text-gray-900 fs-4 fw-bolder text-end pb-0 border-none">{formatNumber(orderDetails?.order_total_tax, 2)}</td>
                                                        </tr>
                                                        <tr className='border-none'>
                                                            <td colSpan={9} className="fs-4 text-gray-900 fw-bold text-end pb-0 border-none">Total</td>
                                                            <td className="text-gray-900 fs-4 fw-bolder text-end pb-0 border-none">{formatNumber(orderDetails?.order_total, 2)}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-root d-flex flex-column">
                                    <span className="text-muted">Remarks:</span>
                                    <span className="fs-5">{orderDetails?.remarks}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default PurchaseOrderReceiptModal;