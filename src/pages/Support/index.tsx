import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 pt-16">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 text-center">
          Trung tâm <span className="text-blue-600">Hỗ trợ</span>
        </h1>
        <p className="text-lg text-slate-600 text-center mb-12 max-w-3xl mx-auto">
          Đội ngũ hỗ trợ của ChemXLab luôn sẵn sàng giải đáp mọi thắc mắc của
          bạn
        </p>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Liên hệ với chúng tôi
            </h2>

            <div className="space-y-4">
              {[
                {
                  icon: <Mail className="w-6 h-6 text-white" />,
                  text: "support@chemxlab.com",
                  color: "from-blue-500 to-blue-700",
                },
                {
                  icon: <Phone className="w-6 h-6 text-white" />,
                  text: "+84 123 456 789",
                  color: "from-green-500 to-green-700",
                },
                {
                  icon: <MapPin className="w-6 h-6 text-white" />,
                  text: "Khu Công nghệ cao, TP. Thủ Đức, TP.HCM",
                  color: "from-red-500 to-red-700",
                },
                {
                  icon: <MessageCircle className="w-6 h-6 text-white" />,
                  text: "Chat trực tuyến (8:00 - 17:00)",
                  color: "from-purple-500 to-purple-700",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 bg-gradient-to-r ${item.color} p-5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all`}
                >
                  <div className="bg-white/20 backdrop-blur p-2.5 rounded-xl border-2 border-white/30">
                    {item.icon}
                  </div>
                  <span className="text-white font-semibold text-lg">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-blue-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Gửi tin nhắn
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="w-full bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Nội dung
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Bạn cần hỗ trợ gì?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3.5 rounded-xl hover:shadow-xl hover:scale-105 transition-all inline-flex items-center justify-center gap-3"
              >
                <Send className="w-5 h-5" />
                Gửi yêu cầu
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Làm thế nào để bắt đầu sử dụng ChemXLab?",
                a: "Bạn có thể đăng ký tài khoản miễn phí và bắt đầu khám phá các thí nghiệm cơ bản ngay lập tức.",
              },
              {
                q: "ChemXLab có hỗ trợ tiếng Việt không?",
                a: "Có, ChemXLab hỗ trợ đầy đủ tiếng Việt cho giao diện và nội dung học tập.",
              },
              {
                q: "Tôi có thể sử dụng ChemXLab trên thiết bị di động không?",
                a: "Có, ChemXLab tương thích với mọi thiết bị bao gồm máy tính, tablet và điện thoại.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:border-blue-400 hover:shadow-xl transition-all"
              >
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm lg:text-base">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
