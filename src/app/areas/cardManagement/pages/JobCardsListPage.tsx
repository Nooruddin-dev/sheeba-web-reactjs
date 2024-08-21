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
import { getAllJobCardsListApi, insertCardDispatchInfoApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls'
import { getDateCommonFormatFromJsonDate } from '../../../../_sitecommon/common/helpers/global/ConversionHelper'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faList } from '@fortawesome/free-solid-svg-icons'
import JobCardDispatchAddForm from '../components/JobCardDispatchAddForm'
import { slideDown } from '../../../../_sitecommon/assets/ts/_utils'
import JobCardDispatchInvoice from '../components/JobCardDispatchInvoice'

export default function JobCardsListPage() {
    const isLoading = false;


    // ✅-- Starts: necessary varaibles for the page
    const [isOpenDispatchInvoiceModal, setIsOpenDispatchInvoiceModal] = useState<boolean>(false);
    const [isOpenDispatchAddForm, setIsOpenDispatchAddForm] = useState<boolean>(false);
    const [listRefreshCounter, setListRefreshCounter] = useState<number>(0);
    const [latestCardDispatchInfoId, setLatestCardDispatchInfoId] = useState<number>(0);
    const [pageBasicInfo, setPageBasicInfo] = useState<any>(
        {
            pageNo: 1,
            pageSize: APP_BASIC_CONSTANTS.ITEMS_PER_PAGE,
            totalRecords: 0
        }
    );

    const [searchFormQueryParams, setSearchFormQueryParams] = useState<string>('');
    const [allJobCardsList, setAllJobCardsList] = useState<any>([]);
    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'job_card_idSearch', inputName: 'job_card_idSearch', labelName: 'Job Card ID', placeHolder: 'Job Card ID', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'company_nameSearch', inputName: 'company_nameSearch', labelName: 'Company Name', placeHolder: 'Company Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'sealing_methodSearch', inputName: 'sealing_methodSearch', labelName: 'Sealing Method', placeHolder: 'Sealing Method', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },

    ];
    const [jobCardDispatchEditForm, setJobCardDispatchEditForm] = useState<any>(null); // Data of the dipatch being edited
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

    const handleGoToPage = (page: number) => {

        //--reset pageNo to param page value
        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: page // Update only the pageNo property
        }));
        setListRefreshCounter(prevCounter => prevCounter + 1);
    };

    const handleOpenCloseAddDispatchModal = () => {
        setIsOpenDispatchAddForm(!isOpenDispatchAddForm);

    }

    const handleDispatchAddEntryFormSubmit = (data: any) => {

        const {
            job_card_id,
            item_name,
            total_bags,
            quantity,
            core_value,
            gross_value,
            net_weight,
            grand_total,
            card_tax_type,
            card_tax_value,
            show_company_detail

        } = data;




        if (stringIsNullOrWhiteSpace(item_name) || stringIsNullOrWhiteSpace(total_bags) || stringIsNullOrWhiteSpace(quantity)
            || stringIsNullOrWhiteSpace(core_value) || stringIsNullOrWhiteSpace(gross_value) || stringIsNullOrWhiteSpace(net_weight)) {
            showErrorMsg('Please fill all required fields!');
            return false;
        }


        const formData = {
            job_card_id: job_card_id,
            item_name: item_name,
            total_bags: total_bags,
            quantity: quantity,
            core_value: core_value,
            gross_value: gross_value,
            net_weight: net_weight,
            grand_total: grand_total,
            card_tax_type: card_tax_type,
            card_tax_value: card_tax_value,
            show_company_detail: show_company_detail ?? true

        };




        insertCardDispatchInfoApi(formData)
            .then((res: any) => {

                if (res?.data?.response?.success == true && (res?.data?.response?.responseMessage == "Saved Successfully!" || res?.data?.response?.responseMessage == 'Updated Successfully!')) {
                    showSuccessMsg("Saved Successfully!");

                    setIsOpenDispatchAddForm(false);

                    //--handle invoice below
                    setLatestCardDispatchInfoId(res?.data?.response?.primaryKeyValue);
                    setIsOpenDispatchInvoiceModal(true);


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
    const handleJobCardDispatch = (record: any) => {

        const dispatchInfoValues = {
            job_card_id: record.job_card_id,
            item_name: record.product_name,
        }
        setJobCardDispatchEditForm(dispatchInfoValues);

        setIsOpenDispatchAddForm(true);
    }


    const handleOpenCloseDispatchInvoiceModal = () => {
        setIsOpenDispatchInvoiceModal(!isOpenDispatchInvoiceModal);
    }



    useEffect(() => {
        getAllJobCardsListService();
    }, [listRefreshCounter]);

    const getAllJobCardsListService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
            pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
        }


        getAllJobCardsListApi(pageBasicInfoParams)
            .then((res: any) => {

                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));
                    setAllJobCardsList(res?.data);

                } else {
                    setAllJobCardsList([]);
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
                title='Job Cards List'
                pageDescription='Job Cards List'
                addNewClickType={'link'}
                newLink={'/job-management/create-card'}
                onAddNewClick={undefined}
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
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Company Name</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Product Name </th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Weight/Qty</th>

                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Status</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Dispatch Info</th>

                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Created At</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Updated At</th>


                                        <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        allJobCardsList != undefined && allJobCardsList.length > 0
                                            ?
                                            allJobCardsList?.map((record: any, index: number) => (
                                                <tr role='row' key={index}>
                                                    <td role="cell" className="ps-3">{record.job_card_no}</td>

                                                    <td role="cell">
                                                        <div className=''>{record?.company_name}</div>
                                                    </td>

                                                    <td role="cell">
                                                        <div className=''>{record?.product_name}</div>
                                                    </td>

                                                    <td role="cell" >{record.weight_qty}</td>

                                                    <td role="cell">
                                                        <div className=''>{record?.job_status}</div>
                                                    </td>
                                                    <td role="cell" >
                                                        <div className='d-flex jobcard-td'>
                                                            <Link to='' onClick={() => handleJobCardDispatch(record)}>            <FontAwesomeIcon icon={faAdd} className='me-1' /> Add</Link>
                                                            <Link to={`/job-management/dispatch-info/${record.job_card_id}`}>            <FontAwesomeIcon icon={faList} className='me-1' />List</Link>

                                                        </div>
                                                    </td>


                                                    <td role="cell" >   {getDateCommonFormatFromJsonDate(record.created_on)} </td>
                                                    <td role="cell" >   {getDateCommonFormatFromJsonDate(record.updated_on)} </td>








                                                    <td className='text-end pe-3'>


                                                        <Link
                                                            to={`/job-management/edit-card/${record.job_card_id}`}
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
                            isOpenDispatchAddForm == true
                                ?

                                <JobCardDispatchAddForm
                                    isOpen={isOpenDispatchAddForm}
                                    closeModal={handleOpenCloseAddDispatchModal}
                                    defaultValues={jobCardDispatchEditForm}
                                    onSubmit={handleDispatchAddEntryFormSubmit}

                                />
                                :
                                <>
                                </>
                        }

                        {
                            isOpenDispatchInvoiceModal == true
                                ?

                                <JobCardDispatchInvoice
                                    isOpen={isOpenDispatchInvoiceModal}
                                    closeModal={handleOpenCloseDispatchInvoiceModal}
                                    cardDispatchInfoId={latestCardDispatchInfoId}
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
