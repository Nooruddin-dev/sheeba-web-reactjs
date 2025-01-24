import { useEffect, useState } from 'react'
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody } from '../../../../_sitecommon/helpers';
import CommonListSearchHeader from '../../common/components/layout/CommonListSearchHeader';
import CommonListPagination from '../../common/components/layout/CommonListPagination';
import TableListLoading from '../../common/components/shared/TableListLoading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { InventoryApi } from '../../../../_sitecommon/common/api/inventory.api';
import { toast } from 'react-toastify';
import { GetFormattedDate, GetFormattedTime, GetProductTypeName, GetStatus, GetUnitShortName } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';


export default function ProductsListPage() {
    const searchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'sku', inputName: 'sku', labelName: 'SKU', placeHolder: 'SKU', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'name', inputName: 'name', labelName: 'Name', placeHolder: 'Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
    ];

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filterValues, setFilterValues] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(25);
    const [totalRecords, setTotalRecords] = useState<number>(0);


    useEffect(() => {
        getUnits();
        getProducts();
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
        console.log(page);
        setPage(page);
    }

    function getProducts(): void {
        setIsLoading(true);
        let filter = {
            page: (page - 1) * pageSize,
            pageSize,
        }
        filterValues.forEach(field => {
            filter = {
                ...filter,
                [field.inputName]: field.defaultValue
            }
        });
        InventoryApi.get(filter)
            .then(({ data: { data, totalRecords } }) => {
                setTotalRecords(totalRecords);
                setProducts(data);
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
                title='Product List'
                pageDescription='List of internal and external products'
                addNewClickType={'link'}
                newLink='/site/products/create'
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
                                                <th className="min-w-125px ps-3 rounded-start">SKU</th>
                                                <th className="min-w-175px">Name</th>
                                                <th className="min-w-125px">Source</th>
                                                <th className="min-w-125px">Type</th>
                                                <th className="min-w-125px">Quantity</th>
                                                <th className="min-w-125px">Weight</th>
                                                <th className="min-w-125px">Created On</th>
                                                <th className="min-w-125px">Status</th>
                                                <th className="min-w-125px ps-3 rounded-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className='text-gray-600 fw-bold'>
                                            {
                                                products && products.length ?
                                                    products.map((product: any, index: number) => {
                                                        return (
                                                            <tr id={product?.id} key={'product-' + index}>
                                                                <td className="ps-3">{product.sku}</td>
                                                                <td>{product.name}</td>
                                                                <td>{product.source}</td>
                                                                <td>{GetProductTypeName(product.type)}</td>
                                                                <td>{product.quantity}</td>
                                                                <td>{product.weight} {GetUnitShortName(units, product.weightUnitId)}</td>
                                                                <td>
                                                                    <div>{GetFormattedDate(product.createdOn)}</div>
                                                                    <div>{GetFormattedTime(product.createdOn)}</div>
                                                                </td>
                                                                <td>
                                                                    <div className={product.status ? 'badge fw-bolder badge-light-success' : 'badge fw-bolder badge-light-danger'}>
                                                                        {GetStatus(product.status)}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <button type='button' className='btn btn-sm'>
                                                                        <Link to={"/site/products/" + product.id}>
                                                                            <FontAwesomeIcon icon={faEdit} className='fa-solid' />
                                                                        </Link>
                                                                    </button>
                                                                    <button type='button' className='btn btn-sm'>
                                                                        <FontAwesomeIcon icon={faTrashAlt} className='fa-solid' />
                                                                    </button>
                                                                </td>
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
                        {
                            products && products.length ?
                                <CommonListPagination
                                    pageNo={page}
                                    pageSize={pageSize}
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
    );
}
