import { useState, useMemo } from 'react';
import ElementCard from './components/ElementCard';
import ElementDetail from './components/ElementDetail';
import periodicData from './elements.json';
import { ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const PeriodicTablePage = () => {
    const [selectedElement, setSelectedElement] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const elements = periodicData.elements;

    // Filter logic
    const filteredElements = useMemo(() => {
        return elements
            .filter(el => el.number <= 118)
            .map(el => {
                // Fix positions for 57 (La) and 89 (Ac) to match Google's layout
                if (el.number === 57) return { ...el, xpos: 3, ypos: 6 };
                if (el.number === 89) return { ...el, xpos: 3, ypos: 7 };
                return el;
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
        let name = element.name.toLowerCase().trim();

        // Handle Map for filename mismatches
        const nameMap: Record<string, string> = {
            'aluminium': 'aluminum',
            'caesium': 'cesium'
        };

        if (nameMap[name]) {
            name = nameMap[name];
        }

        return `/models/elements/element_${num}_${name}.glb?v=${Date.now()}`;
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

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl text-slate-700">
                    ChemXLab
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-100 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 transition-all"
                        />
                    </div>
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">C</div>
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
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeriodicTablePage;
