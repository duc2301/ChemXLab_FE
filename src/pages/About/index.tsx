import { Globe, Shield, Sparkles, Zap } from "lucide-react";

import labImage from "../../shared/assets/about/lab.png";
import team1 from "../../shared/assets/about/team1.png";
import team2 from "../../shared/assets/about/team2.png";
import team3 from "../../shared/assets/about/team3.png";
import timeline1 from "../../shared/assets/about/timeline1.png";
import timeline2 from "../../shared/assets/about/timeline2.png";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section
        className="pt-28 pb-14 lg:pt-36 lg:pb-16 relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse at center, rgba(56,189,248,0.10) 0%, rgba(56,189,248,0.04) 40%, white 70%)" }}
      >
        <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10 px-6">
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-sky-600 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
            ● Giới thiệu
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1e2a4a] leading-[1.15] tracking-tight">
            Về ChemXLab
          </h1>

          <p className="text-[15px] text-slate-500 max-w-lg mx-auto leading-relaxed font-medium">
            Khám phá câu chuyện, sứ mệnh và đội ngũ đằng sau nền tảng thí nghiệm hóa học ảo hàng đầu Việt Nam.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ABOUT FEATURE SECTION
      ═══════════════════════════════════════ */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
                <img
                  src={labImage}
                  alt="ChemXLab Lab"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="aspect-[4/3] bg-gradient-to-br from-sky-100 to-sky-50 flex items-center justify-center">
                        <div class="text-center text-sky-400">
                          <svg class="w-16 h-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                          <p class="text-sm font-medium">Phòng thí nghiệm ảo 3D</p>
                        </div>
                      </div>
                    `;
                  }}
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-5">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e2a4a] leading-tight">
                Nền tảng thực hành hóa học ảo{" "}
                <span className="text-sky-600">hàng đầu Việt Nam</span>
              </h2>

              <p className="text-slate-500 text-sm leading-relaxed">
                ChemXLab được phát triển bởi đội ngũ đam mê công nghệ và giáo dục, mang đến trải nghiệm thí nghiệm hóa học 3D an toàn và hiệu quả cho học sinh và giáo viên trên toàn quốc.
              </p>

              {/* Mini stats */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { icon: <Zap className="w-5 h-5" />, label: "Nhanh chóng", color: "text-sky-600 bg-sky-50" },
                  { icon: <Shield className="w-5 h-5" />, label: "An toàn", color: "text-emerald-600 bg-emerald-50" },
                  { icon: <Globe className="w-5 h-5" />, label: "Trực tuyến", color: "text-violet-600 bg-violet-50" },
                  { icon: <Sparkles className="w-5 h-5" />, label: "Sáng tạo", color: "text-amber-600 bg-amber-50" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-semibold text-[#1e2a4a]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TIMELINE SECTION
      ═══════════════════════════════════════ */}
      <section className="py-20 px-6 bg-[#f7f8fa]">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14 space-y-3 relative">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e2a4a]">
              Hành trình phát triển
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Từ ý tưởng ban đầu đến nền tảng được hàng nghìn học sinh tin dùng
            </p>
            {/* Dot */}
            <div className="absolute top-0 right-4 md:right-8 w-3 h-3 rounded-full bg-sky-200"></div>
          </div>

          {/* Timeline Items */}
          <div className="space-y-10">

            {/* Item 1: Text left + Image right */}
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
              <div className="bg-[#EDF3FA] rounded-2xl p-7 flex flex-col justify-center">
                <p className="text-sky-600 font-bold italic text-sm mb-1">Tháng 3/2022</p>
                <h3 className="text-lg font-extrabold text-[#1e2a4a] mb-3">Ý tưởng ra đời</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Nhóm sáng lập gồm 3 giáo viên hóa học và 2 kỹ sư phần mềm bắt đầu nghiên cứu khả năng xây dựng phòng lab ảo 3D.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={timeline1}
                  alt="Ý tưởng ra đời"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<div class="h-full min-h-[200px] bg-gradient-to-br from-sky-100 to-sky-50 flex items-center justify-center text-sky-400 text-sm font-medium rounded-2xl">Hình ảnh</div>`;
                  }}
                />
              </div>
            </div>

            {/* Item 2: Image left + Text right */}
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={timeline2}
                  alt="Phiên bản Beta"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<div class="h-full min-h-[200px] bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-400 text-sm font-medium rounded-2xl">Hình ảnh</div>`;
                  }}
                />
              </div>
              <div className="bg-[#EDF3FA] rounded-2xl p-7 flex flex-col justify-center">
                <p className="text-sky-600 font-bold italic text-sm mb-1">Tháng 9/2022</p>
                <h3 className="text-lg font-extrabold text-[#1e2a4a] mb-3">Phiên bản Beta</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Ra mắt phiên bản thử nghiệm đầu tiên với 15 thí nghiệm cơ bản. 500 học sinh từ 5 trường tham gia thử nghiệm.
                </p>
              </div>
            </div>

            {/* Item 3: Text left + Image right */}
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
              <div className="bg-[#EDF3FA] rounded-2xl p-7 flex flex-col justify-center">
                <p className="text-sky-600 font-bold italic text-sm mb-1">Tháng 3/2023</p>
                <h3 className="text-lg font-extrabold text-[#1e2a4a] mb-3">Chính thức ra mắt</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  ChemXLab 1.0 chính thức với 50+ thí nghiệm, AI trợ giảng, và hệ thống đánh giá tự động. Hợp tác với 30 trường.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={labImage}
                  alt="Chính thức ra mắt"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<div class="h-full min-h-[200px] bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center text-emerald-400 text-sm font-medium rounded-2xl">Hình ảnh</div>`;
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS STRIP
      ═══════════════════════════════════════ */}
      <section className="py-14 bg-white px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {[
              {
                value: "50,000+",
                label: "HỌC SINH SỬ DỤNG",
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                ),
              },
              {
                value: "80+",
                label: "THÍ NGHIỆM 3D",
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                ),
              },
              {
                value: "2,000+",
                label: "GIÁO VIÊN TIN DÙNG",
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                ),
              },
              {
                value: "150+",
                label: "TRƯỜNG ĐỐI TÁC",
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                ),
              },
            ].map((stat, i) => (
              <div key={i} className="flex-1 text-center py-6 md:py-0 px-6">
                <div className="text-sky-600 flex justify-center mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-[#1e2a4a] mb-1">{stat.value}</div>
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TEAM SECTION
      ═══════════════════════════════════════ */}
      <section className="py-20 px-6 bg-[#f7f8fa]">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4 space-y-2">
            <p className="text-sky-500 font-semibold text-xs uppercase tracking-[0.2em]">Đội ngũ</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e2a4a]">
              Gặp gỡ chuyên gia của chúng tôi
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Các sáng lập viên giàu chuyên gia giáo dục và công nghệ cùng chung tay tạo nên ChemXLab.
            </p>
          </div>

          {/* Team Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              {
                name: "Nguyễn Minh Tuấn",
                role: "Co-Founder & CEO",
                desc: "10+ năm kinh nghiệm trong lĩnh vực EdTech, đam mê đổi mới giáo dục.",
                img: team1,
              },
              {
                name: "Trần Thu Hà",
                role: "Head of Product",
                desc: "Chuyên gia thiết kế trải nghiệm người dùng với background hóa học.",
                img: team2,
              },
              {
                name: "Lê Văn Hùng",
                role: "CTO",
                desc: "Kiến trúc sư phần mềm với 8+ năm xây dựng hệ thống công nghệ giáo dục.",
                img: team3,
              },
            ].map((person, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                {/* Avatar */}
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                  <img
                    src={person.img}
                    alt={person.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-50 to-slate-100">
                          <div class="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
                            <svg class="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-[#1e2a4a]">{person.name}</h3>
                  <p className="text-sky-600 text-xs font-semibold mb-2">{person.role}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{person.desc}</p>
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
