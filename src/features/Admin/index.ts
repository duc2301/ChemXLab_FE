// Admin Features - API Functions
// Using real backend API endpoints

import { message } from "antd";
import type {
    CreatePackageForm,
    DashboardStats,
    MonthlyRevenue,
    PackageAdmin,
    Transaction,
    UpdatePackageForm,
    UserAdmin,
} from "../../entities/Admin";
import type { ResponseDTO } from "../../entities/Response";
import api from "../../shared/api/axios";

// ============== MOCK DATA FOR DASHBOARD ==============
// Dashboard stats API chưa có, sử dụng mock data

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
    // Calculate stats from real data
    const totalRevenue = MOCK_MONTHLY_REVENUE.reduce((sum, m) => sum + m.revenue, 0);

    return {
        totalUsers: users.length,
        totalRevenue: totalRevenue,
        totalPackages: packages.length,
        activeSubscriptions: Math.floor(users.length * 0.6), // Mock: 60% active
        monthlyRevenue: MOCK_MONTHLY_REVENUE,
        recentTransactions: MOCK_TRANSACTIONS,
    };
};

// ============== USER MANAGEMENT API ==============
// GET /api/User/GetAllUsers
export const getAllUsers = async (): Promise<UserAdmin[]> => {
    try {
        const response = await api.get<ResponseDTO<UserAdmin[]>>("User/GetAllUsers");
        if (response.data.isSuccess) {
            return response.data.result;
        }
        message.error(response.data.message || "Không thể tải danh sách người dùng");
        return [];
    } catch (error) {
        console.error("Failed to fetch users:", error);
        message.error("Không thể tải danh sách người dùng");
        return [];
    }
};

// Update user - API chưa có, placeholder
export const updateUser = async (id: string, data: { fullName: string; role: string }): Promise<boolean> => {
    try {
        // TODO: Replace with real API when available
        // const response = await api.put<ResponseDTO<UserAdmin>>(`User/${id}`, data);
        message.info("API cập nhật user chưa sẵn sàng");
        return false;
    } catch (error) {
        console.error("Failed to update user:", error);
        message.error("Cập nhật người dùng thất bại");
        return false;
    }
};

// Delete user - API chưa có, placeholder
export const deleteUser = async (userId: string): Promise<boolean> => {
    try {
        // TODO: Replace with real API when available
        // const response = await api.delete<ResponseDTO<null>>(`User/${userId}`);
        message.info("API xóa user chưa sẵn sàng");
        return false;
    } catch (error) {
        console.error("Failed to delete user:", error);
        message.error("Xóa người dùng thất bại");
        return false;
    }
};

// ============== PACKAGE MANAGEMENT API ==============
// GET /api/packages
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

// GET /api/packages/:id
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

// POST /api/packages
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

// PUT /api/packages/:id
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

// DELETE /api/packages/:id
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

// ============== AUTH HELPERS ==============
export const isAdmin = (): boolean => {
    const role = localStorage.getItem("Role");
    return role === "ADMIN";
};

export const getAdminEmail = (): string | null => {
    return localStorage.getItem("Email");
};
