
import { API_ENDPOINTS } from "../../constants/Config";
import apiRequest from "./axiosHelper";


export const deletAnyRecordApi = (deleteParam: any) => {
    return apiRequest.delete(
        `${API_ENDPOINTS.DELETE_ANY_RECORD}/${deleteParam?.entityName}/${deleteParam?.entityColumnName}/${deleteParam?.entityRowId}/${deleteParam?.sqlDeleteTypeId}`
    );
}

export const getUserLoginApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.USER_LOGIN, body);
};

export const getAllUsersApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_ALL_BUSINESS_PARTNERS}?${queryUrl}`
    );
}

export const inserUpdateBusinessPartnerApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_BUSINESS_PARTNER, body);
};


export const getBusinessPartnerTypesListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_BUSINESS_PARTNERS_TYPES}?${queryUrl}`
    );
}

export const insertUpdateProductApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_PRODUCTS, body);
};

export const getAllProductsListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_ALL_PRODUCTS}?${queryUrl}`
    );
}

export const getMachineTypesListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_MACHINES_TYPES}?${queryUrl}`
    );
}


export const insertUpdateMachineApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_MACHINE, body);
};

export const getAllMachinesListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_ALL_MACHINES}?${queryUrl}`
    );
}

export const gerProductsListBySearchTermApi = (searchQueryProduct: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_PRODUCTS_LIST_BY_SEARCH_TERM}/${searchQueryProduct}`
    );
}

export const getProductDetailById = (productId: number) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_PRODUCT_DETAIL_BY_ID}/${productId}`
    );
}


export const getAllTaxRulesApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_TAX_RULES}?${queryUrl}`
    );
}

export const createPurchaseOrderApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.CREATE_PURCHASER_ORDER, body);
};

export const getAllPurchaseOrdersListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_ALL_PURCHASE_ORDERS}?${queryUrl}`
    );
}



export const getPurchaseOrderDetailsByIdApi = (purchase_order_id: any) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_PURCHASE_ORDER_DETAILS_BY_ID}/${purchase_order_id}`
    );
}


export const getUnitsListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_UNITS_LIST}?${queryUrl}`
    );
}


export const getPurchaseOrderDetailsForGrnVoucherApi = (purchase_order_id: number) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_PURCHASE_ORDER_DETAIL_FOR_GRN_VOUCHER}/${purchase_order_id}`
    );
}


export const gerPurchaseOrdersListForGrnVoucherBySearchTermApi = (searchQueryOrder: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_PURCHASE_ORDER_LIST_FOR_GRN_VOUCHER_BY_SEARCH_TERM}/${searchQueryOrder}`
    );
}
