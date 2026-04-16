import { ArrowRight, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../shared/assets/Logo/logo.png";
import Mascot9 from "../../shared/assets/mascot/9.png";

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
    <div className="bg-white px-20 pt-12 pb-8">
      {/* ═══════════════════════════════════════
          CTA Section — shared across all pages
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-sky-50 rounded-4xl">
        <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-2 md:left-4 lg:left-16 xl:left-32 hidden md:block z-10">
          <img src={Mascot9} alt="Mascot9" className="w-36 md:w-44 lg:w-52 h-auto object-contain" />
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[350px] rounded-full bg-blue-200/20 blur-3xl" />
        </div>
        <div className="relative z-10 py-16 md:py-20 px-6">
          <div className="max-w-[634px] mx-auto md:ml-auto md:mr-4 xl:mx-auto text-center space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold text-sky-900">
              Sẵn sàng khám phá thế giới <span className="text-sky-600">Hóa học?</span>
            </h2>
            <p className="text-sky-950 text-lg font-semibold md:text-base">
              Tham gia cùng hàng ngàn giáo viên và học sinh đã tin tưởng ChemXLab.{" "}
              Bắt đầu miễn phí ngay hôm nay!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link to="/register" className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all shadow-md shadow-sky-500/25 hover:-translate-y-0.5 w-full sm:w-auto">
                Đăng kí miễn phí <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="flex items-center justify-center gap-2 text-[#1e2a4a] font-semibold border border-[#1e2a4a] hover:bg-white px-8 py-3.5 rounded-full text-sm bg-white/60 transition-all w-full sm:w-auto">
                Dùng thử
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          Footer
      ═══════════════════════════════════════ */}
      <footer className="bg-white pt-14 pb-0 font-sans">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">

            {/* COLUMN 1: Logo + Description + Socials */}
            <div className="md:col-span-1 flex flex-col gap-4">
              <Link to="/">
                <img src={logo} alt="ChemXLab" className="h-10 w-auto object-contain" />
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed">
                Mang phòng thí nghiệm hóa học 3D đến tay bạn. An toàn, hiệu quả và cực kỳ vui nhộn.
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
              </div>
            </div>

            {/* COLUMN 2: Sản phẩm */}
            <div>
              <h4 className="text-slate-800 font-semibold text-sm mb-4">Sản phẩm</h4>
              <ul className="flex flex-col gap-2.5">
                {[
                  { label: "Thí nghiệm ảo", path: "/lab" },
                  { label: "Thư viện hóa học", path: "/library" },
                  { label: "Bảng tuần hoàn", path: "/periodic-table" },
                  { label: "Bảng giá", path: "/pricing" },
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
                  { label: "Giới thiệu", path: "/about" },
                  { label: "Trung tâm trợ giúp", path: "/support" },
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
                  { label: "Bản quyền", path: "/copyright" },
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
        <div className="border-t border-slate-100">
          <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center gap-2 justify-center">
            <p className="text-slate-400 text-xs text-center">
              ©2026 ChemXLab. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;