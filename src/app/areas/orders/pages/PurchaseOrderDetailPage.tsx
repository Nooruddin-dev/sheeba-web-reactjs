import React, { useEffect, useState } from "react";

import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleInfo,
    faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { getPurchaseOrderDetailsByIdApi } from "../../../../_sitecommon/common/helpers/api_helpers/ApiCalls";
import { KTCard, KTCardBody, KTIcon } from "../../../../_sitecommon/helpers";
import { getDateCommonFormatFromJsonDate } from "../../../../_sitecommon/common/helpers/global/ConversionHelper";
import AdminLayout from "../../common/components/layout/AdminLayout";
import AdminPageHeader from "../../common/components/layout/AdminPageHeader";
import PurchaseOrderReceiptModal from "../components/PurchaseOrderReceiptModal";
import { formatNumber } from "../../common/util";

export default function PurchaseOrderDetailPage() {
    const params = useParams();
    const purchase_order_id = params.purchase_order_id;
    const [orderDetails, setOrderDetails] = useState<any>({});
    const [isOpenReceiptModal, setIsOpenReceiptModal] = useState<boolean>(false);

    window.addEventListener("afterprint", () => {
        setIsOpenReceiptModal(false);
    });

    const onPrint = () => {
        setIsOpenReceiptModal(true);
    };

    useEffect(() => {
        getPurchaseOrderDetailsById();
    }, []);

    const getPurchaseOrderDetailsById = () => {
        getPurchaseOrderDetailsByIdApi(purchase_order_id)
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
        <>
            <AdminLayout>
                <AdminPageHeader
                    title="Purchase Order Detail"
                    pageDescription="Purchase Order Detail"
                    addNewClickType={""}
                    newLink={""}
                    onAddNewClick={undefined}
                    additionalInfo={{
                        showAddNewButton: false,
                    }}
                />
                <KTCard>
                    <KTCardBody className="py-4">
                        <form className="form w-100">
                            <ul
                                className="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-6 fs-6 pb-4"
                                style={{ borderBottom: "0px" }}>
                                <li className="nav-item">
                                    <span
                                        className="nav-link active text-active-primary fw-bolder"
                                        data-bs-toggle="tab">
                                        <FontAwesomeIcon icon={faCircleInfo} className="me-2" />
                                        Order Info
                                    </span>
                                </li>
                            </ul>

                            <div className="tab-content" id="myTabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="kt_tab_pane_1"
                                    role="tabpanel"
                                >
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="d-flex align-items-center bg-light-info rounded p-5">
                                                <span className=" text-info me-5"></span>
                                                <div className="flex-grow-1 me-2">
                                                    <div className="row">
                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className="d-flex align-items-center flex-row-fluid flex-wrap">
                                                                <div className="flex-grow-1 me-2">
                                                                    <span className="text-muted fw-semibold d-block fs-7">
                                                                        PO Number
                                                                    </span>
                                                                    <span className="text-gray-800 fs-6 fw-bold">
                                                                        {orderDetails?.po_number}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className="d-flex align-items-center flex-row-fluid flex-wrap">
                                                                <div className="flex-grow-1 me-2">
                                                                    <span className="text-muted fw-semibold d-block fs-7">
                                                                        PO Reference
                                                                    </span>
                                                                    <span className="text-gray-800 fs-6 fw-bold">
                                                                        {orderDetails?.po_reference}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className="d-flex align-items-center flex-row-fluid flex-wrap">
                                                                <div className="flex-grow-1 me-2">
                                                                    <span className="text-muted fw-semibold d-block fs-7">
                                                                        Order Date
                                                                    </span>
                                                                    <span className="text-gray-800 fs-6 fw-bold">
                                                                        {getDateCommonFormatFromJsonDate(orderDetails?.order_date)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className="d-flex align-items-center flex-row-fluid flex-wrap">
                                                                <div className="flex-grow-1 me-2">
                                                                    <span className="text-muted fw-semibold d-block fs-7">
                                                                        Delivery Date
                                                                    </span>
                                                                    <span className="text-gray-800 fs-6 fw-bold">
                                                                        {getDateCommonFormatFromJsonDate(orderDetails?.delivery_date)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="separator mb-4 mt-4"></div>

                                                    <div className="row">
                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className="d-flex align-items-center flex-row-fluid flex-wrap">
                                                                <div className="flex-grow-1 me-2">
                                                                    <span className="text-muted fw-semibold d-block fs-7">
                                                                        Company Name
                                                                    </span>
                                                                    <span className="text-gray-800 fs-6 fw-bold">
                                                                        {orderDetails?.company_name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className="d-flex align-items-center flex-row-fluid flex-wrap">
                                                                <div className="flex-grow-1 me-2">
                                                                    <span className="text-muted fw-semibold d-block fs-7">
                                                                        Vendor
                                                                    </span>
                                                                    <span className="text-gray-800 fs-6 fw-bold">
                                                                        {orderDetails?.vendor_first_name} {orderDetails?.vendor_last_name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className="d-flex align-items-center flex-row-fluid flex-wrap">
                                                                <div className="flex-grow-1 me-2">
                                                                    <span className="text-muted fw-semibold d-block fs-7">
                                                                        Sale Representative
                                                                    </span>
                                                                    <span className="text-gray-800 fs-6 fw-bold">
                                                                        {orderDetails?.sale_representative_first_name}{" "}{orderDetails?.sale_representative_last_name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className="d-flex align-items-center flex-row-fluid flex-wrap">
                                                                <div className="flex-grow-1 me-2">
                                                                    <span className="text-muted fw-semibold d-block fs-7">
                                                                        Purchaser Name
                                                                    </span>
                                                                    <span className="text-gray-800 fs-6 fw-bold">
                                                                        {orderDetails?.purchaser_name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="separator mb-4 mt-4"></div>

                                                    <div className="row">
                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className="d-flex align-items-center flex-row-fluid flex-wrap">
                                                                <div className="flex-grow-1 me-2">
                                                                    <span className="text-muted fw-semibold d-block fs-7">
                                                                        Payment Terms
                                                                    </span>
                                                                    <span className="text-gray-800 fs-6 fw-bold">
                                                                        {orderDetails?.payment_terms}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-8 col-md-8 col-8">
                                                            <div className="d-flex align-items-center flex-row-fluid flex-wrap">
                                                                <div className="flex-grow-1 me-2">
                                                                    <span className="text-muted fw-semibold d-block fs-7">
                                                                        Remarks
                                                                    </span>
                                                                    <span className="text-gray-800 fs-6 fw-bold">
                                                                        {orderDetails?.remarks}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className="d-flex justify-content-end">
                                                                <div className="btn btn-primary" onClick={() => onPrint()}>
                                                                    <FontAwesomeIcon icon={faPrint} className="me-2" />
                                                                    Print
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 mt-4">
                                            <div className="d-flex align-items-center bg-light-warning rounded p-5 mb-7">
                                                <span className=" text-warning me-5">
                                                    <KTIcon
                                                        iconName="abstract-26"
                                                        className="text-warning fs-1 me-5"
                                                    />
                                                </span>

                                                <div className="flex-grow-1 me-2">
                                                    <span className="fw-bold text-gray-800 fs-3">
                                                        Order Items
                                                    </span>
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            {/* <UsersTable /> */}
                                                            <KTCardBody className="py-4">
                                                                <div className="table-responsive">
                                                                    <table id="kt_table_users" className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer">
                                                                        <thead>
                                                                            <tr className="text-start text-muted fw-bolder fs-7  gs-0 bg-light-info" style={{ border: "1.5px solid #999" }}>
                                                                                <th role="columnheader" className="min-w-125px ps-3 rounded-start">
                                                                                    SKU
                                                                                </th>
                                                                                <th role="columnheader" className="min-w-125px">
                                                                                    Product
                                                                                </th>
                                                                                <th role="columnheader" className="min-w-125px">
                                                                                    Cost
                                                                                </th>
                                                                                <th role="columnheader" className="min-w-125px">
                                                                                    Weight
                                                                                </th>
                                                                                <th role="columnheader" className="min-w-125px">
                                                                                    Subtotal
                                                                                </th>
                                                                                <th role="columnheader" className="min-w-125px">
                                                                                    Discount
                                                                                </th>
                                                                                <th role="columnheader" className="min-w-125px">
                                                                                    Sales Tax %
                                                                                </th>
                                                                                <th role="columnheader" className="min-w-125px">
                                                                                    Further Tax %
                                                                                </th>
                                                                                <th role="columnheader" className="min-w-125px">
                                                                                    Advance Tax %
                                                                                </th>
                                                                                <th role="columnheader" className="min-w-125px">
                                                                                    Total Tax
                                                                                </th>
                                                                                <th role="columnheader" className="min-w-125px rounded-end">
                                                                                    Total
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="text-gray-600 fw-bold">
                                                                            {orderDetails?.order_items != undefined &&
                                                                                orderDetails?.order_items?.length > 0 ? (
                                                                                orderDetails?.order_items?.map(
                                                                                    (record: any, index: number) => (
                                                                                        <tr key={"order-item-" + index}>
                                                                                            <td className="ps-3">
                                                                                                <span className="text-muted fw-semibold text-muted d-block fs-7">
                                                                                                    {record.sku}
                                                                                                </span>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="d-flex align-items-center">
                                                                                                    <div className="d-flex justify-content-start flex-column">
                                                                                                        <div className="text-gray-900 fw-bold fs-6">
                                                                                                            {record.product_name}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>
                                                                                            <td className="text-gray-900 fw-bold fs-6">
                                                                                                {formatNumber(record.po_rate, 2)}
                                                                                            </td>
                                                                                            <td className="text-gray-900 fw-bold fs-6">
                                                                                                {formatNumber(record.weight, 2)}
                                                                                            </td>
                                                                                            <td className="text-gray-900 fw-bold fs-6">
                                                                                                {formatNumber(record.subtotal, 2)}
                                                                                            </td>
                                                                                            <td className="text-gray-900 fw-bold fs-6">
                                                                                                {formatNumber(record.discount, 2)}
                                                                                            </td>
                                                                                            <td className="text-gray-900 fw-bold fs-6">
                                                                                                {formatNumber(record.tax_1_percentage, 2)}
                                                                                            </td>
                                                                                            <td className="text-gray-900 fw-bold fs-6">
                                                                                                {formatNumber(record.tax_2_percentage, 2)}
                                                                                            </td>
                                                                                            <td className="text-gray-900 fw-bold fs-6">
                                                                                                {formatNumber(record.tax_3_percentage, 2)}
                                                                                            </td>
                                                                                            <td className="text-gray-900 fw-bold fs-6">
                                                                                                {formatNumber(record.total_tax, 2)}
                                                                                            </td>
                                                                                            <td className="text-gray-900 fw-bold fs-6">
                                                                                                {formatNumber(record.total, 2)}
                                                                                            </td>
                                                                                        </tr>
                                                                                    )
                                                                                )
                                                                            ) : (
                                                                                <tr>
                                                                                    <td colSpan={20}>
                                                                                        <div className="d-flex text-center w-100 align-content-center justify-content-center">
                                                                                            No matching records found
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </tbody>
                                                                        <tfoot>
                                                                            <tr>
                                                                                <td colSpan={10} className="text-gray-900 fw-bold fs-6 text-end pb-1 border-none">
                                                                                    Subtotal
                                                                                </td>
                                                                                <td className="text-gray-900 fw-bold fs-6 text-end pb-1 border-none">
                                                                                    {formatNumber(orderDetails.order_subtotal, 2)}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colSpan={10} className="text-gray-900 fw-bold fs-6 text-end pb-1 border-none">
                                                                                    Discount
                                                                                </td>
                                                                                <td className="text-gray-900 fw-bold fs-6 text-end pb-1 border-none">
                                                                                    {formatNumber(orderDetails.order_discount, 2)}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colSpan={10} className="text-gray-900 fw-bold fs-6 text-end pb-1 border-none">
                                                                                    Tax
                                                                                </td>
                                                                                <td className="text-gray-900 fw-bold fs-6 text-end pb-1 border-none">
                                                                                    <div className="pb-1 border-none">{formatNumber(orderDetails.order_tax_amount, 2)}</div>
                                                                                    <div className="pb-1 border-none">({formatNumber(orderDetails.order_tax_percentage, 2)} %)</div>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colSpan={10} className="text-gray-900 fw-bold fs-6 text-end pb-1 border-none">
                                                                                    Total Discount
                                                                                </td>
                                                                                <td className="text-gray-900 fw-bold fs-6 text-end pb-1 border-none">
                                                                                    {formatNumber(orderDetails.order_total_discount, 2)}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colSpan={10} className="text-gray-900 fw-bold fs-6 text-end pb-1 border-none">
                                                                                    Total Tax
                                                                                </td>
                                                                                <td className="text-gray-900 fw-bold fs-6 text-end pb-1 border-none">
                                                                                    {formatNumber(orderDetails.order_total_tax, 2)}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colSpan={10} className="text-gray-900 fw-bold fs-6 text-end pb-1 border-none">
                                                                                    Total
                                                                                </td>
                                                                                <td className="text-gray-900 fw-bold fs-6 text-end pb-1 border-none">
                                                                                    {formatNumber(orderDetails.order_total, 2)}
                                                                                </td>
                                                                            </tr>
                                                                        </tfoot>
                                                                    </table>
                                                                </div>
                                                            </KTCardBody>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        {isOpenReceiptModal === true ? (
                            <PurchaseOrderReceiptModal
                                data={orderDetails ? orderDetails : undefined}
                                orderId={orderDetails ? undefined : purchase_order_id}
                            />
                        ) : (
                            <></>
                        )}
                    </KTCardBody>
                </KTCard>
            </AdminLayout>
        </>
    );
}
