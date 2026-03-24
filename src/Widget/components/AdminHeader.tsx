import { Search, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getAdminEmail } from "../../features/Admin";

const AdminHeader = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const adminEmail = getAdminEmail() || "admin@chemxlab.com";
    const avatarUrl = localStorage.getItem("AvatarUrl");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="h-16 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40 font-inter">
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3298DC]/20 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
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
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3298DC] to-[#025D9E] flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                        )}
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-semibold text-[#12284B] font-space">Admin</p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{adminEmail}</p>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
