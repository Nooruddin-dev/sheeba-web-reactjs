import { AxiosResponse } from "axios";
import ApiHelper from "./api";

export class ReportApi {
    public static async jobSummary(filter: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get(`/reports/job-summary`, { ...filter });
    }

    public static async machineSummary(filter: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get(`/reports/machine-summary`, { ...filter });
    }

    public static async stock(filter: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get(`/reports/stock`, { ...filter });
    }

    public static async grn(filter: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get(`/reports/grn`, { ...filter });
    }

    public static async dispatch(filter: any): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get(`/reports/dispatch`, { ...filter });
    }
}