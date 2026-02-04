import { Bell, ChevronDown, LogOut, Search, Settings, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminEmail } from "../../features/Admin";
import { Logout } from "../../features/Auth";

const AdminHeader = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    const adminEmail = getAdminEmail() || "admin@chemxlab.com";
    const avatarUrl = localStorage.getItem("AvatarUrl");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        Logout();
        navigate("/login");
    };

    const notifications = [
        { id: 1, text: "Người dùng mới đã đăng ký", time: "5 phút trước" },
        { id: 2, text: "Thanh toán mới đã hoàn thành", time: "15 phút trước" },
        { id: 3, text: "Có báo cáo lỗi mới", time: "1 giờ trước" },
    ];

    return (
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Bell size={20} className="text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-800">Thông báo</h3>
                            </div>
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <p className="text-sm text-gray-700">{notif.text}</p>
                                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                </div>
                            ))}
                            <div className="px-4 py-2 border-t border-gray-100">
                                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                    Xem tất cả
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                        )}
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-gray-800">Admin</p>
                            <p className="text-xs text-gray-500 truncate max-w-[120px]">{adminEmail}</p>
                        </div>
                        <ChevronDown size={16} className="text-gray-400" />
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="font-medium text-gray-800">Xin chào!</p>
                                <p className="text-sm text-gray-500 truncate">{adminEmail}</p>
                            </div>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                                <User size={18} />
                                <span className="text-sm">Thông tin cá nhân</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                                <Settings size={18} />
                                <span className="text-sm">Cài đặt</span>
                            </button>
                            <div className="border-t border-gray-100 mt-1 pt-1">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span className="text-sm">Đăng xuất</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
