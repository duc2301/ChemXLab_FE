import { Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../shared/assets/Logo/logo.png";

const TikTok = ({ size = 20 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.66a8.2 8.2 0 0 0 4.79 1.53V6.75a4.85 4.85 0 0 1-1.02-.06z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-[#ffffff] pt-14 pb-0 font-sans">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">

          {/* COLUMN 1: Logo + Description + Socials */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link to="/">
              <img src={logo} alt="ChemXLab" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Phòng thí nghiệm hóa học ảo giúp học sinh học hóa học an toàn, sáng tạo và đầy cảm hứng.
            </p>
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://www.facebook.com/ChemxLab201"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-blue-600 hover:text-white text-slate-600 flex items-center justify-center transition-all duration-200"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.tiktok.com/@chemxlab_231"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-800 hover:text-white text-slate-600 flex items-center justify-center transition-all duration-200"
              >
                <TikTok size={16} />
              </a>
              <a
                href="https://www.instagram.com/chemxlab"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-pink-600 hover:text-white text-slate-600 flex items-center justify-center transition-all duration-200"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* COLUMN 2: Sản phẩm */}
          <div>
            <h4 className="text-slate-800 font-semibold text-sm mb-4">Sản phẩm</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Thí nghiệm hóa học", path: "/labtest" },
                { label: "Thư viện thí nghiệm", path: "/library" },
                { label: "Bảng tuần hoàn", path: "/periodic-table" },
                { label: "Bảng giá", path: "/experience" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-slate-500 hover:text-blue-600 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Hỗ trợ */}
          <div>
            <h4 className="text-slate-800 font-semibold text-sm mb-4">Hỗ trợ</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Trung tâm hỗ trợ", path: "/support" },
                { label: "Liên hệ chúng tôi", path: "/support" },
                { label: "Câu hỏi thường gặp", path: "/support" },
                { label: "Lịch sử cập nhật", path: "/about" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-slate-500 hover:text-blue-600 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: Pháp lý */}
          <div>
            <h4 className="text-slate-800 font-semibold text-sm mb-4">Pháp lý</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Điều khoản dịch vụ", path: "/terms" },
                { label: "Chính sách bảo mật", path: "/privacy" },
                { label: "Chính sách hoàn tiền", path: "/refund" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-slate-500 hover:text-blue-600 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className=" bg-[#ffffff]">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center gap-2 justify-center">
          <p className="text-slate-400 text-xs flex text-center">
            © 2025 ChemXLab. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;