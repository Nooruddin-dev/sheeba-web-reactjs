
const VERSION = "1";
export const API_BASE_URL = 'http://localhost:3009'; //--Live: http://noornashad-001-site5.etempurl.com, Local: https://localhost:7044
export const API_URL = `${API_BASE_URL}/api/v${VERSION}`;
export const APP_BASE_URL = "http://localhost:3001/"; //--Live: http://noornashad-001-site1.etempurl.com/, Local: http://localhost:3000/

export const pageShowTimeDuration = 500;


export const controllerUrlExtensions = {
  COMMON: 'common',
  USERS: 'users',
  SETTING: 'setting',
  INVENTORY: 'inventory',
  MACHINES: 'machines',
  ORDERS: 'orders',


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



}

export const APP_BASIC_CONSTANTS = {
  ITEMS_PER_PAGE: 10,
  DefaultCurrencyCode: 'PKR',
  DefaultCurrencySymbol: 'RS'
}

