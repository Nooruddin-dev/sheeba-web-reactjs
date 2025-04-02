
const VERSION = "1";
export const API_BASE_URL = 'https://demo-api.sheebapolybag.com'; /** Live: 'https://api.sheebapolybag.com'; Local: http://localhost:3009 */
export const API_URL = `${API_BASE_URL}/api/v${VERSION}`;
export const APP_BASE_URL = 'https://demo.sheebapolybag.com/'; /** Live: 'https://sheebapolybag.com/'; Local: "http://localhost:3000/"; */

export const pageShowTimeDuration = 500;


export const controllerUrlExtensions = {
  COMMON: 'common',
  USERS: 'users',
  SETTING: 'setting',
  INVENTORY: 'inventory',
  MACHINES: 'machines',
  ORDERS: 'orders',
  VOUCHER: 'voucher',
  JOB_CARD: 'jobcard',
  SALE_INVOICE: 'sale-invoices',
}

export const API_ENDPOINTS = {
  //--Common Controller APIs url



  //--Users APIs urls
  USER_LOGIN: `/${controllerUrlExtensions.USERS}/get_login_user`,
  GET_ALL_BUSINESS_PARTNERS: `/${controllerUrlExtensions.USERS}/get-all-business-partners`,
  INSERT_UPDATE_BUSINESS_PARTNER: `/${controllerUrlExtensions.USERS}/insert-update-business-partner`,
  GET_BUSINESS_PARTNERS_TYPES: `/${controllerUrlExtensions.USERS}/get-business-partner-types`,
  DELETE_ANY_RECORD: `/${controllerUrlExtensions.USERS}/delete-any-record`,

  //--Inventory APIs urls
  INSERT_UPDATE_PRODUCTS: `/${controllerUrlExtensions.INVENTORY}/insert-update-product`,
  GET_ALL_PRODUCTS: `/${controllerUrlExtensions.INVENTORY}/get_all_products`,
  GET_PRODUCTS_LIST_BY_SEARCH_TERM: `/${controllerUrlExtensions.INVENTORY}/get-products-list-by-search-term`,
  GET_PRODUCT_DETAIL_BY_ID: `/${controllerUrlExtensions.INVENTORY}/get-product-detail-by-id`,
  GET_TAX_RULES: `/${controllerUrlExtensions.INVENTORY}/get_tax_rules`,
  GET_UNITS_LIST: `/${controllerUrlExtensions.INVENTORY}/get-units-list`,

  //--Machines APIs urls
  GET_MACHINES_TYPES: `/${controllerUrlExtensions.MACHINES}/get-machines-types`,
  INSERT_UPDATE_MACHINE: `/${controllerUrlExtensions.MACHINES}/insert-update-machine`,
  GET_ALL_MACHINES: `/${controllerUrlExtensions.MACHINES}/get_all_machines`,

  //--Orders APIs urls
  CREATE_PURCHASER_ORDER: `/${controllerUrlExtensions.ORDERS}/create-purchase-order`,
  GET_ALL_PURCHASE_ORDERS: `/${controllerUrlExtensions.ORDERS}/get-all-purchase-orders`,
  GET_PURCHASE_ORDER_DETAILS_BY_ID: `/${controllerUrlExtensions.ORDERS}/get-purchase-order-details`,
  GET_PURCHASE_ORDER_DETAILS_FOR_EDIT_CLONE_BY_ID: `/${controllerUrlExtensions.ORDERS}/get-purchase-order-details-for-edit-clone`,
  UPDATE_PURCHASE_ORDER_STATUS: `/${controllerUrlExtensions.ORDERS}/update-purchase-order-status`,

  //--Voucher APIs urls
  GET_PURCHASE_ORDER_DETAIL_FOR_GRN_VOUCHER: `/${controllerUrlExtensions.VOUCHER}/get_purchase_order_detail_for_grn_voucher`,
  GET_PURCHASE_ORDER_LIST_FOR_GRN_VOUCHER_BY_SEARCH_TERM: `/${controllerUrlExtensions.VOUCHER}/get-purchase-order-list-for-grn-voucher-by-search-term`,
  CREATE_GRN_VOUCHER_API: `/${controllerUrlExtensions.VOUCHER}/create-grn-voucher`,
  GET_GRN_VOUCHERS_LIST_API: `/${controllerUrlExtensions.VOUCHER}/get-grn-vouchers-list`,
  GET_GRN_VOUCHER_DETAIL_BY_ID_API: `/${controllerUrlExtensions.VOUCHER}/get-grn-voucher-detail-by-id`,

  //--Job Card APIs urls
  GET_PRODUCTS_LIST_FOR_JOB_CARD_BY_SEARCH_TERM: `/${controllerUrlExtensions.JOB_CARD}/get-products-list-for-job-card-by-search-term`,
  CREATE_JOB_CARD: `/${controllerUrlExtensions.JOB_CARD}/create-job-card`,
  GET_ALL_JOB_CARDS_LIST: `/${controllerUrlExtensions.JOB_CARD}/get-job-card-list`,
  GET_JOB_CARD_DETAIL_BY_ID_FOR_EDIT: `/${controllerUrlExtensions.JOB_CARD}/get-job-card-detail-by-id-for-edit`,
  GET_JOB_CARD_PRODUCTION_ENTRIES: `/${controllerUrlExtensions.JOB_CARD}/get-job-production-entries`,
  GET_JOB_CARDS_BY_SEARCH_TERM_FOR_PRODUCTION_ENTRY: `/${controllerUrlExtensions.JOB_CARD}/get-job-cards-by-search-term-for-production-entry`,
  INSERT_UPDATE_PRODUCTION_ENTRY: `/${controllerUrlExtensions.JOB_CARD}/insert-update-production-entry`,
  INSERT_CARD_DISPATCH_INFO: `/${controllerUrlExtensions.JOB_CARD}/insert-card-dispatch-info`,
  GET_JOB_DISPATCH_REPORT_DATA: `/${controllerUrlExtensions.JOB_CARD}/get-job-dispatch-report-data`,
  GET_JOB_DISPATCH_REPORT_DATA_BY_ID: `/${controllerUrlExtensions.JOB_CARD}/get-job-dispatch-report-data-by-id`,
  GET_MACHINE_BASED_REPORT_DATA: `/${controllerUrlExtensions.JOB_CARD}/get-machine-based-report-api`,
  GET_ALL_PRODUCTS_FOR_PRODUCTION: `/${controllerUrlExtensions.JOB_CARD}/get-all-products-for-production-entry`,
  GET_DISPATCH_AUTO_COMPLETE: `/${controllerUrlExtensions.JOB_CARD}/dispatch-auto-complete`,
  GET_USER_AUTO_COMPLETE: `/${controllerUrlExtensions.USERS}/auto-complete`,

    //--Machines APIs urls
    GET_SALE_INVOICES: `/${controllerUrlExtensions.SALE_INVOICE}`,
    GET_SALE_INVOICE_BY_ID: `/${controllerUrlExtensions.SALE_INVOICE}`,
    CREATE_SALE_INVOICE: `/${controllerUrlExtensions.SALE_INVOICE}`,

}

export const APP_BASIC_CONSTANTS = {
  ITEMS_PER_PAGE: 10,
  DefaultCurrencyCode: 'PKR',
  DefaultCurrencySymbol: 'RS'
}

