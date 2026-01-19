import { 
  ChevronDown, Menu, X, ChevronRight, Box, BookOpen, Users, Gem, 
  ChartArea, Settings, LogOut, User 
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate để redirect khi logout
import logo from "../../shared/assets/Logo/LogoChemX.png"; 
import { Logout } from "../../features/Auth";

interface NavItem {
  name: string;
  path: string;
  desc: string;
}

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const NAV_DATA: NavGroup[] = [
  {
    label: "Sản phẩm",
    icon: <Box className="w-4 h-4" />,
    items: [
      { name: "Tính năng nổi bật", path: "/features", desc: "Khám phá công nghệ 3D" },
      { name: "Gói trải nghiệm", path: "/experience", desc: "Dùng thử miễn phí 3 ngày" },
      { name: "Thư viện thí nghiệm", path: "/library", desc: "Kho dữ liệu hóa học" },
    ]
  },
  {
    label: "Tài nguyên",
    icon: <BookOpen className="w-4 h-4" />,
    items: [
      { name: "Blog học thuật", path: "/blog", desc: "Kiến thức & tin tức" },
      { name: "Trung tâm hỗ trợ", path: "/support", desc: "Giải đáp thắc mắc" },
      { name: "Hướng dẫn sử dụng", path: "/tutorials", desc: "Video & tài liệu" },
    ]
  },
  {
    label: "Công ty",
    icon: <Users className="w-4 h-4" />,
    items: [
      { name: "Về ChemXLab", path: "/about", desc: "Sứ mệnh & Tầm nhìn" },
      { name: "Liên hệ", path: "/contact", desc: "Kết nối với chúng tôi" },
    ]
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false); // State cho User Dropdown
  const [scrolled, setScrolled] = useState<boolean>(false);

  // --- REFS ---
  const navDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null); // Ref riêng cho User Menu

  // --- USER DATA FROM LOCAL STORAGE ---
  // Lấy dữ liệu mỗi khi component render để đảm bảo cập nhật
  const token = localStorage.getItem("token") || localStorage.getItem("jwtToken"); 
  const userImageUrl = localStorage.getItem("AvatarUrl");
  const userEmail = localStorage.getItem("Email");
  const userRole = localStorage.getItem("Role");

  // --- EFFECTS ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Xử lý đóng Main Menu Dropdown
      if (navDropdownRef.current && !navDropdownRef.current.contains(target)) {
        setActiveDropdown(null);
      }

      // Xử lý đóng User Dropdown
      if (userDropdownRef.current && !userDropdownRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleScroll = () => setScrolled(window.scrollY > 20);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };
  

  return (
    <header
      className={`fixed top-0 w-full z-[100] transition-all duration-300 bg-white/95 backdrop-blur-md ${
        scrolled ? "shadow-md border-b border-gray-100" : "border-b border-transparent"
      }`}
    >
      {/* Thêm ref vào container cha hoặc nav để bắt click outside cho nav chính */}
      <div className="container mx-auto px-6 h-20 flex items-center justify-between" ref={navDropdownRef}>
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
           <img src={logo} alt="ChemXLab" className="h-10 w-auto object-contain" />
           <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
            ChemX<span className="text-blue-600">Lab</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-2">
          {NAV_DATA.map((group) => (
            <div key={group.label} className="relative">
              <button
                onClick={() => toggleDropdown(group.label)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeDropdown === group.label 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                {group.label}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === group.label ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Panel */}
              {activeDropdown === group.label && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setActiveDropdown(null)}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group/item"
                      >
                        <div className="mt-1 text-slate-400 group-hover/item:text-blue-600 transition-colors">
                           <ChevronRight size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 group-hover/item:text-blue-600">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 font-medium">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* RIGHT ACTIONS - LOGIN STATE CHECK */}
        <div className="hidden md:flex items-center gap-4">
          
          {token ? (
            // --- UI KHI ĐÃ ĐĂNG NHẬP ---
            <div className="relative" ref={userDropdownRef}>
              {/* Avatar Button */}
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-2 py-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <div className="relative">
                  {userImageUrl ? (
                    <img
                      src={userImageUrl}
                      alt="User Avatar"
                      className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                        <User className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-[270px] bg-white rounded-lg shadow-lg border border-gray-200 py-2 px-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      {userImageUrl ? (
                        <img
                          src={userImageUrl}
                          alt="User Avatar"
                          className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <User className="w-8 h-8 text-gray-400" />
                      )}
                      <div className="overflow-hidden">
                          <p className="text-xs text-gray-500 font-medium">Xin chào,</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{userEmail || "User"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {userRole === "Admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 rounded-lg mb-1"
                      >
                        <ChartArea className="w-4 h-4 mr-3" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 rounded-lg mb-1"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Hồ sơ cá nhân
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 rounded-lg"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Cài đặt
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-1"></div>

                  {/* Logout */}
                  <button
                    onClick={Logout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 rounded-lg"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            // --- UI KHI CHƯA ĐĂNG NHẬP (GUEST) ---
            <>
              <Link
                to="/login"
                className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/experience"
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-600/30"
              >
                <Gem className="w-4 h-4" />
                Gói Premium
              </Link>
            </>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden p-2 text-slate-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-4 space-y-6">
            
            {/* Hiển thị thông tin User trên Mobile nếu đã login */}
            {token && (
               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                  {userImageUrl ? (
                    <img src={userImageUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover"/>
                  ) : (
                     <User className="w-10 h-10 p-2 bg-white rounded-full text-gray-500" />
                  )}
                  <div>
                    <div className="font-bold text-slate-900">{userEmail}</div>
                    <div className="text-xs text-slate-500">Thành viên</div>
                  </div>
               </div>
            )}

            {NAV_DATA.map((group) => (
              <div key={group.label} className="space-y-3">
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider px-2 flex items-center gap-2">
                    {group.icon} {group.label}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="block px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="border-b border-gray-100 mx-2"></div>
              </div>
            ))}

            <div className="pt-4 space-y-3">
               {!token ? (
                  <>
                    <Link to="/login" className="block w-full text-center border border-slate-200 text-slate-700 py-3 rounded-lg font-bold">
                      Đăng nhập
                    </Link>
                    <Link to="/experience" className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-bold">
                      Gói Premium
                    </Link>
                  </>
               ) : (
                  <button onClick={handleLogout} className="block w-full text-center bg-red-50 text-red-600 py-3 rounded-lg font-bold">
                     Đăng xuất
                  </button>
               )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;