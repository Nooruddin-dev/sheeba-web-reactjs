import { AxiosResponse } from "axios";
import ApiHelper from "./api";

export class VoucherApi {
    public static async get(filter: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get(`/grn`, { ...filter });
    }

    public static async getById(id: number): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get(`/grn/${id}`);
    }

    public static async put(body: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.put(`/grn`, { ...body });
    }

    public static async cancel(id: number): Promise<AxiosResponse<any, any>> {
        return ApiHelper.patch(`/voucher/cancel/${id}`, {});
    }
}