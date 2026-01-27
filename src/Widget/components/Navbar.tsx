import { Menu, X, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../shared/assets/Logo/logo.png";
import { Logout } from "../../features/Auth";

// --- CUSTOM ATOM ICON FOR ACTIVE STATE ---
const ActiveAtom = () => (
  <svg
    viewBox="0 0 100 100"
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] -z-10 animate-spin-slow pointer-events-none"
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    style={{ color: "#7EA6F4" }}
  >
    <ellipse cx="50" cy="50" rx="45" ry="14" transform="rotate(45 50 50)" />
    <ellipse cx="50" cy="50" rx="45" ry="14" transform="rotate(-45 50 50)" />
  </svg>
);

interface NavItem {
  name: string;
  path: string;
}

const NAV_DATA: NavItem[] = [
  { name: "Sản phẩm", path: "/features" },
  { name: "Về ChemXLab", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "Hỗ trợ", path: "/support" },
  { name: "Gói trải nghiệm", path: "/experience" },
];

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  // --- REFS ---
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // --- USER DATA ---
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
      setScrolled(window.scrollY > 50);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Determine text color based on scroll state and location
  // If at top (transparent) => White text (assuming dark hero bg). If scrolled => Dark text.
  // HOWEVER, user image shows transparent navbar with WHITE text on blue background. 
  // When scrolled, background becomes white, text becomes dark.
  const isTransparent = !scrolled && location.pathname === "/";
  const textColorClass = isTransparent ? "text-white" : "text-slate-700";
  const hoverColorClass = isTransparent ? "hover:text-blue-200" : "hover:text-blue-600";
  const activeColorClass = isTransparent ? "text-white" : "text-slate-900";


  return (
    <header
      className={`fixed top-0 w-full z-[100] transition-all duration-300 h-20 
        ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-6 h-full flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          {/* Maybe use white logo when transparent? Defaulting to standard logo. 
               If logo is dark and bg is dark, it might clash. Assuming logo has white outline or is visible.
               If not, we might need a white version of the logo for the hero state. 
               For now, using the standard one. */}
          <img src={logo} alt="ChemXLab" className="h-12 w-auto object-contain" />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center justify-center flex-1 ml-12 gap-8">
          {NAV_DATA.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className="relative flex items-center justify-center h-full px-2"
              >
                {active && <ActiveAtom />}
                <span className={`relative z-10 text-sm font-medium transition-colors uppercase tracking-tight 
                ${active ? activeColorClass : `${textColorClass} ${hoverColorClass}`}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="hidden md:flex items-center justify-end gap-4 w-48">
          {!token ? (
            // Guest State: Login Text + Register Button
            <>
              <Link to="/login" className={`text-sm font-bold transition-colors ${textColorClass} ${hoverColorClass}`}>
                Đăng nhập
              </Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2 rounded-full transition-all shadow-lg shadow-blue-500/30">
                Đăng ký
              </Link>
            </>
          ) : (
            // Logged In State
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
              >
                {userImageUrl ? (
                  <img src={userImageUrl} alt="User" className="w-9 h-9 rounded-full object-cover border-2 border-white/50" />
                ) : (
                  <div className={`p-2 rounded-full ${isTransparent ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700"}`}>
                    <User size={20} />
                  </div>
                )}
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 text-slate-800">
                  <div className="px-4 py-3 border-b border-gray-100 bg-blue-50/30">
                    <p className="text-sm font-bold text-gray-900 truncate">{userEmail || "User"}</p>
                    <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                    </p>
                  </div>
                  <div className="py-2">
                    <Link to="/profile" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600">Hồ sơ cá nhân</Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600">Cài đặt</Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={Logout} className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Đăng xuất</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className={`md:hidden p-2 ${isTransparent ? "text-white" : "text-slate-800"}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xl py-6 flex flex-col items-center space-y-6 animate-in slide-in-from-top-5">
          {NAV_DATA.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative text-base font-bold uppercase tracking-wide px-4 py-2`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {isActive(item.path) && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-50 -z-10 rounded-lg"></div>
              )}
              <span className={isActive(item.path) ? "text-blue-600" : "text-slate-800"}>{item.name}</span>
            </Link>
          ))}
          <div className="w-16 h-[2px] bg-gray-100"></div>
          {token ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <Link to="/profile" className="text-slate-700 font-medium hover:text-blue-600">Hồ sơ</Link>
              <button onClick={Logout} className="text-red-500 font-bold">Đăng xuất</button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-3/4">
              <Link to="/login" className="w-full text-center text-slate-700 font-bold border border-slate-300 py-3 rounded-lg">
                Đăng nhập
              </Link>
              <Link to="/register" className="w-full text-center bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;