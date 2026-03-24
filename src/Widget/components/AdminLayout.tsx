import { motion } from "framer-motion";
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
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 flex items-center justify-center"
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#3298DC] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[#475569] font-inter">Đang kiểm tra quyền truy cập...</p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80">
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
