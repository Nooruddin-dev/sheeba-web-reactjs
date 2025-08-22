import { useEffect, useState } from 'react'
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody } from '../../../../_sitecommon/helpers';
import CommonListSearchHeader from '../../common/components/layout/CommonListSearchHeader';
import { ReportApi } from '../../../../_sitecommon/common/api/report.api';
import { GetFormattedDate, GetUnitShortName } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { InventoryApi } from '../../../../_sitecommon/common/api/inventory.api';
import { toast } from 'react-toastify';
import { formatNumber } from '../../common/util';
import JobSummaryPrintView from '../components/JobSummaryPrintView';
import { MachineTypesEnum } from '../../../../_sitecommon/common/enums/GlobalEnums';


export default function JobSummaryReportPage() {
    const searchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'job-card-no', inputName: 'jobCardNo', labelName: 'Job Card No', placeHolder: 'Job Card No', type: 'text', defaultValue: '', additionalClasses: 'width-100' },
        { inputId: 'job-card-no-start', inputName: 'startJobCardNo', labelName: 'Start Job Card No', placeHolder: 'Start Job Card No', type: 'text', defaultValue: '', additionalClasses: 'width-100' },
        { inputId: 'job-card-no-end', inputName: 'endJobCardNo', labelName: 'End Job Card No', placeHolder: 'End Job Card No', type: 'text', defaultValue: '', additionalClasses: 'width-100' }
    ];

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [print, setPrint] = useState<boolean>(false);
    const [filterValues, setFilterValues] = useState<any[]>([]);
    const [jobCards, setJobCards] = useState<any>();
    const [units, setUnits] = useState<any[]>([]);
    const [total, setTotal] = useState<Record<number, any>>({});

    useEffect(() => {
        getUnits();
    }, [])

    useEffect(() => {
        if (filterValues.length > 0) {
            getReport();
        }
    }, [filterValues])

    const onSearch = (param: any) => {
        setFilterValues(param);
        setTotal({});
        setJobCards([]);
    }

    const onSearchReset = () => {
        setFilterValues([]);
    }

    const onPrint = () => {
        setPrint(true);
    }
    const onAfterPrint = () => {
        setPrint(false);
    }

    function getUnits(): void {
        InventoryApi.getUnits()
            .then((response) => {
                setUnits(response.data.data);
            })
            .catch((response) => { toast.error(response.data.message) })
    }

    function getReport(): void {
        setIsLoading(true);
        let filter = {};
        filterValues.forEach(field => {
            filter = {
                ...filter,
                [field.inputName]: field.defaultValue
            }
        });
        ReportApi.jobSummary(filter)
            .then(({ data }) => {
                const total: any = {};
                data.forEach((jobCard: any) => {
                    total[jobCard.id] = {};
                    jobCard.machines.forEach((machine: any) => {
                        total[jobCard.id][machine.machineTypeId] = getEntriesSum(machine.entries);
                    });
                    total[jobCard.id]['dispatch'] = getDispatchesSum(jobCard.dispatches);
                });
                setTotal(total);
                setJobCards(data);
            })
            .catch(({ response }) => {
                toast.error(response?.data?.message);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    function getEntriesSum(entries: any[]): any {
        let sum = {
            quantity: 0,
            handleCutting: 0,
            trimming: 0,
            rejection: 0,
            waste: 0,
            core: 0,
            gross: 0,
            net: 0
        };
        entries.forEach(entry => {
            sum.quantity += parseFloat(entry.quantity || 0);
            sum.handleCutting += parseFloat(entry.handleCutting || 0);
            sum.trimming += parseFloat(entry.trimming || 0);
            sum.rejection += parseFloat(entry.rejection || 0);
            sum.waste += parseFloat(entry.waste || 0);
            sum.gross += parseFloat(entry.gross || 0);
            sum.net += parseFloat(entry.net || 0);
            sum.core += parseFloat(entry.core || 0);
        });
        return sum;
    }

    function getDispatchesSum(dispatches: any[]): any {
        let sum = {
            quantity: 0,
            core: 0,
            gross: 0,
            net: 0
        };
        dispatches.forEach(entry => {
            sum.quantity += parseFloat(entry.quantity || 0);
            sum.gross += parseFloat(entry.gross || 0);
            sum.net += parseFloat(entry.net || 0);
            sum.core += parseFloat(entry.core || 0);
        });
        return sum;
    }

    return (
        <>
            <AdminLayout>
                <AdminPageHeader
                    title='Job Summary Report'
                    pageDescription='Summary report for a particular job'
                    addNewClickType={'link'}
                    newLink=''
                    additionalInfo={{ showAddNewButton: false }}
                />
                <Content>
                    <KTCard>
                        <CommonListSearchHeader
                            searchFields={searchFields}
                            onSearch={onSearch}
                            onSearchReset={onSearchReset}
                            onPrint={onPrint}
                        />
                        <KTCardBody>
                            {
                                jobCards?.map((jobCard: any) => {
                                    return (
                                        <div key={jobCard.id} className='mb-20'>
                                            <hr />
                                            <h3>
                                                Job Card: <b>{jobCard.jobCardNo}</b>
                                            </h3>
                                            <h3 className=' mb-5'>
                                                Product Name: <b>{jobCard.productName}</b>
                                            </h3>
                                            <hr />
                                            {
                                                jobCard.machines?.map((item: any, index1: number) => (
                                                    <div className='table-responsive mb-10'>
                                                        <h3 className='text-mid mb-5'>{item.machineTypeName}</h3>
                                                        <table className='table align-middle table-row-dashed fs-6 gy-5 dataTable'>
                                                            <thead>
                                                                <tr className='text-start text-muted fw-bolder fs-7 gs-0 bg-light'>
                                                                    <th className="ps-3 rounded-start">Date</th>
                                                                    <th>Machine</th>
                                                                    {
                                                                        item.machineTypeId === MachineTypesEnum.Slitting &&
                                                                        <th>Trimming</th>
                                                                    }
                                                                    {
                                                                        item.machineTypeId === MachineTypesEnum.Cutting &&
                                                                        <>
                                                                            <th>Handle Cutting</th>
                                                                            <th>Rejection</th>
                                                                        </>
                                                                    }
                                                                    {
                                                                        ![MachineTypesEnum.Slitting, MachineTypesEnum.Cutting].includes(item.machineTypeId) &&
                                                                        <th>Quantity</th>
                                                                    }
                                                                    <th>Waste</th>
                                                                    <th>Gross</th>
                                                                    <th className="rounded-end">Net</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className='text-gray-600 fw-bold'>
                                                                {
                                                                    item.entries?.map((entry: any, index2: number) => (
                                                                        <tr key={`${index1}-${index2}`}>
                                                                            <td className='ps-3'>{GetFormattedDate(entry.date)}</td>
                                                                            <td>{entry.machineName}</td>
                                                                            {
                                                                                item.machineTypeId === MachineTypesEnum.Slitting &&
                                                                                <td>{entry.trimming}</td>
                                                                            }
                                                                            {
                                                                                item.machineTypeId === MachineTypesEnum.Cutting &&
                                                                                <>
                                                                                    <td>{entry.handleCutting}</td>
                                                                                    <td>{entry.rejection}</td>
                                                                                </>
                                                                            }
                                                                            {
                                                                                ![MachineTypesEnum.Slitting, MachineTypesEnum.Cutting].includes(item.machineTypeId) &&
                                                                                <td>{entry.quantity}</td>
                                                                            }
                                                                            <td>{entry.waste}</td>
                                                                            <td>{entry.gross}</td>
                                                                            <td>{entry.net}</td>
                                                                        </tr>
                                                                    ))

                                                                }
                                                            </tbody>
                                                            <tfoot className='text-gray-600 fw-bold'>
                                                                <tr className='text-start text-muted fw-bolder fs-7 gs-0'>
                                                                    <td colSpan={2} className='ps-3'></td>
                                                                    {
                                                                        item.machineTypeId === MachineTypesEnum.Slitting &&
                                                                        <td>{formatNumber(total[jobCard.id][item.machineTypeId].trimming, 2)}</td>
                                                                    }
                                                                    {
                                                                        item.machineTypeId === MachineTypesEnum.Cutting &&
                                                                        <>
                                                                            <td>{formatNumber(total[jobCard.id][item.machineTypeId].handleCutting, 2)}</td>
                                                                            <td>{formatNumber(total[jobCard.id][item.machineTypeId].rejection, 2)}</td>
                                                                        </>
                                                                    }
                                                                    {
                                                                        ![MachineTypesEnum.Slitting, MachineTypesEnum.Cutting].includes(item.machineTypeId) &&
                                                                        <td>{formatNumber(total[jobCard.id][item.machineTypeId].quantity, 2)}</td>
                                                                    }
                                                                    <td>{formatNumber(total[jobCard.id][item.machineTypeId].waste, 2)}</td>
                                                                    <td>{formatNumber(total[jobCard.id][item.machineTypeId].gross, 2)}</td>
                                                                    <td>{formatNumber(total[jobCard.id][item.machineTypeId].net, 2)}</td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                ))
                                            }
                                            {
                                                jobCard.dispatches?.length > 0 &&
                                                <div className='table-responsive'>
                                                    <h3 className='text-mid mb-5'>Dispatch</h3>
                                                    <table className='table align-middle table-row-dashed fs-6 gy-5 dataTable'>
                                                        <thead>
                                                            <tr className='text-start text-muted fw-bolder fs-7 gs-0 bg-light'>
                                                                <th className="ps-3 rounded-start">Date</th>
                                                                <th>Quantity</th>
                                                                <th>Gross</th>
                                                                <th>Core</th>
                                                                <th className="rounded-end">Net</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className='text-gray-600 fw-bold'>
                                                            {
                                                                jobCards.dispatches?.map((dispatch: any, index: number) => (
                                                                    <tr key={index}>
                                                                        <td className='ps-3'>{GetFormattedDate(dispatch.date)}</td>
                                                                        <td>{dispatch.quantity}</td>
                                                                        <td>{dispatch.gross}</td>
                                                                        <td>{dispatch.core}</td>
                                                                        <td>{dispatch.net}</td>
                                                                    </tr>
                                                                ))

                                                            }

                                                        </tbody>
                                                        <tfoot className='text-gray-600 fw-bold'>
                                                            <tr className='text-start text-muted fw-bolder fs-7 gs-0'>
                                                                <td className='ps-3'></td>
                                                                <td>{formatNumber(total[jobCard.id]['dispatch'].quantity, 2)}</td>
                                                                <td>{formatNumber(total[jobCard.id]['dispatch'].gross, 2)}</td>
                                                                <td>{formatNumber(total[jobCard.id]['dispatch'].core, 2)}</td>
                                                                <td>{formatNumber(total[jobCard.id]['dispatch'].net, 2)}</td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            }
                                        </div>
                                    );
                                })
                            }
                        </KTCardBody>
                    </KTCard>
                </Content>
            </AdminLayout>
            {
                print &&
                <JobSummaryPrintView
                    afterPrint={onAfterPrint}
                    jobCards={jobCards}
                    total={total} />
            }
        </>
    );
}
