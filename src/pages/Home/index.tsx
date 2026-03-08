import { ArrowRight, FlaskConical, Play, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

import Mascot7 from "../../shared/assets/mascot/7.png";
import Mascot8 from "../../shared/assets/mascot/8.png";
import Mascot9 from "../../shared/assets/mascot/9.png";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">

      {/* ══════════════════════════════════════════
          1. HERO SECTION  
          Centered text, mascot overlaid right,
          soft lavender-blue background glow
      ══════════════════════════════════════════ */}
      <section className="relative pt-28 pb-14 lg:pt-36 lg:pb-20 overflow-hidden bg-white">

        <div className="container mx-auto px-6 relative z-10">

          {/* ── Main layout: text centered, mascot absolute right ── */}
          <div className="relative">
            {/* Mascot – positioned absolute on the right on desktop */}
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[380px] xl:w-[440px] z-0">
            </div>

            {/* Text – centered */}
            <div className="max-w-2xl mx-auto text-center relative z-10 space-y-5"
              style={{ background: "radial-gradient(ellipse at center, rgba(56,189,248,0.1) 30%, rgba(56,189,248,0.1) 35%, transparent 45%)" }}
            >
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 bg-white backdrop-blur border border-blue-100 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
                Nền tảng học hóa học số một tại Việt Nam
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-[3.4rem] font-extrabold text-[#1e2a4a] leading-[1.15] tracking-tight">
                Phòng thí nghiệm{" "}
                <br className="hidden md:block" />
                <span className="relative text-sky-600">
                  hóa học ảo
                  {/* Small blue glow behind "ảo" */}
                  <span
                    className="pointer-events-none absolute -inset-x-8 -inset-y-4 -z-10 rounded-full blur-2xl"
                  />
                </span>{" "}
                của bạn
              </h1>

              {/* Subtitle */}
              <p className="text-[15px] lg:text-base text-slate-500 max-w-lg mx-auto leading-relaxed font-bold">
                ChemXLab giúp bạn mô phỏng thí nghiệm Hóa học chỉ với vài cú nhấp chuột — trực quan, sáng tạo và đầy cảm hứng.
              </p>

              {/* Social proof: avatars + counter */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <div className="flex items-center -space-x-2.5">
                  {[
                    { src: "https://upxptuaomuqukfwvtepi.supabase.co/storage/v1/object/public/avatars/avatars/6d2c7bc6-7931-4e6e-8f73-6675239ff25d_1772243682818_470670641_2295482670829220_492093017164720489_n.jpg", name: "Huyền" },
                    { src: "https://lh3.googleusercontent.com/a/ACg8ocJO4bW8S0AbEUb3TPF8U88qO9FqXaAQadWnDsra0fX0kRKRlVl2yw=s96-c", name: "Khánh" },
                    { src: "https://lh3.googleusercontent.com/a/ACg8ocKfFgJLGz4nGRf8QGNH_ZG_qzY2DD7yb0j-NO5lHqEW1O47IH8h=s96-c", name: "Nam" },
                  ].map((user, i) => (
                    <img
                      key={i}
                      src={user.src}
                      alt={user.name}
                      title={user.name}
                      className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm hover:scale-110 hover:z-10 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
                <span className="text-lg font-extrabold text-[#1e2a4a]">+125</span>
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider leading-tight text-left">
                  Người dùng<br />tham gia trải nghiệm
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-1">
                <Link
                  to="/labtest"
                  className="flex items-center gap-2 bg-linear-to-r from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-700 text-white font-semibold px-7 py-3 rounded-full text-sm transition-all shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 "
                >
                  Khám phá ngay
                  <ArrowRight size={15} />
                </Link>
                <Link
                  to="/about"
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium px-6 py-3 rounded-full text-sm transition-all border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50"
                >
                  <Play size={13} className="fill-current" />
                  Xem Demo
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. STATS STRIP – Pill / Capsule shape
      ══════════════════════════════════════════ */}
      <section className="bg-white py-8">
        <div className="mx-auto">
          <div className="w-full flex flex-col sm:flex-row items-center bg-sky-50 px-4 sm:px-8 py-5 sm:py-7 gap-4 sm:gap-0 sm:divide-x divide-sky-200">
            {[
              { icon: <Users size={18} className="text-sky-500" />, value: "10,000+", label: "Bạn học tham gia" },
              { icon: <FlaskConical size={18} className="text-sky-500" />, value: "500+", label: "Thí nghiệm thú vị" },
              { icon: <Star size={18} className="text-sky-500" />, value: "4.9/5", label: "Đánh giá yêu thích" },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-center gap-3 flex-1 px-4">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">{s.icon}</div>
                <div>
                  <div className="text-lg font-extrabold text-sky-600 leading-tight">{s.value}</div>
                  <div className="text-[11px] text-slate-600 font-medium">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">

          {/* Section header */}
          <div className="text-center mb-16 space-y-2">
            <p className="text-blue-500 font-semibold text-xs uppercase tracking-[0.2em]">Dễ dàng và thuận lợi</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e2a4a]">Cách thức hoạt động</h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm">Chỉ 3 bước đơn giản, không cần cài đặt gì cả</p>
          </div>

          <div className="space-y-20">
            {/* Step 01 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="w-full lg:w-1/2 space-y-4">
                <span className="text-5xl sm:text-[72px] font-black text-blue-100/80 leading-none select-none block">01</span>
                <h3 className="text-2xl font-bold text-[#1e2a4a] -mt-5">Chọn thí nghiệm từ thư viện</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Truy cập kho hàng <strong className="text-slate-700">500+ bài thí nghiệm</strong> được phân loại theo lớp học và chủ đề. Tìm phản ứng phù hợp, đơn giản chỉ với vài cú chạm.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-blue-700 text-xs font-semibold rounded-full ">Lớp 8 - 9</span>
                  <span className="px-3 py-1 bg-purple-100 text-violet-600 text-xs font-semibold rounded-full ">Lớp 10 - 11</span>
                  <span className="px-3 py-1 bg-rose-100 text-rose-600 text-xs font-semibold rounded-full ">Lớp 12</span>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col items-center gap-5">
                <img src={Mascot7} alt="ChemXLab mascot" className="w-[260px] md:w-[320px] h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500" />
                <Link
                  to="/labtest"
                  className="inline-flex items-center gap-2 bg-linear-to-r from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all shadow-md shadow-sky-400/25 hover:-translate-y-0.5"
                >
                  Vào phòng thí nghiệm ngay
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Step 02 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16">
              <div className="w-full lg:w-1/2 space-y-4">
                <span className="text-5xl sm:text-[72px] font-black text-blue-100/80 leading-none select-none block">02</span>
                <h3 className="text-2xl font-bold text-[#1e2a4a] -mt-5">Tương tác với mô hình 3D</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Kéo, thả, xoay mô hình phân tử 3D. Quan sát phản ứng xảy ra ngay trong phòng thí nghiệm ảo như thật với hiệu ứng vật lý chính xác.
                </p>
              </div>
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="w-full max-w-full rounded-2xl overflow-hidden shadow-xl border border-slate-100">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src="https://drive.google.com/file/d/17leoGdPdiLI99hp_AMrerqkqOCHZk3tT/preview"
                      allow="autoplay"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                      title="Demo tương tác 3D"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 03 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="w-full lg:w-1/2 space-y-4">
                <span className="text-5xl sm:text-[72px] font-black text-blue-100/80 leading-none select-none block">03</span>
                <h3 className="text-2xl font-bold text-[#1e2a4a] -mt-5">Nhận kết quả và giải thích</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Hệ thống tự động cung cấp chi tiết hiện tượng hóa học. Học sinh hiểu rõ nguyên lý sau mỗi phản ứng, giúp học môn hóa thật chắc.
                </p>
              </div>
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="w-full max-w-full rounded-2xl overflow-hidden shadow-xl border border-slate-100">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src="https://drive.google.com/file/d/1Bw1Azf_r7uncF4cYSyMUiqUwxZNgg4Em/preview"
                      allow="autoplay"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                      title="Demo kết quả thí nghiệm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. LIBRARY SECTION
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-[#f7f8fa]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-3 space-y-2">
            <p className="text-sky-500 font-semibold text-xs uppercase tracking-[0.2em]">Xem thêm nhiều hơn nữa</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e2a4a]">
              Thư viện thí nghiệm <span className="text-sky-600">không giới hạn</span>
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">Không giới hạn bài thí nghiệm có thể học, được cập nhật liên tục.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-100/80">
              <div className="h-52 bg-linear-to-br from-violet-50 to-blue-50 relative flex items-center justify-center overflow-hidden">
                <iframe src="https://drive.google.com/file/d/1HOiDW0xomJeXph71lW2iMhOQIF0ryHWr/preview" width="640" height="480"></iframe>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-800 text-sm mb-1">Bảng tuần hoàn hóa học</h4>
                <p className="text-slate-500 text-xs mb-3 leading-relaxed">Khám phá các nguyên tố hóa học và cấu tạo nguyên tử</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Star size={11} className="fill-yellow-400 text-yellow-400" />4.8</span>
                  <Link to="/labtest" className="text-blue-500 font-semibold hover:underline">Xem ngay →</Link>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-100/80">
              <div className="h-44 bg-linear-to-br from-sky-50 to-cyan-50 relative flex items-center justify-center">
                <img src={Mascot8} alt="mascot" className="h-32 object-contain drop-shadow" />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md">MỚI</span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-800 text-sm mb-1">Cấu phân tử hữu cơ</h4>
                <p className="text-slate-500 text-xs mb-3 leading-relaxed">Tương tác 3D với các phân tử hữu cơ phổ biến từ lớp 11 đến 12</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Star size={11} className="fill-yellow-400 text-yellow-400" />4.9</span>
                  <Link to="/library" className="text-blue-500 font-semibold hover:underline">Xem ngay →</Link>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-100/80">
              <div className="h-44 bg-linear-to-br from-amber-50 to-orange-50 relative flex items-center justify-center">
                <div className="grid grid-cols-5 gap-1 p-4 opacity-80">
                  {["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne"].map((e, i) => (
                    <div key={i} className="w-9 h-9 bg-amber-400/20 border border-amber-300 rounded text-[10px] font-bold text-amber-700 flex items-center justify-center">{e}</div>
                  ))}
                </div>
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-md">3D</span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-800 text-sm mb-1">Điện phân dung dịch</h4>
                <p className="text-slate-500 text-xs mb-3 leading-relaxed">Mô phỏng điện phân với điện cực và dung dịch khác nhau</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Star size={11} className="fill-yellow-400 text-yellow-400" />4.7</span>
                  <Link to="/labtest" className="text-blue-500 font-semibold hover:underline">Xem ngay →</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link to="/labtest" className="inline-flex items-center gap-2 bg-blue-900 hover:opacity-95 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md shadow-blue-500/25 hover:-translate-y-0.5">
              Khám phá toàn bộ thư viện thí nghiệm <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. CTA SECTION
      ══════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden bg-sky-50">
        <div className="pointer-events-none absolute bottom-8 left-6 md:bottom-12 md:left-18 lg:bottom-12 lg:left-48 hidden md:block">
          <img src={Mascot9} alt="" className="w-32 md:w-44 lg:w-64 h-auto object-contain opacity-80 lg:scale-125" />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[300px] rounded-full bg-blue-200/20 blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-xl mx-auto text-center space-y-5">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e2a4a]">
              Sẵn Sàng Khám Phá Thế Giới <span className="text-sky-600">Hóa Học?</span>
            </h2>
            <p className="text-slate-500">Tham gia cùng hàng nghìn giáo viên và học sinh. Bắt đầu miễn phí ngay hôm nay!</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/register" className="flex items-center gap-2 bg-sky-600 hover:bg-sky-600 text-white font-semibold px-8 py-3 rounded-full text-sm transition-all shadow-md shadow-blue-500/25 hover:-translate-y-0.5">
                Khám phá miễn phí <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="flex items-center gap-2 text-blue-900 hover:text-blue-900 font-medium border border-blue-900 hover:bg-[#c9ccff] px-8 py-3 rounded-full text-sm bg-transparent transition-all">
                Dùng thử
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;