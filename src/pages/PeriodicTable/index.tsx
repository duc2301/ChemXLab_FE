import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MoleculeViewer from '../../components/ThreeD/MoleculeViewer';
import logo from "../../shared/assets/Logo/logo.png";
import ElementCard from './components/ElementCard';
import ElementDetail from './components/ElementDetail';
import periodicData from './elements.json';
import { vietnameseElements } from './vietnamese_data';

const PeriodicTablePage = () => {
    const [selectedElement, setSelectedElement] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const elements = periodicData.elements;

    // Filter logic
    const filteredElements = useMemo(() => {
        return elements
            .filter(el => el.number <= 118)
            .map(el => {
                const viData = vietnameseElements[el.number];
                // Enrich data for searching in Vietnamese too
                const enriched = viData ? { ...el, ...viData } : el;

                // Fix positions for 57 (La) and 89 (Ac) to match Google's layout
                if (enriched.number === 57) return { ...enriched, xpos: 3, ypos: 6 };
                if (enriched.number === 89) return { ...enriched, xpos: 3, ypos: 7 };
                return enriched;
            })
            .filter(el =>
                el.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                el.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [elements, searchTerm]);

    // Model path builder
    const getModelPath = (element: any) => {
        if (!element) return null;
        const num = element.number.toString().padStart(3, '0');
        // We need the original English name for the model file path usually
        // But since valid Vietnamese keys are numbers, we can look up English name from original json if needed
        // However, the 'element' passed here might have Vietnamese name now.
        // Let's rely on 'periodicData' to find English name for filename if name changed

        const originalElement = periodicData.elements.find(e => e.number === element.number);
        let name = (originalElement?.name || element.name).toLowerCase().trim();

        // Handle Map for filename mismatches
        const nameMap: Record<string, string> = {
            'aluminium': 'aluminum',
            'caesium': 'cesium'
        };

        if (nameMap[name]) {
            name = nameMap[name];
        }

        return `/models/elements/element_${num}_${name}.glb`;
    };

    return (
        <div className="h-screen bg-white text-slate-900 font-google overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-white sticky top-0 z-40 py-2 px-6 shadow-sm border-b border-slate-100 flex items-center justify-between h-16 shrink-0">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-slate-600" />
                    </Link>
                    <div className="hidden md:block text-xl font-medium text-slate-500">Bảng tuần hoàn hoá học 3D</div>
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <img src={logo} alt="ChemXLab" className="h-10 w-auto object-contain" />
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm nguyên tố..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row h-full overflow-hidden">
                {/* Main Grid Area - No scrolling desired, so we scale to fit */}
                <div className="flex-1 bg-white p-2 lg:p-4 relative flex flex-col items-center justify-center overflow-hidden">

                    {/* Grid Container - Flex 1 to take available space */}
                    <div className="flex-1 w-full max-w-[1500px] flex items-center justify-center min-h-0">
                        <div className="w-full aspect-[18/10] max-h-full">
                            <div className="grid grid-cols-18 gap-2 h-full w-full" style={{ gridTemplateRows: 'repeat(10, 1fr)' }}>
                                {filteredElements.map((element) => (
                                    <ElementCard
                                        key={element.number}
                                        element={element}
                                        onClick={() => setSelectedElement(element)}
                                        isDimmed={activeCategory ? !element.category.toLowerCase().includes(activeCategory) : false}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Legend Strip - Fixed at bottom, no scroll, shrink-0 */}
                    <div className="mt-4 mb-2 flex flex-wrap justify-center gap-x-6 gap-y-2 shrink-0 z-10">
                        {[
                            { color: "border-[#4DB6AC] text-[#00897B]", label: "Kim loại kiềm", key: "alkali" },
                            { color: "border-[#FF7043] text-[#D84315]", label: "Kim loại kiềm thổ", key: "alkaline" },
                            { color: "border-[#AB47BC] text-[#7B1FA2]", label: "Kim loại chuyển tiếp", key: "transition" },
                            { color: "border-[#81C784] text-[#388E3C]", label: "Kim loại hậu chuyển tiếp", key: "post-transition" },
                            { color: "border-[#FFCA28] text-[#FFA000]", label: "Á kim", key: "metalloid" },
                            { color: "border-[#42A5F5] text-[#1976D2]", label: "Phi kim", key: "nonmetal" },
                            { color: "border-[#29B6F6] text-[#0288D1]", label: "Halogen", key: "halogen" },
                            { color: "border-[#EC407A] text-[#C2185B]", label: "Khí hiếm", key: "noble" },
                            { color: "border-[#66BB6A] text-[#388E3C]", label: "Họ Lantan", key: "lanthanide" },
                            { color: "border-[#26A69A] text-[#00695C]", label: "Họ Actini", key: "actinide" },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => setActiveCategory(activeCategory === item.key ? null : item.key)}
                                className={`
                                    flex items-center gap-2 cursor-pointer transition-all duration-200 px-3 py-1.5 rounded-full
                                    ${activeCategory === item.key ? 'bg-slate-100 ring-2 ring-slate-200 scale-105' : 'hover:bg-slate-50 opacity-70 hover:opacity-100'}
                                    ${activeCategory && activeCategory !== item.key ? 'opacity-30' : ''}
                                `}
                            >
                                <div className={`w-3 h-3 rounded-full border-2 ${item.color.split(' ')[0]}`}></div>
                                <span className={`text-sm font-bold whitespace-nowrap ${item.color.split(' ')[1]}`}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar - Element Detail */}
                <div className={`w-full lg:w-[400px] xl:w-[450px] bg-white border-l border-slate-200 z-20 transition-all duration-300 ${!selectedElement ? 'lg:w-0 lg:opacity-0 xl:w-0 border-none' : ''}`}>
                    <div className="h-full overflow-y-auto w-full">
                        {selectedElement && (
                            <ElementDetail
                                element={selectedElement}
                                modelPath={getModelPath(selectedElement)}
                                onFullScreen={() => setIsFullScreen(true)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Full Screen Overlay - Moved here to ensure true full screen */}
            <AnimatePresence>
                {isFullScreen && selectedElement && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-[#050b18] flex flex-col items-center justify-center overflow-hidden"
                    >
                        {/* Background subtle effect */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150"></div>

                        {/* Top HUD Info */}
                        <div className="absolute top-0 left-0 w-full p-8 md:p-12 flex justify-between items-start z-10">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col"
                            >
                                {/* <span className="text-blue-400 text-xs font-bold uppercase tracking-[0.3em] mb-2">Thông tin nguyên tử</span>
                                <h2 className="text-white text-4xl md:text-6xl font-bold font-google tracking-tight flex items-baseline gap-4">
                                    {selectedElement.name}
                                    <span className="text-blue-500/50 text-2xl md:text-3xl font-light italic">{selectedElement.symbol}</span>
                                </h2>
                                <div className="mt-4 flex items-center gap-3">
                                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{selectedElement.category}</span>
                                    </div>
                                </div> */}
                            </motion.div>

                            <motion.button
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                onClick={() => setIsFullScreen(false)}
                                className="p-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl backdrop-blur-md transition-all duration-300 group"
                            >
                                <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
                            </motion.button>
                        </div>

                        {/* Main 3D Display Area */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 30, stiffness: 150 }}
                            className="relative w-full h-full flex items-center justify-center p-4"
                        >
                            <div className="w-full h-full max-w-7xl max-h-[80vh] relative">
                                {getModelPath(selectedElement) && (
                                    <MoleculeViewer modelPath={getModelPath(selectedElement)!} />
                                )}
                            </div>
                        </motion.div>

                        {/* Bottom Stats HUD */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="absolute bottom-12 w-full max-w-4xl px-8"
                        >
                            {/* <div className="grid grid-cols-3 gap-1 md:gap-4 p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl shadow-2xl">
                                <div className="flex flex-col items-center justify-center border-r border-white/10">
                                    <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Số nguyên tử</span>
                                    <span className="text-2xl md:text-5xl text-white font-black font-google">{selectedElement.number}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center border-r border-white/10">
                                    <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Ký hiệu hóa học</span>
                                    <span className="text-3xl md:text-6xl text-blue-400 font-black font-google">{selectedElement.symbol}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Khối lượng (u)</span>
                                    <span className="text-2xl md:text-5xl text-white font-black font-google">{selectedElement.atomic_mass}</span>
                                </div>
                            </div> */}
                        </motion.div>

                        {/* Corner Accents for HUD feel */}
                        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-white/5 rounded-bl-3xl pointer-events-none"></div>
                        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-white/5 rounded-br-3xl pointer-events-none"></div>
                        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-white/5 rounded-tl-3xl pointer-events-none"></div>
                        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-white/5 rounded-tr-3xl pointer-events-none"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PeriodicTablePage;
