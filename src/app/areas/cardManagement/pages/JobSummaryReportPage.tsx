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


export default function JobSummaryReportPage() {
    const searchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'job-card-no', inputName: 'jobCardNo', labelName: 'Job Card No', placeHolder: 'Job Card No', type: 'text', defaultValue: '', iconClass: 'fa fa-search' }
    ];

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filterValues, setFilterValues] = useState<any[]>([]);
    const [report, setReport] = useState<any>({});
    const [units, setUnits] = useState<any[]>([]);
    const [total, setTotal] = useState<any>({});

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
    }

    const onSearchReset = () => {
        setFilterValues([]);
    }

    const onPrint = () => {
        alert('Print');
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
                data.machines.forEach((item: any) => {
                    total[item.machineTypeId] = getSum(item.entries);
                });
                total['dispatch'] = getSum(data.dispatches);
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
            core: 0,
            gross: 0,
            net: 0
        };
        entries.forEach(entry => {
            sum.waste += parseFloat(entry.waste);
            sum.gross += parseFloat(entry.gross);
            sum.net += parseFloat(entry.net);
            sum.core += parseFloat(entry.core);
        });
        return sum;
    }

    return (
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
                        <div>Job Card: {filterValues?.[0]?.defaultValue || ''}</div>
                        <div>Product Name: {report.machines?.[0]?.entries[0]?.productName || ''}</div>
                        {
                            report?.dispatches?.length > 0 &&
                            report.machines.map((item: any, index1: number) => (
                                <div>
                                    <h3>{item.machineTypeName}</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Machine</th>
                                                <th>Waste</th>
                                                <th>Gross</th>
                                                <th>Net</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                item.entries.map((entry: any, index2: number) => (
                                                    <tr key={`${index1}-${index2}`}>
                                                        <td>{GetFormattedDate(entry.date)}</td>
                                                        <td>{entry.machineName}</td>
                                                        <td>{entry.waste}</td>
                                                        <td>{entry.gross}</td>
                                                        <td>{entry.net}</td>
                                                    </tr>
                                                ))

                                            }
                                            <tr>
                                                <td colSpan={3}>Total</td>
                                                <td>{total[item.machineTypeId].waste}</td>
                                                <td>{total[item.machineTypeId].gross}</td>
                                                <td>{total[item.machineTypeId].net}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        }
                        {
                            report?.dispatches?.length > 0 &&
                            <div>
                                <h3>Dispatch</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Quantity</th>
                                            <th>Unit</th>
                                            <th>Gross</th>
                                            <th>Core</th>
                                            <th>Net</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            report.dispatches.map((dispatch: any, index: number) => (
                                                <tr key={index}>
                                                    <td>{GetFormattedDate(dispatch.date)}</td>
                                                    <td>{dispatch.quantity}</td>
                                                    <td>{GetUnitShortName(units, dispatch.unitId)}</td>
                                                    <td>{dispatch.gross}</td>
                                                    <td>{dispatch.core}</td>
                                                    <td>{dispatch.net}</td>
                                                </tr>
                                            ))

                                        }
                                        <tr>
                                            <td colSpan={3}>Total</td>
                                            <td>{total['dispatch'].gross}</td>
                                            <td>{total['dispatch'].core}</td>
                                            <td>{total['dispatch'].net}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        }
                    </KTCardBody>
                </KTCard>
            </Content>
        </AdminLayout>
    );
}
