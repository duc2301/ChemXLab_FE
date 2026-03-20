import { motion } from "framer-motion";
import { ArrowRight, FlaskConical, Play, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

import Mascot7 from "../../shared/assets/mascot/7.png";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">

      {/* ══════════════════════════════════════════
          1. HERO & STATS SECTION
      ══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-[#F8FAFC]">
        {/* Blurry glow */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none blur-[120px] opacity-30"
          style={{ background: "linear-gradient(0deg, rgba(0, 85, 160, 0.41), rgba(0, 85, 160, 0.41)), rgba(140, 193, 233, 0.13)" }} />

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
          <div className="max-w-[1024px] mx-auto text-center relative z-10 flex flex-col items-center">

            {/* Eyebrow badge */}
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 border border-white rounded-full mb-6 shadow-sm backdrop-blur-md"
              style={{ background: "rgba(255, 248, 231, 0.43)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#025D9E]"></div>
              <span className="text-[#025D9E] text-[12px] sm:text-[13px] font-bold tracking-[0.5px] uppercase">
                MIỄN PHÍ KHÔNG CẦN CÀI ĐẶT
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-space text-[42px] sm:text-[56px] md:text-[76px] font-bold text-[#12284B] leading-[1.1] tracking-[-2px] mb-5">
              Phòng thí nghiệm <br className="hidden sm:block" />
              <span className="text-[#5b9cd6]">hóa học ảo</span> của bạn
            </h1>

            {/* Subtitle */}
            <p className="text-[16px] md:text-[20px] text-[#12284B] max-w-3xl mx-auto leading-[1.35] font-normal mb-8">
              ChemXLab giúp bạn mô phỏng thí nghiệm Hóa học chỉ với vài cú nhấp chuột — trực quan, sáng tạo và đầy cảm hứng
            </p>

            {/* Social proof: avatars + counter */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <span className="text-[24px] md:text-[28px] font-bold text-[#022F6E] tracking-[-1px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>+125</span>
              <div className="flex items-center -space-x-3">
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
                    className="w-9 h-9 rounded-full border border-[#f2f2f2] object-cover shadow-sm hover:scale-110 hover:z-10 transition-transform cursor-pointer relative"
                    style={{ zIndex: 10 - i }}
                  />
                ))}
              </div>
              <span className="text-[10px] text-[#90A1B9] uppercase tracking-[0.05em] font-bold leading-[1.2] text-left ml-1 max-w-[120px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Người dùng<br />tham gia trải nghiệm
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link
                to="/lab"
                className="flex items-center justify-center gap-2 text-[#FFF8E7] font-bold px-7 py-3 rounded-full text-[15px] transition-all hover:scale-105 bg-[#3d8ad9]"
              >
                Khám phá ngay
                <ArrowRight size={17} strokeWidth={2.5} />
              </Link>
              <Link
                to="/about"
                className="flex items-center justify-center gap-2 text-[#12284B] font-bold px-7 py-3 rounded-full text-[15px] transition-all hover:scale-105 border border-[#B0CDDD] backdrop-blur-md"
                style={{
                  background: "rgba(255, 248, 231, 0.51)",
                  boxShadow: "inset 0px 1px 11.9px rgba(255, 255, 255, 0.9)"
                }}
              >
                <div className="w-5 h-5 rounded-full bg-[#12284B] flex items-center justify-center shadow-inner">
                  <Play size={10} className="fill-white text-white ml-0.5" />
                </div>
                Xem Demo
              </Link>
            </div>
          </div>

          {/* Social Proof Banner */}
          <div className="mt-16 md:mt-24 w-full max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 px-6 py-8 md:py-6 border-[2px] border-[#3398DB]/20 rounded-[32px] md:rounded-[48px]"
              style={{ background: "rgba(140, 193, 233, 0.11)" }}>

              {/* Stat 1 */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 flex-1 relative w-full text-center md:text-left">
                <div>
                  <Users size={20} className="text-[#438BC4]" />
                </div>
                <div>
                  <div className="text-[24px] font-bold text-[#3298DC] leading-[1.33]">100+</div>
                  <div className="text-[16px] text-[#12284B] font-medium leading-[1.5]">Bạn học tham gia</div>
                </div>
                {/* Divider */}
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[1.12px] h-[54px] bg-[#3398DB]/20"></div>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 flex-1 relative w-full text-center md:text-left">
                <div>
                  <FlaskConical size={20} className="text-[#438BC4]" />
                </div>
                <div>
                  <div className="text-[24px] font-bold text-[#3298DC] leading-[1.33]">500+</div>
                  <div className="text-[16px] text-[#12284B] font-medium leading-[1.5]">Thí nghiệm thú vị</div>
                </div>
                {/* Divider */}
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[1.12px] h-[54px] bg-[#3398DB]/20"></div>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 flex-1 w-full text-center md:text-left relative pl-0 md:pl-6">
                <div>
                  <Star size={20} className="text-[#438BC4]" />
                </div>
                <div>
                  <div className="text-[24px] font-bold text-[#3298DC] leading-[1.33]">4.9/5</div>
                  <div className="text-[16px] text-[#12284B] font-medium leading-[1.5]">Đánh giá yêu thích</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section >

      {/* ══════════════════════════════════════════
          3. HOW IT WORKS
      ══════════════════════════════════════════ */}
      < section className="py-20 bg-[#F8FAFC]" >
        <div className="container mx-auto px-6 max-w-[1100px]">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 space-y-3"
          >
            <p className="font-lexend text-[#3298DC] font-semibold text-[14px] uppercase tracking-[0.6px]">Quy trình đơn giản</p>
            <h2 className="font-space text-[32px] md:text-[48px] font-bold text-[#12284B] leading-[1.17]">Cách thức hoạt động</h2>
            <p className="font-lexend text-[#475569] max-w-2xl mx-auto text-[16px] md:text-[18px] font-medium">Chỉ với 3 bước đơn giản, không cần cài đặt phức tạp</p>
          </motion.div>

          <div className="space-y-24">
            {/* Step 01 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-full lg:w-1/2 flex flex-col justify-center"
              >
                {/* 01 Block Text */}
                <span className="font-inter text-[80px] lg:text-[100px] font-black text-[#E2E8F0] leading-none select-none mb-4">01</span>

                <div className="space-y-4">
                  <h3 className="font-space text-[26px] md:text-[30px] font-bold text-[#12284B] leading-[1.11]">Chọn thí nghiệm từ thư viện</h3>
                  <p className="font-lexend text-[#475569] text-[16px] md:text-[18px] font-medium leading-[1.4]">
                    Truy cập kho tàng <strong className="text-[#3298DC] font-medium">500+ bài thí nghiệm</strong> được phân loại theo lớp học và chủ đề. Từ phản ứng đơn giản đến phức tạp, tất cả đều có sẵn trong tầm tay bạn.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="px-4 py-2 bg-[#EFF6FF] text-[#1D4ED8] text-[14px] md:text-[15px] font-bold rounded-full shadow-sm" style={{ fontFamily: "'Lexend', sans-serif" }}>Lớp 8-9</span>
                    <span className="px-4 py-2 bg-[#FAF5FF] text-[#7E22CE] text-[14px] md:text-[15px] font-bold rounded-full shadow-sm" style={{ fontFamily: "'Lexend', sans-serif" }}>Lớp 10-11</span>
                    <span className="px-4 py-2 bg-[#F0FDF4] text-[#15803D] text-[14px] md:text-[15px] font-bold rounded-full shadow-sm" style={{ fontFamily: "'Lexend', sans-serif" }}>Lớp 12</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full lg:w-1/2 flex justify-center relative"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#D8EEFF] blur-[90px] pointer-events-none mix-blend-multiply opacity-60"></div>
                <img src={Mascot7} alt="ChemXLab mascot" className="relative z-10 w-[240px] md:w-[320px] h-auto object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-transform duration-500" />
              </motion.div>
            </div>

            {/* Step 02 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-full lg:w-1/2 flex flex-col justify-center"
              >
                <span className="text-[80px] lg:text-[100px] font-black text-[#E2E8F0] leading-none select-none mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>02</span>

                <div className="space-y-4">
                  <h3 className="text-[26px] md:text-[30px] font-bold text-[#12284B] leading-[1.11]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Tương tác với mô hình 3D</h3>
                  <p className="text-[#475569] text-[16px] md:text-[18px] font-medium leading-[1.4]" style={{ fontFamily: "'Lexend', sans-serif" }}>
                    <strong className="text-[#3298DC] font-medium">Kéo thả dụng cụ,</strong> đổ hóa chất và quan sát phản ứng diễn ra ngay trước mắt. Mọi thao tác đều chân thực như trong phòng thí nghiệm thật với hiệu ứng vật lý chính xác.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full lg:w-1/2 flex justify-center relative"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#D8EEFF] blur-[90px] pointer-events-none mix-blend-multiply opacity-60"></div>
                <div className="w-full max-w-full rounded-[20px] overflow-hidden shadow-xl border border-slate-100 relative z-10 bg-white">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src="https://drive.google.com/file/d/17leoGdPdiLI99hp_AMrerqkqOCHZk3tT/preview"
                      allow="autoplay"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                      style={{ border: 'none' }}
                      title="Demo tương tác 3D"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Step 03 */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-full lg:w-1/2 flex flex-col justify-center"
              >
                <span className="text-[80px] lg:text-[100px] font-black text-[#E2E8F0] leading-none select-none mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>03</span>

                <div className="space-y-4">
                  <h3 className="text-[26px] md:text-[30px] font-bold text-[#12284B] leading-[1.11]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Nhận kết quả và giải thích</h3>
                  <p className="text-[#475569] text-[16px] md:text-[18px] font-medium leading-[1.4]" style={{ fontFamily: "'Lexend', sans-serif" }}>
                    Hệ thống <strong className="text-[#3298DC] font-medium">mô tả và giải thích</strong> chi tiết hiện tượng hóa học. Học sinh hiểu rõ nguyên lý đằng sau mỗi phản ứng, không chỉ học vẹt công thức.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full lg:w-1/2 flex justify-center relative"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#D8EEFF] blur-[90px] pointer-events-none mix-blend-multiply opacity-60"></div>
                <div className="w-full max-w-full rounded-2xl overflow-hidden shadow-xl border border-slate-100 relative z-10 bg-white">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src="https://drive.google.com/file/d/1Bw1Azf_r7uncF4cYSyMUiqUwxZNgg4Em/preview"
                      allow="autoplay"
                      allowFullScreen
                      className="absolute inset-0 w-[140%] h-[140%] -top-[20%] -left-[20%] pointer-events-none"
                      title="Demo kết quả thí nghiệm"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section >

      {/* ══════════════════════════════════════════
          4. LIBRARY SECTION
      ══════════════════════════════════════════ */}
      < section className="py-20 bg-[#F8FAFC]" >
        <div className="container mx-auto px-6 max-w-[1100px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 space-y-4 flex flex-col items-center"
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 bg-[#E6F4FF] text-[#04306E] text-[14px] font-medium uppercase tracking-wide rounded-full shadow-sm border-2 border-[#8DD3FF]">
              Kho tàng kiến thức
            </div>
            <h2 className="text-[32px] md:text-[48px] font-bold text-[#12284B] leading-[1.17] tracking-[-1px] max-w-2xl">
              Thư viện thí nghiệm <br />
              <span className="text-[#3b82f6]">không giới hạn</span>
            </h2>
            <p className="text-[#475569] text-[16px] md:text-[18px] font-medium max-w-3xl mx-auto leading-[1.27]">
              Hàng trăm bài thí nghiệm từ cơ bản đến nâng cao, được cập nhật liên tục.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#FFFFFF] rounded-[20px] p-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-2 border-[#E2E8F0] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col group gap-3"
            >
              <div className="h-[190px] rounded-[16px] bg-gradient-to-br from-[#EFF6FF] to-[#E6F4FF] relative flex items-center justify-center overflow-hidden">
                <iframe src="https://drive.google.com/file/d/1HOiDW0xomJeXph71lW2iMhOQIF0ryHWr/preview" className="absolute w-[160%] h-[160%] pointer-events-none mix-blend-multiply opacity-90" style={{ border: 'none' }} title="Bảng tuần hoàn"></iframe>
              </div>
              <div className="pt-2 flex-1 flex flex-col">
                <h4 className="font-semibold text-[#04306E] text-[18px] mb-2 leading-[1.4]">Bảng tuần hoàn hóa học</h4>
                <p className="text-[#475569] text-[14px] font-medium mb-6 leading-[1.25]">Khám phá các nguyên tố hóa học và cấu tạo nguyên tử</p>
                <div className="flex items-center justify-between mt-auto">
                  <Link to="/periodic-table" className="text-[#438BC4] font-bold text-[13px] hover:text-[#2563eb] flex items-center gap-1 transition-colors">Xem bảng tuần hoàn <ArrowRight size={14} /></Link>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#FFFFFF] rounded-[20px] p-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-2 border-[#E2E8F0] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col group gap-3"
            >
              <div className="h-[190px] rounded-[16px] bg-gradient-to-br from-[#FAF5FF] to-[#FDF2F8] relative flex items-center justify-center overflow-hidden">
                <iframe src="https://drive.google.com/file/d/1sYM7PRzfnDGBIzjDV4mFlxdKnh5OTBq7/preview" className="absolute w-[160%] h-[160%] pointer-events-none mix-blend-multiply opacity-90" style={{ border: 'none' }} title="Thư viện hóa học"></iframe>
              </div>
              <div className="pt-2 flex-1 flex flex-col">
                <h4 className="font-semibold text-[#04306E] text-[18px] mb-2 leading-[1.4]">Thư viện hóa học</h4>
                <p className="text-[#475569] text-[14px] font-medium mb-6 leading-[1.25]">Học tập và khám phá kiến thức hóa học các cấp</p>
                <div className="flex items-center justify-between mt-auto">
                  <Link to="/library" className="text-[#438BC4] font-bold text-[13px] hover:text-[#2563eb] flex items-center gap-1 transition-colors">Vào thư viện <ArrowRight size={14} /></Link>
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#FFFFFF] rounded-[20px] p-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-2 border-[#E2E8F0] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col group gap-3"
            >
              <div className="h-[190px] rounded-[16px] bg-gradient-to-br from-[#FAF5FF] to-[#FDF2F8] relative flex items-center justify-center overflow-hidden">
                <iframe src="https://drive.google.com/file/d/1OBs3gTrIiDRhiR9yIkcKWoYXdrR5wgBA/preview" className="absolute w-[160%] h-[160%] pointer-events-none mix-blend-multiply opacity-90" style={{ border: 'none' }} title="Phản ứng hóa học"></iframe>
              </div>
              <div className="pt-2 flex-1 flex flex-col">
                <h4 className="font-semibold text-[#04306E] text-[18px] mb-2 leading-[1.4]">Phản ứng hóa học</h4>
                <p className="text-[#475569] text-[14px] font-medium mb-6 leading-[1.25]">Mô phỏng quá trình phản ứng hóa học giữa các chất</p>
                <div className="flex items-center justify-between mt-auto">
                  <Link to="/lab" className="text-[#438BC4] font-bold text-[13px] hover:text-[#2563eb] flex items-center gap-1 transition-colors">Vào phòng lab <ArrowRight size={14} /></Link>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-center mt-10"
          >
            <Link to="/lab" className="inline-flex items-center gap-2 bg-blue-950 hover:opacity-95 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-blue-500/25 hover:-translate-y-0.5">
              Khám phá toàn bộ thư viện thí nghiệm <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section >

    </div >
  );
};

export default HomePage;