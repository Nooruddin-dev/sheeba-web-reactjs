import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faComment, faCreditCard, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { getPurchaseOrderDetailsByIdApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { KTCard, KTCardBody, KTIcon } from '../../../../_sitecommon/helpers';
import { getDateCommonFormatFromJsonDate } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import PurchaseOrderReceiptModal from '../components/PurchaseOrderReceiptModal';





export default function VendorOrderDetailsPage() {
    const params = useParams();
    const purchase_order_id = params.purchase_order_id;
    const [selectedOrderItemIdForVariant, setSelectedOrderItemIdForVariant] = useState<number>(0);
    const [orderDetails, setOrderDetails] = useState<any>({});
    const [isOpenReceiptModal, setIsOpenReceiptModal] = useState<boolean>(false);
    const [isOpenOrderItemVariantsModal, setIsOpenOrderItemVariantsModal] = useState<boolean>(false);


    const onSubmitOrderDetailForm = (data: any) => {
        return true;
    }

    const handleOpenCloseOrderReceiptModal = () => {
        setIsOpenReceiptModal(!isOpenReceiptModal);
    }
    const handleOpenCloseOrderVariantsModal = () => {
        setIsOpenOrderItemVariantsModal(!isOpenOrderItemVariantsModal);
    }

    window.addEventListener("afterprint", () => {
        setIsOpenReceiptModal(false);
    });


    const print = () => {
        setIsOpenReceiptModal(true);
    };

    useEffect(() => {
        getPurchaseOrderDetailsByIdService();
    }, []);

    const getPurchaseOrderDetailsByIdService = () => {


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

          
               

                <KTCard>


                    <KTCardBody className='py-4'>

                        <h4>Purchase Order Details</h4>

                        <form className='form w-100'>


                            <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-6 fs-6 pb-4" style={{ borderBottom: '0px' }}>
                                <li className="nav-item">
                                    <a
                                        className="nav-link active text-active-primary fw-bolder"
                                        data-bs-toggle="tab"
                                        href="#kt_tab_pane_1"
                                    >

                                        <FontAwesomeIcon icon={faCircleInfo} className='me-2' />
                                        Order Info
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
                                                   
                                                </span>

                                                <div className='flex-grow-1 me-2'>

                                                    <div className="row">
                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                        PO Number
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-7'> {orderDetails?.po_number}</span>
                                                                </div>
                                                                {/* <span className='badge badge-light fw-bold my-2'>+82$</span> */}
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                        PO Ref
                                                                    </a>

                                                                    <span className='text-muted fw-semibold d-block fs-7'> {orderDetails?.po_reference}</span>
                                                                </div>
                                                                {/* <span className='badge badge-light fw-bold my-2'>+82$</span> */}
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                        Delivery Date
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-7'> {getDateCommonFormatFromJsonDate(orderDetails?.delivery_date)}</span>
                                                                </div>
                                                                {/* <span className='badge badge-light fw-bold my-2'>+82$</span> */}
                                                            </div>
                                                        </div>


                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                        Company Name
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-7'>   {orderDetails?.company_name}</span>
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
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                        Vendor
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-7'>{orderDetails?.vendor_first_name} {orderDetails?.vendor_last_name}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                        Sale Representative
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-7'>{orderDetails?.sale_representative_first_name} {orderDetails?.sale_representative_last_name}</span>
                                                                </div>
                                                            </div>
                                                        </div>



                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                        Purchaser Name
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-7'>{orderDetails?.purchaser_name}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                        Payment Terms
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-7'>{orderDetails?.payment_terms}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="separator mb-4 mt-4"></div>

                                                    <div className="row">

                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                        Remarks
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-7'>{orderDetails?.remarks}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                        Order Tax Total
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-7'>{orderDetails?.order_tax_total}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-3 col-md-3 col-3">
                                                            <div className='d-flex align-items-center flex-row-fluid flex-wrap'>
                                                                <div className='flex-grow-1 me-2'>
                                                                    <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bold'>
                                                                        Order Total
                                                                    </a>
                                                                    <span className='text-muted fw-semibold d-block fs-7'>{orderDetails?.order_total}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className="d-flex justify-content-end">
                                                                {/* <a href="#" className="btn btn-primary"
                                                                    onClick={handleOpenCloseOrderReceiptModal}
                                                                >
                                                                    <FontAwesomeIcon icon={faPlus} className='me-2' />
                                                                    Preview Receipt</a> */}
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
                                                        Order Items
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
                                                                            <tr className='text-start text-muted fw-bolder fs-7  gs-0 bg-light-info'
                                                                                style={{ border: '1.5px solid #999' }}
                                                                            >
                                                                                <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Order Item ID</th>
                                                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Product Name</th>
                                                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}> Price</th>
                                                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Quantity</th>
                                                                                <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Item Tax</th>
                                                                                <th colSpan={1} role="columnheader" className="min-w-125px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Order Item Total</th>
                                                                             
                                                                             
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className='text-gray-600 fw-bold'>

                                                                            {
                                                                                orderDetails?.order_items != undefined && orderDetails?.order_items?.length > 0
                                                                                    ?
                                                                                    orderDetails?.order_items?.map((record: any) => (
                                                                                        <tr>
                                                                                            <td className='ps-3'>
                                                                                                <span className="text-muted fw-semibold text-muted d-block fs-7">{record.line_item_id}</span>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className='d-flex align-items-center'>
                                                                                                    {/* <div className='symbol symbol-45px me-5'>
                                                                                                    <img src={toAbsoluteUrlCustom(record.productDefaultImage)} alt='' />
                                                                                                </div> */}
                                                                                                    <div className='d-flex justify-content-start flex-column'>
                                                                                                        <a href='#' className='text-gray-900 fw-bold text-hover-primary fs-6'>
                                                                                                            {record.product_name}
                                                                                                        </a>
                                                                                                        {/* <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                                                                                        Fast Food
                                                                                                    </span> */}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>


                                                                                            <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{record.amount}</td>
                                                                                            <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{record.quantity}</td>
                                                                                            <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{record.tax_amount}</td>
                                                                                            <td className='text-gray-900 fw-bold text-hover-primary fs-6 pe-3'>{record.item_total}</td>

                                                                                          
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

                            <PurchaseOrderReceiptModal
                                afterPrint={setIsOpenReceiptModal}
                                data={undefined}
                                orderId={purchase_order_id}
                            />
                            :
                            <>
                            </>
                    }





                    </KTCardBody>

                </KTCard>

          

        </>
    )
}
