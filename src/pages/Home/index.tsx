import {
  ArrowRight, Beaker, Box, CheckCircle2, FlaskConical,
  Globe2, Layers, Play, ShieldCheck, Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import MoleculeViewer from "../../components/ThreeD/MoleculeViewer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-16 pb-12 lg:pt-24 lg:pb-16 overflow-hidden bg-[#0F172A]">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight uppercase">
                KHÁM PHÁ <br />
                <span className="text-blue-400">CÙNG</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  CHEMXLAB
                </span>
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium text-justify">
                ChemXLab giúp bạn mô phỏng thí nghiệm Hóa học chỉ với vài cú nhấp chuột — trực quan, sáng tạo và đầy cảm hứng.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  to="/labtest"
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2 group"
                >
                  <FlaskConical className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Bắt đầu thí nghiệm
                </Link>
                <Link
                  to="/about"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-md"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Xem Video giới thiệu
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 text-slate-400 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Miễn phí sử dụng
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Không cần cài đặt
                </div>
              </div>
            </div>

            {/* Right Visual - 3D Molecule Viewer */}
            <div className="w-full lg:w-1/2 relative perspective-1000">
              <div className="relative w-full aspect-square max-w-[550px] mx-auto">
                {/* Main Glowing Circle */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-cyan-500/20 rounded-full blur-3xl"></div>

                {/* Clean 3D Viewer Frame */}
                <div className="absolute inset-4 md:inset-8 bg-slate-800/60 backdrop-blur-xl border border-slate-600/50 rounded-3xl shadow-2xl overflow-hidden">
                  <MoleculeViewer modelPath="/models/elements/element_006_carbon.glb" autoRotate={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. STATS STRIP --- */}
      <div className="border-y border-slate-100 bg-white shadow-sm relative z-20">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Thí nghiệm có sẵn", value: "300+" },
              { label: "Người dùng hoạt động", value: "10k+" },
              { label: "Trường học tin dùng", value: "50+" },
              { label: "Đánh giá tích cực", value: "4.9/5" },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 3. BENTO GRID FEATURES --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-3">Tại sao chọn ChemXLab?</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-4">Nền tảng giáo dục <br />cho kỷ nguyên số</h3>
            <p className="text-slate-600 text-lg">
              Giải pháp toàn diện thay thế phòng thí nghiệm truyền thống, giúp việc dạy và học hóa học trở nên an toàn, tiết kiệm và hiệu quả hơn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Safety (Wide) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="relative z-10 w-full md:w-2/3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                  <ShieldCheck size={28} />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-3">An toàn tuyệt đối</h4>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Loại bỏ hoàn toàn rủi ro cháy nổ, hóa chất độc hại. Học sinh có thể tự do thử nghiệm, sai sót và học hỏi trong môi trường giả lập an toàn 100%.
                </p>
              </div>
              {/* Decorative */}
              <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-50 to-transparent hidden md:block"></div>
              <ShieldCheck className="absolute -bottom-10 -right-10 w-64 h-64 text-green-50 group-hover:text-green-100 transition-colors" />
            </div>

            {/* Card 2: Cost (Tall) */}
            <div className="md:row-span-2 bg-[#0B3B69] rounded-3xl p-8 text-white shadow-xl flex flex-col relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white mb-6 backdrop-blur">
                  <Globe2 size={28} />
                </div>
                <h4 className="text-2xl font-bold mb-3">Truy cập mọi lúc</h4>
                <p className="text-blue-100 leading-relaxed mb-6">
                  Không giới hạn thời gian và địa điểm. Học sinh có thể thực hành tại nhà, trên máy tính bảng hoặc laptop cá nhân.
                </p>
              </div>
              <div className="mt-auto relative h-48 w-full bg-blue-500/20 rounded-xl border border-blue-400/30 overflow-hidden">
                {/* Fake Map/Globe UI */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe2 className="w-32 h-32 text-blue-400/50 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Card 3: 3D (Normal) */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Box size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Mô hình 3D</h4>
              <p className="text-slate-600">
                Quan sát cấu trúc phân tử từ mọi góc độ với độ chi tiết cực cao.
              </p>
            </div>

            {/* Card 4: Interactive (Normal) */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <Zap size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Phản ứng tức thì</h4>
              <p className="text-slate-600">
                Kết quả thí nghiệm hiển thị ngay lập tức theo thời gian thực.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. VISUAL LIBRARY / CAROUSEL --- */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Thư viện thí nghiệm phong phú</h2>
              <p className="text-slate-600 text-lg">Hàng trăm mô hình và bài thí nghiệm được cập nhật liên tục theo chương trình giáo dục mới.</p>
            </div>
            <Link to="/library" className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all uppercase text-sm tracking-wider">
              Xem tất cả <ArrowRight size={20} />
            </Link>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Cấu trúc Nguyên tử", color: "from-blue-500 to-cyan-500", icon: <Box className="text-white w-8 h-8" /> },
              { title: "Bảng Tuần hoàn", color: "from-purple-500 to-pink-500", icon: <Layers className="text-white w-8 h-8" /> },
              { title: "Phản ứng Oxy hóa", color: "from-orange-500 to-red-500", icon: <FlaskConical className="text-white w-8 h-8" /> },
              { title: "Liên kết Hóa học", color: "from-emerald-500 to-teal-500", icon: <Beaker className="text-white w-8 h-8" /> },
            ].map((item, idx) => (
              <Link to={item.title === "Bảng Tuần hoàn" ? "/periodic-table" : "/library"} key={idx} className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg block">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90 transition-transform duration-500 group-hover:scale-110`}></div>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>

                <div className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-xl border border-white/20">
                  {item.icon}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <h4 className="text-2xl font-bold text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform">{item.title}</h4>
                  <div className="h-1 w-12 bg-white rounded-full mb-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-white/80 text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    Khám phá ngay <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/library" className="inline-flex items-center gap-2 text-blue-600 font-bold uppercase text-sm tracking-wider">
              Xem tất cả <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- 5. CTA SECTION --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0B3B69] z-0"></div>
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Sẵn sàng cho kỷ nguyên giáo dục mới?
          </h2>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto mb-12">
            Tham gia cùng hàng nghìn giáo viên và học sinh đang đổi mới cách học hóa học mỗi ngày với ChemXLab.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/register"
              className="w-full sm:w-auto px-10 py-4 bg-white text-[#0B3B69] font-bold rounded-full hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Đăng ký tài khoản miễn phí
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-10 py-4 border-2 border-blue-400 text-blue-100 font-bold rounded-full hover:bg-blue-900/50 hover:text-white transition-all backdrop-blur-sm"
            >
              Liên hệ tư vấn trường học
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;