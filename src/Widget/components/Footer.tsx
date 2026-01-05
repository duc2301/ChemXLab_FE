import { Facebook, Github, Linkedin, Twitter, Youtube } from "lucide-react";
import logo from "../../shared/assets/Logo/LogoChemX.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-slate-100 font-sans">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
          
          {/* Cột 1 & 2: Logo & Socials (Chiếm 2 cột trên màn hình lớn) */}
          <div className="col-span-2 lg:col-span-2 pr-8">
            <Link to="/" className="flex items-center gap-2 mb-6">
               <img src={logo} alt="ChemXLab" className="h-8 w-auto object-contain " />
               <span className="text-xl font-bold text-slate-800">ChemXLab</span>
            </Link>
            
            {/* Social Icons (Nhỏ, xám) */}
            <div className="flex gap-4 mt-6">
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Youtube size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
              <SocialIcon icon={<Github size={18} />} />
            </div>
          </div>

          {/* Các cột Links - Typography nhỏ, đậm tiêu đề */}
          <div className="col-span-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Sản phẩm</h4>
            <ul className="space-y-3">
              <FooterLink to="/3d-models" label="Mô hình 3D" />
              <FooterLink to="/studio" label="Human Studio" />
              <FooterLink to="/mobile" label="Ứng dụng Mobile" />
              <FooterLink to="/vr" label="Thực tế ảo (VR)" />
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Tìm hiểu</h4>
            <ul className="space-y-3">
              <FooterLink to="/customers" label="Khách hàng" />
              <FooterLink to="/case-studies" label="Câu chuyện thành công" />
              <FooterLink to="/blog" label="Blog Giáo dục" />
              <FooterLink to="/events" label="Sự kiện & Webinar" />
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Công ty</h4>
            <ul className="space-y-3">
              <FooterLink to="/about" label="Về chúng tôi" />
              <FooterLink to="/careers" label="Tuyển dụng" />
              <FooterLink to="/press" label="Báo chí" />
              <FooterLink to="/contact" label="Liên hệ" />
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Tài nguyên</h4>
            <ul className="space-y-3">
              <FooterLink to="/help" label="Trung tâm hỗ trợ" />
              <FooterLink to="/api" label="Tài liệu API" />
              <FooterLink to="/status" label="System Status" />
              <FooterLink to="/privacy" label="Chính sách bảo mật" />
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} ChemXLab Inc. Bản quyền đã được bảo hộ.
          </p>
          <div className="flex gap-6">
            <Link to="/terms" className="text-xs text-slate-400 hover:text-slate-800 transition-colors">Điều khoản</Link>
            <Link to="/privacy" className="text-xs text-slate-400 hover:text-slate-800 transition-colors">Bảo mật</Link>
            <Link to="/cookies" className="text-xs text-slate-400 hover:text-slate-800 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Component con để code gọn hơn
const FooterLink = ({ to, label }) => (
  <li>
    <Link to={to} className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors">
      {label}
    </Link>
  </li>
);

const SocialIcon = ({ icon }) => (
  <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors">
    {icon}
  </a>
);

export default Footer;