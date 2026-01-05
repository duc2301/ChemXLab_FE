import { ArrowRight, Box, FlaskConical, Layers, PlayCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-slate-50 relative overflow-hidden">
        {/* Background Elements (Subtle) */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 skew-x-12 transform origin-top-right z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">

            {/* Left Content */}
            <div className="w-full md:w-5/12 space-y-8 ">

              <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
                Phòng thí nghiệm <br />
                <span className="text-blue-600">3D Tương tác</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                ChemXLab biến các lý thuyết hóa học trừu tượng thành trải nghiệm
                trực quan sống động. Khám phá, tương tác và hiểu sâu hơn về thế giới nguyên tử ngay trên trình duyệt của bạn.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/labtest"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95"
                >
                  Trải nghiệm ngay
                </Link>
                <Link
                  to="/demo"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 transition-all bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 active:scale-95 gap-2"
                >
                  <PlayCircle className="w-5 h-5" />
                  Xem Demo
                </Link>
              </div>

              <p className="text-sm text-slate-500 pt-2">
                * Không cần cài đặt. Chạy mượt mà trên mọi thiết bị.
              </p>
            </div>

            {/* Right Visual - 3D Viewport Mockup */}
            <div className="w-full md:w-7/12 relative">
              <div className="relative rounded-2xl bg-slate-900 shadow-2xl overflow-hidden border border-slate-800 aspect-video group cursor-pointer">
                {/* Interface Mockup UI */}
                <div className="absolute top-0 w-full h-8 bg-slate-800 flex items-center px-3 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                </div>

                {/* Simulated 3D Content Placeholer */}
                <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center pt-8">
                  {/* Placeholder for 3D Model */}
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-4 border-2 border-cyan-400/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                    <FlaskConical className="absolute inset-0 m-auto text-blue-400 w-32 h-32 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" strokeWidth={1} />
                  </div>
                </div>

                {/* Overlay Button */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                    Khám phá mô hình
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID (BioDigital Style) --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Công nghệ mô phỏng tiên tiến
            </h2>
            <p className="text-slate-600 text-lg">
              ChemXLab cung cấp bộ công cụ toàn diện giúp giáo viên và học sinh tiếp cận hóa học theo cách hoàn toàn mới.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Box className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Mô hình 3D Interactive</h3>
              <p className="text-slate-600 leading-relaxed">
                Xoay, phóng to và bóc tách cấu trúc phân tử. Trải nghiệm không gian ba chiều chân thực thay vì hình ảnh 2D tĩnh.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-cyan-200 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Phản ứng thời gian thực</h3>
              <p className="text-slate-600 leading-relaxed">
                Quan sát quá trình phá vỡ liên kết và hình thành chất mới ngay trước mắt bạn với tốc độ tùy chỉnh.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Thư viện thí nghiệm</h3>
              <p className="text-slate-600 leading-relaxed">
                Truy cập kho dữ liệu khổng lồ với hàng trăm bài thí nghiệm mẫu chuẩn chương trình giáo dục.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- GALLERY / LIBRARY SECTION --- */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Thư viện phổ biến</h2>
              <p className="text-slate-400">Các mô hình được truy cập nhiều nhất tuần qua</p>
            </div>
            <Link to="/library" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Cấu trúc H2O", cat: "Phân tử vô cơ", imgColor: "bg-blue-500" },
              { title: "Phản ứng Oxy hóa", cat: "Thí nghiệm", imgColor: "bg-orange-500" },
              { title: "Bảng tuần hoàn 3D", cat: "Công cụ", imgColor: "bg-purple-600" },
              { title: "Cấu trúc DNA", cat: "Hóa sinh", imgColor: "bg-emerald-500" },
            ].map((item, i) => (
              <div key={i} className="group bg-slate-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer">
                {/* Image Placeholder */}
                <div className={`h-40 w-full ${item.imgColor} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-mono">3D VIEW</div>
                </div>
                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">{item.cat}</p>
                  <h4 className="text-lg font-bold group-hover:text-blue-400 transition-colors">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION (BioDigital Style) --- */}
      <section className="py-20 bg-[#e7e8e961] border-t border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Bạn muốn tìm hiểu thêm?
          </h2>
          <p className="text-slate-500 text-lg mb-10 font-medium">
            Yêu cầu bản demo cho nhà trường hoặc tạo tài khoản cá nhân miễn phí.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-12">
            {/* Button 1: Dành cho Nhà trường (Nổi bật - Màu đỏ/Cam hoặc Xanh đậm) */}
            <div className="w-full md:w-auto p-4">
              <Link
                to="/request-demo"
                className="block w-full md:w-auto bg-blue-500 text-white px-8 py-3 rounded-md font-bold text-sm hover:bg-blue-600 transition-all shadow-sm uppercase tracking-wider"
              >
                NHÀ TRƯỜNG - YÊU CẦU DEMO
              </Link>
            </div>

            {/* Đường kẻ dọc ngăn cách (Chỉ hiện trên Desktop) */}
            <div className="hidden md:block w-px h-12 bg-slate-200"></div>

            {/* Button 2: Dành cho Cá nhân (Viền đơn giản) */}
            <div className="w-full md:w-auto p-4">
              <Link
                to="/register"
                className="block w-full md:w-auto bg-white border-2 border-slate-300 text-slate-700 px-8 py-3 rounded-md font-bold text-sm hover:border-slate-800 hover:text-slate-900 transition-all uppercase tracking-wider"
              >
                CÁ NHÂN - BẮT ĐẦU NGAY
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;