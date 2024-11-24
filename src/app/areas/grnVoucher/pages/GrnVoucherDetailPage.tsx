import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faComment, faCreditCard, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { getGrnVoucherDetailByIdApi, getPurchaseOrderDetailsByIdApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { KTCard, KTCardBody, KTIcon } from '../../../../_sitecommon/helpers';
import { getDateCommonFormatFromJsonDate } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import GrnVoucherReceiptModal from '../components/GrnVoucherReceiptModal';





export default function GrnVoucherDetailPage() {
    const params = useParams();
    const voucher_id = params.voucher_id;
    const [selectedOrderItemIdForVariant, setSelectedOrderItemIdForVariant] = useState<number>(0);
    const [grnVoucherDetail, setGrnVoucherDetail] = useState<any>({});
    const [isOpenReceiptModal, setIsOpenReceiptModal] = useState<boolean>(false);
    const [isOpenOrderItemVariantsModal, setIsOpenOrderItemVariantsModal] = useState<boolean>(false);


    const handleOpenCloseOrderReceiptModal = () => {
        setIsOpenReceiptModal(!isOpenReceiptModal);
    }


    useEffect(() => {
        getGrnVoucherDetailByIdService();
    }, []);

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
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-4 fw-bold'>
                                                                        Voucher Number
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-5'> {grnVoucherDetail?.voucher_number}</span>
                                                                </div>
                                                                {/* <span className='badge badge-light fw-bold my-2'>+82$</span> */}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-4 fw-bold'>
                                                                        PO Number
                                                                    </a>

                                                                    <span className='text-muted fw-semibold d-block fs-5'> {grnVoucherDetail?.po_number}</span>
                                                                </div>
                                                                {/* <span className='badge badge-light fw-bold my-2'>+82$</span> */}
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-4 fw-bold'>
                                                                        Date
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-6'> {getDateCommonFormatFromJsonDate(grnVoucherDetail?.grn_date)}</span>
                                                                </div>
                                                                {/* <span className='badge badge-light fw-bold my-2'>+82$</span> */}
                                                            </div>
                                                        </div>


                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-4 fw-bold'>
                                                                        Receiver Name
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-6'>   {grnVoucherDetail?.receiver_name}</span>
                                                                </div>
                                                                {/* <span className='badge badge-light fw-bold my-2'>+82$</span> */}
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="separator mb-4 mt-4"></div>

                                                    <div className="row">
                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-4 fw-bold'>
                                                                        Receiver Contact
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-6'>   {grnVoucherDetail?.receiver_contact}</span>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-4 fw-bold'>
                                                                        GRN Tax Total
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-6'>{grnVoucherDetail?.grn_tax_total}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-4 fw-bold'>
                                                                        GRN Amount Total
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-6'>{grnVoucherDetail?.grn_toal_amount}</span>
                                                                </div>
                                                            </div>
                                                        </div>




                                                    </div>

                                                    <div className="separator mb-4 mt-4"></div>



                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className="d-flex justify-content-end">
                                                                <a href="#" className="btn btn-primary"
                                                                    onClick={handleOpenCloseOrderReceiptModal}
                                                                >
                                                                    <FontAwesomeIcon icon={faPlus} className='me-2' />
                                                                    Preview Receipt</a>
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
                                                    <a href='#' className='fw-bold text-gray-800 text-hover-primary fs-3'>
                                                        GRN Line Items
                                                    </a>

                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            {/* <UsersTable /> */}
                                                            <KTCardBody className='py-4'>
                                                                <div className='table-responsive'>
                                                                    <table
                                                                        id='kt_table_users'
                                                                        className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'

                                                                    >
                                                                        <thead>
                                                                            <tr className='text-start text-muted fw-bolder fs-6  gs-0 bg-light-info'
                                                                                style={{ border: '1.5px solid #999' }}
                                                                            >
                                                                                {/* <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>GRN Item ID</th> */}
                                                                                <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}> Product Name</th>
                                                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> SKU Code</th>
                                                                                <th colSpan={1} role="columnheader" className="min-w-150px" style={{ cursor: 'pointer' }}></th>

                                                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Quantity</th>
                                                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Weight</th>
                                                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Amount</th>
                                                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Item Tax</th>
                                                                                <th colSpan={1} role="columnheader" className="min-w-125px pe-3 rounded-end" style={{ cursor: 'pointer' }}> Item Total Amount</th>


                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className='text-gray-600 fw-bold'>

                                                                            {
                                                                                grnVoucherDetail?.grn_voucher_line_items != undefined && grnVoucherDetail?.grn_voucher_line_items?.length > 0
                                                                                    ?
                                                                                    grnVoucherDetail?.grn_voucher_line_items?.map((record: any) => (
                                                                                        <tr>
                                                                                            {/* <td className='ps-3'>
                                                                                                <span className="text-muted fw-semibold text-muted d-block fs-6">{record.grn_line_item_id}</span>
                                                                                            </td> */}
                                                                                            <td className='ps-3'>
                                                                                                <div className='d-flex align-items-center'>
                                                                                                    {/* <div className='symbol symbol-45px me-5'>
                                                                                                    <img src={toAbsoluteUrlCustom(record.productDefaultImage)} alt='' />
                                                                                                </div> */}
                                                                                                    <div className='d-flex justify-content-start flex-column'>
                                                                                                        <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                                                                            {record.product_name}
                                                                                                        </a>
                                                                                                        {/* <span className='text-muted fw-semibold text-muted d-block fs-6'>
                                                                                                        Fast Food
                                                                                                    </span> */}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>

                                                                                            <td role='cell'>{record.product_sku_code}</td>
                                                                                            <td role='cell'>
                                                                                                <ul>
                                                                                                    {record.inventory_units_info?.filter((x: { unit_type: number; })=>x.unit_type == 3).map((row: any) => (

                                                                                                        row.unit_sub_type == "Micon" ?
                                                                                                            <>
                                                                                                                <li style={{ border: "1px solid rgb(153 153 153 / 33%)", marginBottom: "4px", listStyle: "none" }}>
                                                                                                                    {row.unit_sub_type} - {row.unit_value}
                                                                                                                </li>

                                                                                                             
                                                                                                            </>
                                                                                                            :
                                                                                                            <>
                                                                                                                <li style={{ border: "1px solid rgb(153 153 153 / 33%)", marginBottom: "4px", listStyle: "none" }}>
                                                                                                                    {row.unit_sub_type} ({row.unit_short_name}) - {row.unit_value}
                                                                                                                </li>
                                                                                                              
                                                                                                            </>

                                                                                                    ))}
                                                                                                </ul>




                                                                                            </td>

                                                                                            <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{record.quantity}</td>
                                                                                            <td className='text-gray-900 fw-bold text-hover-primary fs-6'>10000</td>
                                                                                            <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{record.amount}</td>

                                                                                            <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{record.item_tax_amount_total}</td>
                                                                                            <td className='text-gray-900 fw-bold text-hover-primary fs-6 pe-3'>{record.grn_item_total}</td>


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

                        {
                            isOpenReceiptModal == true
                                ?

                                <GrnVoucherReceiptModal
                                    isOpen={isOpenReceiptModal}
                                    closeModal={handleOpenCloseOrderReceiptModal}
                                    voucherId={voucher_id}
                                />
                                :
                                <>
                                </>
                        }





                    </KTCardBody>

                </KTCard>

            </AdminLayout>

        </>
    )
}
