import {
  ChevronDown,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Send
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

const SUPPORT_EMAIL = "chemxlab567@gmail.com";
const SUPPORT_PHONE = "+84 879487855";

const SupportPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subjectPrefix = formData.category ? `[${formData.category}] ` : "";
    const subjectMain = formData.subject ? formData.subject : `Yêu cầu hỗ trợ từ ${formData.name}`;
    const subjectText = subjectPrefix + subjectMain;
    const body = `Họ tên: ${formData.name}\nEmail: ${formData.email}\nDanh mục: ${formData.category}\n\n${formData.message}`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(body)}`;
  };

  const faqs = [
    {
      q: "Làm thế nào để tạo một tài khoản mới?",
      a: "Bạn có thể dễ dàng tạo tài khoản bằng cách nhấp vào nút 'Đăng ký' ở góc trên bên phải màn hình. Sau đó, điền các thông tin cá nhân cơ bản và xác nhận email của bạn.",
    },
    {
      q: "Yêu cầu cấu hình tối thiểu để chạy ChemXLab là gì?",
      a: "ChemXLab là nền tảng trên trình duyệt, bạn chỉ cần thiết bị có kết nối internet ổn định và trình duyệt web cập nhật mới nhất (Chrome, Firefox, Safari, Edge) là có thể sử dụng mượt mà.",
    },
  ];

  return (
    <div className="w-full bg-white font-sans text-slate-900 overflow-hidden relative pb-[80px]">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-[3677px] bg-gradient-to-b from-[#F0F7FF] to-white pointer-events-none z-0" />

      {/* ═══════════════════════════════════════
          HERO & SEARCH SECTION
      ═══════════════════════════════════════ */}
      <section className="relative z-10 pt-[160px] pb-[80px] bg-gradient-to-b from-white to-[#E0EFFF] flex flex-col items-center">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ background: "url('/noise.png')" }}></div>

        <div className="flex flex-col items-center w-full max-w-[1280px] px-8">
          <h1 className="font-space font-bold text-[48px] md:text-[60px] leading-[1] text-[#003D7A] tracking-[-1.2px] mb-4 text-center">
            Trung tâm Hỗ trợ
          </h1>
          <p className="font-lexend font-bold text-[16px] md:text-[18px] leading-[28px] text-[#475569] text-center mb-[64px] max-w-[683px]">
            Tìm kiếm câu trả lời nhanh chóng hoặc liên hệ với đội ngũ chuyên gia của chúng tôi.
          </p>

          <div className="w-full max-w-[768px] bg-white border border-[#E0EFFF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[16px] p-4 flex flex-col gap-6">
            <div className="relative w-full h-[56px] bg-[#F8FAFC]/50 rounded-[12px] flex items-center px-6">
              <Search className="w-[18px] h-[18px] text-[#94A3B8] mr-3" />
              <input
                type="text"
                placeholder="Bạn cần hỗ trợ điều gì?"
                className="bg-transparent border-none outline-none flex-1 font-lexend font-bold text-[16px] text-slate-700 placeholder:text-[#9CA3AF] h-full"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-[#438BC4] to-[#0055A0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[12px] font-lexend font-semibold text-[14px] text-white transition-transform hover:scale-105 active:scale-95">
                Tìm kiếm
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button className="px-4 py-1.5 bg-white border border-[#E2E8F0] rounded-full font-lexend font-semibold text-[12px] text-[#475569] hover:bg-slate-50 transition-colors">
                Đăng ký tài khoản
              </button>
              <button className="px-4 py-1.5 bg-white border border-[#E2E8F0] rounded-full font-lexend font-semibold text-[12px] text-[#475569] hover:bg-slate-50 transition-colors">
                Cách chạy mô phỏng
              </button>
              <button className="px-4 py-1.5 bg-white border border-[#E2E8F0] rounded-full font-lexend font-semibold text-[12px] text-[#475569] hover:bg-slate-50 transition-colors">
                Lỗi hiển thị 3D
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CATEGORIES & FAQ SECTION
      ═══════════════════════════════════════ */}
      <section className="relative z-10 py-[64px] md:py-[80px] bg-white flex flex-col items-center">
        <div className="absolute right-[5%] top-[20%] w-[300px] h-[300px] bg-[#B8DCFF] opacity-30 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-[1280px] px-8 flex flex-col items-center gap-[48px]">
          <h2 className="font-space font-bold text-[30px] leading-[36px] text-[#003D7A] tracking-[-0.6px] text-center mb-4">
            Danh mục câu hỏi
          </h2>

          {/* Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-[1216px]">
            {/* Card 1 */}
            <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[16px] h-[158px] relative hover:-translate-y-1 transition-transform cursor-pointer group">
              <div className="absolute w-[48px] h-[48px] left-[25px] top-[25px] bg-[#F0F7FF] rounded-[12px] flex items-center justify-center group-hover:bg-[#E0EFFF] transition-colors">
                <svg width="18" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#0072E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#0072E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="absolute left-[25px] top-[89px] font-inter font-bold text-[16px] leading-[24px] text-[#003D7A]">
                Tài khoản
              </h3>
              <p className="absolute left-[25px] top-[117px] font-inter font-medium text-[12px] leading-[16px] text-[#64748B]">
                Đăng nhập, bảo mật
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[16px] h-[158px] relative hover:-translate-y-1 transition-transform cursor-pointer group">
              <div className="absolute w-[48px] h-[48px] left-[25px] top-[25px] bg-[#E0EFFF] rounded-[12px] flex items-center justify-center group-hover:bg-[#D0E7FF] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C20.9996 7.64927 20.9071 7.30699 20.7315 7.00635C20.556 6.70572 20.3033 6.45683 20 6.28L13 2.28C12.6961 2.09647 12.3511 2.00005 12 2.00005C11.6489 2.00005 11.3039 2.09647 11 2.28L4 6.28C3.69675 6.45683 3.44399 6.70572 3.26846 7.00635C3.09294 7.30699 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.693 3.26846 16.9936C3.44399 17.2943 3.69675 17.5432 4 17.72L11 21.72C11.3039 21.9035 11.6489 22 12 22C12.3511 22 12.6961 21.9035 13 21.72L20 17.72C20.3033 17.5432 20.556 17.2943 20.7315 16.9936C20.9071 16.693 20.9996 16.3507 21 16Z" stroke="#005BB5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.27002 6.96L12 12.01L20.73 6.96" stroke="#005BB5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 22.08V12" stroke="#005BB5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="absolute left-[25px] top-[89px] font-inter font-bold text-[16px] leading-[24px] text-[#003D7A]">
                Mô phỏng 3D
              </h3>
              <p className="absolute left-[25px] top-[117px] font-inter font-medium text-[12px] leading-[16px] text-[#64748B]">
                Cách sử dụng phòng lab
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[16px] h-[158px] relative hover:-translate-y-1 transition-transform cursor-pointer group">
              <div className="absolute w-[48px] h-[48px] left-[25px] top-[25px] bg-[#F0F7FF] rounded-[12px] flex items-center justify-center group-hover:bg-[#E0EFFF] transition-colors">
                <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="#0072E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1 10H23" stroke="#0072E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="absolute left-[25px] top-[89px] font-inter font-bold text-[16px] leading-[24px] text-[#003D7A]">
                Thanh toán
              </h3>
              <p className="absolute left-[25px] top-[117px] font-inter font-medium text-[12px] leading-[16px] text-[#64748B]">
                Gói cước, hóa đơn
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[16px] h-[158px] relative hover:-translate-y-1 transition-transform cursor-pointer group">
              <div className="absolute w-[48px] h-[48px] left-[25px] top-[25px] bg-[#E0EFFF] rounded-[12px] flex items-center justify-center group-hover:bg-[#D0E7FF] transition-colors">
                <svg width="24" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 10V15C22 15 22 19 12 19C2 19 2 15 2 15V10L12 5L22 10Z" stroke="#005BB5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 12V15C6 16.6569 8.68629 18 12 18C15.3137 18 18 16.6569 18 15V12" stroke="#005BB5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="absolute left-[25px] top-[89px] font-inter font-bold text-[16px] leading-[24px] text-[#003D7A]">
                Trường học
              </h3>
              <p className="absolute left-[25px] top-[117px] font-inter font-medium text-[12px] leading-[16px] text-[#64748B]">
                Quản lý học sinh, lớp học
              </p>
            </div>
          </div>

          {/* FAQ List */}
          <div className="w-full max-w-[896px] mt-12 flex flex-col gap-4">
            <div className="text-center mb-8">
              <h2 className="font-space font-bold text-[30px] leading-[36px] text-[#04306E] mb-2">
                Câu hỏi thường gặp
              </h2>
              <p className="font-lexend font-normal text-[16px] leading-[24px] text-[#64748B]">
                Giải đáp các thắc mắc phổ biến nhất của người dùng
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white border border-[#B8DCFF] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[24px] overflow-hidden transition-all hover:shadow-md">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-lexend font-semibold text-[18px] text-[#04306E] pr-4">{faq.q}</span>
                    <div className="w-8 h-8 rounded-full bg-[#E0EFFF] flex flex-shrink-0 items-center justify-center text-[#438BC4]">
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                    </div>
                  </button>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === i ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="px-6 pb-6 pt-0 text-[#64748B] font-inter text-[15px] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CONTACT FORM SECTION
      ═══════════════════════════════════════ */}
      <section className="relative z-10 py-[80px] px-8 bg-gradient-to-b from-white to-[#F0F7FF] flex justify-center">

        {/* Decor */}
        <div className="absolute left-[-2%] top-[5%] w-[229px] h-[213px] bg-gradient-to-r from-[#E0EFFF] to-[#B8DCFF] opacity-60 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute right-[-5%] bottom-[10%] w-[320px] h-[290px] bg-gradient-to-r from-[#B8DCFF] to-[#7AC1FF] opacity-60 blur-[70px] rounded-full pointer-events-none" />

        <div className="w-full max-w-[1216px] flex flex-col lg:flex-row gap-16 relative z-10">

          {/* Left Column: Form */}
          <div className="flex-1 flex flex-col gap-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F0F7FF] to-[#E0EFFF] border border-[#B8DCFF] rounded-full mb-6">
                <MessageCircle className="w-4 h-4 text-[#005BB5]" />
                <span className="font-inter font-bold text-[14px] text-[#003D7A]">Hỗ trợ nhanh</span>
              </div>
              <h2 className="font-inter font-extrabold text-[40px] md:text-[48px] leading-[1] text-[#003D7A] tracking-[-0.96px] mb-4">
                Gửi yêu cầu hỗ trợ ngay
              </h2>
              <p className="font-inter font-medium text-[18px] text-[#475569]">
                Đội ngũ chuyên gia sẽ phản hồi trong vòng 24 giờ làm việc
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <label className="font-inter font-bold text-[14px] text-[#003D7A]">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-[59px] bg-white border-2 border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[16px] px-6 font-inter font-medium text-[16px] text-[#334155] placeholder:text-[#9CA3AF] focus:border-[#0072E5] focus:outline-none transition-colors"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-inter font-bold text-[14px] text-[#003D7A]">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-[59px] bg-white border-2 border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[16px] px-6 font-inter font-medium text-[16px] text-[#334155] placeholder:text-[#9CA3AF] focus:border-[#0072E5] focus:outline-none transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="font-inter font-bold text-[14px] text-[#003D7A]">Danh mục vấn đề *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-[58px] bg-[#EFEFEF] border-2 border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[16px] px-6 font-inter font-medium text-[16px] text-[#334155] focus:border-[#0072E5] focus:outline-none appearance-none"
                  style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')", backgroundPosition: "right 20px center", backgroundRepeat: "no-repeat" }}
                >
                  <option value="" disabled className="text-[#9CA3AF]">Chọn danh mục</option>
                  <option value="Hỗ trợ kỹ thuật">Hỗ trợ kỹ thuật / Lỗi phần mềm</option>
                  <option value="Thanh toán">Thanh toán & Gói dịch vụ</option>
                  <option value="Tài khoản">Tài khoản & Đăng nhập</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label className="font-inter font-bold text-[14px] text-[#003D7A]">Tiêu đề *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full h-[59px] bg-white border-2 border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[16px] px-6 font-inter font-medium text-[16px] text-[#334155] placeholder:text-[#9CA3AF] focus:border-[#0072E5] focus:outline-none transition-colors"
                  placeholder="Tóm tắt vấn đề của bạn"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="font-inter font-bold text-[14px] text-[#003D7A]">Mô tả chi tiết *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full h-[180px] resize-none bg-white border-2 border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[16px] px-6 py-4 font-inter font-medium text-[16px] text-[#334155] placeholder:text-[#9CA3AF] focus:border-[#0072E5] focus:outline-none transition-colors"
                  placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full h-[68px] mt-4 bg-gradient-to-r from-[#0072E5] to-[#005BB5] shadow-[0_20px_25px_-5px_rgba(0,61,122,0.3)] hover:shadow-[0_25px_30px_-5px_rgba(0,61,122,0.4)] rounded-[16px] flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95"
              >
                <Send className="w-[18px] h-[18px] text-white" />
                <span className="font-inter font-bold text-[18px] text-white">Gửi yêu cầu hỗ trợ</span>
              </button>
            </form>
          </div>

          {/* Right Column: Contact Info Cards */}
          <div className="w-full lg:w-[544px] flex flex-col gap-6 shrink-0">
            {/* CTA Chatbot Card */}
            <div className="w-full h-[438.5px] bg-gradient-to-br from-[#003D7A] via-[#004A94] to-[#005BB5] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-[24px] p-10 relative overflow-hidden flex flex-col">
              <div className="absolute right-0 top-0 w-[256px] h-[256px] bg-white/5 blur-[32px] rounded-full pointer-events-none" />

              <div className="w-[80px] h-[80px] bg-white/10 backdrop-blur-sm rounded-[24px] flex items-center justify-center mb-8 relative z-10 shadow-sm border border-white/10">
                <MessageCircle className="w-[36px] h-[36px] text-white" />
              </div>

              <h3 className="font-inter font-black text-[30px] leading-[36px] text-white tracking-[-0.6px] mb-6 relative z-10">
                Theo dõi và học <br />hiệu quả hơn cùng AI
              </h3>

              <p className="font-inter font-medium text-[16px] text-white/90 leading-relaxed mb-8 relative z-10">
                Trợ lý AI của ChemXLab luôn sẵn sàng đồng hành cùng bạn trong mọi bài thực hành, 24/7.
              </p>

              <Link
                to="/chatbot"
                className="mt-auto h-[64px] bg-white text-[#003D7A] rounded-[16px] flex items-center justify-center gap-3 font-inter font-bold text-[16px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-shadow group relative z-10"
              >
                <MessageCircle className="w-6 h-6 text-[#003D7A]" />
                <span>Chat với AI ngay</span>
              </Link>
            </div>

            <h3 className="font-inter font-extrabold text-[24px] text-[#003D7A] tracking-[-0.48px] mt-2 mb-2">
              Thông tin liên hệ
            </h3>

            {/* Email Card */}
            <div className="w-full bg-white border border-[#E2E8F0] shadow-sm rounded-[16px] p-6 flex items-start gap-5 hover:border-[#B8DCFF] transition-colors">
              <div className="w-[56px] h-[56px] shrink-0 bg-gradient-to-br from-[#E0EFFF] to-[#B8DCFF] rounded-[16px] flex items-center justify-center shadow-sm">
                <Mail className="w-6 h-6 text-[#0072E5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-inter font-extrabold text-[16px] text-[#003D7A] mb-1">Email hỗ trợ</span>
                <span className="font-inter font-bold text-[16px] text-[#0072E5] mb-1">{SUPPORT_EMAIL}</span>
                <span className="font-inter font-medium text-[14px] text-[#64748B]">Phản hồi nhanh trong 2 - 4 giờ</span>
              </div>
            </div>

            {/* Phone Card */}
            <div className="w-full bg-white border border-[#E2E8F0] shadow-sm rounded-[16px] p-6 flex items-start gap-5 hover:border-[#B8DCFF] transition-colors">
              <div className="w-[56px] h-[56px] shrink-0 bg-gradient-to-br from-[#E0EFFF] to-[#B8DCFF] rounded-[16px] flex items-center justify-center shadow-sm">
                <Phone className="w-6 h-6 text-[#0072E5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-inter font-extrabold text-[16px] text-[#003D7A] mb-1">Hotline</span>
                <span className="font-inter font-bold text-[16px] text-[#0072E5] mb-1">{SUPPORT_PHONE}</span>
                <span className="font-inter font-medium text-[14px] text-[#64748B]">T2 - T6, 8:00 - 17:30</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
