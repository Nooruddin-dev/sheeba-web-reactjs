import { useEffect, useState } from 'react'
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody } from '../../../../_sitecommon/helpers';
import CommonListSearchHeader from '../../common/components/layout/CommonListSearchHeader';
import { ReportApi } from '../../../../_sitecommon/common/api/report.api';
import MachineSummaryReportPrintView from '../components/MachineSummaryReportPrintView';
import { formatNumber } from '../../common/util';
import { toast } from 'react-toastify';


export default function MachineSummaryReport() {
    const searchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'start-date', inputName: 'startDate', type: 'date', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'end-date', inputName: 'endDate', type: 'date', defaultValue: '', iconClass: 'fa fa-search' },
    ];

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [print, setPrint] = useState<boolean>(false);
    const [filterValues, setFilterValues] = useState<any[]>([]);
    const [report, setReport] = useState<any>([]);
    const [total, setTotal] = useState<any>({});

    useEffect(() => {
        if (filterValues.length > 0) {
            getReport();
        }
    }, [filterValues])

    const onSearch = (param: any) => {
        if (!param.length) {
            toast.error('Please select date range!');
            return;
        }
        setFilterValues(param);
    }

    const onSearchReset = () => {
        setFilterValues([]);
        setTotal({});
        setReport([]);
    }

    const onPrint = () => {
        setPrint(true);
    }

    const onAfterPrint = () => {
        setPrint(false);
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
        ReportApi.machineSummary(filter)
            .then(({ data }) => {
                const total: any = {};
                data.forEach((item: any) => {
                    total[item.machineTypeId] = getSum(item.machines);
                });
                setTotal(total);
                setReport(data);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    function getSum(entries: any[]): any {
        let sum = {
            waste: 0,
            gross: 0,
            net: 0
        };
        entries.forEach(entry => {
            sum.waste += parseFloat(entry.waste);
            sum.gross += parseFloat(entry.gross);
            sum.net += parseFloat(entry.net);
        });
        return sum;
    }

    return (
        <>
            <AdminLayout>
                <AdminPageHeader
                    title='Machine Summary Report'
                    pageDescription='Summary report for a machines by type'
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
                                report.map((item: any, index1: number) => (
                                    <div className='table-responsive mb-10'>
                                        <h3 className='text-mid mb-5'>{item.machineTypeName}</h3>
                                        <table className='table align-middle table-row-dashed fs-6 gy-5 dataTable'>
                                            <thead>
                                                <tr className='text-start text-muted fw-bolder fs-7 gs-0 bg-light'>
                                                    <th className="ps-3 rounded-start">Machine</th>
                                                    <th>Waste</th>
                                                    <th>Gross</th>
                                                    <th className="rounded-end">Net</th>
                                                </tr>
                                            </thead>
                                            <tbody className='text-gray-600 fw-bold'>
                                                {
                                                    item.machines.map((machine: any, index2: number) => (
                                                        <tr key={`${index1}-${index2}`}>
                                                            <td className='ps-3'>{machine.machineName}</td>
                                                            <td>{machine.waste}</td>
                                                            <td>{machine.gross}</td>
                                                            <td>{machine.net}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                            <tfoot className='text-gray-600 fw-bold'>
                                                <tr className='text-start text-muted fw-bolder fs-7 gs-0'>
                                                    <td className='ps-3'></td>
                                                    <td>{formatNumber(total[item.machineTypeId]?.waste, 2)}</td>
                                                    <td>{formatNumber(total[item.machineTypeId]?.gross, 2)}</td>
                                                    <td>{formatNumber(total[item.machineTypeId]?.net, 2)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                ))
                            }
                        </KTCardBody>
                    </KTCard>
                </Content>
            </AdminLayout>
            {
                print &&
                <MachineSummaryReportPrintView
                    afterPrint={onAfterPrint}
                    report={report}
                    total={total}
                    startDate={filterValues?.find((value) => value.inputName === 'startDate')?.defaultValue}
                    endDate={filterValues?.find((value) => value.inputName === 'endDate')?.defaultValue} />
            }
        </>
    );
}
