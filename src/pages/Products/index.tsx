import { BarChart2, BookOpen, Briefcase, Contact, FlaskConical, GraduationCap, Landmark, Layers, Rocket } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


// Import MoleculeViewer directly from components/ThreeD
import MoleculeViewerModel from "../../components/ThreeD/MoleculeViewer";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Tất cả");


  const filters = ["Tất cả", "Cơ bản", "Trung bình", "Nâng cao", "Hữu cơ", "Cấu trúc"];

  const experiments = [
    {
      title: "Thí nghiệm về biến đổi hóa học (Fe + S → FeS)",
      desc: "Quan sát hiện tượng và nhiệt lượng tỏa ra khi đun nóng hỗn hợp sắt và lưu huỳnh.",
      badge: "Cơ bản",
      badgeColor: "bg-[#00BC7D]/80 border-white/30",
      gradient: "from-emerald-50 to-teal-100",
      iframeSrc: "https://drive.google.com/file/d/1OBs3gTrIiDRhiR9yIkcKWoYXdrR5wgBA/preview",
    },
    {
      title: "Nhận biết chất mới tạo thành – Zn + HCl",
      desc: "Hiện tượng sủi bọt khí hydro sinh ra khi cho kẽm tác dụng với axit clohydric.",
      badge: "Cơ bản",
      badgeColor: "bg-[#00BC7D]/80 border-white/30",
      gradient: "from-sky-50 to-blue-100",
      iframeSrc: "https://drive.google.com/file/d/1hHohhmqGCCPD3YhrhEz5kEuiWgc27bs5/preview",
    },
    {
      title: "Nhận biết chất mới tạo thành – BaCl₂ + HCl",
      desc: "Phân tích phản ứng và tính chất khi nhỏ axit clohydric vào dung dịch bari clorua.",
      badge: "Cơ bản",
      badgeColor: "bg-[#00BC7D]/80 border-white/30",
      gradient: "from-indigo-50 to-cyan-100",
      iframeSrc: "https://drive.google.com/file/d/1WyC-aZWRzIBFgIzaEawP1W8I0x5dIhKS/preview",
    },
    {
      title: "Định luật bảo toàn khối lượng (BaCl₂ + Na₂SO₄)",
      desc: "Kiểm chứng định luật qua phản ứng tạo kết tủa trắng bari sunfat.",
      badge: "Cơ bản",
      badgeColor: "bg-[#00BC7D]/80 border-white/30",
      gradient: "from-rose-50 to-pink-100",
      iframeSrc: "https://drive.google.com/file/d/1-N2C8aJLrYeMI2srvc5b3Ma956Wjy-L0/preview",
    },
  ];

  return (
    <div className="w-full bg-[#FFFFFF] font-space text-[#12284B]">
      {/* ═══════════════════════════════════════
          HERO SECTION (Figma: Section 1)
      ═══════════════════════════════════════ */}
      <section
        className="w-full relative overflow-hidden flex flex-col items-center pt-32 lg:pt-44 pb-20 justify-start"
        style={{
          background:
            "linear-gradient(180deg, rgba(240, 249, 255, 0.64) 0%, rgba(241, 245, 249, 0.64) 30.77%, rgba(241, 245, 249, 0.64) 54.81%, rgba(67, 139, 196, 0.6016) 89.42%, rgba(255, 255, 255, 0.64) 100%)",
        }}
      >
        {/* Glow Effects */}
        <div className="absolute w-[500px] h-[256px] left-[-100px] top-[370px] bg-white/50 mix-blend-plus-lighter blur-[168px] pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] right-[-30px] bottom-[290px] bg-sky-400/20 mix-blend-plus-lighter blur-[174px] opacity-70 pointer-events-none" />

        <div className="max-w-[1280px] w-full px-8 flex flex-col items-center relative z-10">

          {/* Header Texts */}
          <div className="w-full max-w-[1216px] flex flex-col items-center mb-10">
            <h1 className="font-space font-bold text-5xl md:text-[72px] text-center text-[#12284B] leading-tight md:leading-[72px] tracking-[-1.8px] max-w-[850px]">
              Trải nghiệm Phòng Thí Nghiệm Ảo 3D
            </h1>
            <p className="font-space font-normal text-xl text-[#4A5565] text-center mt-6 max-w-[680px] leading-relaxed">
              ChemXLab mang đến môi trường thí nghiệm hóa học 3D chân thực cho học sinh Cấp 2 và Cấp 3. An toàn, trực quan và đầy đủ công cụ chuyên nghiệp.
            </p>
          </div>

          {/* Model Container (Glassmorphism + 3D Viewer) */}
          <div className="relative w-full max-w-[1152px] mt-8">
            {/* Outer decorative borders and shadows */}
            <div className="relative bg-[#F3F4F6] border border-white/50 rounded-[40px] p-[10px] w-full shadow-[inset_30px_4px_71px_rgba(255,255,255,0.44),inset_0px_25px_118px_-12px_#FFFFFF]">
              <div className="absolute inset-0 rounded-[40px] shadow-[0px_20px_40px_rgba(4,48,110,0.1)] pointer-events-none" />

              {/* Inner wrapper */}
              <div className="relative bg-white border-[5px] border-[#64748B] rounded-[32px] overflow-hidden flex flex-col h-[600px] shadow-2xl">
                {/* 3D Viewer Area */}
                <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                  <MoleculeViewerModel modelPath="/models/phongthinghiem.glb" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          LIBRARY / EXPERIMENTS SECTION (Figma: Section 2)
      ═══════════════════════════════════════ */}
      <section className="w-full bg-[#FBFBFB] py-16 lg:py-24 px-6 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-12">

          {/* Header */}
          <div className="w-full flex flex-col items-center text-center gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-space font-bold text-[10px] uppercase tracking-[2px] text-[#438BC4]">VIRTUAL ENVIRONMENT</span>
            </div>

            <h2 className="font-space font-bold text-4xl md:text-5xl text-[#12284B] leading-tight flex items-center justify-center">
              Thư viện Mô phỏng 3D
            </h2>

            <p className="font-lexend font-medium text-lg md:text-xl text-[#6A7282] max-w-3xl mt-4 leading-relaxed">
              Khám phá các môi trường hóa học độ trung thực cao và cấu trúc phân tử sống động với rủi ro bằng không.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveTab(filter)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-space font-bold text-sm transition-all duration-300 border ${activeTab === filter
                  ? "bg-gradient-to-r from-[#438BC4] to-[#0055A0] text-white border-transparent shadow-[0_10px_15px_-3px_rgba(0,166,244,0.2)]"
                  : "bg-white text-[#6A7282] border-slate-100 hover:border-slate-300 shadow-sm"
                  }`}
              >
                {filter === "Tất cả" && <Layers className="w-4 h-4" />}
                {filter !== "Tất cả" && <div className="w-2 h-2 rounded-full bg-current opacity-60" />}
                {filter}
              </button>
            ))}
          </div>

          {/* Experiments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 w-full max-w-5xl mt-8">
            {experiments.map((exp, idx) => (
              <div
                key={idx}
                className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[40px] p-4 shadow-[0_8px_32px_rgba(31,38,135,0.05),0_4px_10px_rgba(51,152,219,0.05)] flex flex-col transition-transform duration-300 hover:-translate-y-2 group"
              >
                {/* Image Area */}
                <div className={`w-full aspect-video rounded-[32px] bg-gradient-to-br ${exp.gradient} border border-white/40 shadow-inner flex relative overflow-hidden mb-6 items-center justify-center p-2`}>
                  {exp.iframeSrc ? (
                    <div className="w-full h-full rounded-[24px] overflow-hidden relative">
                      <iframe
                        src={exp.iframeSrc}
                        className="absolute top-0 left-0 w-full h-full border-none"
                        title={exp.title}
                        allow="autoplay"
                      ></iframe>
                    </div>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-white/40 rounded-full blur-3xl absolute"></div>
                      <FlaskConical className={`w-28 h-28 opacity-20 text-${idx % 2 === 0 ? 'sky' : 'rose'}-600 mix-blend-multiply`} />
                    </>
                  )}

                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg border backdrop-blur-md shadow-sm flex items-center gap-1 z-10 ${exp.badgeColor}`}>
                    <span className="font-space font-black text-[10px] text-white uppercase tracking-widest">{exp.badge}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-2 flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="font-space font-bold text-[20px] text-[#12284B] leading-snug flex-1">
                      {exp.title}
                    </h3>
                  </div>

                  <p className="font-space text-sm text-[#99A1AF] leading-relaxed mb-6">
                    {exp.desc}
                  </p>

                  <button
                    onClick={() => navigate("/lab")}
                    className="w-full mt-auto bg-[#12284B] text-white rounded-2xl py-4 flex items-center justify-center gap-2 font-space font-bold text-sm shadow-[0_10px_15px_-3px_rgba(18,40,75,0.2)] hover:bg-[#1e3a6a] transition-colors group-hover:shadow-[0_15px_25px_-5px_rgba(18,40,75,0.3)]"
                  >
                    Bắt đầu Thí nghiệm
                    <Rocket className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          TARGET AUDIENCE SECTION (Figma: Section 3)
      ═══════════════════════════════════════ */}
      <section className="w-full bg-gradient-to-b from-[#F4F8FB] to-[#FFFFFF] py-24 px-6 relative z-10">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-16">

          {/* Header */}
          <div className="w-full flex flex-col items-center text-center gap-3 max-w-3xl mx-auto">
            <span className="font-space font-bold text-sm uppercase tracking-wider text-[#438BC4]">
              Giải pháp cho mọi hành trình
            </span>
            <h2 className="font-space font-bold text-4xl md:text-5xl leading-tight">
              <span className="text-[#12284B]">Chúng tôi </span>
              <span className="text-[#438BC4]">dành cho ai?</span>
            </h2>
            <p className="font-lexend font-medium text-lg text-[#6A7282] max-w-2xl mt-4 leading-relaxed">
              Nền tảng được thiết kế tối ưu cho từng giai đoạn của hành trình giáo dục, từ người học cá nhân đến các tổ chức lớn.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 w-full max-w-[1150px]">
            {[
              {
                icon: GraduationCap,
                title: "Sinh viên",
                desc: "Trao quyền cho người học với bộ công cụ tương tác thông minh và lộ trình cá nhân hóa.",
              },
              {
                icon: Contact,
                title: "Giảng viên",
                desc: "Tối ưu hóa quy trình giảng dạy, quản lý học liệu và theo dõi tiến độ sinh viên dễ dàng.",
              },
              {
                icon: Landmark,
                title: "Trường học",
                desc: "Chuyển đổi số toàn diện cho các cơ sở giáo dục với hệ thống quản trị tập trung mạnh mẽ.",
              },
              {
                icon: BarChart2,
                title: "Nhà nghiên cứu",
                desc: "Công cụ phân tích dữ liệu nâng cao và hệ thống quản lý trích dẫn chuyên nghiệp.",
              },
              {
                icon: Briefcase,
                title: "Doanh nghiệp",
                desc: "Đào tạo nội bộ và phát triển kỹ năng cho đội ngũ nhân sự với chi phí tối ưu nhất.",
              },
              {
                icon: BookOpen,
                title: "Tự học",
                desc: "Linh hoạt xây dựng lộ trình học tập trọn đời theo sở thích và mục tiêu cá nhân.",
              },
            ].map((target, idx) => (
              <div key={idx} className="flex items-start gap-5 p-4 rounded-2xl bg-transparent transition-all duration-300 hover:bg-white/60 hover:shadow-[0_8px_32px_rgba(31,38,135,0.05)] border border-transparent hover:border-white/80">
                <div className="shrink-0">
                  <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-white to-sky-50 shadow-sm border border-sky-100 flex items-center justify-center text-[#438BC4]">
                    <target.icon className="w-7 h-7 stroke-[1.5]" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-1">
                  <h3 className="font-space font-bold text-[20px] text-[#12284B]">{target.title}</h3>
                  <p className="font-lexend text-[#99A1AF] text-sm leading-relaxed pr-2">{target.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default ProductsPage;
