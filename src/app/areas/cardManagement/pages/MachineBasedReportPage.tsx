/* eslint-disable */

import React, { useEffect, useState, useRef } from 'react'
import { getCurrentDate } from '../../../../_sitecommon/common/helpers/global/GlobalHelper';
import { showErrorMsg, stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import AdminLayout from '../../common/components/layout/AdminLayout';
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody, KTIcon } from '../../../../_sitecommon/helpers';
import TableListLoading from '../../common/components/shared/TableListLoading';
import { getAllMachinesListApi, getJobDispatchReportDataApi, getMachineBasedReportDataApi, getMachineTypesListApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPrint } from '@fortawesome/free-solid-svg-icons';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useReactToPrint } from 'react-to-print';

import { getDateCommonFormatFromJsonDate } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import JobCardDispatchInvoice from '../components/JobCardDispatchInvoice';
import ReactSelect,  { components }  from 'react-select';



export default function MachineBasedReportPage() {
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


    const [allMachineReportsData, setAllMachineReportsData] = useState<any>([]);
    const [allMachineTypes, setAllMachineTypes] = useState<any>([]);
    const [allMachinesList, setAllMachinesList] = useState<any>([]);
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [machineTypeId, setMachineTypeId] = useState<number>(0);
    const [selectedMachineIds, setSelectedMachineIds] = useState([]);

    const [optionsMachine, setOptionsMachine] = useState<any>(null)

  

  
    const handleSelectMachineChange = (selected: any) => {
        setSelectedMachineIds(selected);
    };


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

        setAllMachineReportsData(null);

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

    const handleMachineTypeIdChange = (event: any) => {
        setMachineTypeId(event.target.value);
      };
    



    const generatePrint = useReactToPrint({
        content: () => componentRefForReceipt.current,
        documentTitle: 'Card Dispatch Report',

    });

    const CustomOption = (props: any) => {
        return (
          <components.Option {...props}>
            <input
              type="checkbox"
              checked={props.isSelected}
              onChange={() => null} // This prevents React warning, actual change is handled by react-select
              style={{ marginRight: 8 }}
            />
            <label>{props.label}</label>
          </components.Option>
        );
      };




    useEffect(() => {
        if (stringIsNullOrWhiteSpace(fromDate) == false && stringIsNullOrWhiteSpace(toDate) == false) {
            getMachineBasedReportDataService();
        }

        
        if(allMachineTypes == undefined || allMachineTypes == null || allMachineTypes.length < 1){
            getMachineTypesListService();
        }
        if(allMachinesList == undefined || allMachinesList == null || allMachinesList.length < 1){
            getAllMachinesListService();
        }


    }, [listRefreshCounter]);

    const getMachineBasedReportDataService = () => {

        let machineIdsArray: any = [];
        selectedMachineIds?.forEach((element: any) => {
            machineIdsArray.push(element.value);
        });
        const commaSeparatedMachineIds = machineIdsArray?.join(',');

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
        pageBasicInfoParams = `${pageBasicInfoParams}&fromDate=${fromDate}&toDate=${toDate}&machineTypeId=${machineTypeId}&commaSeparatedMachineIds=${commaSeparatedMachineIds}`;


        getMachineBasedReportDataApi(pageBasicInfoParams)
            .then((res: any) => {

                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));
                    console.log('data is: ', res.data);

                    setAllMachineReportsData(res?.data);

                } else {
                    setAllMachineReportsData([]);
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: 0
                    }));
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };

    const getMachineTypesListService = () => {

        let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();


        getMachineTypesListApi(pageBasicInfoParams)
            .then((res: any) => {
                const { data } = res;
                if (data && data.length > 0) {
                    const totalRecords = data[0]?.totalRecords;
                    setPageBasicInfo((prevPageBasicInfo: any) => ({
                        ...prevPageBasicInfo,
                        totalRecords: totalRecords
                    }));

                    setAllMachineTypes(res?.data);

                } else {
                    setAllMachineTypes([]);
                }


            })
            .catch((err: any) => console.log(err, "err"));
    };


    const getAllMachinesListService = () => {

        const pageBasicInfoMachine: any = {
            pageNo: 1,
            pageSize: 200,
            totalRecords: 0
        }

        let pageBasicInfoMachineParams = new URLSearchParams(pageBasicInfoMachine).toString();

        getAllMachinesListApi(pageBasicInfoMachineParams)
            .then((res: any) => {

                const { data } = res;
                if (data && data.length > 0) {

                    let localMachinesOption: any = [];
                    data.forEach((element: any) => {
                        localMachinesOption.push({
                            value: element.machine_id,
                            label: element.machine_name
                        });
                    });
                   
                    setOptionsMachine(localMachinesOption);

                } else {
                    setOptionsMachine([]);
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
                                <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">Machine Based Report</h1>
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
                                <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">Machine Based Report</h1>
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
                                    <label htmlFor="staticEmail" className="col-sm-4 col-form-label">From Date: </label>
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
                                    <label htmlFor="staticEmail" className="col-sm-4 col-form-label">To Date: </label>
                                    <div className="col-sm-8">
                                        <input type="date" className="form-control form-control-solid ps-3"
                                            value={toDate}
                                            onChange={(e) => setToDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={'col-lg-4 mt-4 me-3'}>
                                <div className="form-group row">
                                    <label htmlFor="multiSelect" className="col-sm-4 col-form-label">Machines: </label>
                                    <div className="col-sm-8">
                                        <ReactSelect
                                            isMulti
                                            options={optionsMachine}
                                            value={selectedMachineIds}
                                            onChange={handleSelectMachineChange}
                                            closeMenuOnSelect={false}
                                            hideSelectedOptions={false}
                                            components={{ Option: CustomOption }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={'col-lg-4 mt-4'}>
                                <div className="form-group row">
                                    <label  className="col-sm-4 col-form-label">Machine Type: </label>
                                    <div className="col-sm-8">
                                    <select
                                        className={`form-select form-select-solid`}
                                        value={machineTypeId} onChange={handleMachineTypeIdChange}
                                        aria-label="Select example"
                                        
                                        
                                    >
                                       <option value=''>--Select--</option>

                                        {allMachineTypes?.map((item: any, index: any) => (
                                            <option key={index} value={item.machine_type_id}>
                                                {item.machine_type_name}
                                            </option>
                                        ))}
                                    </select>
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
                                        <th colSpan={1} role="columnheader" className="min-w-150px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Job Card#</th>
                                        <th colSpan={1} role="columnheader" className="min-w-150px" style={{ cursor: 'pointer' }}>Item</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Machine Type</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Roll</th>
                                        <th colSpan={1} role="columnheader" className="min-w-150px" style={{ cursor: 'pointer' }}>Trim</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Waste</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Size</th>
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Gross</th>
                                     
                                        <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Net</th>
                                        <th colSpan={1} role="columnheader" className="min-w-150px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Job Date</th>
                                 

                                    </tr>
                                </thead>
                                <tbody className='text-gray-600 fw-bold'>

                                    {
                                        allMachineReportsData != undefined && allMachineReportsData.length > 0
                                            ?
                                            allMachineReportsData?.map((record: any, index: number) => (
                                                <tr role='row' key={index}>
                                                    <td role="cell" className="ps-3">

                                                        {record.job_card_no}
                                                    </td>

                                                    <td>
                                                        <div className="d-flex align-items-center">

                                                            <div className="ms-5">

                                                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">{record.item_name}</a>

                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td role="cell" className=''>
                                                        <div className=''>{record?.machine_type_name}</div>
                                                    </td>

                                                    <td role="cell">
                                                        <div className=''></div>
                                                    </td>

                                                    <td role="cell" className=''>
                                                        <div className=''></div>
                                                    </td>

                                                    <td role="cell" className=''>
                                                        <div className=''>{record?.waste_value}</div>
                                                    </td>
                                                    <td role="cell" className=''>
                                                        <div className=''>{record?.job_size}</div>
                                                    </td>
                                                    <td role="cell" className=''>
                                                        <div className=''>{record?.gross_value}</div>
                                                    </td>
                                                   
                                                    <td role="cell" >
                                                        <div className=''>{record?.net_value}</div>
                                                    </td>
                                                   

                                                    <td role="cell" className='pe-3'>

                                                    {getDateCommonFormatFromJsonDate(record.prod_entry_date)}

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
