import { ChartArea, LogOut, Menu, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logout } from "../../features/Auth";
import logo from "../../shared/assets/Logo/logo.png";

interface NavItem {
  name: string;
  path: string;
}

const NAV_DATA: NavItem[] = [
  { name: "Sản phẩm", path: "/products" },
  { name: "Thư viện", path: "/library" },
  { name: "Bảng giá", path: "/pricing" },
  { name: "Thí nghiệm", path: "/lab" },
  { name: "ChemXLab AI", path: "/chatbot" },
];

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const navigate = useNavigate();
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("token") || localStorage.getItem("jwtToken");
  const userImageUrl = localStorage.getItem("AvatarUrl");
  const userEmail = localStorage.getItem("Email");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = NAV_DATA.findIndex(item => location.pathname === item.path);
      if (activeIndex !== -1 && navItemRefs.current[activeIndex]) {
        const el = navItemRefs.current[activeIndex];
        setIndicatorStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1,
        });
      } else {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    };

    // Use a small timeout to allow layout to settle before calculating width/left, e.g., on first load
    const timeoutId = setTimeout(updateIndicator, 50);
    window.addEventListener("resize", updateIndicator);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-100 h-16 transition-all duration-300 rounded-full
        ${scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
          : "bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)]"
        }`}
    >
      <div className="w-full px-8 h-full flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="ChemXLab" className="h-10 w-auto object-contain" />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="relative hidden md:flex items-center justify-center flex-1 mx-8 gap-7">
          {/* Animated Sliding Underline */}
          <span
            className="absolute -bottom-1 h-[2.5px] bg-sky-700 rounded-full transition-all duration-300 ease-out z-10"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width, opacity: indicatorStyle.opacity }}
          />

          {NAV_DATA.map((item, index) => {
            const active = isActive(item.path);
            const isAi = item.name === "ChemXLab AI";
            return (
              <Link
                key={item.name}
                to={item.path}
                ref={(el) => { navItemRefs.current[index] = el; }}
                className={`group flex items-center relative text-sm transition-colors font-medium
                  ${active ? "text-sky-700" : "text-slate-600 hover:text-sky-700"}
                `}
              >
                {isAi && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`w-[18px] h-[18px] mr-1.5 transition-transform group-hover:scale-110 ${active ? 'text-[#0ea5e9]' : 'text-[#3d8ad9]'}`}>
                    <path d="M11 3C11 7.418 7.418 11 3 11C7.418 11 11 14.582 11 19C11 14.582 14.582 11 19 11C14.582 11 11 7.418 11 3Z" />
                    <circle cx="4" cy="19" r="1.5" />
                    <path d="M19 3V7M17 5H21" />
                  </svg>
                )}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="hidden md:flex items-center gap-6 shrink-0">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-sm font-bold text-slate-500 hover:text-sky-700 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-[#3d8ad9] hover:bg-[#2e77bf] text-white px-6 py-2.5 rounded-full transition-all shadow-sm"
              >
                Bắt đầu ngay
              </Link>
            </>
          ) : (
            <div className="relative" ref={userDropdownRef}>
              {/* Avatar Button */}
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 transition-colors"
              >
                {userImageUrl ? (
                  <img src={userImageUrl} alt="User" className="w-9 h-9 rounded-full object-cover border-2 border-blue-100" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <User size={18} />
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 md:right-0 mt-3.5 w-[270px] bg-white rounded-lg shadow-lg border border-gray-200 py-2 px-2 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100 ">
                    <div className="flex items-center space-x-3 ">
                      {userImageUrl ? (
                        <img src={userImageUrl} alt="User" className="w-9 h-9 rounded-full object-cover border-2 border-blue-100" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <User size={18} />
                        </div>
                      )}
                      <div className="font-medium text-sm text-slate-700 truncate">{userEmail}!</div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1 mt-1">
                    {localStorage.getItem("Role") === "ADMIN" && (
                      <Link
                        to="/admin"
                        className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 transition-colors duration-150 rounded-lg mb-1"
                      >
                        <ChartArea className="w-4 h-4 mr-3 " />
                        Admin
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-gray-100 transition-colors duration-150 rounded-lg mb-1"
                    >
                      <User className="w-4 h-4 mr-3 " />
                      Hồ sơ cá nhân
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 mb-1 mt-1"></div>

                  {/* Logout */}
                  <button
                    onClick={() => { Logout(); navigate("/login"); }}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors duration-150 rounded-lg"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden p-2 text-slate-700"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-white rounded-2xl border border-gray-100 shadow-xl py-4 flex flex-col items-center space-y-2">
          {NAV_DATA.map((item) => {
            const active = isActive(item.path);
            const isAi = item.name === "ChemX AI";
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-lg w-4/5 text-center
                  ${isAi ? "font-normal" : "font-medium"}
                  ${active ? "text-sky-700 bg-[#f0f9ff]" : "text-slate-700 hover:bg-slate-50"}
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isAi && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`w-[18px] h-[18px] ${active ? 'text-[#0ea5e9]' : 'text-[#3d8ad9]'}`}>
                    <path d="M11 3C11 7.418 7.418 11 3 11C7.418 11 11 14.582 11 19C11 14.582 14.582 11 19 11C14.582 11 11 7.418 11 3Z" />
                    <circle cx="4" cy="19" r="1.5" />
                    <path d="M19 3V7M17 5H21" />
                  </svg>
                )}
                {item.name}
              </Link>
            );
          })}
          <div className="w-16 h-px bg-gray-100 my-1" />
          {token ? (
            <div className="flex flex-col items-center gap-3">
              <Link to="/profile" className="text-slate-700 font-medium hover:text-sky-700 text-sm">Hồ sơ</Link>
              <button onClick={() => { Logout(); navigate("/login"); }} className="text-rose-400 font-bold text-sm">Đăng xuất</button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-4/5">
              <Link to="/login" className="w-full text-center text-slate-700 font-medium border border-slate-200 py-2.5 rounded-xl text-sm">Đăng nhập</Link>
              <Link to="/register" className="w-full text-center bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm">Bắt đầu ngay</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;