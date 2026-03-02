import type { DashboardTransaction } from "../../entities/Dashboard";
import type { ResponseDTO } from "../../entities/Response";
import api from "../../shared/api/axios";

export const getDashboardTransactions = async (
    fromDate: string,
    toDate: string
): Promise<DashboardTransaction[]> => {
    try {
        const response = await api.get<ResponseDTO<DashboardTransaction[]>>("Dashboard", {
            params: { FromDate: fromDate, ToDate: toDate },
        });
        if (response.data.isSuccess) {
            return response.data.result;
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch dashboard transactions:", error);
        return [];
    }
};
