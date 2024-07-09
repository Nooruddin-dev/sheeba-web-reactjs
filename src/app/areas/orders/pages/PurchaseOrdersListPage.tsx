/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { APP_BASIC_CONSTANTS } from '../../../../_sitecommon/common/constants/Config';
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig';
import { buildUrlParamsForSearch } from '../../../../_sitecommon/common/helpers/global/GlobalHelper';
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody, KTIcon, toAbsoluteUrlCustom } from '../../../../_sitecommon/helpers';
import CommonListSearchHeader from '../../common/components/layout/CommonListSearchHeader';
import { CommonTableActionCell } from '../../common/components/layout/CommonTableActionCell';
import dBEntitiesConst from '../../../../_sitecommon/common/constants/dBEntitiesConst';
import { PurchaseOrderStatusTypesEnum, sqlDeleteTypesConst } from '../../../../_sitecommon/common/enums/GlobalEnums';
import CommonListPagination from '../../common/components/layout/CommonListPagination';
import TableListLoading from '../../common/components/shared/TableListLoading';
import BusinessPartnerTypesEnum from '../../../../_sitecommon/common/enums/BusinessPartnerTypesEnum';
import { getAllMachinesListApi, getAllPurchaseOrdersListApi, getAllUsersApi, getMachineTypesListApi, inserUpdateBusinessPartnerApi, insertUpdateMachineApi, updatePurchaseOrderStatusApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { Link } from 'react-router-dom';
import { getDateCommonFormatFromJsonDate } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { getPurchaseOrderStatusClass } from '../../../../_sitecommon/common/helpers/global/OrderHelper';
import OrderStatusCommonForm from '../components/OrderStatusCommonForm';




export default function PurchaseOrdersListPage() {
    const isLoading = false;


    // ✅-- Starts: necessary varaibles for the page
    const [isOpenAddNewForm, setIsOpenAddNewForm] = useState<boolean>(false);
    const [listRefreshCounter, setListRefreshCounter] = useState<number>(0);
    const [pageBasicInfo, setPageBasicInfo] = useState<any>(
        {
            pageNo: 1,
            pageSize: APP_BASIC_CONSTANTS.ITEMS_PER_PAGE,
            totalRecords: 0
        }
    );

    const [searchFormQueryParams, setSearchFormQueryParams] = useState<string>('');
    const [allPurchaseOrdersList, setAllPurchaseOrdersList] = useState<any>([]);
    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const [orderStatusEditForm, setOrderStatusEditForm] = useState<any>(null); // Data of the order status being edited
    const [isOpenOrderStatusForm, setIsOpenOrderStatusForm] = useState<boolean>(false);

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'po_numberSearch', inputName: 'po_numberSearch', labelName: 'PO Number', placeHolder: 'PO Number', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'company_nameSearch', inputName: 'company_nameSearch', labelName: 'Company Name', placeHolder: 'Company Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },

    ];
    const [userEditForm, setUserEditForm] = useState<any>(null); // Data of the user being edited
    // ✅-- Ends: necessary varaibles for the page


    const handleSearchForm = (updatedSearchFields: HtmlSearchFieldConfig) => {
        const queryUrl = buildUrlParamsForSearch(updatedSearchFields);
        setSearchFormQueryParams(queryUrl);

        //--reset pageNo to 1
        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: 1 // Update only the pageNo property
        }));

        setTimeout(() => {
            setListRefreshCounter(prevCounter => prevCounter + 1);
        }, 300);

    }

    const handleSearchFormReset = (e: Event) => {
        if (e) {
            e.preventDefault();
        }
        //--reset pageNo to 1
        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: 1 // Update only the pageNo property
        }));

        setSearchFormQueryParams('');
        setListRefreshCounter(prevCounter => prevCounter + 1);
    }

    const handleOpenCloseOrderStatusFormModal = () => {
        setIsOpenOrderStatusForm(!isOpenOrderStatusForm);
        setOrderStatusEditForm(null);
    }


    const handlePurchaseOrderStatusEditForm = (e: any, id: number) => {

        e.preventDefault();




        const recordForEdit = allPurchaseOrdersList?.find((x: { purchase_order_id: number }) => x.purchase_order_id == id);

        if (recordForEdit?.status_id == PurchaseOrderStatusTypesEnum.Complete || recordForEdit?.status_id == PurchaseOrderStatusTypesEnum.Cancel) {
            showErrorMsg('Not allowed to change status from complete/cancel!');
            return;
        }



        setOrderStatusEditForm({
            orderIdStatusEditForm: recordForEdit?.purchase_order_id,
            orderStatusIdForUpdate: recordForEdit?.status_id,

        });

        setIsOpenOrderStatusForm(!isOpenOrderStatusForm);
    }

    const updatePurchaseOrderStatusService = (data: any) => {
        console.log('order status data: ', data); // Handle form submission here
        const { orderIdStatusEditForm, orderStatusIdForUpdate } = data;
        if (stringIsNullOrWhiteSpace(orderIdStatusEditForm) || orderIdStatusEditForm < 1) {
            showErrorMsg('Invalid purchase order id');
            return;
        }

        if (stringIsNullOrWhiteSpace(orderStatusIdForUpdate) || orderStatusIdForUpdate < 1) {
            showErrorMsg('Please select order status');
            return;
        }

        const recordForEdit = allPurchaseOrdersList?.find((x: { purchase_order_id: number }) => x.purchase_order_id == orderIdStatusEditForm);
        let total_grn_vouchers = recordForEdit?.total_grn_vouchers ?? 0;
        total_grn_vouchers = parseInt(total_grn_vouchers ?? 0);
        if (orderStatusIdForUpdate == PurchaseOrderStatusTypesEnum.Cancel && total_grn_vouchers > 0) {
            showErrorMsg('Status can be marked "Cancel" if no GRN vouchers exist');
            return;
        }

        if (orderStatusIdForUpdate == PurchaseOrderStatusTypesEnum.Complete && total_grn_vouchers < 1) {
            showErrorMsg('Status can be marked "Complete" if at least one GRN voucher exists');
            return;
        }


        const formData = {
            purchase_order_id: stringIsNullOrWhiteSpace(orderIdStatusEditForm) ? 0 : orderIdStatusEditForm,
            status_id: orderStatusIdForUpdate,

        }


        updatePurchaseOrderStatusApi(formData)
            .then((res: any) => {
debugger
                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");
                    //--clear form
                    setTimeout(() => {
                        setIsOpenOrderStatusForm(false);
                        setSearchFormQueryParams('');
                        setListRefreshCounter(prevCounter => prevCounter + 1);
                    }, 500);

                } else {
                    showErrorMsg("An error occured. Please try again!");
                }


            })
            .catch((err: any) => {
                console.error(err, "err");
                showErrorMsg("An error occured. Please try again!");
            });

    }


    const handleGoToPage = (page: number) => {

        //--reset pageNo to param page value
        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: page // Update only the pageNo property
        }));
        setListRefreshCounter(prevCounter => prevCounter + 1);
    };



    useEffect(() => {
        getAllPurchaseOrdersListService();
    }, [listRefreshCounter]);

    const getAllPurchaseOrdersListService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }



        getAllPurchaseOrdersListApi(pageBasicInfoParams)
            .then((res: any) => {

                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));
                    setAllPurchaseOrdersList(res?.data);

                } else {
                    setAllPurchaseOrdersList([]);
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: 0
                    }));
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };


    return (
        <AdminLayout>
            <AdminPageHeader
                title='Purchase Orders List'
                pageDescription='Purchase Orders List'
                addNewClickType={'modal'}
                newLink={''}
                onAddNewClick={undefined}
                additionalInfo={{
                    showAddNewButton: false
                }
                }
            />

            <Content>
                <KTCard>

                    <CommonListSearchHeader
                        searchFields={HtmlSearchFields}
                        onSearch={handleSearchForm}
                        onSearchReset={handleSearchFormReset}
                    />
                    {/* <UsersTable /> */}
                    <KTCardBody className='py-4'>
                        <div className='table-responsive'>
                            <table
                                id='kt_table_users'
                                className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'

                            >
                                <thead>
                                    <tr className='text-start text-muted fw-bolder fs-7 gs-0 bg-light'>
                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>PO Number</th>
                                        {/* <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>PO Ref</th> */}
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Delivery Date</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Company Name</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Vendor</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>GRN Vochers Count</th>
                                        {/* <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Purchaser Name</th> */}
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Order Total</th>
                                        <th colSpan={1} role="columnheader" className="min-w-50px" style={{ cursor: 'pointer' }}>Status</th>

                                        <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        allPurchaseOrdersList != undefined && allPurchaseOrdersList.length > 0
                                            ?
                                            allPurchaseOrdersList?.map((record: any, index: number) => (
                                                <tr role='row' key={index}>
                                                    <td role="cell" className="ps-3">{record.po_number}</td>
                                                    {/* <td role="cell" className="ps-3">{record.po_reference}</td> */}




                                                    <td>
                                                        <div className="d-flex align-items-center">




                                                            <div className="ms-5">

                                                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">

                                                                    {getDateCommonFormatFromJsonDate(record.delivery_date)}
                                                                </a>

                                                            </div>
                                                        </div>
                                                    </td>




                                                    <td role="cell">
                                                        <div className=''>{record?.company_name}</div>
                                                    </td>

                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="ms-5">

                                                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.vendor_first_name}</a>

                                                            </div>
                                                        </div>
                                                    </td>


                                                    {/* 
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="ms-5">

                                                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.purchaser_name}</a>

                                                            </div>
                                                        </div>
                                                    </td> */}

                                                    <td role="cell">
                                                        <div className=''>{record?.total_grn_vouchers ?? 0}</div>
                                                    </td>

                                                    <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{record.order_total}</td>





                                                    <td style={{ cursor: 'pointer' }}>
                                                        <span
                                                            onClick={(e) => handlePurchaseOrderStatusEditForm(e, record.purchase_order_id)}
                                                            className={getPurchaseOrderStatusClass(record.status_id ?? PurchaseOrderStatusTypesEnum.Pending)}
                                                        >{record.status_name ?? 'Pending'}
                                                        </span>

                                                    </td>


                                                    <td className='text-end pe-3'>


                                                        <Link
                                                            to={`/site/create-order-clone/${record.purchase_order_id}`}
                                                            className='btn btn-bg-light btn-color-muted btn-active-color-primary btn-sm px-4 me-2'
                                                        >
                                                            <KTIcon iconName='copy' className='fs-3' />

                                                            Clone
                                                        </Link>

                                                        <Link
                                                            to={`/site/purchase-order-detail/${record.purchase_order_id}`}
                                                            className='btn btn-bg-light btn-color-muted btn-active-color-primary btn-sm px-4 me-2'
                                                        >
                                                            <KTIcon iconName='eye' className='fs-3' />

                                                            View
                                                        </Link>

                                                    </td>
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
                        <CommonListPagination
                            pageNo={pageBasicInfo.pageNo}
                            pageSize={pageBasicInfo.pageSize}
                            totalRecords={pageBasicInfo.totalRecords}
                            goToPage={handleGoToPage}
                        />
                        {isLoading && <TableListLoading />}



                        {
                            isOpenOrderStatusForm == true
                                ?

                                <OrderStatusCommonForm
                                    isOpen={isOpenOrderStatusForm}
                                    closeModal={handleOpenCloseOrderStatusFormModal}
                                    defaultValues={orderStatusEditForm}
                                    onSubmit={updatePurchaseOrderStatusService}

                                />
                                :
                                <>
                                </>
                        }



                    </KTCardBody>
                </KTCard>
            </Content>


        </AdminLayout>
    )
}
