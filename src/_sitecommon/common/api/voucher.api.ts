import { AxiosResponse } from "axios";
import ApiHelper from "./api";

export class VoucherApi {
    public static async get(filter: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get(`/voucher`, { ...filter });
    }

    public static async cancel(id: number): Promise<AxiosResponse<any, any>> {
        return ApiHelper.patch(`/voucher/cancel/${id}`, {});
    }
}