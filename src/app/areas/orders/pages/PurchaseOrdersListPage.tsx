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
import { sqlDeleteTypesConst } from '../../../../_sitecommon/common/enums/GlobalEnums';
import CommonListPagination from '../../common/components/layout/CommonListPagination';
import TableListLoading from '../../common/components/shared/TableListLoading';
import BusinessPartnerTypesEnum from '../../../../_sitecommon/common/enums/BusinessPartnerTypesEnum';
import { getAllMachinesListApi, getAllPurchaseOrdersListApi, getAllUsersApi, getMachineTypesListApi, inserUpdateBusinessPartnerApi, insertUpdateMachineApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { Link } from 'react-router-dom';
import { getDateCommonFormatFromJsonDate } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';




export default function PurchaseOrdersListPage() {
    const isLoading = false;
    const [allMachineTypes, setAllMachineTypes] = useState<any>([]);

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



    const handleOnDeleteClick = (rowId: number) => {
        setListRefreshCounter(prevCounter => prevCounter + 1);
    }


    const handleOpenCloseAddModal = () => {
        setIsOpenAddNewForm(!isOpenAddNewForm);
        setUserEditForm(null);
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
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>PO Ref</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Delivery Date</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Company Name</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Vendor</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Sale Representative</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Purchaser Name</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Order Total</th>

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
                                                    <td role="cell" className="ps-3">{record.po_reference}</td>




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

                                                    <td role="cell">
                                                        <div className=''>{record?.sale_representative_first_name}</div>
                                                    </td>

                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="ms-5">

                                                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.purchaser_name}</a>

                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{record.order_total}</td>




                                                    <td className='text-end pe-3'>
                                                       

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


                      



                    </KTCardBody>
                </KTCard>
            </Content>

            
        </AdminLayout>
    )
}
