import { useEffect, useState } from 'react'
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody } from '../../../../_sitecommon/helpers';
import CommonListSearchHeader from '../../common/components/layout/CommonListSearchHeader';
import { ReportApi } from '../../../../_sitecommon/common/api/report.api';


export default function MachineSummaryReport() {
    const searchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'start-date', inputName: 'startDate', labelName: 'Start Date', placeHolder: 'Start Date', type: 'date', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'end-date', inputName: 'endDate', labelName: 'End Date', placeHolder: 'End Date', type: 'date', defaultValue: '', iconClass: 'fa fa-search' },
    ];

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filterValues, setFilterValues] = useState<any[]>([]);
    const [report, setReport] = useState<any>([]);
    const [units, setUnits] = useState<any[]>([]);
    const [total, setTotal] = useState<any>({});

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
                                <div>
                                    <h3>{item.machineTypeName}</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Machine</th>
                                                <th>Waste</th>
                                                <th>Gross</th>
                                                <th>Net</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                item.machines.map((machine: any, index2: number) => (
                                                    <tr key={`${index1}-${index2}`}>
                                                        <td>{machine.machineName}</td>
                                                        <td>{machine.waste}</td>
                                                        <td>{machine.gross}</td>
                                                        <td>{machine.net}</td>
                                                    </tr>
                                                ))
                                            }
                                            <tr>
                                                <td>Total</td>
                                                <td>{total[item.machineTypeId].waste}</td>
                                                <td>{total[item.machineTypeId].gross}</td>
                                                <td>{total[item.machineTypeId].net}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        }
                    </KTCardBody>
                </KTCard>
            </Content>
        </AdminLayout>
    );
}
