/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { APP_BASIC_CONSTANTS } from '../../../../_sitecommon/common/constants/Config';
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig';
import { buildUrlParamsForSearch } from '../../../../_sitecommon/common/helpers/global/GlobalHelper';
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody, toAbsoluteUrlCustom } from '../../../../_sitecommon/helpers';
import CommonListSearchHeader from '../../common/components/layout/CommonListSearchHeader';
import { CommonTableActionCell } from '../../common/components/layout/CommonTableActionCell';
import dBEntitiesConst from '../../../../_sitecommon/common/constants/dBEntitiesConst';
import { sqlDeleteTypesConst } from '../../../../_sitecommon/common/enums/GlobalEnums';
import CommonListPagination from '../../common/components/layout/CommonListPagination';
import TableListLoading from '../../common/components/shared/TableListLoading';
import BusinessPartnerTypesEnum from '../../../../_sitecommon/common/enums/BusinessPartnerTypesEnum';
import { getAllProductsListApi, insertUpdateProductApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import ProductAddUpdateForm from '../components/ProductAddUpdateForm';
import { getDateCommonFormatFromJsonDate, makeAnyStringShortAppenDots } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';


export default function ProductsListPage() {
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
    const [allProductsList, setAllProductsList] = useState<any>([]);
    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'productIdSearch', inputName: 'productIdSearch', labelName: 'Product ID', placeHolder: 'Product ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'skuSearch', inputName: 'skuSearch', labelName: 'SKU', placeHolder: 'SKU', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'productNameSearch', inputName: 'productNameSearch', labelName: 'Product Name', placeHolder: 'Product Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },

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

    const handleUserEditClick = (e: Event, id: number) => {
        e.preventDefault();
        const recordForEdit = allProductsList?.find((x: { productId: number }) => x.productId == id);



        setUserEditForm({
            productIdEditForm: recordForEdit?.productId,
            productName: recordForEdit?.productName,
            shortDescription: recordForEdit?.shortDescription,
            sku: recordForEdit?.sku,

            stockQuantity: recordForEdit?.stockQuantity,
            isActive: (recordForEdit?.isActive == true || recordForEdit?.isActive == 1) ? '1' : '0',

            price: recordForEdit?.price,
            oldPrice: recordForEdit?.oldPrice,

        });

        setIsOpenAddNewForm(!isOpenAddNewForm);
    }

    const handleOnDeleteClick = (rowId: number) => {
        setListRefreshCounter(prevCounter => prevCounter + 1);
    }


    const handleOpenCloseAddModal = () => {
        setIsOpenAddNewForm(!isOpenAddNewForm);
        setUserEditForm(null);
    }

    const handleUserFormSubmit = (data: any) => {


        console.log('data product: ', data); // Handle form submission here
        const { productIdEditForm, productName, shortDescription, sku, stockQuantity, isActive, price } = data;
        if (stringIsNullOrWhiteSpace(productName) || stringIsNullOrWhiteSpace(sku)) {
            showErrorMsg('Please fill all required fields');
            return false;
        }

        if (stringIsNullOrWhiteSpace(isActive)) {
            showErrorMsg('Status is required!');
            return false;
        }


        const productIdLocal = stringIsNullOrWhiteSpace(productIdEditForm) ? 0 : productIdEditForm;

        let productFormData: any = {}

        //--in case of edit form, not allow email address to edit
        if (productIdLocal && productIdLocal > 0) {
            let currentEditProduct = allProductsList?.find((x: { productId: any; }) => x.productId == productIdLocal);

            productFormData.productId = productIdLocal;
            productFormData.productName = productName ?? '';
            productFormData.shortDescription = currentEditProduct.productName;
            productFormData.sku = currentEditProduct.sku;
            productFormData.stockQuantity = currentEditProduct.stockQuantity;
            productFormData.isActive = currentEditProduct.isActive;
            productFormData.price = currentEditProduct.price;
        } else {
            if (stringIsNullOrWhiteSpace(stockQuantity) || stockQuantity < 0) {
                showErrorMsg('Please define stock quantity');
                return false;
            }

            if (stringIsNullOrWhiteSpace(price) || price < 1) {
                showErrorMsg('Cost is required!');
                return false;
            }

            productFormData.productId = productIdLocal;
            productFormData.productName = productName ?? '';
            productFormData.shortDescription = shortDescription ?? '';
            productFormData.sku = sku ?? '';
            productFormData.stockQuantity = stockQuantity ?? 0;
            productFormData.isActive = isActive?.toString() == "1" ? 'true' : 'false';
            productFormData.price = price ?? 0;


        }
        const formData = {
            productId: productFormData.productId,
            productName: productFormData.productName,
            shortDescription: productFormData.shortDescription,
            sku: productFormData.sku,
            stockQuantity: productFormData.stockQuantity,
            isActive: productFormData.isActive,
            price: productFormData.price
        };




        insertUpdateProductApi(formData)
            .then((res: any) => {

                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");
                    //--clear form
                    setTimeout(() => {
                        setIsOpenAddNewForm(false);
                        setSearchFormQueryParams('');
                        setListRefreshCounter(prevCounter => prevCounter + 1);
                    }, 500);

                } else if (res?.data?.response?.success == false && !stringIsNullOrWhiteSpace(res?.data?.response?.responseMessage)) {
                    showErrorMsg(res?.data?.response?.responseMessage);
                }
                else {
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
        getAllProductsListService();
    }, [listRefreshCounter]);

    const getAllProductsListService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }

        pageBasicInfoParams = `${pageBasicInfoParams}&busnPartnerTypeId=${BusinessPartnerTypesEnum.SalesRepresentative}`;


        getAllProductsListApi(pageBasicInfoParams)
            .then((res: any) => {

                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));
                    setAllProductsList(res?.data);

                } else {
                    setAllProductsList([]);
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
                title='Products List'
                pageDescription='Products List'
                addNewClickType={'modal'}
                newLink={''}
                onAddNewClick={handleOpenCloseAddModal}
                additionalInfo={{
                    showAddNewButton: true
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
                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Product Id</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Product Name</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Description</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Cost</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>SKU</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Stock Quantity</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Created On</th>

                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Status</th>
                                        <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        allProductsList != undefined && allProductsList.length > 0
                                            ?
                                            allProductsList?.map((record: any, index: number) => (
                                                <tr role='row' key={index}>
                                                    <td role="cell" className="ps-3">{record.productId}</td>




                                                    <td>
                                                        <div className="d-flex align-items-center">

                                                            {/* <a href="/metronic8/demo1/apps/ecommerce/catalog/edit-product.html" className="symbol symbol-50px">
                                                                <span className="symbol-label"
                                                                    style={{ backgroundImage: `url(${toAbsoluteUrlCustom(record.profilePicturePath)})` }}
                                                                ></span>
                                                            </a> */}


                                                            <div className="ms-5">

                                                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{makeAnyStringShortAppenDots(record.productName, 110)}</a>

                                                            </div>
                                                        </div>
                                                    </td>




                                                    <td role="cell">
                                                        <div className=''>{makeAnyStringShortAppenDots(record.shortDescription, 110)}</div>
                                                    </td>

                                                    <td role="cell">
                                                        <div className='badge badge-light fw-bolder'>{record?.price}</div>
                                                    </td>
                                                    <td role="cell">
                                                        <div className=' fw-bolder'> {record?.sku}</div>
                                                    </td>

                                                    <td role="cell">
                                                        <div className=' fw-bolder'> {record?.stockQuantity}</div>
                                                    </td>

                                                    <td role="cell">
                                                        <div className=' fw-bolder'>  {getDateCommonFormatFromJsonDate(record.createdOn)}</div>
                                                    </td>


                                                    {
                                                        record.isActive == true
                                                            ?
                                                            <td role="cell" className=""> <div className="badge badge-light-success fw-bolder">Active</div></td>

                                                            :
                                                            <td role="cell" className=""> <div className="badge badge-light-danger fw-bolder">Inactive</div></td>
                                                    }

                                                    <td role="cell" className='text-end min-w-100px pe-3'>
                                                        <CommonTableActionCell
                                                            onEditClick={handleUserEditClick}
                                                            onDeleteClick={handleOnDeleteClick}
                                                            editId={record.productId}
                                                            showEditButton={true}
                                                            deleteData={{
                                                                showDeleteButton: true,
                                                                entityRowId: record.productId,
                                                                entityName: dBEntitiesConst.Products.tableName,
                                                                entityColumnName: dBEntitiesConst.Products.primaryKeyColumnName,
                                                                sqlDeleteTypeId: sqlDeleteTypesConst.foreignKeyDelete,
                                                                deleteModalTitle: 'Delete Product'
                                                            }} />
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
                            isOpenAddNewForm == true
                                ?

                                <ProductAddUpdateForm
                                    isOpen={isOpenAddNewForm}
                                    closeModal={handleOpenCloseAddModal}
                                    defaultValues={userEditForm}
                                    onSubmit={handleUserFormSubmit}
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
