import {
    Atom,
    BookOpen,
    Box,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Sparkles,
} from "lucide-react";
import { Suspense, lazy, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EnhancedContentRenderer from "./components/EnhancedContentRenderer";
import type { Lesson, Topic } from "./data";
import { getGradeData } from "./data";

// Lazy load 3D component
const ElementViewer3D = lazy(() => import("./components/ElementViewer3D"));

// Complete element mappings (Vietnamese + English)
const ELEMENT_MAPPINGS: Record<string, { number: number; name: string; symbol: string }> = {
    // Common elements with Vietnamese names
    "hidro": { number: 1, name: "Hydrogen", symbol: "H" },
    "hydrogen": { number: 1, name: "Hydrogen", symbol: "H" },
    "heli": { number: 2, name: "Helium", symbol: "He" },
    "helium": { number: 2, name: "Helium", symbol: "He" },
    "liti": { number: 3, name: "Lithium", symbol: "Li" },
    "lithium": { number: 3, name: "Lithium", symbol: "Li" },
    "cacbon": { number: 6, name: "Carbon", symbol: "C" },
    "carbon": { number: 6, name: "Carbon", symbol: "C" },
    "nitơ": { number: 7, name: "Nitrogen", symbol: "N" },
    "nitrogen": { number: 7, name: "Nitrogen", symbol: "N" },
    "oxi": { number: 8, name: "Oxygen", symbol: "O" },
    "oxygen": { number: 8, name: "Oxygen", symbol: "O" },
    "flo": { number: 9, name: "Fluorine", symbol: "F" },
    "fluorine": { number: 9, name: "Fluorine", symbol: "F" },
    "neon": { number: 10, name: "Neon", symbol: "Ne" },
    "natri": { number: 11, name: "Sodium", symbol: "Na" },
    "sodium": { number: 11, name: "Sodium", symbol: "Na" },
    "magie": { number: 12, name: "Magnesium", symbol: "Mg" },
    "magnesium": { number: 12, name: "Magnesium", symbol: "Mg" },
    "nhôm": { number: 13, name: "Aluminum", symbol: "Al" },
    "aluminum": { number: 13, name: "Aluminum", symbol: "Al" },
    "silic": { number: 14, name: "Silicon", symbol: "Si" },
    "silicon": { number: 14, name: "Silicon", symbol: "Si" },
    "photpho": { number: 15, name: "Phosphorus", symbol: "P" },
    "phosphorus": { number: 15, name: "Phosphorus", symbol: "P" },
    "lưu huỳnh": { number: 16, name: "Sulfur", symbol: "S" },
    "sulfur": { number: 16, name: "Sulfur", symbol: "S" },
    "clo": { number: 17, name: "Chlorine", symbol: "Cl" },
    "chlorine": { number: 17, name: "Chlorine", symbol: "Cl" },
    "argon": { number: 18, name: "Argon", symbol: "Ar" },
    "kali": { number: 19, name: "Potassium", symbol: "K" },
    "potassium": { number: 19, name: "Potassium", symbol: "K" },
    "canxi": { number: 20, name: "Calcium", symbol: "Ca" },
    "calcium": { number: 20, name: "Calcium", symbol: "Ca" },
    "sắt": { number: 26, name: "Iron", symbol: "Fe" },
    "iron": { number: 26, name: "Iron", symbol: "Fe" },
    "đồng": { number: 29, name: "Copper", symbol: "Cu" },
    "copper": { number: 29, name: "Copper", symbol: "Cu" },
    "kẽm": { number: 30, name: "Zinc", symbol: "Zn" },
    "zinc": { number: 30, name: "Zinc", symbol: "Zn" },
    "brom": { number: 35, name: "Bromine", symbol: "Br" },
    "bromine": { number: 35, name: "Bromine", symbol: "Br" },
    "bạc": { number: 47, name: "Silver", symbol: "Ag" },
    "silver": { number: 47, name: "Silver", symbol: "Ag" },
    "iot": { number: 53, name: "Iodine", symbol: "I" },
    "iodine": { number: 53, name: "Iodine", symbol: "I" },
    "vàng": { number: 79, name: "Gold", symbol: "Au" },
    "gold": { number: 79, name: "Gold", symbol: "Au" },
};

// Get all elements mentioned in lesson
function getElementsForLesson(lesson: Lesson): { number: number; name: string; symbol: string }[] {
    const searchText = (lesson.title + " " + lesson.content).toLowerCase();
    const found: { number: number; name: string; symbol: string }[] = [];
    const foundNumbers = new Set<number>();

    for (const [keyword, element] of Object.entries(ELEMENT_MAPPINGS)) {
        if (searchText.includes(keyword) && !foundNumbers.has(element.number)) {
            found.push(element);
            foundNumbers.add(element.number);
            if (found.length >= 3) break; // Max 3 elements
        }
    }
    return found;
}

// Loading fallback
function Model3DFallback() {
    return (
        <div className="h-40 rounded-xl bg-white/60 flex items-center justify-center border border-[#E2E8F0] shadow-sm">
            <div className="w-8 h-8 border-2 border-[#3398DB]/30 border-t-[#3398DB] rounded-full animate-spin" />
        </div>
    );
}

const GradeDetail = () => {
    const { gradeId } = useParams<{ gradeId: string }>();
    const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

    const gradeData = gradeId ? getGradeData(gradeId) : undefined;

    if (!gradeData) {
        return (
            <div className="min-h-screen bg-[#F0F7FF] pt-20 flex items-center justify-center font-sans">
                <div className="text-center">
                    <h1 className="text-2xl font-space font-bold text-[#04306E] mb-4">
                        Không tìm thấy dữ liệu
                    </h1>
                    <Link to="/library" className="font-inter text-[#3398DB] hover:underline">
                        ← Quay lại thư viện
                    </Link>
                </div>
            </div>
        );
    }

    const toggleTopic = (topicId: string) => {
        const newExpanded = new Set(expandedTopics);
        if (newExpanded.has(topicId)) {
            newExpanded.delete(topicId);
        } else {
            newExpanded.add(topicId);
        }
        setExpandedTopics(newExpanded);
    };

    const handleLessonClick = (lesson: Lesson, topic: Topic) => {
        setSelectedLesson(lesson);
        setSelectedTopic(topic);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const closeLessonView = () => {
        setSelectedLesson(null);
        setSelectedTopic(null);
    };

    // Get elements for current lesson
    const elements = selectedLesson ? getElementsForLesson(selectedLesson) : [];
    const has3DContent = elements.length > 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] via-[#E0F0FF] to-white pt-20 pb-16 font-sans">
            {/* Breadcrumb */}
            <div className="bg-white/80 border-b border-[#E2E8F0] sticky top-16 z-20 backdrop-blur-md shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm font-inter">
                        <Link
                            to="/library"
                            className="text-[#64748B] hover:text-[#04306E] flex items-center gap-1 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Thư viện
                        </Link>
                        <span className="text-[#CBD5E1]">/</span>
                        <span className="text-[#04306E] font-medium">Lớp {gradeData.grade}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="flex gap-6">
                    {/* Sidebar - Topic List */}
                    <aside className="w-72 flex-shrink-0 hidden lg:block">
                        <div className="sticky top-32 bg-white/90 rounded-2xl border border-[#E2E8F0] shadow-[0_8px_32px_rgba(4,48,110,0.05)] overflow-hidden backdrop-blur-md">
                            {/* Header */}
                            <div className="p-4 border-b border-[#E2E8F0] bg-gradient-to-r from-[#F0F7FF] to-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3398DB]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="flex items-center gap-3 mb-2 relative z-10">
                                    <div className="w-8 h-8 bg-[#3398DB]/10 rounded-lg flex items-center justify-center">
                                        <GraduationCap className="w-4 h-4 text-[#3398DB]" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-space font-bold text-[#04306E]">
                                            Lớp {gradeData.grade}
                                        </h2>
                                        <p className="font-inter text-xs text-[#64748B]">
                                            {gradeData.topics.length} chủ đề
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Topics */}
                            <div className="max-h-[calc(100vh-250px)] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}>
                                {gradeData.topics.map((topic) => (
                                    <div key={topic.id} className="border-b border-[#F1F5F9] last:border-0">
                                        <button
                                            onClick={() => toggleTopic(topic.id)}
                                            className="w-full px-4 py-3 flex items-start gap-2 hover:bg-[#F8FAFC] transition-colors text-left"
                                        >
                                            <div className="mt-0.5">
                                                {expandedTopics.has(topic.id) ? (
                                                    <ChevronDown className="w-4 h-4 text-[#3398DB]" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-inter text-xs font-semibold text-[#334155] mb-0.5 line-clamp-2">
                                                    {topic.title}
                                                </h3>
                                                <p className="font-inter text-[10px] text-[#94A3B8]">
                                                    {topic.lessons.length} bài
                                                </p>
                                            </div>
                                        </button>

                                        {expandedTopics.has(topic.id) && (
                                            <div className="bg-[#F8FAFC]/50 px-4 pb-3">
                                                {topic.lessons.map((lesson) => (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => handleLessonClick(lesson, topic)}
                                                        className={`w-full text-left py-1.5 px-3 rounded-lg font-inter text-xs transition-colors flex items-center gap-2 ${selectedLesson?.id === lesson.id
                                                            ? "bg-[#3398DB]/10 text-[#04306E] font-medium shadow-sm"
                                                            : "text-[#64748B] hover:text-[#04306E] hover:bg-white"
                                                            }`}
                                                    >
                                                        <BookOpen className="w-3 h-3 flex-shrink-0" />
                                                        <span className="line-clamp-1">{lesson.title}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {selectedLesson && selectedTopic ? (
                            <div className="flex gap-6">
                                {/* Lesson Content - Left side */}
                                <div className="flex-1 min-w-0 space-y-4">
                                    {/* Header */}
                                    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
                                        <button
                                            onClick={closeLessonView}
                                            className="font-inter text-xs text-[#64748B] hover:text-[#04306E] mb-4 flex items-center gap-1 transition-colors"
                                        >
                                            <ChevronLeft className="w-3 h-3" />
                                            Quay lại
                                        </button>
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            <span className="font-inter text-[10px] text-[#3398DB] bg-[#3398DB]/10 px-2 py-1 rounded-md uppercase tracking-wider font-semibold">
                                                {selectedTopic.title}
                                            </span>
                                            {elements.length > 0 && (
                                                <div className="inline-flex px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-purple-600 font-inter text-xs items-center gap-1.5">
                                                    <Atom className="w-3.5 h-3.5" />
                                                    <span className="font-medium">{elements.length} nguyên tố liên quan</span>
                                                </div>
                                            )}
                                        </div>
                                        <h1 className="text-2xl md:text-3xl font-space font-bold text-[#04306E] mb-3">
                                            {selectedLesson.title}
                                        </h1>
                                    </div>

                                    {/* Lesson Content */}
                                    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#E2E8F0] p-6 md:p-8 shadow-sm">
                                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#F1F5F9]">
                                            <Sparkles className="w-5 h-5 text-[#3398DB]" />
                                            <h3 className="text-[#04306E] font-space font-bold text-lg">Nội dung bài học</h3>
                                        </div>
                                        <div className="font-inter text-[#334155] leading-relaxed">
                                            <EnhancedContentRenderer
                                                content={selectedLesson.content}
                                                keyPoints={selectedLesson.keyPoints}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3D Content - Right side */}
                                {has3DContent && (
                                    <div className="w-72 flex-shrink-0 space-y-4 hidden xl:block">
                                        {/* 3D Element Models */}
                                        {elements.length > 0 && (
                                            <div className="sticky top-32">
                                                <div className="flex items-center gap-2 mb-3 bg-white/60 p-3 rounded-xl border border-[#E2E8F0] shadow-sm backdrop-blur-sm">
                                                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                                        <Box className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <h4 className="text-[#04306E] font-space text-sm font-bold">Mô hình 3D</h4>
                                                </div>
                                                <div className="space-y-4">
                                                    {elements.map((element) => (
                                                        <Suspense key={element.number} fallback={<Model3DFallback />}>
                                                            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden p-2 relative group hover:shadow-md transition-shadow">
                                                                <ElementViewer3D
                                                                    elementNumber={element.number}
                                                                    elementName={element.name}
                                                                    elementSymbol={element.symbol}
                                                                />
                                                            </div>
                                                        </Suspense>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#E2E8F0] p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-20 h-20 bg-gradient-to-br from-[#F0F7FF] to-white border border-[#E2E8F0] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm shadow-[#3398DB]/5">
                                    <BookOpen className="w-10 h-10 text-[#3398DB]" />
                                </div>
                                <h2 className="text-2xl font-space font-bold text-[#04306E] mb-3">
                                    Chọn bài học để bắt đầu
                                </h2>
                                <p className="font-inter text-[#64748B] text-sm max-w-md mx-auto mb-6 leading-relaxed">
                                    Hãy chọn một chủ đề ở danh mục bên trái, sau đó click vào bài học để xem chi tiết lý thuyết và các mô hình biểu diễn 3D (nếu có).
                                </p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <div className="px-4 py-2 bg-purple-50 border border-purple-100 rounded-lg flex items-center gap-2">
                                        <Box className="w-4 h-4 text-purple-500" />
                                        <span className="text-purple-700 font-inter text-sm font-medium">Hỗ trợ Mô hình 3D</span>
                                    </div>
                                    <div className="px-4 py-2 bg-[#F0F7FF] border border-[#E2E8F0] rounded-lg flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-[#3398DB]" />
                                        <span className="text-[#04306E] font-inter text-sm font-medium">Lý thuyết trực quan</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default GradeDetail;
