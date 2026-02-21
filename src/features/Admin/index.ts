import { message } from "antd";
import type {
    CreateElementForm,
    CreatePackageForm,
    CreateUserForm,
    DashboardStats,
    ElementAdmin,
    MonthlyRevenue,
    PackageAdmin,
    Transaction,
    UpdateElementForm,
    UpdatePackageForm,
    UserAdmin,
    ChemicalAdmin,
    CreateChemicalForm,
    UpdateChemicalForm
} from "../../entities/Admin";
import type { ResponseDTO } from "../../entities/Response";
import api from "../../shared/api/axios";
import { supabase } from "../../shared/config/supabase"; 

// ============== MOCK DATA FOR DASHBOARD ==============
const MOCK_MONTHLY_REVENUE: MonthlyRevenue[] = [
    { month: "T1", revenue: 15000000, transactions: 120 },
    { month: "T2", revenue: 18500000, transactions: 145 },
    { month: "T3", revenue: 22000000, transactions: 168 },
    { month: "T4", revenue: 19800000, transactions: 155 },
    { month: "T5", revenue: 25600000, transactions: 195 },
    { month: "T6", revenue: 28900000, transactions: 220 },
];
const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: "txn_001",
        userId: "1",
        userEmail: "user1@example.com",
        userName: "Nguyễn Văn A",
        packageId: "2",
        packageName: "Gói Nâng Cao",
        amount: 199000,
        status: "completed",
        createdAt: "2024-02-04T10:30:00Z",
    },
    {
        id: "txn_002",
        userId: "2",
        userEmail: "user2@example.com",
        userName: "Trần Thị B",
        packageId: "1",
        packageName: "Gói Cơ Bản",
        amount: 99000,
        status: "completed",
        createdAt: "2024-02-03T15:20:00Z",
    },
];

// ============== DASHBOARD API ==============
export const getDashboardStats = async (
    users: UserAdmin[],
    packages: PackageAdmin[]
): Promise<DashboardStats> => {
    const totalRevenue = MOCK_MONTHLY_REVENUE.reduce((sum, m) => sum + m.revenue, 0);
    return {
        totalUsers: users.length,
        totalRevenue: totalRevenue,
        totalPackages: packages.length,
        activeSubscriptions: Math.floor(users.length * 0.6),
        monthlyRevenue: MOCK_MONTHLY_REVENUE,
        recentTransactions: MOCK_TRANSACTIONS,
    };
};

