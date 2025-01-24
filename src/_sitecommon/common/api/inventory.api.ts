import { AxiosResponse } from "axios";
import ApiHelper from "./api";

export class InventoryApi {
    public static async getUnits(): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get(`/inventory/units`);
    }

    public static async create(payload: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.put('/inventory', payload);
    }

    public static async update(id: number, payload: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.patch(`/inventory/${id}`, payload);
    }

    public static async delete(id: number): Promise<AxiosResponse<any, any>> {
        return ApiHelper.delete(`/inventory/${id}`);
    }

    public static async getById(id: number): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get(`/inventory/${id}`);
    }


    public static async get(filter?: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get(`/inventory`, { ...filter });
    }
}