import { Facebook, Mail } from "lucide-react";
import logo from "../../shared/assets/Logo/logo.png";

const TikTok = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="font-sans -mt-10 relative z-20">
      {/* Main Footer Container - Rounded Top, Light Blue */}
      <div className="w-full bg-[#EAF5FF] rounded-t-[40px] md:rounded-t-[50px] pt-10 pb-8 px-6 md:px-10 relative overflow-hidden">

        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-8">

            {/* COLUMN 1: Fanpage CTA */}
            <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h3 className="text-[#0B3B69] font-bold text-lg mb-2">Theo dõi ChemXLab</h3>
              <p className="text-slate-500 text-xs mb-4 max-w-xs leading-relaxed">
                Hãy theo dõi Fanpage của ChemXLab để cập nhật những thông tin mới nhất nhé!
              </p>

              <a
                href="https://www.facebook.com/ChemxLab201"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0B3B69] hover:bg-[#0EA5E9] text-white text-sm font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-lg shadow-blue-900/20 hover:-translate-y-0.5"
              >
                <Facebook size={18} />
                Theo dõi Fanpage
              </a>
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
                <SocialIcon icon={<Facebook size={22} />} href="https://www.facebook.com/ChemxLab201" />
                <SocialIcon icon={<Mail size={22} />} href="mailto:chemxlab567@gmail.com" />
                <SocialIcon icon={<TikTok size={22} />} href="https://www.tiktok.com/@chemxlab_231" />
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
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0B3B69] text-white hover:bg-[#0EA5E9] hover:-translate-y-1 transition-all duration-300 shadow-md shadow-blue-900/20"
  >
    {icon}
  </a>
);

export default Footer;