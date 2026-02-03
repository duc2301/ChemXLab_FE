import { ArrowRight, Atom, BookOpen, FlaskConical, Layers } from "lucide-react";
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
        <div className="min-h-screen bg-[#0F172A] pt-20 pb-16">
            {/* Hero Section */}
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                            <BookOpen className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-300 text-sm font-medium">
                                Chương trình Chân Trời Sáng Tạo 2024-2025
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                            Hệ thống Kiến thức{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                Hóa học
                            </span>
                        </h1>

                        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
                            Trọn bộ kiến thức Hóa học từ lớp 6 đến lớp 12, được biên soạn theo
                            chương trình sách giáo khoa mới nhất. Đầy đủ lý thuyết, công thức
                            và ví dụ minh họa.
                        </p>

                        <div className="flex justify-center gap-6 text-slate-400 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                THCS: Lớp 6-9
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                THPT: Lớp 10-12
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grade Grid */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    {/* THCS Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Trung học cơ sở (THCS)
                        </h2>
                        <p className="text-slate-400 mb-8">
                            Phần Hóa học trong môn Khoa học tự nhiên
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {GRADES.filter((g) => g.level === "THCS").map((grade) => (
                                <Link
                                    key={grade.id}
                                    to={`/library/${grade.id}`}
                                    className="group relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div
                                        className={`w-14 h-14 bg-gradient-to-br ${grade.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                                    >
                                        {grade.icon}
                                    </div>

                                    <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                                        {grade.subject}
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Lớp {grade.grade}
                                    </h3>

                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                        {grade.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                            {grade.topicsCount} chủ đề
                                        </span>
                                        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* THPT Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Trung học phổ thông (THPT)
                        </h2>
                        <p className="text-slate-400 mb-8">Môn Hóa học chuyên biệt</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {GRADES.filter((g) => g.level === "THPT").map((grade) => (
                                <Link
                                    key={grade.id}
                                    to={`/library/${grade.id}`}
                                    className="group relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div
                                        className={`w-14 h-14 bg-gradient-to-br ${grade.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                                    >
                                        {grade.icon}
                                    </div>

                                    <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                                        {grade.subject}
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Lớp {grade.grade}
                                    </h3>

                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                        {grade.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                            {grade.topicsCount} chương
                                        </span>
                                        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
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
