
/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toAbsoluteUrl } from '../../../../_sitecommon/helpers';
import { getDateCommonFormatFromJsonDate } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { getGrnVoucherDetailByIdApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { formatNumber } from '../../common/util';

const GrnVoucherReceiptModal: React.FC<{ afterPrint: any, voucherId: any }> = ({
    afterPrint,
    voucherId,
}) => {
    const [grnVoucherDetail, setGrnVoucherDetail] = useState<any>(null);
    const componentRefForReceipt = useRef(null);
    const handlePrintReceipt = useReactToPrint({
        content: () => componentRefForReceipt.current,
        documentTitle: 'GRN Voucher',
        onAfterPrint: () => { afterPrint(false) }
    });

    useEffect(() => {
        getGrnVoucherDetailByIdService();
    }, [voucherId]);

    useEffect(() => {
        if (grnVoucherDetail) {
            setTimeout(handlePrintReceipt);
        }
    }, [grnVoucherDetail]);

    const getGrnVoucherDetailByIdService = () => {
        getGrnVoucherDetailByIdApi(voucherId)
            .then((res: any) => {
                const { data } = res;
                if (data) {
                    setGrnVoucherDetail(res?.data);
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
                                    <h4 className="fw-bolder text-gray-800 fs-2qx pe-5 pb-7">GRN VOUCHER</h4>
                                    <div className="text-sm-end">
                                        <a href="#" className="d-block mw-150px ms-sm-auto">
                                            {
                                                (grnVoucherDetail?.show_company_detail == true || grnVoucherDetail?.show_company_detail == 'true' || grnVoucherDetail?.show_company_detail == '1') &&
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
                                            (grnVoucherDetail?.show_company_detail == true || grnVoucherDetail?.show_company_detail == 'true' || grnVoucherDetail?.show_company_detail == '1') &&
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
                                                <span className="text-muted">GRN Number:</span>
                                                <span className="fs-5">{grnVoucherDetail?.voucher_number}</span>
                                            </div>

                                            <div className="flex-root d-flex flex-column">
                                                <span className="text-muted">PO No:</span>
                                                <span className="fs-5">{grnVoucherDetail?.po_number}</span>
                                            </div>

                                            <div className="flex-root d-flex flex-column">
                                                <span className="text-muted">Date:</span>
                                                <span className="fs-5">{getDateCommonFormatFromJsonDate(grnVoucherDetail?.grn_date)}</span>
                                            </div>

                                            <div className="flex-root d-flex flex-column">
                                                <span className="text-muted">Receiver Name:</span>
                                                <span className="fs-5">{grnVoucherDetail?.receiver_name}</span>
                                            </div>

                                            <div className="flex-root d-flex flex-column">
                                                <span className="text-muted">Receiver Contact:</span>
                                                <span className="fs-5">{grnVoucherDetail?.receiver_contact}</span>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between flex-column">
                                            <div className="table-responsive border-bottom mb-9">
                                                <table className="table align-middle table-row-dashed fs-6 gy-5 mb-0">
                                                    <thead>
                                                        <tr className="border-bottom fs-6 fw-bold text-muted bg-light">
                                                            <th className="min-w-70px text-end pb-3 rounded-start">SKU</th>
                                                            <th className="min-w-175px pb-2 ps-2">Product</th>
                                                            <th className="min-w-80px text-end pb-2">Quantity</th>
                                                            <th className="min-w-80px text-end pb-2">Weight</th>
                                                            <th className="min-w-80px text-end pe-3 rounded-end">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="fw-semibold text-gray-600">
                                                        {
                                                            grnVoucherDetail?.grn_voucher_line_items != undefined && grnVoucherDetail?.grn_voucher_line_items?.length > 0
                                                                ?
                                                                grnVoucherDetail?.grn_voucher_line_items?.map((record: any, index: number) => (
                                                                    <tr>
                                                                        <td className="text-end">{record.product_sku_code}</td>
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
                                                                        <td className="text-end">{formatNumber(record.quantity, 2)}</td>
                                                                        <td className="text-end">{formatNumber(record.weight, 2)}</td>
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
                                                            <td colSpan={4} className="fs-3 text-gray-900 fw-bold border-none text-end">Subtotal</td>
                                                            <td className="text-gray-900 fs-3 fw-bolder text-end">{formatNumber(grnVoucherDetail?.subtotal, 2)}</td>
                                                        </tr>
                                                        <tr className='border-none'>
                                                            <td colSpan={4} className="fs-3 text-gray-900 fw-bold border-none text-end">Total</td>
                                                            <td className="text-gray-900 fs-3 fw-bolder text-end">{formatNumber(grnVoucherDetail?.total, 2)}</td>
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
            </form>
        </div>
    )
}

export default GrnVoucherReceiptModal;