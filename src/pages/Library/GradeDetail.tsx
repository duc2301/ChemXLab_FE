import { useParams, Link } from "react-router-dom";
import { useState, Suspense, lazy } from "react";
import {
    ChevronLeft,
    ChevronDown,
    ChevronRight,
    BookOpen,
    GraduationCap,
    Atom,
    Sparkles,
    Box,
} from "lucide-react";
import { getGradeData } from "./data";
import type { Topic, Lesson } from "./data";
import EnhancedContentRenderer from "./components/EnhancedContentRenderer";

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
        <div className="h-40 rounded-xl bg-slate-800/50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
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
            <div className="min-h-screen bg-[#0F172A] pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">
                        Không tìm thấy dữ liệu
                    </h1>
                    <Link to="/library" className="text-blue-400 hover:underline">
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
        <div className="min-h-screen bg-[#0F172A] pt-20 pb-16">
            {/* Breadcrumb */}
            <div className="bg-slate-800/50 border-b border-slate-700/50">
                <div className="container mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link
                            to="/library"
                            className="text-slate-400 hover:text-white flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Thư viện
                        </Link>
                        <span className="text-slate-600">/</span>
                        <span className="text-white font-medium">Lớp {gradeData.grade}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="flex gap-6">
                    {/* Sidebar - Topic List */}
                    <aside className="w-72 flex-shrink-0 hidden lg:block">
                        <div className="sticky top-24 bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
                            {/* Header */}
                            <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <GraduationCap className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-white">
                                            Lớp {gradeData.grade}
                                        </h2>
                                        <p className="text-xs text-slate-400">
                                            {gradeData.topics.length} chủ đề
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Topics */}
                            <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
                                {gradeData.topics.map((topic) => (
                                    <div key={topic.id} className="border-b border-slate-700/30 last:border-0">
                                        <button
                                            onClick={() => toggleTopic(topic.id)}
                                            className="w-full px-4 py-3 flex items-start gap-2 hover:bg-slate-700/30 transition-colors text-left"
                                        >
                                            <div className="mt-0.5">
                                                {expandedTopics.has(topic.id) ? (
                                                    <ChevronDown className="w-4 h-4 text-blue-400" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-slate-500" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-semibold text-white mb-0.5 line-clamp-2">
                                                    {topic.title}
                                                </h3>
                                                <p className="text-[10px] text-slate-500">
                                                    {topic.lessons.length} bài
                                                </p>
                                            </div>
                                        </button>

                                        {expandedTopics.has(topic.id) && (
                                            <div className="bg-slate-900/50 px-4 pb-3">
                                                {topic.lessons.map((lesson) => (
                                                    <button
                                                        key={lesson.id}
                                                        onClick={() => handleLessonClick(lesson, topic)}
                                                        className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center gap-2 ${selectedLesson?.id === lesson.id
                                                            ? "bg-blue-600/20 text-blue-300"
                                                            : "text-slate-400 hover:text-white hover:bg-slate-700/50"
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
                                    <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
                                        <button
                                            onClick={closeLessonView}
                                            className="text-xs text-slate-400 hover:text-white mb-3 flex items-center gap-1"
                                        >
                                            <ChevronLeft className="w-3 h-3" />
                                            Quay lại
                                        </button>
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">
                                                {selectedTopic.title}
                                            </span>
                                            {elements.length > 0 && (
                                                <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-[10px] flex items-center gap-1">
                                                    <Atom className="w-2.5 h-2.5" />
                                                    {elements.length} nguyên tố
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-xl font-bold text-white">
                                            {selectedLesson.title}
                                        </h1>
                                    </div>

                                    {/* Lesson Content */}
                                    <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Sparkles className="w-4 h-4 text-blue-400" />
                                            <h3 className="text-white font-semibold text-sm">Nội dung bài học</h3>
                                        </div>
                                        <EnhancedContentRenderer
                                            content={selectedLesson.content}
                                            keyPoints={selectedLesson.keyPoints}
                                        />
                                    </div>
                                </div>

                                {/* 3D Content - Right side */}
                                {has3DContent && (
                                    <div className="w-72 flex-shrink-0 space-y-4">
                                        {/* 3D Element Models */}
                                        {elements.length > 0 && (
                                            <div className="sticky top-24">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Box className="w-4 h-4 text-purple-400" />
                                                    <h4 className="text-white text-sm font-semibold">Mô hình 3D</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {elements.map((element) => (
                                                        <Suspense key={element.number} fallback={<Model3DFallback />}>
                                                            <ElementViewer3D
                                                                elementNumber={element.number}
                                                                elementName={element.name}
                                                                elementSymbol={element.symbol}
                                                            />
                                                        </Suspense>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-12 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-8 h-8 text-blue-400" />
                                </div>
                                <h2 className="text-lg font-semibold text-white mb-2">
                                    Chọn bài học để bắt đầu
                                </h2>
                                <p className="text-slate-400 text-sm max-w-md mx-auto mb-4">
                                    Click vào chủ đề ở bên trái để xem danh sách bài học
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <div className="px-3 py-1.5 bg-purple-500/10 border border-purple-400/20 rounded-full flex items-center gap-1.5">
                                        <Box className="w-3 h-3 text-purple-400" />
                                        <span className="text-purple-200 text-xs">Mô hình 3D</span>
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
