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
import GrnReportPrintView from '../components/GrnReportPrintView';


export default function GrnReport() {
    const searchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'start-date', inputName: 'startDate', type: 'date', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'end-date', inputName: 'endDate', type: 'date', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'sku', inputName: 'sku', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
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
        ReportApi.grn(filter)
            .then(({ data }) => {
                const total: any = {};
                setTotal(total);
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
                    title='GRN Report'
                    pageDescription='Report for GRN'
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
                                                <th className="ps-3 rounded-start">GRN Date</th>
                                                <th>GRN Number</th>
                                                <th>PO Number</th>
                                                <th>Product</th>
                                                <th>Quantity</th>
                                                <th className="rounded-end">Weight</th>
                                            </tr>
                                        </thead>
                                        <tbody className='text-gray-600 fw-bold'>
                                            {
                                                report.map((item: any, index: number) => (
                                                    <tr key={`grn-${index}`}>
                                                        <td className='ps-3'>{GetFormattedDate(item.grnDate)}</td>
                                                        <td>{item.grnNumber}</td>
                                                        <td>{item.poNumber}</td>
                                                        <td>{item.productName} ({item.productSku})</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.weight}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </KTCardBody>
                    </KTCard>
                </Content>
            </AdminLayout>
            {
                print &&
                <GrnReportPrintView
                    afterPrint={onAfterPrint}
                    report={report}
                    startDate={filterValues?.find((value) => value.inputName === 'startDate')?.defaultValue}
                    endDate={filterValues?.find((value) => value.inputName === 'endDate')?.defaultValue}
                    sku={filterValues?.find((value) => value.inputName === 'sku')?.defaultValue} />
            }
        </>
    );
}
