
const VERSION = "1";
export const API_BASE_URL = 'http://localhost:3009'; //--Live: http://noornashad-001-site5.etempurl.com, Local: https://localhost:7044
export const API_URL = `${API_BASE_URL}/api/v${VERSION}`;
export const APP_BASE_URL = "http://localhost:3000/"; //--Live: http://noornashad-001-site1.etempurl.com/, Local: http://localhost:3000/

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


}

export const API_ENDPOINTS = {
  //--Common Controller APIs url
  DELETE_ANY_RECORD: `/${controllerUrlExtensions.COMMON}/delete-record`,


  //--Users APIs urls
  USER_LOGIN: `/${controllerUrlExtensions.USERS}/get_login_user`,
  GET_ALL_BUSINESS_PARTNERS: `/${controllerUrlExtensions.USERS}/get-all-business-partners`,
  INSERT_UPDATE_BUSINESS_PARTNER: `/${controllerUrlExtensions.USERS}/insert-update-business-partner`,
  GET_BUSINESS_PARTNERS_TYPES: `/${controllerUrlExtensions.USERS}/get-business-partner-types`,

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


}

export const APP_BASIC_CONSTANTS = {
  ITEMS_PER_PAGE: 10,
  DefaultCurrencyCode: 'PKR',
  DefaultCurrencySymbol: 'RS'
}

