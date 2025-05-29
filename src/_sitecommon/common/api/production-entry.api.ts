import { AxiosResponse } from "axios";
import ApiHelper from "./api";

export class ProductionEntryApi {
    public static async create(payload: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.put('/production-entries', payload);
    }

    public static async get(filter?: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get('/production-entries', { ...filter });
    }

    public static async getLastConsumedProducts(jobCardId: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get('/production-entries/latest-consumed-products', { jobCardId });
    }

    public static async cancel(id: number): Promise<AxiosResponse<any, any>> {
        return ApiHelper.patch(`/production-entries/${id}/cancel`, {});
    }
}