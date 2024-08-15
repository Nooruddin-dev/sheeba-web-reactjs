import React, { useEffect, useState } from 'react'
import AdminLayout from '../../common/components/layout/AdminLayout'
import AdminPageHeader from '../../common/components/layout/AdminPageHeader'
import { Content } from '../../../../_sitecommon/layout/components/content'
import { KTCard, KTCardBody, KTIcon } from '../../../../_sitecommon/helpers'
import CommonListSearchHeader from '../../common/components/layout/CommonListSearchHeader'
import CommonListPagination from '../../common/components/layout/CommonListPagination'
import TableListLoading from '../../common/components/shared/TableListLoading'
import { APP_BASIC_CONSTANTS } from '../../../../_sitecommon/common/constants/Config'
import { HtmlSearchFieldConfig } from '../../../models/common/HtmlSearchFieldConfig'
import { buildUrlParamsForSearch } from '../../../../_sitecommon/common/helpers/global/GlobalHelper'
import { stringIsNullOrWhiteSpace } from '../../../../_sitecommon/common/helpers/global/ValidationHelper'
import { getDateCommonFormatFromJsonDate } from '../../../../_sitecommon/common/helpers/global/ConversionHelper'
import { Link } from 'react-router-dom'
import { getGrnVouchersListApi } from '../../../../_sitecommon/common/helpers/api_helpers/ApiCalls'

