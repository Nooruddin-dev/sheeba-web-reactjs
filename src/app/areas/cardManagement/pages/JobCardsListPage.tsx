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
import { stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper'
import { getAllJobCardsListApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls'
import { getDateCommonFormatFromJsonDate } from '../../../../_sitecommon/common/helpers/global/ConversionHelper'
import { Link } from 'react-router-dom'

export default function JobCardsListPage() {
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
    const [allJobCardsList, setAllJobCardsList] = useState<any>([]);
    const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

    const HtmlSearchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'job_card_idSearch', inputName: 'job_card_idSearch', labelName: 'Job Card ID', placeHolder: 'Job Card ID', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'company_nameSearch', inputName: 'company_nameSearch', labelName: 'Company Name', placeHolder: 'Company Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'sealing_methodSearch', inputName: 'sealing_methodSearch', labelName: 'Sealing Method', placeHolder: 'Sealing Method', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },

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

    const handleGoToPage = (page: number) => {

        //--reset pageNo to param page value
        setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            pageNo: page // Update only the pageNo property
        }));
        setListRefreshCounter(prevCounter => prevCounter + 1);
    };



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





                    </KTCardBody>
                </KTCard>
            </Content>
        </AdminLayout>
    )
}
