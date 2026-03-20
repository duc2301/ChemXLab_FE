import {
  Bot,
  Box,
  ChevronRight,
  GraduationCap,
  MonitorPlay,
  ShieldCheck,
  TestTubes,
  Users
} from "lucide-react";

import labImage from "../../shared/assets/about/lab.png";
import timeline1 from "../../shared/assets/about/timeline1.png";
import timeline2 from "../../shared/assets/about/timeline2.png";

const AboutPage = () => {
  return (
    <div className="relative min-h-screen font-sans text-slate-900 bg-gradient-to-b from-[#FFFFFF] to-[#F0F9FF] overflow-hidden">
      {/* ═══════════════════════════════════════
          BACKGROUND BLUR DECORATIONS
      ═══════════════════════════════════════ */}
      <div className="absolute top-[50px] -left-[42px] w-[175px] h-[807px] bg-slate-400/5 mix-blend-plus-lighter blur-[42px] -rotate-45 pointer-events-none z-0" />
      <div className="absolute right-[128px] top-[80px] w-5 h-5 bg-[#8DD3FF] opacity-30 rounded-full pointer-events-none z-0" />

      {/* ═══════════════════════════════════════
          HERO SECTION (Light Blue)
      ═══════════════════════════════════════ */}
      <section className="relative h-[425px] bg-[#E6F4FF] flex flex-col items-center justify-center -mx-[12px] px-6 z-10">
        <div className="max-w-[1280px] w-full mt-24 flex flex-col items-center gap-4 relative z-10">
          {/* Breadcrumb */}
          <div className="flex flex-row items-center gap-2 text-sm font-medium">
            <span className="text-slate-600">Trang chủ</span>
            <ChevronRight className="w-4 h-4 text-sky-500" />
            <span className="text-[#04306E]">Về chúng tôi</span>
          </div>

          {/* Title */}
          <h1
            className="font-space font-bold text-5xl md:text-6xl text-center tracking-tight"
            style={{
              background: "linear-gradient(90deg, #3298DC 0%, #3298DC 23.56%, #12284B 98.08%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Về ChemXLab
          </h1>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURE SECTION
      ═══════════════════════════════════════ */}
      <section className="relative w-full max-w-[1216px] mx-auto z-20 px-6 -mt-[80px] mb-32">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">

          {/* Left: Image with glassmorphism border & badge */}
          <div className="relative w-full lg:w-[568px] aspect-[4/3]">
            {/* Soft gradient blur behind image */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-sky-400/20 to-blue-600/20 blur-xl rounded-3xl z-0" />

            {/* Image Container */}
            <div className="relative z-10 w-full h-full bg-white/70 backdrop-blur-md rounded-2xl border-4 border-white shadow-[0px_25px_50px_-12px_rgba(4,48,110,0.1)] overflow-hidden">
              <img
                src={labImage}
                alt="3D Chemistry Lab"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-full bg-gradient-to-br from-sky-100 to-sky-50 flex items-center justify-center">
                      <div class="text-center text-sky-400">Phòng lab 3D</div>
                    </div>`;
                }}
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="flex flex-col gap-6 w-full lg:w-[568px]">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 bg-[#BAE3FF] rounded-full w-max">
              <span className="font-bold text-xs uppercase tracking-wider text-[#226595]">Về chúng tôi</span>
            </div>

            {/* Heading */}
            <h2 className="font-space font-bold text-4xl text-[#04306E] leading-[1.15] tracking-tight">
              Nền tảng thực hành hóa học ảo hàng đầu Việt Nam
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Chúng tôi tạo ra ChemXLab với sứ mệnh mang không gian phòng thí nghiệm đến mọi lớp học, mọi ngôi nhà. Bằng việc kết hợp công nghệ 3D tiên tiến và AI, chúng tôi giúp việc học hóa học trở nên an toàn, trực quan và đầy cảm hứng hơn bao giờ hết.
            </p>

            {/* 4 Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mt-4">
              {/* Item 1 */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-[#E6F4FF] shadow-sm flex items-center justify-center shrink-0">
                  <MonitorPlay className="w-5 h-5 text-[#2B7FB8]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#04306E]">Thực hành trực tuyến</h4>
                  <p className="text-xs text-slate-500 mt-1">Mọi lúc, mọi nơi</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-[#E6F4FF] shadow-sm flex items-center justify-center shrink-0">
                  <TestTubes className="w-5 h-5 text-[#2B7FB8]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#04306E]">80+ Thí nghiệm</h4>
                  <p className="text-xs text-slate-500 mt-1">Bám sát chương trình</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-[#E6F4FF] shadow-sm flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#2B7FB8]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#04306E]">An toàn tuyệt đối</h4>
                  <p className="text-xs text-slate-500 mt-1">Không rủi ro hóa chất</p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-[#E6F4FF] shadow-sm flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-[#2B7FB8]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#04306E]">AI Trợ giảng</h4>
                  <p className="text-xs text-slate-500 mt-1">Hỗ trợ 24/7</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS SECTION (Dark Blue Wave placeholder)
      ═══════════════════════════════════════ */}
      <section className="bg-[#04306E] w-full py-24 relative overflow-hidden">
        {/* Subtle background mask pattern could go here */}
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col items-center gap-16 relative z-10">
          <h2 className="font-space font-medium text-3xl md:text-4xl text-white text-center">
            Được tin tưởng sử dụng bởi
          </h2>

          <div className="flex flex-col md:flex-row w-full justify-center md:divide-x divide-sky-300/30 gap-y-12">
            {[
              { val: "100+", label: "HỌC SINH SỬ DỤNG", icon: <Users className="w-5 h-5 text-[#E6F4FF]" /> },
              { val: "500+", label: "THÍ NGHIỆM 3D", icon: <Box className="w-5 h-5 text-[#E6F4FF]" /> },
              { val: "20+", label: "GIÁO VIÊN TRẢI NGHIỆM", icon: <GraduationCap className="w-5 h-5 text-[#E6F4FF]" /> },
            ].map((stat, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center px-4">
                <div className="w-12 h-12 rounded-full bg-[#E6F4FF]/20 flex items-center justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="font-lexend font-extrabold text-3xl text-white mb-2">{stat.val}</div>
                <div className="font-lexend font-medium text-sm tracking-wider uppercase text-[#F1F5F9] text-center">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TIMELINE SECTION
      ═══════════════════════════════════════ */}
      <section className="relative w-full py-32 bg-gradient-to-b from-white to-[#F0F9FF] overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col items-center">

          <div className="text-center mb-24 max-w-2xl">
            <h2 className="font-space font-black text-4xl md:text-5xl text-[#04306E] tracking-tight mb-6">
              Từ ý tưởng ban đầu đến nền tảng được hàng nghìn học sinh tin dùng
            </h2>
          </div>

          <div className="relative w-full max-w-[1152px] flex flex-col gap-12">
            {/* Center Gradient Line */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-[#0E6FB0] to-[#8DD3FF] rounded-full z-0" />

            {/* Timeline Items */}
            {[
              {
                date: "Tháng 9/2025",
                title: "Ý tưởng ra đời",
                desc: "Nhóm sáng lập gồm 1 Maketing, 2 Truyền thông và 3 kỹ sư phần mềm bắt đầu nghiên cứu khả năng xây dựng phòng lab ảo 3D.",
                img: timeline1,
                reverse: false,
              },
              {
                date: "Tháng 1/2026",
                title: "Phiên bản Beta",
                desc: "Ra mắt phiên bản thử nghiệm đầu tiên với 1 thí nghiệm cơ bản. 100 học sinh từ các trường THPT trên địa bàn Hồ Chí Minh tham gia thử nghiệm.",
                img: timeline2,
                reverse: true,
              },
              {
                date: "Tháng 3/2026",
                title: "Phiên bản Beta 2.0",
                desc: "Ra mắt phiên bản thử nghiệm 2.0 với 5 thí nghiệm, AI dạy hóa, thư viện kiến thức hóa học, bảng tuần hoàn 3D",
                img: labImage,
                reverse: false,
              },
            ].map((step, idx) => (
              <div key={idx} className={`flex flex-col md:flex-row items-center w-full relative z-10 ${step.reverse ? 'md:flex-row-reverse' : ''}`}>

                {/* Text Content */}
                <div className={`w-full md:w-1/2 flex flex-col ${step.reverse ? 'md:items-start md:pl-12 text-left' : 'md:items-end md:pr-12 md:text-right'} mb-6 md:mb-0`}>
                  <div className="bg-white/50 backdrop-blur-md border border-white/50 shadow-[0px_8px_32px_rgba(4,48,110,0.08)] rounded-3xl p-8 max-w-lg">
                    <p className="font-black text-2xl text-[#3398DB] mb-2">{step.date}</p>
                    <h3 className="font-space font-bold text-2xl text-[#04306E] mb-4 tracking-tight">{step.title}</h3>
                    <p className="text-slate-600 text-base leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </div>

                {/* Center Node (Hidden on mobile) */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 z-20">
                  <div className="w-full h-full rounded-full bg-white border-2 border-[#12284B] shadow-[0_0_20px_#3398DB] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#04306E]" />
                  </div>
                </div>

                {/* Image Content */}
                <div className={`w-full md:w-1/2 flex ${step.reverse ? 'md:pr-12 justify-end' : 'md:pl-12 justify-start'}`}>
                  <div className="w-full max-w-lg aspect-square bg-white/25 backdrop-blur-md border border-white/40 shadow-sm rounded-3xl overflow-hidden p-[2px]">
                    <div className="w-full h-full rounded-[22px] overflow-hidden">
                      <img
                        src={step.img}
                        alt={step.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="w-full h-full bg-sky-100 flex items-center justify-center">Chưa có ảnh</div>';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
