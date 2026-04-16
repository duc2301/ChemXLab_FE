import { motion } from "framer-motion";
import {
    Eye,
    Filter,
    Plus,
    Search,
    Trash2,
    Users as UsersIcon,
    X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Pagination, { ITEMS_PER_PAGE } from "../../../components/Admin/Pagination";
import type { CreateUserForm, UserAdmin } from "../../../entities/Admin";
import { createUser, deleteUser, getAllUsers } from "../../../features/Admin";

// --- Sub-components ---

const RoleBadge = ({ role }: { role: string }) => {
    const normalizedRole = role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : "Unknown";
    const styles: Record<string, string> = {
        Admin: "bg-purple-100 text-purple-700 border-purple-200",
        Teacher: "bg-blue-100 text-blue-700 border-blue-200",
        Student: "bg-green-100 text-green-700 border-green-200",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[normalizedRole] || "bg-gray-100 text-gray-700"}`}>
            {normalizedRole}
        </span>
    );
};

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric"
    });
};

// --- Modal Tạo Mới User ---
const CreateUserModal = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => {
    const [formData, setFormData] = useState<CreateUserForm>({
        fullName: "", email: "", password: "", confirmPassword: "", role: "STUDENT"
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
        setLoading(true);
        const success = await createUser(formData);
        setLoading(false);
        if (success) onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Thêm người dùng mới</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                        <input required type="text" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Nguyễn Văn A"
                            value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input required type="email" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="example@email.com"
                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                            <input required type="password" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận MK</label>
                            <input required type="password" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                        <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                            <option value="Student">Học sinh (STUDENT)</option>
                            <option value="Teacher">Giáo viên (TEACHER)</option>
                            <option value="Admin">Quản trị viên (ADMIN )</option>
                        </select>
                    </div>
                    <div className="pt-4">
                        <button type="submit" disabled={loading}
                            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:bg-gray-400">
                            {loading ? "Đang xử lý..." : "Tạo tài khoản"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// --- Modal Xem Chi Tiết ---
const ViewUserModal = ({ user, onClose }: { user: UserAdmin; onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                <div className="flex flex-col items-center pt-4">
                    <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold mb-4 overflow-hidden border-4 border-white shadow-lg">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                            user.fullName.charAt(0).toUpperCase()
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{user.fullName}</h3>
                    <p className="text-gray-500 text-sm mb-3">{user.email}</p>
                    <RoleBadge role={user.role} />
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Mã người dùng</span>
                        <span className="text-gray-900 font-mono text-xs truncate max-w-[150px]" title={user.id}>{user.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Ngày tham gia</span>
                        <span className="text-gray-900 font-medium">{formatDate(user.createdAt)}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// --- Main Page Component ---
const AdminUsers = () => {
    const [users, setUsers] = useState<UserAdmin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);

    // States cho Modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [viewingUser, setViewingUser] = useState<UserAdmin | null>(null);

    // Fetch dữ liệu
    const fetchUsers = async () => {
        setIsLoading(true);
        const data = await getAllUsers();
        setUsers(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filtered users with useMemo
    const filteredUsers = useMemo(() => {
        let result = [...users];
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(u => u.fullName?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query));
        }
        if (roleFilter !== "all") {
            result = result.filter(u => u.role?.toLowerCase() === roleFilter.toLowerCase());
        }
        // Sort newest first
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return result;
    }, [users, searchQuery, roleFilter]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, roleFilter]);

    // Xử lý Xóa
    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.")) {
            const success = await deleteUser(id);
            if (success) {
                // Cập nhật UI ngay lập tức
                setUsers(prev => prev.filter(u => u.id !== id));
            }
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-[60vh] gap-3">
            <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-500 font-medium">Đang tải dữ liệu...</span>
        </div>
    );

    return (
        <div className="space-y-6 p-6 font-lexend">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#12284B] font-space">Quản lý người dùng</h1>
                    <p className="text-[#475569] text-sm mt-1">
                        Tổng số: <span className="font-semibold text-[#3298DC]">{users.length}</span> tài khoản
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-[#3298DC] text-white px-5 py-2.5 rounded-xl hover:bg-[#287BBF] transition shadow-sm font-medium"
                >
                    <Plus size={20} /> Thêm người dùng
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#3298DC]/20 focus:border-[#3298DC] transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 min-w-[200px]">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 flex items-center">
                        <Filter size={18} className="text-gray-400 mr-2" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="bg-transparent outline-none text-gray-700 text-sm font-medium cursor-pointer w-full"
                        >
                            <option value="all">Tất cả vai trò</option>
                            <option value="Admin">Quản trị viên</option>
                            <option value="Teacher">Giáo viên</option>
                            <option value="Student">Học sinh</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/80 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Người dùng</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Vai trò</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                    {user.avatarUrl ? (
                                                        <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-gray-500 font-bold">{user.fullName?.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{user.fullName}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6"><RoleBadge role={user.role} /></td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{formatDate(user.status)}</td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setViewingUser(user)} className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all" title="Xem chi tiết">
                                                    <Eye size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all" title="Xóa người dùng">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-500">
                                        <UsersIcon size={48} className="mx-auto mb-3 text-gray-300" />
                                        <p>Không tìm thấy người dùng phù hợp</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredUsers.length}
                    itemName="người dùng"
                />
            </div>

            {/* Render Modals */}
            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => { setShowCreateModal(false); fetchUsers(); }}
                />
            )}
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