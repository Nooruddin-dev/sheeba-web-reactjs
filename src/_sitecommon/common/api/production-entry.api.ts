import { AxiosResponse } from "axios";
import ApiHelper from "./api";

export class ProductionEntryApi {
    public static async create(payload: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.put('/production-entries', payload);
    }

    public static async get(filter?: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get('/production-entries', { ...filter });
    }
}