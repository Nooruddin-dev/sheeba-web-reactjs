/* eslint-disable */

import React, { useEffect, useState, useRef } from 'react'
import { APP_BASIC_CONSTANTS } from '../../../../_sitecommon/common/constants/Config';
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig';
import { buildUrlParamsForSearch, getCurrentDate } from '../../../../_sitecommon/common/helpers/global/GlobalHelper';
import { showErrorMsg, showSuccessMsg, showWarningMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
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
import { getAllMachinesListApi, getAllUsersApi, getJobDispatchReportDataApi, getMachineTypesListApi, inserUpdateBusinessPartnerApi, insertUpdateMachineApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPrint } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';
import { useReactToPrint } from 'react-to-print';
import { getDateCommonFormatFromJsonDate } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import JobCardDispatchInvoice from '../components/JobCardDispatchInvoice';



export default function CardDispatchInfoPage() {
    const isLoading = false;
    const [isOpenDispatchInvoiceModal, setIsOpenDispatchInvoiceModal] = useState<boolean>(false);
    const [latestCardDispatchInfoId, setLatestCardDispatchInfoId] = useState<number>(0);

    const params = useParams();
    const job_card_id = params.job_card_id;
    const componentRefForReceipt = useRef(null);


    // ✅-- Starts: necessary varaibles for the page
    const [listRefreshCounter, setListRefreshCounter] = useState<number>(0);
    const [pageBasicInfo, setPageBasicInfo] = useState<any>(
        {
            pageNo: 1,
            pageSize: 2000,
            totalRecords: 0
        }
    );


    const [allJobDispatchReportData, setAllJobDispatchReportData] = useState<any>([]);

    const datePlusOneDay = new Date()
    datePlusOneDay.setDate(new Date().getDate() + 1);
    const dateMinusThreeMonths = new Date();
    dateMinusThreeMonths.setMonth(new Date().getMonth() - 3);

    const [fromDate, setFromDate] = useState<string>(dateMinusThreeMonths.toISOString().split('T')[0]);
    const [toDate, setToDate] = useState<string>(datePlusOneDay.toISOString().split('T')[0]);

    // ✅-- Ends: necessary varaibles for the page


    const handleSearchForm = () => {

        if (stringIsNullOrWhiteSpace(fromDate) == true || stringIsNullOrWhiteSpace(toDate) == true) {
            showErrorMsg("Please select from date and to date.");
            return;
        }

        setTimeout(() => {
            setListRefreshCounter(prevCounter => prevCounter + 1);
        }, 300);

    }

    const handleSearchFormReset = () => {

        setFromDate('');
        setToDate('');

        setAllJobDispatchReportData(null);

        // setTimeout(() => {
        //     setListRefreshCounter(prevCounter => prevCounter + 1);
        // }, 300);


    }

    const handleOpenCloseDispatchInvoiceModal = () => {
        setIsOpenDispatchInvoiceModal(!isOpenDispatchInvoiceModal);
    }
    const handleDispatchInvoiceOpen = (card_dispatch_info_id: number) => {
        setLatestCardDispatchInfoId(card_dispatch_info_id);
        setIsOpenDispatchInvoiceModal(true);
    }



    const generatePDF = () => {

        const input: any = document.getElementById('card_dispatch_info');

        html2canvas(input).then((canvas) => {

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('download.pdf');
        });
    };

    const generatePrint = useReactToPrint({
        content: () => componentRefForReceipt.current,
        documentTitle: 'Card Dispatch Report',

    });




    useEffect(() => {
        if (stringIsNullOrWhiteSpace(fromDate) == false && stringIsNullOrWhiteSpace(toDate) == false) {
            getJobDispatchReportDataService();
        }



    }, [listRefreshCounter]);

    const getJobDispatchReportDataService = () => {


        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        pageBasicInfoParams = `${pageBasicInfoParams}&fromDate=${fromDate}&toDate=${toDate}&job_card_id=${job_card_id}`;


        getJobDispatchReportDataApi(pageBasicInfoParams)
            .then((res: any) => {

                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));
                    console.log('data is: ', res.data);

                    setAllJobDispatchReportData(res?.data);

                } else {
                    setAllJobDispatchReportData([]);
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
            {/* <AdminPageHeader
                title='Dispatch Info'
                pageDescription='Dispatch Info'
                addNewClickType={'modal'}
                newLink={''}
                onAddNewClick={undefined}
                additionalInfo={{
                    showAddNewButton: false
                }
                }
            /> */}

            <Content>

                <KTCard className='mt-5 mb-5'>
                    <KTCardBody className='py-4'>
                        <div className="row">
                            <div className="col-lg-4">
                                <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">Dispatch Info</h1>
                            </div>
                            <div className="col-lg-8">
                                <div className="d-flex justify-content-end">
                                    {/* <Link
                                    to=''
                                    className=''
                                >
                                    {getCurrentDate()}
                                </Link> */}

                                    <button type='button' className='btn btn-light-primary me-3' onClick={handleSearchFormReset}>
                                        <KTIcon iconName='exit-up' className='fs-2' />
                                        Reset
                                    </button>

                                    <button type='button' className='btn btn-primary me-3' onClick={handleSearchForm}>
                                        <KTIcon iconName='magnifier' className='fs-2' />
                                        Search
                                    </button>

                                    <button className="btn btn-warning me-3" onClick={generatePrint}>

                                        <FontAwesomeIcon icon={faPrint} className='fs-2 me-3' />
                                        Print
                                    </button>


                                </div>

                            </div>
                        </div>
                    </KTCardBody>
                </KTCard>


                <div className='card printable-area' id="card_dispatch_info" ref={componentRefForReceipt}>

                    {/* <CommonListSearchHeader
                        searchFields={HtmlSearchFields}
                        onSearch={handleSearchForm}
                        onSearchReset={handleSearchFormReset}
                    /> */}

                    {/* <div className='card-header border-0 pt-1'>
                        <div className='card-title'>
                        </div>
                    </div> */}



                    {/* <UsersTable /> */}
                    <KTCardBody className='py-4 mt-3' >

                        <div className="row mb-8">
                            <div className="col-lg-4">
                                <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">Dispatch Info</h1>
                            </div>
                            <div className="col-lg-8">
                                <div className="d-flex justify-content-end">
                                    <Link
                                        to=''
                                        className=''
                                    >
                                        {getCurrentDate()}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className='row mb-8'>
                            <div className={'col-lg-4 me-3'}>

                                <div className="form-group row">
                                    <label htmlFor="staticEmail" className="col-sm-3 col-form-label">From Date: </label>
                                    <div className="col-sm-8">
                                        <input type="date" className="form-control form-control-solid ps-3"
                                            value={fromDate}
                                            onChange={(e) => setFromDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={'col-lg-4'}>
                                <div className="form-group row">
                                    <label htmlFor="staticEmail" className="col-sm-3 col-form-label">To Date: </label>
                                    <div className="col-sm-8">
                                        <input type="date" className="form-control form-control-solid ps-3"
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>


                        <div className='table-responsive'>
                            <table
                                id='kt_table_users'
                                className='table align-middle table-row-dashed table-bordered fs-6 gy-5 dataTable no-footer'

                            >
                                <thead>
                                    <tr className='text-start text-muted fw-bolder fs-7 gs-0 bg-light'>
                                        <th colSpan={1} role="columnheader" className="min-w-150px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Dispatch Date</th>
                                        <th colSpan={1} role="columnheader" className="min-w-150px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Job Date</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Job Card</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Dispatch#</th>
                                        <th colSpan={1} role="columnheader" className="min-w-150px" style={{ cursor: 'pointer' }}>Item</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>M/s.</th>

                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Grand Total</th>
                                        <th colSpan={1} role="columnheader" className="min-w-150px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Invoice</th>

                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        allJobDispatchReportData != undefined && allJobDispatchReportData.length > 0
                                            ?
                                            allJobDispatchReportData?.map((record: any, index: number) => (
                                                <tr role='row' key={index}>
                                                    <td role="cell" className="ps-3">

                                                        {getDateCommonFormatFromJsonDate(record.created_on)}
                                                    </td>
                                                    <td role="cell" className="ps-3">

                                                        {getDateCommonFormatFromJsonDate(record.job_date)}
                                                    </td>




                                                    <td>
                                                        <div className="d-flex align-items-center">




                                                            <div className="ms-5">

                                                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.job_card_no}</a>

                                                            </div>
                                                        </div>
                                                    </td>






                                                    <td role="cell">
                                                        <div className=''>{record?.card_dispatch_no}</div>
                                                    </td>

                                                    <td role="cell" className=''>
                                                        <div className=''>{record?.item_name}</div>
                                                    </td>

                                                    <td role="cell" className=''>
                                                        <div className=''>{record?.company_name}</div>
                                                    </td>
                                                    <td role="cell" className=''>
                                                        <div className=''>{record?.grand_total}</div>
                                                    </td>


                                                    <td role="cell" className='pe-3'>


                                                        <div className='d-flex jobcard-td'>
                                                            <Link to='' onClick={() => handleDispatchInvoiceOpen(record.card_dispatch_info_id)}>
                                                                <FontAwesomeIcon icon={faEye} className='me-1' />
                                                                Invoice
                                                            </Link>


                                                        </div>

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

                        {isLoading && <TableListLoading />}


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
                </div>
            </Content>
        </AdminLayout>
    )
}
