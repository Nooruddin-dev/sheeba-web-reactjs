import { useEffect, useState } from 'react'
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody } from '../../../../_sitecommon/helpers';
import CommonListSearchHeader from '../../common/components/layout/CommonListSearchHeader';
import CommonListPagination from '../../common/components/layout/CommonListPagination';
import TableListLoading from '../../common/components/shared/TableListLoading';
import { InventoryApi } from '../../../../_sitecommon/common/api/inventory.api';
import { toast } from 'react-toastify';
import { ProductSourceEnum, ProductTypeEnum } from '../../../../_sitecommon/common/enums/GlobalEnums';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { ReportApi } from '../../../../_sitecommon/common/api/report.api';
import { GetProductTypeName, GetUnitShortName } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';


export default function StockReportPage() {
    const searchFields: HtmlSearchFieldConfig[] = [
        {
            inputId: 'source', inputName: 'source', labelName: 'Source', placeHolder: 'Source', type: 'dropdown', defaultValue: '',
            options: [{ text: 'Select Source', value: '' }, { text: 'Purchase Order', value: ProductSourceEnum.PurchaseOrder }, { text: 'Recycle', value: ProductSourceEnum.Recycle }, { text: 'Job Card', value: ProductSourceEnum.JobCard }],
        },
        {
            inputId: 'type', inputName: 'type', labelName: 'Type', placeHolder: 'Type', type: 'dropdown', defaultValue: '',
            options: [{ text: 'Select Type', value: '' }, { text: 'Roll', value: ProductTypeEnum.Roll }, { text: 'Granule', value: ProductTypeEnum.Granule }, { text: 'Solvent', value: ProductTypeEnum.Solvent }],
        }
    ];

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filterValues, setFilterValues] = useState<any[]>([]);
    const [report, setReport] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);

    useEffect(() => {
        getUnits();
    }, [])

    useEffect(() => {
        getReport();
    }, [filterValues])

    const onSearch = () => {
        // do nothing, filter change will trigger useEffect
    }

    const onPrint = () => {
        alert('Print');
    }

    const onSearchReset = () => {
        setFilterValues([]);
    }

    function getReport(): void {
        setIsLoading(true);
        let filter = {}
        filterValues.forEach(field => {
            filter = {
                ...filter,
                [field.inputName]: field.defaultValue
            }
        });
        ReportApi.stock(filter)
            .then(({ data }) => {
                setReport(data);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    function getUnits(): void {
        InventoryApi.getUnits()
            .then((response) => {
                setUnits(response.data.data);
            })
            .catch((response) => { toast.error(response.data.message) })
    }

    return (
        <AdminLayout>
            <AdminPageHeader
                title='Stock Report'
                pageDescription='Stock report about quantity and weight'
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
                            isLoading ?
                                <TableListLoading /> :
                                <div className='table-responsive'>
                                    <table
                                        id='sales-invoices-table'
                                        className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'>
                                        <thead>
                                            <tr className='text-start text-muted fw-bolder fs-7 gs-0 bg-light'>
                                                <th className="min-w-125px ps-3 rounded-start">SKU</th>
                                                <th className="min-w-125px">Name</th>
                                                <th className="min-w-125px">Type</th>
                                                <th className="min-w-125px">Quantity</th>
                                                <th className="min-w-125px ps-3 rounded-end">Weight</th>
                                            </tr>
                                        </thead>
                                        <tbody className='text-gray-600 fw-bold'>
                                            {
                                                report && report.length ?
                                                    report.map((product: any, index: number) => {
                                                        return (
                                                            <tr id={product?.id} key={'product-' + index}>
                                                                <td className="ps-3">{product.sku}</td>
                                                                <td>
                                                                    <div>
                                                                        {product.name}
                                                                        {
                                                                            product.type.toString() === ProductTypeEnum.Roll &&
                                                                            <span>W: {product.width}, L: {product.width}, M: {product.micron}</span>
                                                                        }
                                                                    </div>

                                                                </td>
                                                                <td>{GetProductTypeName(product.type)}</td>
                                                                <td>{product.quantity}</td>
                                                                <td>{product.weight} {GetUnitShortName(units, product.weightUnitId)}</td>
                                                            </tr>
                                                        )
                                                    }) :
                                                    <tr>
                                                        <td colSpan={9}>
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
                    </KTCardBody>
                </KTCard>
            </Content>
        </AdminLayout>
    );
}
