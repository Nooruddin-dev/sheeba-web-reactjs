import { useEffect, useState } from 'react'
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody } from '../../../../_sitecommon/helpers';
import CommonListSearchHeader from '../../common/components/layout/CommonListSearchHeader';
import { ReportApi } from '../../../../_sitecommon/common/api/report.api';
import { toast } from 'react-toastify';
import { GetFormattedDate } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { formatNumber } from '../../common/util';
import DispatchReportPrintView from '../components/DispatchReportPrintView';


export default function DispatchReportPage() {
    const searchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'start-date', inputName: 'startDate', type: 'date', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'end-date', inputName: 'endDate', type: 'date', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'official', inputName: 'official', type: 'dropdown', options: [{ value: 'true', text: 'Official' }, { value: 'false', text: 'Non-Official' }], defaultValue: 'false', iconClass: 'fa fa-search' },
    ];

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [print, setPrint] = useState<boolean>(false);
    const [filterValues, setFilterValues] = useState<any[]>([]);
    const [report, setReport] = useState<any>({});

    useEffect(() => {
        if (filterValues.length > 0) {
            getReport();
        }
    }, [filterValues])

    const onSearch = (param: any) => {
        if (param.length && !param.some((item: any) => item.inputName === 'startDate' || item.inputName === 'endDate')) {
            toast.error('Please select a date range!');
            return;
        }
        setFilterValues(param);
    }

    const onSearchReset = () => {
        setFilterValues([]);
        setReport({});
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
        ReportApi.dispatch(filter)
            .then(({ data }) => {
                setReport(data);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    return (
        <>
            <AdminLayout>
                <AdminPageHeader
                    title='Dispatch Report'
                    pageDescription='Job card dispatch report'
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
                                <div className='table-responsive mb-10'>
                                    <table className='table align-middle table-row-dashed fs-6 gy-5 dataTable'>
                                        <thead>
                                            <tr className='text-start text-muted fw-bolder fs-7 gs-0 bg-light'>
                                                <th className="ps-3 rounded-start">Dispatch Date</th>
                                                <th>Job Date</th>
                                                <th>Dispatch No</th>
                                                <th>Job Card No</th>
                                                <th>Item</th>
                                                <th>Quantity</th>
                                                <th className="rounded-end">Weight</th>
                                            </tr>
                                        </thead>
                                        <tbody className='text-gray-600 fw-bold'>
                                            {
                                                report?.entries?.map((item: any, index: number) => (
                                                    <tr key={`dispatch-${index}`}>
                                                        <td className='ps-3'>{GetFormattedDate(item.dispatchDate)}</td>
                                                        <td>{GetFormattedDate(item.jobCardDate)}</td>
                                                        <td>{item.dispatchNo}</td>
                                                        <td>{item.jobCardNo}</td>
                                                        <td>{item.product}</td>
                                                        <td>{formatNumber(item.quantity, 2)}</td>
                                                        <td>{formatNumber(item.weight, 2)}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                        <tfoot className='text-gray-600 fw-bold'>
                                            <tr className='text-start text-muted fw-bolder fs-7 gs-0'>
                                                <td className='ps-3' colSpan={5}>Total</td>
                                                <td>{formatNumber(report?.summary?.totalQuantity, 2)} PCS</td>
                                                <td>{formatNumber(report?.summary?.totalWeight, 2)} KG</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            }
                        </KTCardBody>
                    </KTCard>
                </Content>
            </AdminLayout>
            {
                print &&
                <DispatchReportPrintView
                    afterPrint={onAfterPrint}
                    report={report}
                    startDate={filterValues?.find((value) => value.inputName === 'startDate')?.defaultValue}
                    endDate={filterValues?.find((value) => value.inputName === 'endDate')?.defaultValue}
                    official={filterValues?.find((value) => value.inputName === 'official')?.defaultValue} />
            }
        </>
    );
}
