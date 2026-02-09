import {
    ArrowUpRight,
    GraduationCap,
    Package,
    UserCog,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";
import type { DashboardStats, PackageAdmin, UserAdmin } from "../../../entities/Admin";
import { getAllPackagesAdmin, getAllUsers, getDashboardStats } from "../../../features/Admin";

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: number;
    trendLabel?: string;
    color: string;
}

const StatCard = ({ title, value, icon, trend, trendLabel, color }: StatCardProps) => {
    const isPositive = trend && trend > 0;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {trend !== undefined && (
                        <div className="flex items-center gap-1 mt-2">
                            <ArrowUpRight size={16} className={isPositive ? "text-green-500" : "text-gray-400"} />
                            <span className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-gray-400"}`}>
                                {Math.abs(trend)}%
                            </span>
                            <span className="text-sm text-gray-400">{trendLabel}</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Simple Bar Chart Component
interface BarChartProps {
    data: { month: string; revenue: number }[];
}

const SimpleBarChart = ({ data }: BarChartProps) => {
    const maxValue = Math.max(...data.map((d) => d.revenue));

    return (
        <div className="h-64 flex items-end justify-between gap-2 px-4">
            {data.map((item, index) => {
                const height = (item.revenue / maxValue) * 100;
                return (
                    <div key={index} className="flex flex-col items-center flex-1">
                        <div
                            className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500 hover:from-indigo-700 hover:to-indigo-500 cursor-pointer relative group"
                            style={{ height: `${height}%` }}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {(item.revenue / 1000000).toFixed(1)}M VNĐ
                            </div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                    </div>
                );
            })}
        </div>
    );
};

// Format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};

const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [users, setUsers] = useState<UserAdmin[]>([]);
    const [packages, setPackages] = useState<PackageAdmin[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch real data from APIs
            const [usersData, packagesData] = await Promise.all([
                getAllUsers(),
                getAllPackagesAdmin(),
            ]);

            setUsers(usersData);
            setPackages(packagesData);

            // Calculate dashboard stats
            const dashboardStats = await getDashboardStats(usersData, packagesData);
            setStats(dashboardStats);
            setIsLoading(false);
        };

        fetchData();
    }, []);

    // Count users by role
    const countByRole = (role: string) => users.filter((u) => u.role === role).length;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-120px)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-120px)]">
                <p className="text-gray-500">Không thể tải dữ liệu thống kê</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển</h1>
                <p className="text-gray-500 mt-1">Tổng quan về hoạt động hệ thống</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng người dùng"
                    value={users.length.toLocaleString()}
                    icon={<Users size={24} className="text-white" />}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatCard
                    title="Học sinh"
                    value={countByRole("STUDENT")}
                    icon={<GraduationCap size={24} className="text-white" />}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                />
                <StatCard
                    title="Giáo viên"
                    value={countByRole("TEACHER")}
                    icon={<UserCog size={24} className="text-white" />}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <StatCard
                    title="Gói dịch vụ"
                    value={packages.length}
                    icon={<Package size={24} className="text-white" />}
                    color="bg-gradient-to-br from-orange-500 to-orange-600"
                />
            </div>

            {/* Charts and Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Doanh thu theo tháng</h2>
                            <p className="text-sm text-gray-500">6 tháng gần nhất (dữ liệu mẫu)</p>
                        </div>
                    </div>
                    <SimpleBarChart data={stats.monthlyRevenue} />
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê theo vai trò</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                    <UserCog size={20} className="text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Admin</p>
                                    <p className="text-xs text-gray-500">Quản trị viên</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-gray-900">{countByRole("ADMIN")}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <UserCog size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Giáo viên</p>
                                    <p className="text-xs text-gray-500">Người giảng dạy</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-gray-900">{countByRole("TEACHER")}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <GraduationCap size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Học sinh</p>
                                    <p className="text-xs text-gray-500">Người học</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-gray-900">{countByRole("STUDENT")}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Package Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Danh sách gói dịch vụ</h2>
                        <p className="text-sm text-gray-500">Tổng quan các gói hiện có</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Tên gói
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Giá
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Thời hạn
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Số tính năng
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map((pkg) => (
                                <tr key={pkg.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4">
                                        <span className="text-sm font-mono text-gray-600">{pkg.id}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm font-medium text-gray-900">{pkg.name}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {pkg.price === 0 ? "Miễn phí" : formatCurrency(pkg.price)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600">
                                            {pkg.durationDays === 0 ? "Theo hợp đồng" : `${pkg.durationDays} ngày`}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                                            {pkg.features.length} tính năng
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
