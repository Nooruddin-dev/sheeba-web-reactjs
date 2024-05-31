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
import { getAllUsersApi, inserUpdateBusinessPartnerApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import CustomerAddUpdateForm from '../components/CustomerAddUpdateForm';



export default function CustomersListPage() {
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
    const [allUsersList, setAllUsersList] = useState<any>([]);
    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'busnPartnerIdSearch', inputName: 'busnPartnerIdSearch', labelName: 'Customer ID', placeHolder: 'Customer ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'firstNameSearch', inputName: 'firstNameSearch', labelName: 'Name', placeHolder: 'Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'emailAddressSearch', inputName: 'emailAddressSearch', labelName: 'Email', placeHolder: 'Email', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },

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
        const recordForEdit = allUsersList?.find((x: { busnPartnerId: number }) => x.busnPartnerId == id);

        setUserEditForm({
            busnPartnerIdEditForm: recordForEdit?.busnPartnerId,
            firstName: recordForEdit?.firstName,
            lastName: recordForEdit?.lastName,
            emailAddress: recordForEdit?.emailAddress,
            busnPartnerTypeId: recordForEdit?.busnPartnerTypeId,
            isActive: recordForEdit?.isActive == true ? '1' : '0',
            isVerified: recordForEdit?.isVerified == true ? '1' : '0',
            countryId: recordForEdit?.countryId,
            addressOne: recordForEdit?.busnPartnerAddressAssociationBusnPartners[0]?.addressOne,
            phoneNo: recordForEdit?.busnPartnerPhoneAssociation[0]?.phoneNo,
            profilePictureId: recordForEdit?.profilePictureId,

            password: recordForEdit?.testWordHooP,
            confirmPassword: recordForEdit?.testWordHooP,
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
        console.log('data user: ', data); // Handle form submission here
        const { busnPartnerIdEditForm, firstName, lastName, emailAddress, isActive, phoneNo } = data;
        if (stringIsNullOrWhiteSpace(firstName) || stringIsNullOrWhiteSpace(lastName) || stringIsNullOrWhiteSpace(emailAddress)
            || stringIsNullOrWhiteSpace(isActive)) {
            showErrorMsg('Please fill all required fields');
            return false;
        }

        if (stringIsNullOrWhiteSpace(phoneNo)) {
            showErrorMsg('Mobile/phone field is required!');
            return false;
        }

     

        const idBusinessPartner = stringIsNullOrWhiteSpace(busnPartnerIdEditForm) ? 0 : busnPartnerIdEditForm;
        let emailAddressLocal = ""

        //--in case of edit form, not allow email address to edit
        if (idBusinessPartner && idBusinessPartner > 0) {
            emailAddressLocal = allUsersList?.find((x: { busnPartnerId: any; }) => x.busnPartnerId == idBusinessPartner)?.emailAddress;
        } else {
            emailAddressLocal = emailAddress;
        }
        const formData = {
            busnPartnerId: idBusinessPartner,
            firstName: firstName ?? '',
            lastName: lastName ?? '',
            emailAddress: emailAddress ?? '',
            busnPartnerTypeId: BusinessPartnerTypesEnum.Customer,
            isActive: isActive?.toString() == "1" ? 'true' : 'false',
            isVerified: true,
            countryId: 1,
            addressOne: '',
            phoneNo: phoneNo ?? '',
            password: '123456' ?? '',
            profilePictureId: null
        };



        // const formData = new FormData();
        // formData.append('busnPartnerId', stringIsNullOrWhiteSpace(busnPartnerIdEditForm) ? 0 : busnPartnerIdEditForm);
        // formData.append('firstName', firstName ?? '');
        // formData.append('lastName', lastName ?? '');
        // formData.append('emailAddress', emailAddress ?? '');
        // formData.append('busnPartnerTypeId', BusinessPartnerTypesEnum.NormalUser);
        // formData.append('IsActive', isActive?.toString() == "1" ? 'true' : 'false');
        // formData.append('phoneNo', phoneNo ?? '');
        // formData.append('password', password ?? '');


        inserUpdateBusinessPartnerApi(formData)
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
        getAllUsersService();
    }, [listRefreshCounter]);

    const getAllUsersService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }

        pageBasicInfoParams = `${pageBasicInfoParams}&busnPartnerTypeId=${BusinessPartnerTypesEnum.Customer}`;


        getAllUsersApi(pageBasicInfoParams)
            .then((res: any) => {

                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));
                    setAllUsersList(res?.data);

                } else {
                    setAllUsersList([]);
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
                title='Customers List'
                pageDescription='Customers List'
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
                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Customer Id</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Full Name</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Phone Number</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Email Address</th>
                                        {/* <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>User Type</th> */}
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Status</th>
                                        <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        allUsersList != undefined && allUsersList.length > 0
                                            ?
                                            allUsersList?.map((record: any) => (
                                                <tr role='row'>
                                                    <td role="cell" className="ps-3">{record.busnPartnerId}</td>




                                                    <td>
                                                        <div className="d-flex align-items-center">

                                                            {/* <a href="/metronic8/demo1/apps/ecommerce/catalog/edit-product.html" className="symbol symbol-50px">
                                                                <span className="symbol-label"
                                                                    style={{ backgroundImage: `url(${toAbsoluteUrlCustom(record.profilePicturePath)})` }}
                                                                ></span>
                                                            </a> */}


                                                            <div className="ms-5">

                                                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.firstName} {record.lastName}</a>

                                                            </div>
                                                        </div>
                                                    </td>




                                                    <td role="cell">
                                                        <div className=''>{record?.busnPartnerPhoneAssociation[0]?.phoneNo}</div>
                                                    </td>

                                                    <td role="cell">
                                                        <div className='badge badge-light fw-bolder'>{record?.emailAddress}</div>
                                                    </td>
                                                    {/* <td role="cell">
                                                        <div className=' fw-bolder'>{record?.busnPartnerTypeName}</div>
                                                    </td> */}
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
                                                            editId={record.busnPartnerId}
                                                            showEditButton={true}
                                                            deleteData={{
                                                                showDeleteButton: true,
                                                                entityRowId: record.busnPartnerId,
                                                                entityName: dBEntitiesConst.BusnPartner.tableName,
                                                                entityColumnName: dBEntitiesConst.BusnPartner.primaryKeyColumnName,
                                                                sqlDeleteTypeId: sqlDeleteTypesConst.foreignKeyDelete,
                                                                deleteModalTitle: 'Delete User'
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

                                <CustomerAddUpdateForm
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
