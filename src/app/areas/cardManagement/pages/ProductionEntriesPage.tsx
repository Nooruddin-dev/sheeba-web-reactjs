import React, { useEffect, useState } from 'react'
import AdminLayout from '../../common/components/layout/AdminLayout'
import AdminPageHeader from '../../common/components/layout/AdminPageHeader'
import { Content } from '../../../../_sitecommon/layout/components/content'
import { KTCard, KTCardBody, KTIcon } from '../../../../_sitecommon/helpers'
import CommonListSearchHeader from '../../common/components/layout/CommonListSearchHeader'
import { buildUrlParamsForSearch } from '../../../../_sitecommon/common/helpers/global/GlobalHelper'
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig'
import { APP_BASIC_CONSTANTS } from '../../../../_sitecommon/common/constants/Config'
import CommonListPagination from '../../common/components/layout/CommonListPagination'
import TableListLoading from '../../common/components/shared/TableListLoading'
import { showErrorMsg, showSuccessMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper'
import { getAllJobProductionEntriesApi, getAllMachinesListApi, insertUpdateJobProductionEntryApi, insertUpdateProductApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls'
import { getDateCommonFormatFromJsonDate } from '../../../../_sitecommon/common/helpers/global/ConversionHelper'
import { Link } from 'react-router-dom'
import ProductionEntryAddUpdateForm from '../components/ProductionEntryAddUpdateForm'

export default function ProductionEntriesPage() {
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
    const [allJobProductionEntries, setAllJobProductionEntries] = useState<any>([]);
    const [allMachinesList, setAllMachinesList] = useState<any>([]);
    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'job_card_idSearch', inputName: 'job_card_idSearch', labelName: 'Job Card ID', placeHolder: 'Job Card ID', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'production_entry_idSearch', inputName: 'production_entry_idSearch', labelName: 'Prod Entry ID', placeHolder: 'Prod Entry ID', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'machine_nameSearch', inputName: 'machine_nameSearch', labelName: 'Machine Name', placeHolder: 'Machine Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },

    ];
    const [prodEntryEditForm, setProdEntryEditForm] = useState<any>(null);
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

    const handleProdEntryEditClick = (e: any, id: number) => {
        e.preventDefault();
        const recordForEdit = allJobProductionEntries?.find((x: { production_entry_id: number }) => x.production_entry_id == id);

    
      

        setProdEntryEditForm({
            production_entry_idEditForm: recordForEdit?.production_entry_id,

            job_card_id: recordForEdit?.job_card_id,
            job_card_no: recordForEdit?.job_card_no,
            company_name: recordForEdit?.company_name,
            product_name: recordForEdit?.product_name,
            weight_qty: recordForEdit?.weight_qty,

            job_card_product_id: recordForEdit?.job_card_product_id,
            machine_id: recordForEdit?.machine_id,
            waste_value: recordForEdit?.waste_value,
            weight_value: recordForEdit?.weight_value,

      

            net_value: recordForEdit?.net_value,

          

        });

        setIsOpenAddNewForm(!isOpenAddNewForm);
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

    const handleGoToPage = (page: number) => {

        //--reset pageNo to param page value
        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: page // Update only the pageNo property
        }));
        setListRefreshCounter(prevCounter => prevCounter + 1);
    };


    const handleOpenCloseAddModal = () => {
        setIsOpenAddNewForm(!isOpenAddNewForm);
        setProdEntryEditForm(null);
    }

    const handleProductionEntryFormSubmit = (data: any) => {


        console.log('data production entry: ', data); // Handle form submission here

        const {
            production_entry_idEditForm,
            job_card_id,
            machine_id,
            job_card_product_id,
            waste_value,
            net_value,
            gross_value,

            weight_value

        } = data;

        if (stringIsNullOrWhiteSpace(job_card_id) || job_card_id < 1) {
            showErrorMsg('Please select job card');
            return false;
        }

        if (stringIsNullOrWhiteSpace(machine_id) || machine_id < 1) {
            showErrorMsg('Please select machine');
            return false;
        }

        // if (stringIsNullOrWhiteSpace(job_card_product_id) || job_card_product_id < 1) {
        //     showErrorMsg('Please select material');
        //     return false;
        // }

        if (stringIsNullOrWhiteSpace(waste_value) || waste_value < 1) {
            showErrorMsg('Please select waste value');
            return false;
        }

        if (stringIsNullOrWhiteSpace(net_value) || net_value < 1) {
            showErrorMsg('Please select net value');
            return false;
        }

        const production_entry_id_local = stringIsNullOrWhiteSpace(production_entry_idEditForm) ? 0 : production_entry_idEditForm;

        const formData = {
            production_entry_id: production_entry_id_local,
            job_card_id: job_card_id,
            machine_id: machine_id,
            job_card_product_id: job_card_product_id,
            waste_value: waste_value,
            net_value: net_value,
            gross_value: gross_value,

            weight_value: weight_value

        };




        insertUpdateJobProductionEntryApi(formData)
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


    useEffect(() => {
        getAllJobProductionEntriesService();
    }, [listRefreshCounter]);

    const getAllJobProductionEntriesService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }


        getAllJobProductionEntriesApi(pageBasicInfoParams)
            .then((res: any) => {

                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));
                    setAllJobProductionEntries(res?.data);

                } else {
                    setAllJobProductionEntries([]);
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: 0
                    }));
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };


    useEffect(() => {
        getAllMachinesListService();
    }, []);

    const getAllMachinesListService = () => {

        const pageBasicInfoMachine: any = {
            pageNo: 1,
            pageSize: APP_BASIC_CONSTANTS.ITEMS_PER_PAGE,
            totalRecords: 0
        }

        let pageBasicInfoMachineParams = new URLSearchParams(pageBasicInfoMachine).toString();

        getAllMachinesListApi(pageBasicInfoMachineParams)
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




    return (
        <AdminLayout>
            <AdminPageHeader
                title='Production Entries'
                pageDescription='Production Entries'
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
                                        <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Job Card No</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Prod Entry ID</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Machine</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Material </th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Waste</th>

                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Net</th>

                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Gross</th>


                                        <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        allJobProductionEntries != undefined && allJobProductionEntries.length > 0
                                            ?
                                            allJobProductionEntries?.map((record: any, index: number) => (
                                                <tr role='row' key={index}>
                                                    <td role="cell" className="ps-3">{record.job_card_no}</td>

                                                    <td role="cell">
                                                        <div className=''>{record?.production_entry_id}</div>
                                                    </td>

                                                    <td role="cell">
                                                        <div className=''>{record?.machine_name}</div>
                                                    </td>

                                                    <td role="cell">
                                                        <div className=''>{record?.product_name}</div>
                                                    </td>

                                                    <td role="cell" >{record.waste_value}</td>

                                                    <td role="cell">
                                                        <div className=''>{record?.net_value}</div>
                                                    </td>
                                                    <td role="cell">
                                                        <div className=''>{record?.gross_value}</div>
                                                    </td>




                                                    <td className='text-end pe-3'>


                                                        <Link
                                                            to='#'
                                                            onClick={(e) => handleProdEntryEditClick(e, record.production_entry_id)}
                                                            className='btn btn-bg-light btn-color-muted btn-active-color-primary btn-sm px-4 me-2'
                                                        >
                                                            <KTIcon iconName='pencil' className='fs-3' />

                                                            Edit
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
                            isOpenAddNewForm == true
                                ?

                                <ProductionEntryAddUpdateForm
                                    isOpen={isOpenAddNewForm}
                                    closeModal={handleOpenCloseAddModal}
                                    defaultValues={prodEntryEditForm}
                                    onSubmit={handleProductionEntryFormSubmit}
                                    allMachinesList={allMachinesList}
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
