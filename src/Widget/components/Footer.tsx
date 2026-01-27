import { Facebook, Youtube, Mail } from "lucide-react";
import logo from "../../shared/assets/Logo/logo.png";

const Footer = () => {
  return (
    <footer className="font-sans pt-8 bg-[#0B3B69]">
      {/* Main Footer Container - Rounded Top, Light Blue */}
      <div className="w-full bg-[#EAF5FF] rounded-t-[40px] md:rounded-t-[50px] pt-10 pb-8 px-6 md:px-10 relative overflow-hidden">

        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-8">

            {/* COLUMN 1: Newsletter */}
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h3 className="text-[#0B3B69] font-bold text-lg mb-2">Đăng ký thông tin</h3>
              <p className="text-slate-500 text-xs mb-4 max-w-xs leading-relaxed">
                Đăng ký thông tin để nhận ngay thông tin mới nhất từ ChemXLab nhé!
              </p>

              <form className="relative w-full max-w-xs sm:max-w-sm flex items-center shadow-lg rounded-full">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-white/70 backdrop-blur-sm border border-blue-100 rounded-full py-3.5 pl-6 pr-24 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1.5 bottom-1.5 bg-[#EAF5FF] hover:bg-white text-[#0B3B69] text-xs font-bold px-4 rounded-full transition-all border border-blue-100 shadow-sm"
                >
                  Đăng ký
                </button>
              </form>
            </div>

            {/* COLUMN 2: Logo - Centered */}
            <div className="w-full lg:w-1/3 flex justify-center items-center">
              <div className="relative z-10 p-4">
                {/* Glow effect behind logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-400/20 blur-3xl rounded-full -z-10"></div>
                <img src={logo} alt="ChemXLab" className="h-16 md:h-20 w-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300 ease-out" />
              </div>
            </div>

            {/* COLUMN 3: Contact */}
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-end text-center lg:text-right">
              <h3 className="text-[#0B3B69] font-bold text-lg mb-4">Liên hệ</h3>
              <div className="flex gap-6">
                <SocialIcon icon={<Facebook size={22} />} href="https://facebook.com" />
                <SocialIcon icon={<Mail size={22} />} href="mailto:contact@chemxlab.vn" />
                <SocialIcon icon={<Youtube size={22} />} href="https://youtube.com" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* BOTTOM BAR - Dark Blue */}
      <div className="bg-[#0B3B69] py-2.5 text-center relative z-20">
        <p className="text-white/90 text-xs font-bold tracking-[0.3em] uppercase">
          CHEMXLAB
        </p>
      </div>
    </footer>
  );
};

interface SocialIconProps {
  icon: React.ReactNode;
  href?: string;
}

const SocialIcon = ({ icon, href }: SocialIconProps) => (
  <a
    href={href || "#"}
    className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0B3B69] text-white hover:bg-[#0EA5E9] hover:-translate-y-1 transition-all duration-300 shadow-md shadow-blue-900/20"
  >
    {icon}
  </a>
);

export default Footer;