// ============== USER MANAGEMENT API ==============
export const getAllUsers = async (): Promise<UserAdmin[]> => {
    try {
        const response = await api.get<ResponseDTO<UserAdmin[]>>("User/GetAllUsers");
        if (response.data.isSuccess) {
            return response.data.result;
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
};

export const createUser = async (data: CreateUserForm): Promise<boolean> => {
    try {
        const payload = {
            email: data.email,
            password: data.password,
            fullName: data.fullName,
            avatarUrl: data.avatarUrl || null,
            role: data.role
        };
        const response = await api.post<ResponseDTO<UserAdmin>>("User", payload);

        if (response.data.isSuccess) {
            message.success("Tạo người dùng thành công");
            return true;
        }
        message.error(response.data.message || "Tạo thất bại");
        return false;
    } catch (error: any) {
        console.error("Create User Error:", error);
        const serverError = error.response?.data?.errors?.[0]?.message || error.response?.data?.message;
        message.error(serverError || "Lỗi khi tạo người dùng");
        return false;
    }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
    try {
        const response = await api.delete<ResponseDTO<null>>(`User/${userId}`);
        if (response.data.isSuccess) {
            message.success("Đã xóa người dùng");
            return true;
        }
        message.error(response.data.message || "Xóa thất bại");
        return false;
    } catch (error) {
        console.error("Failed to delete user:", error);
        message.error("Lỗi khi xóa người dùng");
        return false;
    }
};

// ============== PACKAGE MANAGEMENT API ==============
export const getAllPackagesAdmin = async (): Promise<PackageAdmin[]> => {
    try {
        const response = await api.get<ResponseDTO<PackageAdmin[]>>("packages");
        if (response.data.isSuccess) {
            return response.data.result;
        }
        message.error(response.data.message || "Không thể tải danh sách gói");
        return [];
    } catch (error) {
        console.error("Failed to fetch packages:", error);
        message.error("Không thể tải danh sách gói");
        return [];
    }
};

export const getPackageById = async (id: number): Promise<PackageAdmin | null> => {
    try {
        const response = await api.get<ResponseDTO<PackageAdmin>>(`packages/${id}`);
        if (response.data.isSuccess) {
            return response.data.result;
        }
        message.error(response.data.message || "Không thể tải thông tin gói");
        return null;
    } catch (error) {
        console.error("Failed to fetch package:", error);
        message.error("Không thể tải thông tin gói");
        return null;
    }
};

export const createPackage = async (data: CreatePackageForm): Promise<boolean> => {
    try {
        const response = await api.post<ResponseDTO<PackageAdmin>>("packages", data);
        if (response.data.isSuccess) {
            message.success("Tạo gói mới thành công");
            return true;
        }
        message.error(response.data.message || "Tạo gói thất bại");
        return false;
    } catch (error) {
        console.error("Failed to create package:", error);
        message.error("Tạo gói thất bại");
        return false;
    }
};

export const updatePackage = async (id: number, data: UpdatePackageForm): Promise<boolean> => {
    try {
        const response = await api.put<ResponseDTO<PackageAdmin>>(`packages/${id}`, data);
        if (response.data.isSuccess) {
            message.success("Cập nhật gói thành công");
            return true;
        }
        message.error(response.data.message || "Cập nhật gói thất bại");
        return false;
    } catch (error) {
        console.error("Failed to update package:", error);
        message.error("Cập nhật gói thất bại");
        return false;
    }
};

export const deletePackage = async (packageId: number): Promise<boolean> => {
    try {
        const response = await api.delete<ResponseDTO<null>>(`packages/${packageId}`);
        if (response.data.isSuccess) {
            message.success("Xóa gói thành công");
            return true;
        }
        message.error(response.data.message || "Xóa gói thất bại");
        return false;
    } catch (error) {
        console.error("Failed to delete package:", error);
        message.error("Xóa gói thất bại");
        return false;
    }
};

// ============== ELEMENT MANAGEMENT API ==============
export const getAllElements = async (): Promise<ElementAdmin[]> => {
    try {
        const response = await api.get<ResponseDTO<ElementAdmin[]>>("elements");
        if (response.data.isSuccess) {
            return response.data.result;
        }
        message.error(response.data.message || "Không thể tải danh sách nguyên tố");
        return [];
    } catch (error) {
        console.error("Failed to fetch elements:", error);
        message.error("Không thể tải danh sách nguyên tố");
        return [];
    }
};

export const getElementById = async (id: number): Promise<ElementAdmin | null> => {
    try {
        const response = await api.get<ResponseDTO<ElementAdmin>>(`elements/${id}`);
        if (response.data.isSuccess) {
            return response.data.result;
        }
        message.error(response.data.message || "Không thể tải thông tin nguyên tố");
        return null;
    } catch (error) {
        console.error("Failed to fetch element:", error);
        message.error("Không thể tải thông tin nguyên tố");
        return null;
    }
};

export const createElement = async (data: CreateElementForm): Promise<boolean> => {
    try {
        const response = await api.post<ResponseDTO<ElementAdmin>>("elements", data);
        if (response.data.isSuccess) {
            message.success("Tạo nguyên tố mới thành công");
            return true;
        }
        message.error(response.data.message || "Tạo nguyên tố thất bại");
        return false;
    } catch (error) {
        console.error("Failed to create element:", error);
        message.error("Tạo nguyên tố thất bại");
        return false;
    }
};

export const updateElement = async (id: number, data: UpdateElementForm): Promise<boolean> => {
    try {
        const response = await api.put<ResponseDTO<ElementAdmin>>(`elements/${id}`, data);
        if (response.data.isSuccess) {
            message.success("Cập nhật nguyên tố thành công");
            return true;
        }
        message.error(response.data.message || "Cập nhật nguyên tố thất bại");
        return false;
    } catch (error) {
        console.error("Failed to update element:", error);
        message.error("Cập nhật nguyên tố thất bại");
        return false;
    }
};

export const deleteElement = async (elementId: number): Promise<boolean> => {
    try {
        const response = await api.delete<ResponseDTO<null>>(`elements/${elementId}`);
        if (response.data.isSuccess) {
            message.success("Xóa nguyên tố thành công");
            return true;
        }
        message.error(response.data.message || "Xóa nguyên tố thất bại");
        return false;
    } catch (error) {
        console.error("Failed to delete element:", error);
        message.error("Xóa nguyên tố thất bại");
        return false;
    }
};

// ============== AUTH HELPERS ==============
export const isAdmin = (): boolean => {
    const role = localStorage.getItem("Role");
    return role === "ADMIN";
};
export const getAdminEmail = (): string | null => {
    return localStorage.getItem("Email");
};

// ============== CHEMICAL MANAGEMENT API ==============

// GET /api/Chemical
export const getAllChemicals = async (): Promise<ChemicalAdmin[]> => {
    try {
        const response = await api.get<ResponseDTO<ChemicalAdmin[]>>("Chemical");
        if (response.data.isSuccess) {
            return response.data.result;
        }
        message.error(response.data.message || "Không thể tải danh sách hóa chất");
        return [];
    } catch (error) {
        console.error("Failed to fetch chemicals:", error);
        message.error("Không thể tải danh sách hóa chất");
        return [];
    }
};

// GET /api/Chemical/{id}
export const getChemicalById = async (id: string): Promise<ChemicalAdmin | null> => {
    try {
        const response = await api.get<ResponseDTO<ChemicalAdmin>>(`Chemical/${id}`);
        if (response.data.isSuccess) {
            return response.data.result;
        }
        message.error(response.data.message || "Không thể tải thông tin hóa chất");
        return null;
    } catch (error) {
        console.error("Failed to fetch chemical:", error);
        message.error("Không thể tải thông tin hóa chất");
        return null;
    }
};

// POST /api/Chemical
export const createChemical = async (data: CreateChemicalForm): Promise<boolean> => {
    try {
        const response = await api.post<ResponseDTO<ChemicalAdmin>>("Chemical", data);
        if (response.data.isSuccess) {
            message.success("Tạo hóa chất mới thành công");
            return true;
        }
        message.error(response.data.message || "Tạo hóa chất thất bại");
        return false;
    } catch (error: any) {
        console.error("Failed to create chemical:", error);
        const serverError = error.response?.data?.message || "Tạo hóa chất thất bại";
        message.error(serverError);
        return false;
    }
};

// PUT /api/Chemical/{id}
export const updateChemical = async (id: string, data: UpdateChemicalForm): Promise<boolean> => {
    try {
        const response = await api.put<ResponseDTO<ChemicalAdmin>>(`Chemical/${id}`, data);
        if (response.data.isSuccess) {
            message.success("Cập nhật hóa chất thành công");
            return true;
        }
        message.error(response.data.message || "Cập nhật hóa chất thất bại");
        return false;
    } catch (error: any) {
        console.error("Failed to update chemical:", error);
        const serverError = error.response?.data?.message || "Cập nhật hóa chất thất bại";
        message.error(serverError);
        return false;
    }
};

// DELETE /api/Chemical/{id}
export const deleteChemical = async (id: string): Promise<boolean> => {
    try {
        const response = await api.delete<ResponseDTO<null>>(`Chemical/${id}`);
        if (response.data.isSuccess) {
            message.success("Đã xóa hóa chất");
            return true;
        }
        message.error(response.data.message || "Xóa hóa chất thất bại");
        return false;
    } catch (error) {
        console.error("Failed to delete chemical:", error);
        message.error("Lỗi khi xóa hóa chất");
        return false;
    }
};

// ============== UPLOAD FILE (SUPABASE) ==============
export const uploadFile = async (file: File): Promise<string | null> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from("chemical-models")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false
            });

            console.log("Upload result:", data);

        if (error) {
            throw error;
        }

        const { data: publicUrlData } = supabase.storage
            .from('chemical-models')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;

    } catch (error: any) {
        console.error("Supabase Upload Error:", error);
        message.error("Upload file thất bại: " + (error.message || "Lỗi không xác định"));
        return null;
    }
};