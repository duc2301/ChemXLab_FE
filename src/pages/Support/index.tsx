import {
  ChevronDown,
  Headphones,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

const SUPPORT_EMAIL = "lanhatnam1612@gmail.com";
const SUPPORT_PHONE = "+84 123 456 789";

const SupportPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subjectText = formData.subject ? `[${formData.subject}] ` : "";
    const body = `Họ tên: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subjectText + "Yêu cầu hỗ trợ từ " + formData.name)}&body=${encodeURIComponent(body)}`;
  };

  const faqs = [
    {
      q: "Làm thế nào để bắt đầu sử dụng ChemXLab?",
      a: "Bạn có thể đăng ký tài khoản miễn phí và bắt đầu khám phá các thí nghiệm cơ bản ngay lập tức. Chỉ cần nhấn nút 'Đăng ký' ở góc trên bên phải của trang web.",
    },
    {
      q: "ChemXLab có hỗ trợ tiếng Việt không?",
      a: "Có, ChemXLab hỗ trợ đầy đủ tiếng Việt cho cả giao diện và nội dung học tập. Đây là một trong những ưu tiên hàng đầu của chúng tôi để phục vụ học sinh Việt Nam.",
    },
    {
      q: "Tôi có thể sử dụng ChemXLab trên thiết bị di động không?",
      a: "Có, ChemXLab tương thích với mọi thiết bị bao gồm máy tính, máy tính bảng và điện thoại. Giao diện được tối ưu hóa cho từng loại màn hình.",
    },
    {
      q: "Làm sao để nâng cấp gói dịch vụ?",
      a: "Bạn có thể nâng cấp gói dịch vụ bất cứ lúc nào bằng cách vào trang 'Trải nghiệm' và chọn gói phù hợp. Chi phí sẽ được tính toán dựa trên thời gian còn lại của gói hiện tại.",
    },
    {
      q: "Chính sách hoàn tiền như thế nào?",
      a: "Chúng tôi có chính sách hoàn tiền trong 7 ngày đầu tiên nếu bạn không hài lòng với dịch vụ. Vui lòng liên hệ đội ngũ hỗ trợ để được hướng dẫn cụ thể.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Hero Section - Light with blue accent */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-white">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Headphones className="w-4 h-4" />
              Hỗ trợ tận tâm
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Trung tâm{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Hỗ trợ
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Đội ngũ ChemXLab luôn sẵn sàng giải đáp mọi thắc mắc và hỗ trợ bạn trong suốt hành trình học tập
            </p>

            {/* Quick Contact - Inline Style */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-500 font-medium">Email hỗ trợ</div>
                  <div className="text-base font-bold text-slate-900">{SUPPORT_EMAIL}</div>
                </div>
              </a>

              <a
                href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}
                className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border-2 border-slate-200 hover:border-cyan-400 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-500 font-medium">Hotline</div>
                  <div className="text-base font-bold text-slate-900">{SUPPORT_PHONE}</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Contact Form & FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
                Gửi yêu cầu hỗ trợ
              </h2>
              <p className="text-slate-600 mb-6">Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email của bạn</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Chủ đề</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  >
                    <option value="">Chọn chủ đề liên quan</option>
                    <option value="Hỗ trợ kỹ thuật">Hỗ trợ kỹ thuật</option>
                    <option value="Thanh toán">Thanh toán & Gói dịch vụ</option>
                    <option value="Tài khoản">Tài khoản & Đăng nhập</option>
                    <option value="Góp ý">Góp ý & Phản hồi</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nội dung chi tiết</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all resize-none"
                    placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Gửi email hỗ trợ
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Câu hỏi thường gặp</h2>
                  <p className="text-slate-600 text-sm">Những thắc mắc phổ biến nhất</p>
                </div>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-white border-2 border-slate-100 rounded-xl overflow-hidden hover:border-blue-200 transition-colors shadow-sm"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="font-semibold text-slate-900 pr-4">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-blue-600 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-40" : "max-h-0"
                        }`}
                    >
                      <p className="px-5 pb-5 text-slate-600 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark accent */}
      <section className="py-16 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Vẫn cần thêm hỗ trợ?
          </h2>
          <p className="text-slate-300 text-lg max-w-xl mx-auto mb-8">
            Trợ lý AI của ChemXLab luôn sẵn sàng hỗ trợ bạn 24/7
          </p>
          <Link
            to="/chatbot"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            Chat với AI ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
