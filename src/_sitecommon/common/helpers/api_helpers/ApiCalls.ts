
import { API_ENDPOINTS } from "../../constants/Config";
import apiRequest from "./axiosHelper";


export const deletAnyRecordApi = (deleteParam: any) => {
    // return apiRequest.delete(
    //     `${API_ENDPOINTS.DELETE_ANY_RECORD}/${deleteParam?.entityName}/${deleteParam?.entityColumnName}/${deleteParam?.entityRowId}/${deleteParam?.sqlDeleteTypeId}`
    // );

    return apiRequest.post(API_ENDPOINTS.DELETE_ANY_RECORD, deleteParam);
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

export const getPurchaseOrderDetailForEditCloneByIdApi = (purchase_order_id: any) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_PURCHASE_ORDER_DETAILS_FOR_EDIT_CLONE_BY_ID}/${purchase_order_id}`
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


export const gerProductsListForJobCardBySearchTermApi = (searchQueryProduct: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_PRODUCTS_LIST_FOR_JOB_CARD_BY_SEARCH_TERM}/${searchQueryProduct}`
    );
}


export const createJobCardApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.CREATE_JOB_CARD, body);
};

export const getAllJobCardsListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_ALL_JOB_CARDS_LIST}?${queryUrl}`
    );
}

export const getAllJobProductionEntriesApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_JOB_CARD_PRODUCTION_ENTRIES}?${queryUrl}`
    );
}


export const createGrnVoucherApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.CREATE_GRN_VOUCHER_API, body);
};

export const getGrnVouchersListApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_GRN_VOUCHERS_LIST_API}?${queryUrl}`
    );
}


export const getGrnVoucherDetailByIdApi = (voucherId: any) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_GRN_VOUCHER_DETAIL_BY_ID_API}/${voucherId}`
    );
}

export const updatePurchaseOrderStatusApi = (body: any) => {

    return apiRequest.post(API_ENDPOINTS.UPDATE_PURCHASE_ORDER_STATUS, body);

};


export const getJobCardDetailByIdForEditApi = (job_card_id: any) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_JOB_CARD_DETAIL_BY_ID_FOR_EDIT}/${job_card_id}`
    );
}

export const gerProductionEntryListBySearchTermApi = (searchQueryProductEntry: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_JOB_CARDS_BY_SEARCH_TERM_FOR_PRODUCTION_ENTRY}/${searchQueryProductEntry}`
    );
}

export const insertUpdateJobProductionEntryApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.INSERT_UPDATE_PRODUCTION_ENTRY, body);
};

export const insertCardDispatchInfoApi = (body: any) => {
    return apiRequest.post(API_ENDPOINTS.INSERT_CARD_DISPATCH_INFO, body);
};


export const getJobDispatchReportDataApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_JOB_DISPATCH_REPORT_DATA}?${queryUrl}`
    );
}

export const getJobDispatchReportDataByIdApi = (card_dispatch_info_id: any) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_JOB_DISPATCH_REPORT_DATA_BY_ID}/${card_dispatch_info_id}`
    );
}

export const getMachineBasedReportDataApi = (queryUrl: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_MACHINE_BASED_REPORT_DATA}?${queryUrl}`
    );
}




export const getAllProductsForProductionEntryApi = () => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_ALL_PRODUCTS_FOR_PRODUCTION}`
    );
}

export const getSalesInvoicesByFilter = (query: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_SALE_INVOICES}?${query}`
    );
}

export const getSalesInvoicesById = (id: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_SALE_INVOICE_BY_ID}/${id}`
    );
}

export const createSalesInvoice = (body: object) => {
    return apiRequest.post(
        `${API_ENDPOINTS.GET_SALE_INVOICES}`,
        body
    );
}

export const getDispatchAutoComplete = (value: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_DISPATCH_AUTO_COMPLETE}?dispatchNo=${value}`
    );
}

export const getCustomerAutoComplete = (value: string) => {
    return apiRequest.get(
        `${API_ENDPOINTS.GET_USER_AUTO_COMPLETE}?typeId=3&name=${value}`
    );
}