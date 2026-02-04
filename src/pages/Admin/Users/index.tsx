import {
    Eye,
    Filter,
    Search,
    Users as UsersIcon,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { UserAdmin } from "../../../entities/Admin";
import { getAllUsers } from "../../../features/Admin";

// Role Badge
const RoleBadge = ({ role }: { role: string }) => {
    const styles: Record<string, string> = {
        ADMIN: "bg-purple-100 text-purple-700",
        TEACHER: "bg-blue-100 text-blue-700",
        STUDENT: "bg-green-100 text-green-700",
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[role] || "bg-gray-100 text-gray-700"}`}>
            {role}
        </span>
    );
};

// Format date
const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// View User Modal
interface ViewModalProps {
    user: UserAdmin;
    onClose: () => void;
}

const ViewUserModal = ({ user, onClose }: ViewModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Chi tiết người dùng</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Avatar */}
                    <div className="flex justify-center">
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={user.fullName}
                                className="w-20 h-20 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
                                {user.fullName.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">ID</span>
                            <span className="text-gray-900 font-mono text-sm">{user.id.slice(0, 8)}...</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Họ và tên</span>
                            <span className="text-gray-900 font-medium">{user.fullName}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Email</span>
                            <span className="text-gray-900">{user.email}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Vai trò</span>
                            <RoleBadge role={user.role} />
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500">Ngày tạo</span>
                            <span className="text-gray-900">{formatDate(user.createdAt)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminUsers = () => {
    const [users, setUsers] = useState<UserAdmin[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserAdmin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [viewingUser, setViewingUser] = useState<UserAdmin | null>(null);

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getAllUsers();
            setUsers(data);
            setFilteredUsers(data);
            setIsLoading(false);
        };

        fetchUsers();
    }, []);

    // Filter users
    useEffect(() => {
        let result = users;

        // Search filter
        if (searchQuery) {
            result = result.filter(
                (user) =>
                    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Role filter
        if (roleFilter !== "all") {
            result = result.filter((user) => user.role === roleFilter);
        }

        setFilteredUsers(result);
    }, [users, searchQuery, roleFilter]);

    // Get unique roles
    const roles = Array.from(new Set(users.map((u) => u.role)));

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

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
                    <p className="text-gray-500 mt-1">Xem danh sách tất cả người dùng trong hệ thống</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg">
                    <UsersIcon size={20} className="text-indigo-600" />
                    <span className="text-indigo-600 font-semibold">{users.length} người dùng</span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên hoặc email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-400" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        >
                            <option value="all">Tất cả vai trò</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Người dùng
                                </th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Vai trò
                                </th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            {user.avatarUrl ? (
                                                <img
                                                    src={user.avatarUrl}
                                                    alt={user.fullName}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                    {user.fullName.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">{user.fullName}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-gray-600">{formatDate(user.createdAt)}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setViewingUser(user)}
                                                className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={16} className="text-indigo-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <UsersIcon size={48} className="text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Không tìm thấy người dùng nào</p>
                    </div>
                )}

                {/* Pagination Info */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Hiển thị {filteredUsers.length} trên {users.length} người dùng
                    </p>
                </div>
            </div>

            {/* View Modal */}
            {viewingUser && (
                <ViewUserModal
                    user={viewingUser}
                    onClose={() => setViewingUser(null)}
                />
            )}
        </div>
    );
};

export default AdminUsers;
