import { useEffect, useState } from 'react'
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig';
import AdminLayout from '../../common/components/layout/AdminLayout';
import AdminPageHeader from '../../common/components/layout/AdminPageHeader';
import { Content } from '../../../../_sitecommon/layout/components/content';
import { KTCard, KTCardBody } from '../../../../_sitecommon/helpers';
import CommonListSearchHeader from '../../common/components/layout/CommonListSearchHeader';
import CommonListPagination from '../../common/components/layout/CommonListPagination';
import TableListLoading from '../../common/components/shared/TableListLoading';
import { GetFormattedDate, GetFormattedTime } from '../../../../_sitecommon/common/helpers/global/ConversionHelper';
import { ProductionEntryApi } from '../../../../_sitecommon/common/api/production-entry.api';
import { showErrorMsg, showSuccessMsg } from '../../../../_sitecommon/common/helpers/global/ValidationHelper';
import { formatNumber } from '../../common/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../common/components/layout/ConfirmationModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../globalStore/rootReducer';
import { UserRole } from '../../../../_sitecommon/common/enums/GlobalEnums';


export default function ProductionEntriesPage() {
    const searchFields: HtmlSearchFieldConfig[] = [
        { inputId: 'job-card-no', inputName: 'jobCardNo', labelName: 'Job Card No', placeHolder: 'Job Card No', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'machine-name', inputName: 'machineName', labelName: 'Machine Name', placeHolder: 'Machine Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
        { inputId: 'product-name-sku', inputName: 'productName', labelName: 'Product Name or SKU', placeHolder: 'Product Name or SKU', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
    ];

    const { role_type: roleType } = useSelector((state: RootState) => state.userData.userData);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filterValues, setFilterValues] = useState<any[]>([]);
    const [entries, setEntries] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(25);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false);
    const [deleteEntryId, setDeleteEntryId] = useState<number | null>(null);

    useEffect(() => {
        getEntries();
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

    const onCancel = (id: number) => {
        setDeleteEntryId(id);
        setIsConfirmDeleteOpen(true);
    }

    const onCancelConfirm = () => {
        if (deleteEntryId && !isLoading) {
            setIsLoading(true);
            ProductionEntryApi.cancel(deleteEntryId)
                .then((response) => {
                    showSuccessMsg(response.data.message);
                    setIsConfirmDeleteOpen(false);
                    getEntries();
                })
                .catch((error) => showErrorMsg(error.response.data.message))
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }

    function getEntries(): void {
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
        ProductionEntryApi.get(filter)
            .then(({ data: { data, totalRecords } }) => {
                setTotalRecords(totalRecords);
                setEntries(data);
            })
            .catch((error) => showErrorMsg(error.response.data.message))
            .finally(() => {
                setIsLoading(false);
            })
    }

    return (
        <AdminLayout>
            <AdminPageHeader
                title='Production Entries'
                pageDescription='List of production entry'
                addNewClickType={'link'}
                newLink='/job-management/production-entries/create'
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
                                                <th className="min-w-125px ps-3 rounded-start">Job Card No</th>
                                                <th className="min-w-125px">Entry Date</th>
                                                <th className="min-w-125px">Machine</th>
                                                <th className="min-w-200px">Material</th>
                                                <th className="min-w-125px">Quantity</th>
                                                <th className="min-w-125px">Gross</th>
                                                <th className="min-w-125px">Waste</th>
                                                <th className="min-w-125px">Tare</th>
                                                {
                                                    roleType === UserRole.Admin ?
                                                        <>
                                                            <th className="min-w-125pxd">Net</th>
                                                            <th className="min-w-125px ps-3 rounded-end">Action</th>
                                                        </>
                                                        :
                                                        <th className="min-w-125px rounded-end">Net</th>
                                                }
                                            </tr>
                                        </thead>
                                        <tbody className='text-gray-600 fw-bold'>
                                            {
                                                entries && entries.length ?
                                                    entries.map((entry: any, index: number) => {
                                                        return (
                                                            <tr id={entry?.id} key={'product-' + index}>
                                                                <td className="ps-3">{entry.jobCardNo}</td>
                                                                <td>
                                                                    <div>{GetFormattedDate(entry.date)}</div>
                                                                    <div>{GetFormattedTime(entry.date)}</div>
                                                                </td>
                                                                <td>{entry.machineName}</td>
                                                                <td>
                                                                    <div>{entry.productName}</div>
                                                                    <div>SKU: {entry.productSku}</div>
                                                                </td>
                                                                <td>{formatNumber(entry.quantity, 2)}</td>
                                                                <td>{formatNumber(entry.grossWeight, 2)}</td>
                                                                <td>{formatNumber(entry.wasteWeight, 2)}</td>
                                                                <td>{formatNumber(entry.tareWeight, 2)}</td>
                                                                <td>{formatNumber(entry.netWeight, 2)}</td>
                                                                {
                                                                    roleType === UserRole.Admin && entry.cancelled === 0 && (
                                                                        <td>
                                                                            <button type='button'
                                                                                className='btn btn-sm btn-secondary'
                                                                                onClick={() => onCancel(entry.id)}>
                                                                                <FontAwesomeIcon icon={faTimesCircle} className='fa-solid' />
                                                                            </button>
                                                                        </td>
                                                                    )
                                                                }
                                                                {
                                                                    entry.cancelled === 1 &&
                                                                    <td>
                                                                        <div className='badge fw-bolder badge-light-danger'>
                                                                            Cancelled
                                                                        </div>
                                                                    </td>
                                                                }
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
                            entries && entries.length ?
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
            {
                isConfirmDeleteOpen && (
                    <ConfirmationModal
                        title='Cancel Production Entry'
                        description='Are you sure you want to cancel this production entry?'
                        confirmLabel='Yes, Cancel'
                        cancelLabel='No, Keep It'
                        isOpen={isConfirmDeleteOpen}
                        closeModal={() => setIsConfirmDeleteOpen(false)}
                        onConfirm={onCancelConfirm}
                    />
                )
            }
        </AdminLayout>
    );
}
