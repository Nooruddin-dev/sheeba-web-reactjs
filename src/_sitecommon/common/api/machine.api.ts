import { AxiosResponse } from "axios";
import ApiHelper from "./api";

export class MachineApi {
    public static async autoComplete(value: string): Promise<AxiosResponse<any, any>> {
        return ApiHelper.get(`/machines/auto-complete`, { value });
    }
}