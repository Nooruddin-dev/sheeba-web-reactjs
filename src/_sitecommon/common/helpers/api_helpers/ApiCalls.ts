
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
