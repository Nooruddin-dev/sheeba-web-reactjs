
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

  //--Machines APIs urls
  GET_MACHINES_TYPES: `/${controllerUrlExtensions.MACHINES}/get-machines-types`,
  INSERT_UPDATE_MACHINE: `/${controllerUrlExtensions.MACHINES}/insert-update-machine`,
  GET_ALL_MACHINES: `/${controllerUrlExtensions.MACHINES}/get_all_machines`,


}

export const APP_BASIC_CONSTANTS = {
  ITEMS_PER_PAGE: 10,
  DefaultCurrencyCode: 'USD',
  DefaultCurrencySymbol: '$'
}

