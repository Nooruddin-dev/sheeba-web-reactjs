import { useEffect, useState } from "react";
import { KTCard, KTCardBody } from "../../../../_sitecommon/helpers";
import { Content } from "../../../../_sitecommon/layout/components/content";
import { HtmlSearchFieldConfig } from "../../../models/common/HtmlSearchFieldConfig";
import AdminLayout from "../../common/components/layout/AdminLayout";
import AdminPageHeader from "../../common/components/layout/AdminPageHeader";
import CommonListSearchHeader from "../../common/components/layout/CommonListSearchHeader";
import TableListLoading from "../../common/components/shared/TableListLoading";
import CommonListPagination from "../../common/components/layout/CommonListPagination";
import { getSalesInvoicesByFilter } from "../../../../_sitecommon/common/helpers/api_helpers/ApiCalls";
import { formatNumber } from "../../common/util";
import { getDateCommonFormatFromJsonDate } from "../../../../_sitecommon/common/helpers/global/ConversionHelper";
import SaleInvoiceReceipt from "../components/SalesInvoiceReceipt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

export default function SaleInvoiceListPage() {
    const searchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'sale-invoice-no', inputName: 'saleInvoiceNo', labelName: 'Sale Invoice No.', placeHolder: 'Sale Invoice No.', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'dispatch-no', inputName: 'dispatchNo', labelName: 'Dispatch No.', placeHolder: 'Dispatch No.', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'company-name', inputName: 'companyName', labelName: 'Company Name', placeHolder: 'Company Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
    ];

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filterValues, setFilterValues] = useState<any[]>([]);
    const [saleInvoices, setSaleInvoices] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [invoiceIdForPrint, setInvoiceIdForPrint] = useState<number>();


    useEffect(() => {
        getSalesInvoices();
    }, [filterValues, page])

    const onSearch = (param: any) => {
        setPage(1);
        setFilterValues(param);
    }

    const onSearchReset = () => {
        setPage(1);
        setFilterValues([]);
    }

    const onGotoPage = (page: number) => {
        setPage(page);
    }

    const onPrintInvoice = (invoiceId: any) => {
        setInvoiceIdForPrint(invoiceId);
    }

    const onAfterPrint = () => {
        setInvoiceIdForPrint(undefined);
    }

    function getSalesInvoices(): void {
        setIsLoading(true);
        let query = filterValues?.map(field => `${encodeURIComponent(field.inputName)}=${encodeURIComponent(field.defaultValue)}`)
            .join('&');
        query += query ? `&page=${page}` : `page=${page}`;
        getSalesInvoicesByFilter(query)
            .then(({ data: { invoices, total } }) => {
                setTotalRecords(total);
                setSaleInvoices(invoices);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    return (
        <>
            <AdminLayout>
                <AdminPageHeader
                    title='Sale Invoices'
                    pageDescription='Sale Invoices'
                    addNewClickType={'link'}
                    newLink='/sale-invoice/create'
                    additionalInfo={{ showAddNewButton: true }}
                />
                <Content>
                    <KTCard>
                        <CommonListSearchHeader
                            searchFields={searchFields}
                            onSearch={onSearch}
                            onSearchReset={onSearchReset}
                        />
                        <KTCardBody>
                            {
                                isLoading ?
                                    <TableListLoading /> :
                                    <div className='table-responsive'>
                                        <table
                                            id='sales-invoices-table'
                                            className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'>
                                            <thead>
                                                <tr className='text-start text-muted fw-bolder fs-7 gs-0 bg-light'>
                                                    <th className="min-w-125px ps-3 rounded-start">Date</th>
                                                    <th className="min-w-125px">Sale Invoice No</th>
                                                    <th className="min-w-125px">Dispatch No</th>
                                                    <th className="min-w-125px">Company Name</th>
                                                    <th className="min-w-125px ps-3 rounded-end">Total</th>
                                                    <th className="min-w-50px"></th>
                                                </tr>
                                            </thead>
                                            <tbody className='text-gray-600 fw-bold'>
                                                {
                                                    saleInvoices && saleInvoices.length ?
                                                        saleInvoices.map((invoice: any, index: number) => {
                                                            return (
                                                                <tr id={invoice?.id} key={'sale-invoice-' + index}>
                                                                    <td className="ps-3">{getDateCommonFormatFromJsonDate(invoice?.date)}</td>
                                                                    <td>{invoice?.saleInvoiceNo}</td>
                                                                    <td>{invoice?.dispatchNo}</td>
                                                                    <td>{invoice?.companyName}</td>
                                                                    <td>{formatNumber(invoice?.total, 2)}</td>
                                                                    <td>
                                                                        <button type='button' className='btn btn-sm btn-light-secondary'
                                                                            onClick={() => onPrintInvoice(invoice?.id)}>
                                                                            <FontAwesomeIcon icon={faPrint} className='fa-solid' />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }) :
                                                        <tr>
                                                            <td colSpan={5}>
                                                                <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                                                                    No records found
                                                                </div>
                                                            </td>
                                                        </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                            }
                            {
                                saleInvoices && saleInvoices.length ?
                                    <CommonListPagination
                                        pageNo={page}
                                        pageSize={10}
                                        totalRecords={totalRecords}
                                        goToPage={onGotoPage}
                                    />
                                    :
                                    <> </>
                            }
                        </KTCardBody>
                    </KTCard>
                </Content>
            </AdminLayout>
            {
                invoiceIdForPrint &&
                <SaleInvoiceReceipt
                    afterPrint={onAfterPrint}
                    invoiceId={invoiceIdForPrint} />
            }
        </>
    );
}