export default function GrnVoucherListPage() {
  const isLoading = false;
  const [allMachineTypes, setAllMachineTypes] = useState<any>([]);

  // ✅-- Starts: necessary varaibles for the page
  const [isOpenAddNewForm, setIsOpenAddNewForm] = useState<boolean>(false);
  const [listRefreshCounter, setListRefreshCounter] = useState<number>(0);
  const [pageBasicInfo, setPageBasicInfo] = useState<any>(
    {
      pageNo: 1,
      pageSize: APP_BASIC_CONSTANTS.ITEMS_PER_PAGE,
      totalRecords: 0
    }
  );

  const [searchFormQueryParams, setSearchFormQueryParams] = useState<string>('');
  const [allGrnVouchersList, setAllGrnVouchersList] = useState<any>([]);
  const [searchFieldValues, setSearchFieldValues] = useState<{ [key: string]: string }>({});

  const HtmlSearchFields: HtmlSearchFieldConfig[] = [
    { inputId: 'voucher_numberSearch', inputName: 'voucher_numberSearch', labelName: 'Voucher Number', placeHolder: 'Voucher Number', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
    { inputId: 'po_numberSearch', inputName: 'po_numberSearch', labelName: 'PO Number', placeHolder: 'PO Number', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },
    { inputId: 'receiver_nameSearch', inputName: 'receiver_nameSearch', labelName: 'Receiver Name', placeHolder: 'Receiver Name', type: 'text', defaultValue: '', iconClass: 'fa fa-search' },

  ];
  const [userEditForm, setUserEditForm] = useState<any>(null); // Data of the user being edited
  // ✅-- Ends: necessary varaibles for the page


  const handleSearchForm = (updatedSearchFields: HtmlSearchFieldConfig) => {
    const queryUrl = buildUrlParamsForSearch(updatedSearchFields);
    setSearchFormQueryParams(queryUrl);

    //--reset pageNo to 1
    setPageBasicInfo((prevPageBasicInfo: any) => ({
      ...prevPageBasicInfo,
      pageNo: 1 // Update only the pageNo property
    }));

    setTimeout(() => {
      setListRefreshCounter(prevCounter => prevCounter + 1);
    }, 300);

  }

  const handleSearchFormReset = (e: Event) => {
    if (e) {
      e.preventDefault();
    }
    //--reset pageNo to 1
    setPageBasicInfo((prevPageBasicInfo: any) => ({
      ...prevPageBasicInfo,
      pageNo: 1 // Update only the pageNo property
    }));

    setSearchFormQueryParams('');
    setListRefreshCounter(prevCounter => prevCounter + 1);
  }





  const handleOpenCloseAddModal = () => {
    setIsOpenAddNewForm(!isOpenAddNewForm);
    setUserEditForm(null);
  }


  const handleGoToPage = (page: number) => {

    //--reset pageNo to param page value
    setPageBasicInfo((prevPageBasicInfo: any) => ({
      ...prevPageBasicInfo,
      pageNo: page // Update only the pageNo property
    }));
    setListRefreshCounter(prevCounter => prevCounter + 1);
  };



  useEffect(() => {
    getGrnVouchersListService();
  }, [listRefreshCounter]);

  const getGrnVouchersListService = () => {

    let pageBasicInfoParams = new URLSearchParams(pageBasicInfo).toString();
    if (!stringIsNullOrWhiteSpace(searchFormQueryParams)) {
      pageBasicInfoParams = `${pageBasicInfoParams}&${searchFormQueryParams}`;
    }

    getGrnVouchersListApi(pageBasicInfoParams)
      .then((res: any) => {

        const { data } = res;
        if (data && data.length > 0) {
          const totalRecords = data[0]?.totalRecords;
          setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            totalRecords: totalRecords
          }));
          setAllGrnVouchersList(res?.data);

        } else {
          setAllGrnVouchersList([]);
          setPageBasicInfo((prevPageBasicInfo: any) => ({
            ...prevPageBasicInfo,
            totalRecords: 0
          }));
        }


      })
      .catch((err: any) => console.log(err, "err"));
  };




  return (
    <AdminLayout>
      <AdminPageHeader
        title='GRN Vouchers'
        pageDescription='GRN Vouchers'
        addNewClickType={'modal'}
        newLink={''}
        onAddNewClick={undefined}
        additionalInfo={{
          showAddNewButton: false
        }
        }
      />

      <Content>
        <KTCard>

          <CommonListSearchHeader
            searchFields={HtmlSearchFields}
            onSearch={handleSearchForm}
            onSearchReset={handleSearchFormReset}
          />
          {/* <UsersTable /> */}
          <KTCardBody className='py-4'>
            <div className='table-responsive'>
              <table
                id='kt_table_users'
                className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'

              >
                <thead>
                  <tr className='text-start text-muted fw-bolder fs-7 gs-0 bg-light'>
                    <th colSpan={1} role="columnheader" className="min-w-125px ps-3 rounded-start" style={{ cursor: 'pointer' }}>Voucher Number</th>
                    <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>PO No</th>
                    <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>GRN Date</th>
                    <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Receiver Name</th>
                    <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Receiver Contact</th>
  
                    <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>Tax Amount Total</th>
                    <th colSpan={1} role="columnheader" className="min-w-125px" style={{ cursor: 'pointer' }}>GRN Amount Total</th>

                    <th colSpan={1} role="columnheader" className="text-end min-w-100px pe-3 rounded-end" style={{ cursor: 'pointer' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className='text-gray-600 fw-bold'>

                  {
                    allGrnVouchersList != undefined && allGrnVouchersList.length > 0
                      ?
                      allGrnVouchersList?.map((record: any, index: number) => (
                        <tr role='row' key={index}>
                          
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="ms-5">

                                <a href="#" className="text-gray-800 text-hover-primary fs-5 fw-bold" data-kt-ecommerce-product-filter="product_name">

                                {record.voucher_number}
                                </a>

                              </div>
                            </div>
                          </td>

                        
                          <td role="cell" className="ps-3">{record.po_number}</td>
                          <td role="cell" className="ps-3"> {getDateCommonFormatFromJsonDate(record.grn_date)}</td>

                        


                          <td role="cell">
                            <div className=''>{record?.receiver_name}</div>
                          </td>
                          <td role="cell">
                            <div className=''>{record?.receiver_contact}</div>
                          </td>




                          <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{record.grn_tax_total}</td>
                          <td className='text-gray-900 fw-bold text-hover-primary fs-6'>{record.grn_toal_amount}</td>




                          <td className='text-end pe-3'>



                            <Link
                              to={`/site/grn-voucher-detail/${record.voucher_id}`}
                              className='btn btn-bg-light btn-color-muted btn-active-color-primary btn-sm px-4 me-2'
                            >
                              <KTIcon iconName='eye' className='fs-3' />

                              View
                            </Link>

                          </td>
                        </tr>

                      ))
                      :
                      <tr>
                        <td colSpan={20}>
                          <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                            No matching records found
                          </div>
                        </td>
                      </tr>

                  }







                </tbody>
              </table>
            </div>
            <CommonListPagination
              pageNo={pageBasicInfo.pageNo}
              pageSize={pageBasicInfo.pageSize}
              totalRecords={pageBasicInfo.totalRecords}
              goToPage={handleGoToPage}
            />
            {isLoading && <TableListLoading />}






          </KTCardBody>
        </KTCard>
      </Content>


    </AdminLayout>
  )
}
