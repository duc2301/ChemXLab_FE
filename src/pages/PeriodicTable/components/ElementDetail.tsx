import { AnimatePresence, motion } from "framer-motion";
import { Box, ExternalLink, Maximize2 } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import MoleculeViewer from "../../../components/ThreeD/MoleculeViewer";

class ModelErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("3D Model Load Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                    <Box size={40} className="mb-2" />
                    <span className="text-sm">Mô hình không khả dụng</span>
                </div>
            );
        }

        return this.props.children;
    }
}

interface ElementDetailProps {
    element: any | null;
    modelPath: string | null;
    onFullScreen?: () => void;
}

const ElementDetail = ({ element, modelPath, onFullScreen }: ElementDetailProps) => {

    if (!element) {
        return (
            <div className="hidden lg:flex flex-col items-center justify-center p-8 h-full bg-white text-center">
                <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Box className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-400">Chọn một nguyên tố</h3>
                <p className="text-slate-400 mt-2">Nhấp vào bảng tuần hoàn để xem chi tiết 3D</p>
            </div>
        )
    }

    // Map category to color dot
    const getCategoryColor = (cat: string) => {
        if (cat.includes('alkali')) return 'bg-cyan-400';
        if (cat.includes('alkaline')) return 'bg-red-400';
        if (cat.includes('transition')) return 'bg-purple-400';
        if (cat.includes('metalloid')) return 'bg-orange-400';
        if (cat.includes('nonmetal')) return 'bg-blue-500';
        if (cat.includes('halogen')) return 'bg-blue-400';
        if (cat.includes('noble')) return 'bg-pink-500';
        return 'bg-slate-500';
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={element.number}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white min-h-full flex flex-col"
            >
                <div className="p-8 pb-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-5xl font-bold text-slate-900 mb-1 font-google">{element.name}</h1>
                            <div className="text-2xl text-slate-500 font-medium font-google">({element.symbol}) <sup className="text-lg">{element.number}</sup></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(element.category)}`}></div>
                        <span className="text-sm font-bold text-slate-600 uppercase tracking-wide font-google">{element.category}</span>
                    </div>
                </div>

                {/* 3D Viewer Area */}
                <div className="flex-1 min-h-[300px] relative mt-4 bg-white group">
                    {modelPath ? (
                        <div className="w-full h-full absolute inset-0 bg-slate-50 overflow-hidden rounded-2xl border border-slate-100 shadow-inner">
                            <ModelErrorBoundary key={modelPath}>
                                <MoleculeViewer modelPath={modelPath} autoRotate={true} />
                            </ModelErrorBoundary>

                            {/* Full screen toggle button */}
                            <button
                                onClick={onFullScreen}
                                className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-blue-600 hover:bg-white shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                                title="Mở rộng"
                            >
                                <Maximize2 size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300 rounded-2xl border border-dashed border-slate-200">
                            <div className="flex flex-col items-center">
                                <Box className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-sm font-medium">Không có mô hình 3D</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats & Info */}
                <div className="p-8 space-y-6 bg-white shrink-0 font-roboto">
                    <div className="prose prose-sm prose-slate max-w-none">
                        <p className="text-base leading-relaxed">{element.summary}</p>

                        {element.appearance && (
                            <div className="mt-4">
                                <span className="font-bold text-slate-700 block mb-1">Trạng thái tự nhiên:</span>
                                <p className="m-0 text-slate-600">{element.appearance}</p>
                            </div>
                        )}

                        {element.uses && (
                            <div className="mt-4">
                                <span className="font-bold text-slate-700 block mb-1">Ứng dụng:</span>
                                <p className="m-0 text-slate-600">{element.uses}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-google">Khối lượng nguyên tử</div>
                            <div className="text-xl font-bold text-slate-800">{element.atomic_mass} u</div>
                        </div>

                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-google">Cấu hình electron</div>
                            <div className="text-xl font-bold text-slate-800">{element.electron_configuration_semantic}</div>
                        </div>

                        {element.density && (
                            <div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 font-google">Khối lượng riêng</div>
                                <div className="text-xl font-bold text-slate-800">{element.density} g/cm³</div>
                            </div>
                        )}
                    </div>

                    <a
                        href={element.source}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-bold mt-2"
                    >
                        Xem thêm trên Wikipedia <ExternalLink size={14} />
                    </a>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ElementDetail;
