import {
    ChevronLeft,
    ChevronRight,
    FlaskConical,
    Home,
    LayoutDashboard,
    LogOut,
    Package,
    Users,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logout } from "../../features/Auth";

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
}

const sidebarItems: SidebarItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        path: "/admin",
    },
    {
        id: "users",
        label: "Quản lý Users",
        icon: <Users size={20} />,
        path: "/admin/users",
    },
    {
        id: "packages",
        label: "Quản lý Gói",
        icon: <Package size={20} />,
        path: "/admin/packages",
    },
];

interface AdminSidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

const AdminSidebar = ({ isCollapsed, onToggle }: AdminSidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => {
        if (path === "/admin") {
            return location.pathname === "/admin";
        }
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        Logout();
        navigate("/login");
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-[#1a1b2e] to-[#2e3048] text-white transition-all duration-300 z-50 flex flex-col ${isCollapsed ? "w-[72px]" : "w-[260px]"
                }`}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <FlaskConical size={22} className="text-white" />
                </div>
                {!isCollapsed && (
                    <div className="overflow-hidden">
                        <h1 className="text-lg font-bold tracking-tight">ChemXLab</h1>
                        <p className="text-xs text-gray-400">Admin Panel</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive(item.path)
                            ? "bg-white/15 text-white shadow-lg"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        <span
                            className={`transition-colors ${isActive(item.path) ? "text-indigo-400" : "text-gray-400 group-hover:text-indigo-400"
                                }`}
                        >
                            {item.icon}
                        </span>
                        {!isCollapsed && (
                            <span className="font-medium text-sm">{item.label}</span>
                        )}
                        {isActive(item.path) && !isCollapsed && (
                            <div className="ml-auto w-1.5 h-6 rounded-full bg-indigo-500" />
                        )}
                    </Link>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="px-3 py-4 border-t border-white/10 space-y-2">
                {/* Back to Home */}
                <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-gray-300 hover:bg-indigo-500/20 hover:text-indigo-400 transition-all duration-200"
                >
                    <Home size={20} />
                    {!isCollapsed && <span className="font-medium text-sm">Về trang chủ</span>}
                </Link>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span className="font-medium text-sm">Đăng xuất</span>}
                </button>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-20 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
                style={{ cursor: "pointer", zIndex: 60 }}
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </aside>
    );
};

export default AdminSidebar;
