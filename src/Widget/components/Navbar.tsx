import {
  BookOpen,
  Box,
  ChevronDown,
  ChevronRight,
  Gem,
  Menu,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../shared/assets/Logo/LogoChemX.png"; // Đảm bảo đường dẫn đúng

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

// --- 2. Dữ liệu Menu (Có Type Safety) ---
const NAV_DATA: NavGroup[] = [
  {
    label: "Sản phẩm",
    icon: <Box className="w-4 h-4" />,
    items: [
      {
        name: "Tính năng nổi bật",
        path: "/features",
        desc: "Khám phá công nghệ 3D",
      },
      {
        name: "Gói trải nghiệm",
        path: "/experience",
        desc: "Dùng thử miễn phí 3 ngày",
      },
      {
        name: "Thư viện thí nghiệm",
        path: "/library",
        desc: "Kho dữ liệu hóa học",
      },
    ],
  },
  {
    label: "Tài nguyên",
    icon: <BookOpen className="w-4 h-4" />,
    items: [
      { name: "Blog học thuật", path: "/blog", desc: "Kiến thức & tin tức" },
      { name: "Trung tâm hỗ trợ", path: "/support", desc: "Giải đáp thắc mắc" },
      {
        name: "Hướng dẫn sử dụng",
        path: "/tutorials",
        desc: "Video & tài liệu",
      },
    ],
  },
  {
    label: "Công ty",
    icon: <Users className="w-4 h-4" />,
    items: [
      { name: "Về ChemXLab", path: "/about", desc: "Sứ mệnh & Tầm nhìn" },
      { name: "Liên hệ", path: "/contact", desc: "Kết nối với chúng tôi" },
    ],
  },
];

const Navbar = () => {
  // --- 3. State Management với Types ---
  // activeDropdown có thể là string (tên menu) hoặc null
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  // useRef cần định nghĩa rõ kiểu Element (HTMLDivElement)
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- 4. Effects ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ép kiểu event.target về Node để kiểm tra contains
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
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
    if (activeDropdown === label) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(label);
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-[100] transition-all duration-300 bg-white/95 backdrop-blur-md ${
        scrolled
          ? "shadow-md border-b border-gray-100"
          : "border-b border-transparent"
      }`}
    >
      <div
        className="container mx-auto px-6 h-20 flex items-center justify-between"
        ref={dropdownRef}
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="ChemXLab"
            className="h-10 w-auto object-contain"
          />
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

        {/* RIGHT ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
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
            <div className="pt-4">
              <Link
                to="/experience"
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-bold"
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
