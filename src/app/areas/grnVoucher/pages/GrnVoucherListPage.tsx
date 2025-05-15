import React, { useEffect, useState } from 'react'
import AdminLayout from '../../common/components/layout/AdminLayout'
import AdminPageHeader from '../../common/components/layout/AdminPageHeader'
import { Content } from '../../../../_sitecommon/layout/components/content'
import { KTCard, KTCardBody, KTIcon } from '../../../../_sitecommon/helpers'
import CommonListSearchHeader from '../../common/components/layout/CommonListSearchHeader'
import CommonListPagination from '../../common/components/layout/CommonListPagination'
import TableListLoading from '../../common/components/shared/TableListLoading'
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig'
import { formatNumber } from '../../common/util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import ConfirmationModal from '../../common/components/layout/ConfirmationModal'
import { GetFormattedDate } from '../../../../_sitecommon/common/helpers/global/ConversionHelper'
import { GrnVoucherStatus } from '../../../../_sitecommon/common/enums/GlobalEnums'
import { VoucherApi } from '../../../../_sitecommon/common/api/voucher.api'
import { showErrorMsg, showSuccessMsg } from '../../../../_sitecommon/common/helpers/global/ValidationHelper'
import { Link } from 'react-router-dom'

export default function GrnVoucherListPage() {

  const searchFields: HtmlSearchFieldConfig[] = [
    { inputId: 'voucherNumber', inputName: 'voucherNumber', labelName: 'Voucher Number', placeHolder: 'Voucher Number', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
    { inputId: 'poNumber', inputName: 'poNumber', labelName: 'PO Number', placeHolder: 'PO Number', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
    { inputId: 'receiverName', inputName: 'receiverName', labelName: 'Receiver Name', placeHolder: 'Receiver Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
  ];

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterValues, setFilterValues] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(25);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isCancelConfirmationModalOpen, setIsCancelConfirmationModalOpen] = useState(false);
  const [voucherForCancel, setVoucherForCancel] = useState<any | null>(null);


  useEffect(() => {
    getVouchers();
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

  const onCancelVoucher = (voucher: any) => {
    setVoucherForCancel(voucher);
    setIsCancelConfirmationModalOpen(true);
  };

  const onCancelVoucherConfirm = (data: any) => {
    if (voucherForCancel) {
      VoucherApi.cancel(voucherForCancel.voucherId)
        .then(() => {
          showSuccessMsg('Voucher cancelled successfully');
          getVouchers();
        })
        .catch((error) => {
          showErrorMsg(error);
        });
    }
    setIsCancelConfirmationModalOpen(false);
    setVoucherForCancel(null);
  }

  function getVouchers(): void {
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
    VoucherApi.get(filter)
      .then(({ data: { data, totalRecords } }) => {
        setTotalRecords(totalRecords);
        setVouchers(data);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title='GRN Vouchers'
        pageDescription='List of GRN vouchers'
        addNewClickType={'link'}
        newLink='/grn-vouchers'
        additionalInfo={{ showAddNewButton: false }}
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
                        <th className="min-w-125px ps-3 rounded-start">Voucher No</th>
                        <th className="min-w-125px">PO No</th>
                        <th className="min-w-125px">Date</th>
                        <th className="min-w-125px">Receiver</th>
                        <th className="min-w-125px">Total</th>
                        <th className="min-w-125px">Status</th>
                        <th className="min-w-125px ps-3 rounded-end">Action</th>
                      </tr>
                    </thead>
                    <tbody className='text-gray-600 fw-bold'>
                      {
                        vouchers && vouchers.length ?
                          vouchers.map((voucher: any, index: number) => {
                            return (
                              <tr id={voucher?.id} key={'voucher-' + index}>
                                <td className="ps-3">{voucher.voucherNumber}</td>
                                <td>{voucher.poNumber}</td>
                                <td>{GetFormattedDate(voucher.createdOn)}</td>
                                <td>
                                  <div>{voucher.receiverName}</div>
                                  <div>{voucher.receiverContact}</div>
                                </td>
                                <td>{formatNumber(voucher.total, 2)}</td>
                                <td>
                                  <div className={voucher.status === GrnVoucherStatus.Issued ? 'badge fw-bolder badge-light-success' : 'badge fw-bolder badge-light-danger'}>
                                    {voucher.status}
                                  </div>
                                </td>
                                <td>
                                  <Link
                                    to={`/site/grn-voucher-detail/${voucher.voucherId}`}
                                    className='btn btn-bg-light btn-color-muted btn-active-color-primary btn-sm px-4 me-2'>
                                    <FontAwesomeIcon icon={faEye} className='fa-solid' />
                                  </Link>
                                  <button type='button' className='btn btn-sm'>
                                  </button>
                                  <button type='button' className='btn btn-sm btn-secondary' onClick={() => onCancelVoucher(voucher)}>
                                    <FontAwesomeIcon icon={faTimesCircle} className='fa-solid' />
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
              vouchers && vouchers.length ?
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
        {
          isCancelConfirmationModalOpen &&
          <ConfirmationModal
            title='Cancel Voucher'
            description={`Are you sure you want to cancel voucher # ${voucherForCancel?.voucherNumber}?`}
            confirmLabel='Yes, Cancel'
            cancelLabel='No, Keep'
            isOpen={isCancelConfirmationModalOpen}
            closeModal={() => setIsCancelConfirmationModalOpen(false)}
            onConfirm={onCancelVoucherConfirm}
          />
        }
      </Content>
    </AdminLayout >
  );
}
