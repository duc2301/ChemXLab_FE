import { message } from "antd";
import type { Package } from "../../entities/Package";
import type { ResponseDTO } from "../../entities/Response";
import api from "../../shared/api/axios";

export const getAllPackages = async (): Promise<Package[]> => {
    try {
        const response = await api.get<ResponseDTO<Package[]>>("packages");
        if (response.data.isSuccess) {
            return response.data.result;
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch packages:", error);
        message.error("Không thể tải danh sách gói dịch vụ");
        return [];
    }
};
