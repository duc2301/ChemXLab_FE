import { Beaker, BookOpen, FlaskConical, GraduationCap, Lightbulb, School } from "lucide-react";

const FeatureSection = () => {
    return (
        <>
            {/* ═══════════════════════════════════════
          "Chúng tôi dành cho ai?" Section
      ═══════════════════════════════════════ */}
            <section className="py-20 bg-[#f7f8fa]">
                <div className="container mx-auto px-6 max-w-6xl">
                    {/* Header */}
                    <div className="text-center mb-4 space-y-2">
                        <p className="text-sky-500 font-semibold text-xs uppercase tracking-[0.2em]">Giải pháp cho mọi hành trình</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e2a4a]">
                            Chúng tôi dành cho ai?
                        </h2>
                        <p className="text-slate-500 text-sm max-w-lg mx-auto">
                            Nền tảng được thiết kế tối ưu cho từng giai đoạn của hành trình giáo dục, từ người học cá nhân đến các tổ chức lớn.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mt-10">
                        {[
                            {
                                icon: <GraduationCap className="w-7 h-7" />,
                                title: "Sinh viên",
                                desc: "Trao quyền cho người học với bộ công cụ tương tác thông minh và lộ trình cá nhân hóa.",
                                color: "text-sky-600 bg-sky-50",
                            },
                            {
                                icon: <School className="w-7 h-7" />,
                                title: "Giảng viên",
                                desc: "Tối ưu hóa quy trình giảng dạy, quản lý học liệu và theo dõi tiến độ sinh viên dễ dàng.",
                                color: "text-violet-600 bg-violet-50",
                            },
                            {
                                icon: <Lightbulb className="w-7 h-7" />,
                                title: "Trường học",
                                desc: "Chuyển đổi số toàn diện cho các cơ sở giáo dục với hệ thống quản trị tập trung mạnh mẽ.",
                                color: "text-amber-600 bg-amber-50",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-[#1e2a4a] mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Second Row */}
                    <div className="grid md:grid-cols-3 gap-6 mt-6">
                        {[
                            {
                                icon: <Beaker className="w-7 h-7" />,
                                title: "Nhà nghiên cứu",
                                desc: "Công cụ phân tích dữ liệu nâng cao và hệ thống quản lý trích dẫn chuyên nghiệp.",
                                color: "text-emerald-600 bg-emerald-50",
                            },
                            {
                                icon: <FlaskConical className="w-7 h-7" />,
                                title: "Doanh nghiệp",
                                desc: "Đào tạo nội bộ và phát triển kỹ năng cho đội ngũ nhân sự với chi phí tối ưu nhất.",
                                color: "text-rose-600 bg-rose-50",
                            },
                            {
                                icon: <BookOpen className="w-7 h-7" />,
                                title: "Tự học",
                                desc: "Linh hoạt xây dựng lộ trình học tập trọn đời theo sở thích và mục tiêu cá nhân.",
                                color: "text-indigo-600 bg-indigo-50",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-[#1e2a4a] mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default FeatureSection;
