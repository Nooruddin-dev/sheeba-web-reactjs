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
import { getAllMachinesListApi, getAllUsersApi, getMachineTypesListApi, inserUpdateBusinessPartnerApi, insertUpdateMachineApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import MachineAddUpdateForm from '../components/MachineAddUpdateForm';



export default function MachinesListPage() {
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
    const [allMachinesList, setAllMachinesList] = useState<any>([]);
    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'machine_idSearch', inputName: 'machine_idSearch', labelName: 'Machine ID', placeHolder: 'Machine ID', type: 'number', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'machine_nameSearch', inputName: 'machine_nameSearch', labelName: 'Name', placeHolder: 'Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
       
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
        const recordForEdit = allMachinesList?.find((x: { machine_id: number }) => x.machine_id == id);

        
        setUserEditForm({
            machine_idEditForm: recordForEdit?.machine_id,
            machine_type_id: recordForEdit?.machine_type_id,
            machine_name: recordForEdit?.machine_name,
            is_active: recordForEdit?.is_active == true ? '1' : '0',
            
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
        const { machine_idEditForm, machine_type_id, machine_name, is_active } = data;
        if (stringIsNullOrWhiteSpace(machine_type_id) || stringIsNullOrWhiteSpace(machine_name)) {
            showErrorMsg('Please fill all required fields');
            return false;
        }

        if (stringIsNullOrWhiteSpace(machine_type_id) || machine_type_id < 1) {
            showErrorMsg('Machine type is required!');
            return false;
        }

        if (stringIsNullOrWhiteSpace(is_active)) {
            showErrorMsg('Status field is required!');
            return false;
        }
       

        const machine_id_local = stringIsNullOrWhiteSpace(machine_idEditForm) ? 0 : machine_idEditForm;
        let selectedMachineRow: any = {}
        let machine_type_id_local = 0;


        //--in case of edit form, not allow email address to edit
        if (machine_id_local && machine_id_local > 0) {
            selectedMachineRow = allMachinesList?.find((x: { machine_id: any; }) => x.machine_id == machine_id_local);
            machine_type_id_local = selectedMachineRow?.machine_type_id;
        } else{
            machine_type_id_local = machine_type_id;
        }

        const formData = {
            machine_id: machine_id_local,
            machine_type_id: machine_type_id_local ?? 0,
            machine_name: machine_name ?? '',
            is_active: is_active?.toString() == "1" ? 'true' : 'false',

        };




        insertUpdateMachineApi(formData)
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
        getAllMachinesListService();
    }, [listRefreshCounter]);

    const getAllMachinesListService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }

        

        getAllMachinesListApi(pageBasicInfoParams)
            .then((res: any) => {

                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));
                    setAllMachinesList(res?.data);

                } else {
                    setAllMachinesList([]);
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: 0
                    }));
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };


    useEffect(() => {
        getMachineTypesListService();
    }, []);

    const getMachineTypesListService = () => {

        const pageBasicInfoMachineTypes: any = {
            pageNo: 1,
            pageSize: 50
        }
        let pageBasicInfoVendorRequestParams = new URLSearchParams(pageBasicInfoMachineTypes).toString();
      

        getMachineTypesListApi(pageBasicInfoVendorRequestParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    setAllMachineTypes(res?.data);
                }else{
                    setAllMachineTypes([]);
                }

            })
            .catch((err: any) => console.log(err, "err"));
    };





    return (
        <AdminLayout>
            <AdminPageHeader
                title='Machines List'
                pageDescription='Machines List'
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
                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Machine ID</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Machine Name</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Machine Type</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Status</th>

                                        <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        allMachinesList != undefined && allMachinesList.length > 0
                                            ?
                                            allMachinesList?.map((record: any, index: number) => (
                                                <tr role='row' key={index}>
                                                    <td role="cell" className="ps-3">{record.machine_id}</td>




                                                    <td>
                                                        <div className="d-flex align-items-center">

                                                          


                                                            <div className="ms-5">

                                                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.machine_name}</a>

                                                            </div>
                                                        </div>
                                                    </td>




                                                    <td role="cell">
                                                        <div className=''>{record?.machine_type_name}</div>
                                                    </td>

                                                    {
                                                        record.is_active == true
                                                            ?
                                                            <td role="cell" className=""> <div className="badge badge-light-success fw-bolder">Active</div></td>

                                                            :
                                                            <td role="cell" className=""> <div className="badge badge-light-danger fw-bolder">Inactive</div></td>
                                                    }
                                               
                                                    <td role="cell" className='text-end min-w-100px pe-3'>
                                                        <CommonTableActionCell
                                                            onEditClick={handleUserEditClick}
                                                            onDeleteClick={handleOnDeleteClick}
                                                            editId={record.machine_id}
                                                            showEditButton={true}
                                                            deleteData={{
                                                                showDeleteButton: true,
                                                                entityRowId: record.machine_id,
                                                                entityName: dBEntitiesConst.Machines.tableName,
                                                                entityColumnName: dBEntitiesConst.Machines.primaryKeyColumnName,
                                                                sqlDeleteTypeId: sqlDeleteTypesConst.foreignKeyDelete,
                                                                deleteModalTitle: 'Delete Machine'
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

                                <MachineAddUpdateForm
                                    isOpen={isOpenAddNewForm}
                                    closeModal={handleOpenCloseAddModal}
                                    defaultValues={userEditForm}
                                    onSubmit={handleUserFormSubmit}
                                    allMachineTypes = {allMachineTypes}
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
