import { Menu, User, X } from "lucide-react";
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
  { name: "ChemXLab AI", path: "/chatbot" },
  { name: "Giới thiệu", path: "/about" },
  { name: "Thư viện", path: "/library" },
  { name: "Bảng giá", path: "/experience" },
];

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

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

  return (
    <header
      className={`fixed top-0 w-full z-[100] h-16 transition-all duration-300
        ${scrolled
          ? "bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
          : "bg-white"
        }`}
    >
      <div className="container mx-auto px-8 h-full flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="ChemXLab" className="h-10 w-auto object-contain" />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center justify-center flex-1 mx-8 gap-7">
          {NAV_DATA.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-sm font-medium transition-colors
                  ${active ? "text-blue-600" : "text-slate-600 hover:text-blue-600"}`}
              >
                {item.name}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold bg-linear-to-r from-sky-700 to-sky-600 hover:from-sky-800 hover:to-sky-700 text-white px-5 py-2 rounded-full transition-all shadow-sm"
              >
                Bắt đầu ngay
              </Link>
            </>
          ) : (
            <div className="relative" ref={userDropdownRef}>
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

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 text-slate-800">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 truncate">{userEmail || "User"}</p>
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-0.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full" /> Trực tuyến
                    </p>
                  </div>
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600">Hồ sơ cá nhân</Link>
                    {localStorage.getItem("Role") === "ADMIN" && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600">Trang Admin</Link>
                    )}
                    <div className="border-t border-gray-100 my-1" />
                    <button onClick={() => { Logout(); navigate("/login"); }} className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Đăng xuất</button>
                  </div>
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
        <div className="md:hidden absolute top-14 left-0 w-full bg-white border-t border-gray-100 shadow-lg py-4 flex flex-col items-center space-y-2">
          {NAV_DATA.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium px-4 py-2.5 rounded-lg w-4/5 text-center
                ${isActive(item.path) ? "text-blue-600 bg-blue-50" : "text-slate-700 hover:bg-slate-50"}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="w-16 h-px bg-gray-100 my-1" />
          {token ? (
            <div className="flex flex-col items-center gap-3">
              <Link to="/profile" className="text-slate-700 font-medium hover:text-blue-600 text-sm">Hồ sơ</Link>
              <button onClick={() => { Logout(); navigate("/login"); }} className="text-red-500 font-bold text-sm">Đăng xuất</button>
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