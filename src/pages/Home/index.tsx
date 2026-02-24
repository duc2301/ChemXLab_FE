import {
  ArrowRight, Box, CheckCircle2, FlaskConical,
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
                {/* <span className="text-blue-400">CÙNG</span> <br /> */}
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

          {/* Gallery Grid - 2 Cards: Periodic Table & Chemistry Library */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Card 1: Bảng Tuần hoàn - Element grid pattern */}
            <Link
              to="/periodic-table"
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer block shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-900"></div>

              {/* Periodic table grid pattern */}
              <div className="absolute inset-0 p-6 grid grid-cols-8 grid-rows-5 gap-2 opacity-60 group-hover:opacity-80 transition-opacity">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-md border border-white/20 flex items-center justify-center text-[10px] font-bold text-white/70 transition-all duration-300 hover:bg-white/20
                      ${i === 0 ? 'bg-red-500/40' : ''}
                      ${i === 7 ? 'bg-yellow-500/40' : ''}
                      ${[1, 2, 9, 10].includes(i) ? 'bg-blue-500/30' : ''}
                      ${[16, 17, 24, 25].includes(i) ? 'bg-green-500/30' : ''}
                      ${[18, 19, 26, 27].includes(i) ? 'bg-orange-500/30' : ''}
                      ${[32, 33, 34, 35].includes(i) ? 'bg-teal-500/30' : ''}
                    `}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr'][i]}
                  </div>
                ))}
              </div>

              {/* Glowing orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-fuchsia-600/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

              {/* Icon */}
              <div className="absolute top-6 left-6 p-3 bg-purple-500/20 backdrop-blur-xl rounded-xl border border-purple-400/30 group-hover:bg-purple-500/30 group-hover:scale-110 transition-all duration-300 z-10">
                <Layers className="text-purple-200 w-7 h-7" />
              </div>

              {/* 3D Model indicator */}
              <div className="absolute top-6 right-6 px-3 py-1.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 z-10">
                <span className="text-white/90 text-xs font-semibold flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5" />
                  118 mô hình 3D
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-violet-950/95 via-violet-900/60 to-transparent z-10">
                <p className="text-purple-300/80 text-sm font-medium uppercase tracking-widest mb-2">Tương tác 3D với mọi nguyên tố</p>
                <h4 className="text-2xl md:text-3xl font-bold text-white mb-3">Bảng Tuần hoàn</h4>
                <p className="text-purple-200/70 text-sm mb-4 max-w-md">Khám phá 118 nguyên tố với mô hình 3D chi tiết, thông tin đầy đủ và trực quan</p>
                <span className="text-purple-200/80 text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Khám phá ngay <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </span>
              </div>
            </Link>

            {/* Card 2: Thư viện Hóa học - Knowledge Library with molecules */}
            <Link
              to="/library"
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer block shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Premium dark gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"></div>

              {/* Molecular structure pattern */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\' fill=\'%233b82f6\' opacity=\'0.5\'/%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'3\' fill=\'%2360a5fa\' opacity=\'0.3\'/%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'3\' fill=\'%2360a5fa\' opacity=\'0.3\'/%3E%3Cline x1=\'10\' y1=\'10\' x2=\'30\' y2=\'30\' stroke=\'%233b82f6\' stroke-width=\'1\' opacity=\'0.2\'/%3E%3Cline x1=\'30\' y1=\'30\' x2=\'50\' y2=\'50\' stroke=\'%233b82f6\' stroke-width=\'1\' opacity=\'0.2\'/%3E%3C/svg%3E")' }}></div>

              {/* Glowing aura */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-indigo-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>

              {/* Floating molecules animation */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* H2O molecule representation */}
                <div className="absolute top-[15%] right-[20%] animate-[bounce_4s_ease-in-out_infinite]">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>
                    <div className="absolute -left-4 top-2 w-5 h-5 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <div className="absolute -right-4 top-2 w-5 h-5 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  </div>
                </div>
                {/* CO2 molecule */}
                <div className="absolute bottom-[25%] left-[15%] animate-[bounce_5s_ease-in-out_infinite_1s]">
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 bg-gradient-to-br from-red-400 to-red-600 rounded-full opacity-80"></div>
                    <div className="w-7 h-7 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full"></div>
                    <div className="w-5 h-5 bg-gradient-to-br from-red-400 to-red-600 rounded-full opacity-80"></div>
                  </div>
                </div>
                {/* CH4 molecule */}
                <div className="absolute top-[40%] left-[25%] animate-[bounce_3.5s_ease-in-out_infinite_0.5s]">
                  <div className="relative">
                    <div className="w-6 h-6 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full"></div>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full opacity-70"></div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full opacity-70"></div>
                    <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full opacity-70"></div>
                    <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full opacity-70"></div>
                  </div>
                </div>
              </div>

              {/* Icon */}
              <div className="absolute top-6 left-6 p-3 bg-blue-500/20 backdrop-blur-xl rounded-xl border border-blue-400/30 group-hover:bg-blue-500/30 group-hover:scale-110 transition-all duration-300 z-10">
                <FlaskConical className="text-blue-200 w-7 h-7" />
              </div>

              {/* Grade badges */}
              <div className="absolute top-6 right-6 flex gap-2 z-10">
                <span className="px-3 py-1.5 bg-emerald-500/20 backdrop-blur-xl rounded-full border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
                  THCS 6-9
                </span>
                <span className="px-3 py-1.5 bg-amber-500/20 backdrop-blur-xl rounded-full border border-amber-400/30 text-amber-200 text-xs font-semibold">
                  THPT 10-12
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-950/95 via-blue-950/70 to-transparent z-10">
                <p className="text-blue-300/90 text-sm font-semibold uppercase tracking-widest mb-2">Kiến thức toàn diện từ lớp 6-12</p>
                <h4 className="text-2xl md:text-3xl font-bold text-white mb-3">Thư viện Hóa học</h4>
                <p className="text-blue-200/70 text-sm mb-4 max-w-md">Hệ thống kiến thức đầy đủ, mô phỏng 3D và phản ứng hóa học trực quan</p>
                <span className="text-blue-200/90 text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Khám phá ngay <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </span>
              </div>
            </Link>

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
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;