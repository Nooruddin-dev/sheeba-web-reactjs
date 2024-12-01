import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPrint } from '@fortawesome/free-solid-svg-icons';
import { getGrnVoucherDetailByIdApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { KTCard, KTCardBody, KTIcon } from '../../../../_sitecommon/helpers';
import { getDateCommonFormatFromJsonDate } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import GrnVoucherReceiptModal from '../components/GrnVoucherReceiptModal';
import { formatNumber } from '../../common/util';





export default function GrnVoucherDetailPage() {
    const params = useParams();
    const voucher_id = params.voucher_id;
    const [grnVoucherDetail, setGrnVoucherDetail] = useState<any>({});
    const [isOpenReceiptModal, setIsOpenReceiptModal] = useState<boolean>(false);

    useEffect(() => {
        getGrnVoucherDetailByIdService();
    }, []);

    const handlePrint = () => {
        setIsOpenReceiptModal(!isOpenReceiptModal);
    }

    const getGrnVoucherDetailByIdService = () => {
        getGrnVoucherDetailByIdApi(voucher_id)
            .then((res: any) => {

                const { data } = res;
                if (data) {
                    setGrnVoucherDetail(res?.data);
                } else {
                    setGrnVoucherDetail({});
                }
            })
            .catch((err: any) => console.log(err, "err"));
    };


    return (
        <>
            <AdminLayout>
                <AdminPageHeader
                    title='GRN Voucher Detail'
                    pageDescription='GRN Voucher Detail'
                    addNewClickType={''}
                    newLink={''}
                    onAddNewClick={undefined}
                    additionalInfo={{
                        showAddNewButton: false
                    }
                    }
                />
                <KTCard>
                    <KTCardBody className='py-4'>
                        <form className='form w-100'>
                            <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-6 fs-6 pb-4" style={{ borderBottom: '0px' }}>
                                <li className="nav-item">
                                    <a
                                        className="nav-link active text-active-primary fw-bolder"
                                        data-bs-toggle="tab"
                                        href="#kt_tab_pane_1"
                                    >
                                        <FontAwesomeIcon icon={faCircleInfo} className='me-2' />
                                        GRN Voucher Info
                                    </a>
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
                                            <div className='d-flex align-items-center bg-light-info rounded p-5'>

                                                <span className=' text-info me-5'>
                                                    <KTIcon iconName='abstract-26' className='text-info fs-1 me-5' />
                                                </span>

                                                <div className='flex-grow-1 me-2'>

                                                    <div className="row">
                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <span className='text-gray-800 text-hover-primary fs-4 fw-bold'>
                                                                        Voucher Number
                                                                    </span>
                                                                    <span className='text-muted fw-semibold d-block fs-5'>
                                                                        {grnVoucherDetail?.voucher_number}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <span className='text-gray-800 text-hover-primary fs-4 fw-bold'>
                                                                        PO Number
                                                                    </span>

                                                                    <span className='text-muted fw-semibold d-block fs-5'>
                                                                        {grnVoucherDetail?.po_number}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <span className='text-gray-800 text-hover-primary fs-4 fw-bold'>
                                                                        Date
                                                                    </span>
                                                                    <span className='text-muted fw-semibold d-block fs-6'> {
                                                                        getDateCommonFormatFromJsonDate(grnVoucherDetail?.grn_date)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <span className='text-gray-800 text-hover-primary fs-4 fw-bold'>
                                                                        Receiver Name
                                                                    </span>
                                                                    <span className='text-muted fw-semibold d-block fs-6'>
                                                                        {grnVoucherDetail?.receiver_name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="separator mb-4 mt-4"></div>

                                                    <div className="row">
                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <span className='text-gray-800 text-hover-primary fs-4 fw-bold'>
                                                                        Receiver Contact
                                                                    </span>
                                                                    <span className='text-muted fw-semibold d-block fs-6'>
                                                                        {grnVoucherDetail?.receiver_contact}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="separator mb-4 mt-4"></div>



                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className="d-flex justify-content-end">
                                                                <div className="btn btn-primary" onClick={handlePrint}>
                                                                    <FontAwesomeIcon icon={faPrint} className='me-2' />
                                                                    Print
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12 mt-4">
                                            <div className='d-flex align-items-center bg-light-warning rounded p-5 mb-7'>
                                                <span className=' text-warning me-5'>
                                                    <KTIcon iconName='abstract-26' className='text-warning fs-1 me-5' />
                                                </span>

                                                <div className='flex-grow-1 me-2'>
                                                    <div className='fw-bold text-gray-800 text-hover-primary fs-3'>
                                                        GRN Products
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <KTCardBody className='py-4'>
                                                                <div className='table-responsive'>
                                                                    <table
                                                                        id='kt_table_users'
                                                                        className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'>
                                                                        <thead>
                                                                            <tr className='text-start text-muted fw-bolder fs-6  gs-0 bg-light-info'
                                                                                style={{ border: '1.5px solid #999' }}>
                                                                                <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start"> SKU Code</th>
                                                                                <th colSpan={1} role="columnheader" className="min-w-250px">Product</th>
                                                                                <th colSpan={1} role="columnheader" className="min-w-100px">Quantity</th>
                                                                                <th colSpan={1} role="columnheader" className="min-w-100px">Weight</th>
                                                                                <th colSpan={1} role="columnheader" className="min-w-100px pe-3 rounded-end">Total</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className='text-gray-600 fw-bold'>
                                                                            {
                                                                                grnVoucherDetail?.grn_voucher_line_items !== undefined && grnVoucherDetail?.grn_voucher_line_items?.length > 0
                                                                                    ?
                                                                                    grnVoucherDetail?.grn_voucher_line_items?.map((record: any, index: number) => (
                                                                                        <tr>
                                                                                            <td className='ps-3'>{record.product_sku_code}</td>
                                                                                            <td>
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
                                                                                            </td>
                                                                                            <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{formatNumber(record.quantity, 2)}</td>
                                                                                            <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{formatNumber(record.weight, 2)}</td>
                                                                                            <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{formatNumber(record.total, 2)}</td>
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
                                                                                <td colSpan={4} className="fs-4 text-gray-900 fw-bold text-end pb-0 border-none">Subtotal</td>
                                                                                <td className="text-gray-900 fs-4 fw-bolder text-end pb-0 border-none">{formatNumber(grnVoucherDetail?.subtotal, 2)}</td>
                                                                            </tr>
                                                                            <tr className='border-none'>
                                                                                <td colSpan={4} className="fs-4 text-gray-900 fw-bold text-end pb-0 border-none">Total</td>
                                                                                <td className="text-gray-900 fs-4 fw-bolder text-end pb-0 border-none">{formatNumber(grnVoucherDetail?.total, 2)}</td>
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


                    </KTCardBody>
                </KTCard>
            </AdminLayout>
            {
                isOpenReceiptModal === true
                &&
                <GrnVoucherReceiptModal
                    afterPrint={setIsOpenReceiptModal}
                    voucherId={voucher_id} />
            }
        </>
    )
}
