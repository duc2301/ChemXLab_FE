import { ArrowRight, Atom, BookOpen, FlaskConical, Grid3X3, Layers } from "lucide-react";
import { Link } from "react-router-dom";

interface GradeInfo {
    id: string;
    grade: number;
    level: "THCS" | "THPT";
    subject: string;
    description: string;
    topicsCount: number;
    color: string;
    icon: React.ReactNode;
}

const GRADES: GradeInfo[] = [
    {
        id: "6",
        grade: 6,
        level: "THCS",
        subject: "Khoa học tự nhiên",
        description: "Chất và sự biến đổi, Oxygen, Không khí, Vật liệu",
        topicsCount: 4,
        color: "from-emerald-500 to-teal-600",
        icon: <FlaskConical className="w-8 h-8" />,
    },
    {
        id: "7",
        grade: 7,
        level: "THCS",
        subject: "Khoa học tự nhiên",
        description: "Nguyên tử, Nguyên tố hóa học, Phân tử, Liên kết",
        topicsCount: 5,
        color: "from-cyan-500 to-blue-600",
        icon: <Atom className="w-8 h-8" />,
    },
    {
        id: "8",
        grade: 8,
        level: "THCS",
        subject: "Khoa học tự nhiên",
        description: "Acid, Base, Oxide, Muối, Thang pH",
        topicsCount: 4,
        color: "from-violet-500 to-purple-600",
        icon: <FlaskConical className="w-8 h-8" />,
    },
    {
        id: "9",
        grade: 9,
        level: "THCS",
        subject: "Khoa học tự nhiên",
        description: "Kim loại, Hữu cơ, Alcohol, Acid, Polymer",
        topicsCount: 6,
        color: "from-rose-500 to-pink-600",
        icon: <Layers className="w-8 h-8" />,
    },
    {
        id: "10",
        grade: 10,
        level: "THPT",
        subject: "Hóa học",
        description: "Cấu tạo nguyên tử, Bảng tuần hoàn, Liên kết, Halogen",
        topicsCount: 7,
        color: "from-amber-500 to-orange-600",
        icon: <Atom className="w-8 h-8" />,
    },
    {
        id: "11",
        grade: 11,
        level: "THPT",
        subject: "Hóa học",
        description: "Cân bằng hóa học, Nitrogen, Sulfur, Hữu cơ, Hydrocarbon",
        topicsCount: 6,
        color: "from-blue-500 to-indigo-600",
        icon: <FlaskConical className="w-8 h-8" />,
    },
    {
        id: "12",
        grade: 12,
        level: "THPT",
        subject: "Hóa học",
        description: "Ester, Carbohydrate, Protein, Polymer, Kim loại",
        topicsCount: 8,
        color: "from-indigo-500 to-violet-600",
        icon: <BookOpen className="w-8 h-8" />,
    },
];

const LibraryPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] via-[#E0F0FF] to-white pt-20 pb-16 font-sans">
            {/* Hero Section */}
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#3398DB]/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#04306E]/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">

                        <h1 className="text-4xl md:text-6xl font-space font-bold text-[#04306E] mb-6 leading-[1.1] tracking-[-1.5px]">
                            Hệ thống Kiến thức{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#04306E] to-[#3398DB]">
                                Hóa học
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl font-inter text-[#475569] max-w-2xl mx-auto mb-8 font-medium">
                            Trọn bộ kiến thức Hóa học từ lớp 6 đến lớp 12, được biên soạn theo
                            chương trình sách giáo khoa mới nhất. Đầy đủ lý thuyết, công thức và cập nhật liên tục.
                        </p>

                        <div className="flex justify-center gap-6 text-[#64748B] text-sm font-inter font-medium mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-[#3398DB] rounded-full shadow-[0_0_8px_rgba(51,152,219,0.5)]"></div>
                                THCS: Lớp 6-9
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-[#04306E] rounded-full shadow-[0_0_8px_rgba(4,48,110,0.5)]"></div>
                                THPT: Lớp 10-12
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Tool: Periodic Table */}
            <section className="py-8">
                <div className="container mx-auto px-6">
                    <Link
                        to="/periodic-table"
                        className="group relative block overflow-hidden rounded-[28px] bg-gradient-to-r from-[#04306E] via-[#0C4A8E] to-[#3398DB] p-8 md:p-10 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(51,152,219,0.4)] hover:-translate-y-1"
                    >
                        {/* Background decorations */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4"></div>
                        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] bg-[#3398DB]/20 rounded-full blur-[60px]"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                            {/* Icon */}
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shrink-0">
                                <Grid3X3 className="w-10 h-10 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                    <h3 className="text-2xl md:text-3xl font-space font-bold text-white">
                                        Bảng tuần hoàn 3D
                                    </h3>
                                    <span className="px-3 py-1 bg-white/15 backdrop-blur-sm text-white/90 text-xs font-bold uppercase tracking-wider rounded-full border border-white/20">
                                        Tương tác
                                    </span>
                                </div>
                                <p className="font-inter text-white/70 text-base md:text-lg max-w-2xl leading-relaxed">
                                    Khám phá 118 nguyên tố hóa học với mô hình 3D tương tác. Xem cấu trúc nguyên tử,
                                    tính chất vật lý và hóa học của từng nguyên tố.
                                </p>
                            </div>

                            {/* Arrow */}
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300 shrink-0">
                                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Grade Grid */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    {/* THCS Section */}
                    <div className="mb-16">
                        <div className="mb-8 text-center md:text-left">
                            <h2 className="text-3xl font-space font-bold text-[#04306E] mb-2 tracking-[-0.5px]">
                                Trung học cơ sở (THCS)
                            </h2>
                            <p className="font-inter text-[#64748B] text-lg">
                                Phần Hóa học trong môn Khoa học tự nhiên
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {GRADES.filter((g) => g.level === "THCS").map((grade) => (
                                <Link
                                    key={grade.id}
                                    to={`/library/${grade.id}`}
                                    className="group relative bg-white/80 backdrop-blur-[10px] border border-white rounded-[24px] p-6 hover:border-[#3398DB]/30 transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_32px_rgba(4,48,110,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(51,152,219,0.2)] flex flex-col items-start"
                                >
                                    <div
                                        className={`w-14 h-14 bg-gradient-to-br ${grade.color} rounded-2xl flex items-center justify-center text-white mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-md`}
                                    >
                                        {grade.icon}
                                    </div>

                                    <div className="font-inter text-[#94A3B8] text-xs font-bold uppercase tracking-wider mb-2">
                                        {grade.subject}
                                    </div>

                                    <h3 className="text-2xl font-space font-bold text-[#04306E] mb-3">
                                        Lớp {grade.grade}
                                    </h3>

                                    <p className="font-inter text-[#475569] text-sm mb-6 line-clamp-2 leading-relaxed min-h-[44px]">
                                        {grade.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9] w-full mt-auto">
                                        <span className="font-inter text-xs font-semibold text-[#64748B]">
                                            {grade.topicsCount} CHỦ ĐỀ
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-[#F0F7FF] flex items-center justify-center group-hover:bg-[#3398DB] transition-colors duration-300">
                                            <ArrowRight className="w-4 h-4 text-[#3398DB] group-hover:text-white transition-colors duration-300" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* THPT Section */}
                    <div>
                        <div className="mb-8 text-center md:text-left">
                            <h2 className="text-3xl font-space font-bold text-[#04306E] mb-2 tracking-[-0.5px]">
                                Trung học phổ thông (THPT)
                            </h2>
                            <p className="font-inter text-[#64748B] text-lg">Môn Hóa học chuyên biệt</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {GRADES.filter((g) => g.level === "THPT").map((grade) => (
                                <Link
                                    key={grade.id}
                                    to={`/library/${grade.id}`}
                                    className="group relative bg-white/80 backdrop-blur-[10px] border border-white rounded-[24px] p-6 hover:border-[#3398DB]/30 transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_32px_rgba(4,48,110,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(51,152,219,0.2)] flex flex-col items-start"
                                >
                                    <div
                                        className={`w-14 h-14 bg-gradient-to-br ${grade.color} rounded-2xl flex items-center justify-center text-white mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-md`}
                                    >
                                        {grade.icon}
                                    </div>

                                    <div className="font-inter text-[#94A3B8] text-xs font-bold uppercase tracking-wider mb-2">
                                        {grade.subject}
                                    </div>

                                    <h3 className="text-2xl font-space font-bold text-[#04306E] mb-3">
                                        Lớp {grade.grade}
                                    </h3>

                                    <p className="font-inter text-[#475569] text-sm mb-6 line-clamp-2 leading-relaxed min-h-[44px]">
                                        {grade.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9] w-full mt-auto">
                                        <span className="font-inter text-xs font-semibold text-[#64748B]">
                                            {grade.topicsCount} CHƯƠNG
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-[#F0F7FF] flex items-center justify-center group-hover:bg-[#3398DB] transition-colors duration-300">
                                            <ArrowRight className="w-4 h-4 text-[#3398DB] group-hover:text-white transition-colors duration-300" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LibraryPage;
