import { AxiosResponse } from "axios";
import ApiHelper from "./api";

export class JobCardApi {
    public static async autoComplete(value: string): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get(`/jobcard/auto-complete`, { value });
    }
}