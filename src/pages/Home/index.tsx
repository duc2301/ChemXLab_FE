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

          {/* Gallery Grid - Each card has unique theme-specific design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Card 1: Cấu trúc Nguyên tử - Elegant Bohr Model */}
            <Link
              to="/library"
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer block shadow-xl shadow-indigo-500/40 hover:shadow-indigo-400/60 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Premium gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950"></div>

              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

              {/* Glowing aura behind atom */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>

              {/* Bohr Model Atom */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44">
                {/* Outer ring 3 */}
                <div className="absolute inset-0 rounded-full border border-dashed border-violet-400/30 animate-[spin_12s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-violet-400 rounded-full shadow-[0_0_12px_rgba(167,139,250,0.9)] animate-pulse"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 bg-violet-400 rounded-full shadow-[0_0_12px_rgba(167,139,250,0.9)] animate-pulse delay-500"></div>
                </div>

                {/* Middle ring 2 */}
                <div className="absolute inset-6 rounded-full border border-dashed border-blue-400/40 animate-[spin_8s_linear_infinite_reverse]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_14px_rgba(96,165,250,0.9)] animate-pulse delay-200"></div>
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_14px_rgba(96,165,250,0.9)] animate-pulse delay-700"></div>
                </div>

                {/* Inner ring 1 */}
                <div className="absolute inset-12 rounded-full border-2 border-cyan-400/50 animate-[spin_5s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-cyan-400 rounded-full shadow-[0_0_16px_rgba(34,211,238,1)] animate-pulse delay-300"></div>
                </div>

                {/* Nucleus - Protons & Neutrons */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-orange-400 to-amber-400 rounded-full shadow-[0_0_30px_rgba(251,146,60,0.8)] animate-pulse"></div>
                  <div className="absolute inset-1 bg-gradient-to-tl from-rose-500/50 to-transparent rounded-full"></div>
                  <div className="absolute top-1 left-1 w-2 h-2 bg-white/40 rounded-full blur-[1px]"></div>
                </div>
              </div>

              {/* Icon */}
              <div className="absolute top-6 left-6 p-3 bg-indigo-500/20 backdrop-blur-xl rounded-xl border border-indigo-400/30 group-hover:bg-indigo-500/30 group-hover:scale-110 transition-all duration-300">
                <Box className="text-indigo-200 w-6 h-6" />
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/95 via-slate-900/70 to-transparent">
                <p className="text-cyan-300/90 text-xs font-semibold uppercase tracking-widest mb-1">Khám phá thế giới vi mô</p>
                <h4 className="text-xl font-bold text-white mb-2">Cấu trúc Nguyên tử</h4>
                <span className="text-indigo-200/90 text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Khám phá <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            {/* Card 2: Bảng Tuần hoàn - Element grid pattern */}
            <Link
              to="/periodic-table"
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer block shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-900"></div>

              {/* Periodic table grid pattern */}
              <div className="absolute inset-0 p-4 grid grid-cols-6 grid-rows-5 gap-1.5 opacity-60 group-hover:opacity-80 transition-opacity">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-md border border-white/20 flex items-center justify-center text-[8px] font-bold text-white/70 transition-all duration-300 hover:bg-white/20
                      ${i === 0 ? 'bg-red-500/40' : ''}
                      ${i === 5 ? 'bg-yellow-500/40' : ''}
                      ${[1, 2, 7, 8].includes(i) ? 'bg-blue-500/30' : ''}
                      ${[12, 13, 18, 19].includes(i) ? 'bg-green-500/30' : ''}
                      ${[14, 15, 20, 21].includes(i) ? 'bg-orange-500/30' : ''}
                    `}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn'][i]}
                  </div>
                ))}
              </div>

              {/* Glowing orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-purple-400/30 to-fuchsia-600/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

              {/* Icon */}
              <div className="absolute top-6 left-6 p-3 bg-purple-500/20 backdrop-blur-xl rounded-xl border border-purple-400/30 group-hover:bg-purple-500/30 group-hover:scale-110 transition-all duration-300 z-10">
                <Layers className="text-purple-200 w-6 h-6" />
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-violet-950/95 via-violet-900/60 to-transparent z-10">
                <p className="text-purple-300/80 text-xs font-medium uppercase tracking-widest mb-1">118 nguyên tố hóa học</p>
                <h4 className="text-xl font-bold text-white mb-2">Bảng Tuần hoàn</h4>
                <span className="text-purple-200/80 text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Khám phá <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            {/* Card 3: Phản ứng Oxy hóa - Fire/bubbles effect */}
            <Link
              to="/library"
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer block shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-b from-amber-600 via-orange-600 to-red-700"></div>

              {/* Fire/heat waves */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-400/40 via-orange-500/20 to-transparent animate-pulse"></div>
                <div className="absolute bottom-0 left-[10%] w-16 h-24 bg-gradient-to-t from-yellow-300/60 to-transparent rounded-t-full blur-sm animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-0 left-[30%] w-12 h-20 bg-gradient-to-t from-orange-400/50 to-transparent rounded-t-full blur-sm animate-[pulse_2s_ease-in-out_infinite_0.3s]"></div>
                <div className="absolute bottom-0 right-[25%] w-14 h-28 bg-gradient-to-t from-yellow-400/50 to-transparent rounded-t-full blur-sm animate-[pulse_1.8s_ease-in-out_infinite_0.5s]"></div>
                <div className="absolute bottom-0 right-[10%] w-10 h-16 bg-gradient-to-t from-red-400/40 to-transparent rounded-t-full blur-sm animate-[pulse_2.2s_ease-in-out_infinite_0.7s]"></div>
              </div>

              {/* Rising bubbles/sparks */}
              <div className="absolute inset-0">
                <div className="absolute bottom-[20%] left-[20%] w-3 h-3 bg-yellow-300/70 rounded-full animate-[bounce_2s_ease-in-out_infinite] shadow-[0_0_10px_rgba(253,224,71,0.8)]"></div>
                <div className="absolute bottom-[35%] left-[40%] w-2 h-2 bg-orange-300/60 rounded-full animate-[bounce_2.5s_ease-in-out_infinite_0.5s]"></div>
                <div className="absolute bottom-[25%] right-[30%] w-2.5 h-2.5 bg-yellow-200/70 rounded-full animate-[bounce_1.8s_ease-in-out_infinite_0.3s] shadow-[0_0_8px_rgba(254,240,138,0.8)]"></div>
                <div className="absolute bottom-[45%] right-[20%] w-1.5 h-1.5 bg-red-300/50 rounded-full animate-[bounce_2.2s_ease-in-out_infinite_0.8s]"></div>
              </div>

              {/* Flask silhouette */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-30 transition-opacity">
                <FlaskConical className="w-32 h-32 text-white" strokeWidth={1} />
              </div>

              {/* Icon */}
              <div className="absolute top-6 left-6 p-3 bg-orange-500/30 backdrop-blur-xl rounded-xl border border-orange-300/30 group-hover:bg-orange-500/40 group-hover:scale-110 transition-all duration-300">
                <FlaskConical className="text-orange-100 w-6 h-6" />
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-red-900/90 via-orange-800/50 to-transparent">
                <p className="text-orange-200/80 text-xs font-medium uppercase tracking-widest mb-1">Phản ứng hóa học cơ bản</p>
                <h4 className="text-xl font-bold text-white mb-2">Phản ứng Oxy hóa</h4>
                <span className="text-orange-100/80 text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Khám phá <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            {/* Card 4: Liên kết Hóa học - Benzene/Hexagonal molecular structure */}
            <Link
              to="/library"
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer block shadow-xl shadow-teal-500/40 hover:shadow-teal-400/60 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Premium dark gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950"></div>

              {/* Hexagonal pattern overlay */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'28\' height=\'49\' viewBox=\'0 0 28 49\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%2310b981\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

              {/* Glowing aura */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-gradient-to-r from-emerald-500/15 via-teal-500/20 to-cyan-500/15 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>

              {/* Benzene Ring Structure - SVG */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <svg width="160" height="160" viewBox="0 0 160 160" className="group-hover:scale-105 transition-transform duration-500">
                  {/* Hexagon bonds */}
                  <polygon
                    points="80,20 130,45 130,95 80,120 30,95 30,45"
                    fill="none"
                    stroke="url(#bondGradient)"
                    strokeWidth="3"
                    className="drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]"
                  />

                  {/* Inner hexagon (double bond representation) */}
                  <polygon
                    points="80,35 115,52 115,88 80,105 45,88 45,52"
                    fill="none"
                    stroke="rgba(94,234,212,0.4)"
                    strokeWidth="2"
                    strokeDasharray="8,4"
                  />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="bondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2dd4bf" />
                      <stop offset="50%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>

                  {/* Carbon atoms at vertices */}
                  <circle cx="80" cy="20" r="8" fill="url(#atomGradient1)" className="drop-shadow-[0_0_10px_rgba(45,212,191,0.8)] animate-pulse" />
                  <circle cx="130" cy="45" r="8" fill="url(#atomGradient2)" className="drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <circle cx="130" cy="95" r="8" fill="url(#atomGradient1)" className="drop-shadow-[0_0_10px_rgba(45,212,191,0.8)] animate-pulse" style={{ animationDelay: '0.4s' }} />
                  <circle cx="80" cy="120" r="8" fill="url(#atomGradient2)" className="drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" style={{ animationDelay: '0.6s' }} />
                  <circle cx="30" cy="95" r="8" fill="url(#atomGradient1)" className="drop-shadow-[0_0_10px_rgba(45,212,191,0.8)] animate-pulse" style={{ animationDelay: '0.8s' }} />
                  <circle cx="30" cy="45" r="8" fill="url(#atomGradient2)" className="drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" style={{ animationDelay: '1s' }} />

                  <defs>
                    <radialGradient id="atomGradient1" cx="30%" cy="30%">
                      <stop offset="0%" stopColor="#5eead4" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </radialGradient>
                    <radialGradient id="atomGradient2" cx="30%" cy="30%">
                      <stop offset="0%" stopColor="#6ee7b7" />
                      <stop offset="100%" stopColor="#10b981" />
                    </radialGradient>
                  </defs>

                  {/* Hydrogen atoms extending outward */}
                  <line x1="80" y1="20" x2="80" y2="4" stroke="rgba(167,243,208,0.6)" strokeWidth="2" />
                  <circle cx="80" cy="2" r="4" fill="#a7f3d0" className="opacity-70" />

                  <line x1="130" y1="45" x2="144" y2="37" stroke="rgba(167,243,208,0.6)" strokeWidth="2" />
                  <circle cx="146" cy="36" r="4" fill="#a7f3d0" className="opacity-70" />

                  <line x1="130" y1="95" x2="144" y2="103" stroke="rgba(167,243,208,0.6)" strokeWidth="2" />
                  <circle cx="146" cy="105" r="4" fill="#a7f3d0" className="opacity-70" />
                </svg>
              </div>

              {/* Floating electron clouds */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[18%] left-[18%] w-3 h-3 bg-teal-400/30 rounded-full blur-sm animate-pulse"></div>
                <div className="absolute top-[22%] right-[22%] w-2 h-2 bg-emerald-400/40 rounded-full blur-sm animate-pulse delay-300"></div>
                <div className="absolute bottom-[28%] left-[20%] w-2 h-2 bg-cyan-300/30 rounded-full blur-sm animate-pulse delay-700"></div>
              </div>

              {/* Icon */}
              <div className="absolute top-6 left-6 p-3 bg-teal-500/20 backdrop-blur-xl rounded-xl border border-teal-400/30 group-hover:bg-teal-500/30 group-hover:scale-110 transition-all duration-300 z-10">
                <Beaker className="text-teal-200 w-6 h-6" />
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/95 via-teal-950/70 to-transparent z-10">
                <p className="text-teal-300/90 text-xs font-semibold uppercase tracking-widest mb-1">Cộng hóa trị & ion</p>
                <h4 className="text-xl font-bold text-white mb-2">Liên kết Hóa học</h4>
                <span className="text-teal-200/90 text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Khám phá <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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