import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { isAdmin } from "../../features/Admin";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin
        const checkAdmin = () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                navigate("/login");
                return;
            }

            if (!isAdmin()) {
                navigate("/");
                return;
            }

            setIsLoading(false);
        };

        checkAdmin();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminSidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <div
                className={`transition-all duration-300 ${sidebarCollapsed ? "ml-[72px]" : "ml-[260px]"
                    }`}
            >
                <AdminHeader />
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
