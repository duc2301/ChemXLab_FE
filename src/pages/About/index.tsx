import {
  ArrowRight,
  Beaker,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  Globe,
  GraduationCap,
  Heart,
  Lightbulb,
  Rocket,
  Sparkles,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Integrated Hero & TVC Section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-white">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-cyan-50 rounded-full blur-3xl opacity-50"></div>
          {/* Subtle floating circles */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-cyan-200 rounded-full animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left Column: Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                Nền tảng giáo dục Hóa học hàng đầu Việt Nam
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                Chào mừng đến với{" "}
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
                  ChemXLab
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10">
                ChemXLab là nền tảng tiên phong ứng dụng công nghệ thực tế ảo và mô phỏng 3D vào giáo dục Hóa học.
                Chúng tôi trực quan hóa kiến thức, biến những công thức khô khan thành trải nghiệm sinh động.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/labtest"
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <FlaskConical className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Trải nghiệm ngay
                </Link>
                <Link
                  to="/library"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Khám phá thư viện
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right Column: TVC Video */}
            <div className="w-full lg:w-1/2 relative group">
              {/* Cinematic background glow for video */}
              <div className="absolute -inset-4 bg-linear-to-r from-blue-400 to-cyan-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10 border-4 border-white aspect-[1.72/1] bg-white transform hover:scale-[1.02] transition-transform duration-500">
                <iframe
                  src="https://drive.google.com/file/d/10PFmUjz2zfMB-_7yz0JI2squBfbytGCM/preview"
                  title="ChemXLab TVC"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full scale-[1.04]"
                  style={{ border: 0 }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Học sinh sử dụng", icon: <Users className="w-5 h-5" /> },
              { number: "500+", label: "Thí nghiệm mô phỏng", icon: <Beaker className="w-5 h-5" /> },
              { number: "50+", label: "Trường học tin dùng", icon: <GraduationCap className="w-5 h-5" /> },
              { number: "4.9/5", label: "Đánh giá trung bình", icon: <Star className="w-5 h-5" /> },
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">
              Giá trị cốt lõi
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Sứ mệnh & Tầm nhìn
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Target className="w-7 h-7" />,
                title: "Sứ mệnh",
                desc: "Phổ cập kiến thức Hóa học thông qua công nghệ tiên tiến, giúp mọi học sinh tiếp cận khoa học một cách trực quan và thú vị nhất.",
                color: "bg-blue-100 text-blue-600",
                borderColor: "hover:border-blue-300",
              },
              {
                icon: <Globe className="w-7 h-7" />,
                title: "Tầm nhìn",
                desc: "Trở thành nền tảng giáo dục STEM hàng đầu Đông Nam Á, xây dựng thế hệ nhà khoa học yêu thích khám phá và sáng tạo.",
                color: "bg-cyan-100 text-cyan-600",
                borderColor: "hover:border-cyan-300",
              },
              {
                icon: <Heart className="w-7 h-7" />,
                title: "Giá trị",
                desc: "Sáng tạo không ngừng, Chính xác trong từng chi tiết, và Đam mê truyền cảm hứng học tập cho mọi người.",
                color: "bg-emerald-100 text-emerald-600",
                borderColor: "hover:border-emerald-300",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-8 border-2 border-slate-100 ${item.borderColor} shadow-sm hover:shadow-xl transition-all duration-300 group`}
              >
                <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Bento Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">
              Tại sao chọn ChemXLab?
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Trải nghiệm học tập khác biệt
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Large Card - Dark accent */}
            <div className="md:col-span-2 bg-[#0F172A] rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur border border-blue-400/30">
                  <Rocket className="w-6 h-6 text-blue-300" />
                </div>
                <h4 className="text-2xl font-bold mb-3">Học qua trải nghiệm thực tế</h4>
                <p className="text-slate-300 leading-relaxed max-w-lg">
                  Không còn học thuộc lòng khô khan! ChemXLab cho phép học sinh tự tay thực hiện thí nghiệm,
                  quan sát phản ứng và hiểu sâu bản chất hóa học thông qua mô phỏng 3D sinh động.
                </p>
              </div>
              <Beaker className="absolute -bottom-10 -right-10 w-48 h-48 text-blue-500/10 group-hover:text-blue-500/20 transition-colors" />
            </div>

            {/* Small Cards - White */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">An toàn 100%</h4>
              <p className="text-slate-600">Không lo hóa chất độc hại hay tai nạn phòng thí nghiệm</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">AI Thông minh</h4>
              <p className="text-slate-600">Trợ lý AI hỗ trợ giải đáp thắc mắc 24/7</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Theo chương trình</h4>
              <p className="text-slate-600">Nội dung phù hợp chương trình THCS & THPT Việt Nam</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Phản hồi tức thì</h4>
              <p className="text-slate-600">Kết quả thí nghiệm hiển thị realtime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-slate-100">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    <Users className="w-4 h-4" />
                    Đội ngũ của chúng tôi
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 mb-6">
                    Những con người đam mê giáo dục
                  </h3>
                  <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                    Đội ngũ ChemXLab bao gồm các chuyên gia hóa học, giáo viên giàu kinh nghiệm và
                    kỹ sư công nghệ tài năng. Chúng tôi chia sẻ chung một đam mê:
                    <strong> biến việc học Hóa học thành hành trình khám phá thú vị.</strong>
                  </p>
                  <Link
                    to="/support"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/30"
                  >
                    Liên hệ với chúng tôi
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { role: "Chuyên gia Hóa học", color: "bg-blue-50 border-blue-200" },
                    { role: "Giáo viên THPT", color: "bg-cyan-50 border-cyan-200" },
                    { role: "Kỹ sư 3D", color: "bg-emerald-50 border-emerald-200" },
                    { role: "AI Engineer", color: "bg-amber-50 border-amber-200" },
                  ].map((member, i) => (
                    <div
                      key={i}
                      className={`aspect-square ${member.color} rounded-2xl flex flex-col items-center justify-center border-2 hover:scale-105 transition-all p-4`}
                    >
                      <Users className="w-10 h-10 text-slate-400 mb-3" />
                      <span className="text-sm font-semibold text-slate-700 text-center">{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark accent */}
      <section className="py-20 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Sẵn sàng bắt đầu hành trình?
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
            Tham gia cùng hàng nghìn học sinh đang khám phá thế giới Hóa học một cách trực quan và thú vị mỗi ngày.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
            >
              Đăng ký miễn phí
            </Link>
            <Link
              to="/experience"
              className="w-full sm:w-auto px-10 py-4 border border-slate-600 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
            >
              Xem các gói dịch vụ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
