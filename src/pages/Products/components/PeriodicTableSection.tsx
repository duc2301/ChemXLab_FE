import { ArrowRight, Atom } from "lucide-react";
import { Link } from "react-router-dom";
import MoleculeViewer from "../../../components/ThreeD/MoleculeViewer";

const PeriodicTableSection = () => {
    // Elements with model paths
    const elements = [
        { symbol: "H", name: "Hydrogen", num: 1, mass: "1.008", bg: "bg-blue-600", model: "/models/elements/element_001_hydrogen.glb" },
        { symbol: "He", name: "Helium", num: 2, mass: "4.0026", bg: "bg-blue-500", model: "/models/elements/element_002_helium.glb" },
        { symbol: "Li", name: "Lithium", num: 3, mass: "6.94", bg: "bg-indigo-500", model: "/models/elements/element_003_lithium.glb" },
        { symbol: "C", name: "Carbon", num: 6, mass: "12.011", bg: "bg-violet-500", model: "/models/elements/element_006_carbon.glb" },
        { symbol: "O", name: "Oxygen", num: 8, mass: "15.999", bg: "bg-fuchsia-500", model: "/models/elements/element_008_oxygen.glb" },
    ];

    return (
        <section className="mb-28">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl mb-4">
                    <Atom className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                    Bảng tuần hoàn tương tác
                </h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                    Khám phá từng nguyên tố với hình ảnh, đặc tính và ứng dụng sinh động
                </p>
            </div>

            <div className="relative">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-blue-50/50 -skew-y-3 scale-y-110 rounded-[3rem] -z-10"></div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-4">
                    {elements.map((el) => (
                        <Link
                            to="/periodic-table"
                            key={el.symbol}
                            className={`group relative aspect-[3/5] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl shadow-lg bg-white border border-slate-100`}
                        >
                            {/* 3D Model Preview */}
                            <div className="h-1/2 w-full bg-slate-900 relative overflow-hidden">
                                <MoleculeViewer modelPath={el.model} autoRotate={true} />
                            </div>

                            {/* Card Body */}
                            <div className="p-4 bg-white h-1/2 flex flex-col justify-between relative z-10">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-3xl font-bold text-slate-800">{el.symbol}</span>
                                        <span className="text-xs font-mono text-slate-400">{el.num}</span>
                                    </div>
                                    <h3 className="font-semibold text-slate-700">{el.name}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{el.mass}</p>
                                </div>

                                <div className="w-full bg-slate-50 py-2 rounded-lg text-center text-xs font-medium text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    Chi tiết
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        to="/periodic-table"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        Xem toàn bộ bảng tuần hoàn <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PeriodicTableSection;

