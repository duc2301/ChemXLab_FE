import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MoleculeViewer from "../../../components/ThreeD/MoleculeViewer";

const PeriodicTableSection = () => {
    const elements = [
        { symbol: "H", name: "Hydrogen", viName: "Hiđro", num: 1, mass: "1.008", model: "/models/elements/element_001_hydrogen.glb" },
        { symbol: "He", name: "Helium", viName: "Heli", num: 2, mass: "4.0026", model: "/models/elements/element_002_helium.glb" },
        { symbol: "Li", name: "Lithium", viName: "Liti", num: 3, mass: "6.94", model: "/models/elements/element_003_lithium.glb" },
        { symbol: "C", name: "Carbon", viName: "Cacbon", num: 6, mass: "12.011", model: "/models/elements/element_006_carbon.glb" },
        { symbol: "O", name: "Oxygen", viName: "Oxi", num: 8, mass: "15.999", model: "/models/elements/element_008_oxygen.glb" },
        { symbol: "Fe", name: "Iron", viName: "Sắt", num: 26, mass: "55.845", model: "/models/elements/element_026_iron.glb" },
    ];

    return (
        <section className="py-16">
            {/* Section Header */}
            <div className="text-center mb-4 space-y-2">
                <p className="text-sky-500 font-semibold text-xs uppercase tracking-[0.2em]">Khám phá thế giới vi mô</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e2a4a]">
                    Thư viện <span className="text-sky-600">Mô phỏng 3D</span>
                </h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Khám phá các mô hình Hóa học 3D trong Trời gian thực từ các mô hình từ đơn giản đến phức tạp.
                </p>
            </div>

            {/* Element Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-10">
                {elements.map((el) => (
                    <Link
                        to="/periodic-table"
                        key={el.symbol}
                        className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                        {/* 3D Preview */}
                        <div className="h-36 w-full bg-[#f0f4fa] relative overflow-hidden">
                            <MoleculeViewer modelPath={el.model} autoRotate={true} />
                        </div>

                        {/* Card Info */}
                        <div className="p-3 text-center">
                            <div className="text-lg font-bold text-[#1e2a4a]">{el.symbol}</div>
                            <div className="text-xs text-slate-400 font-medium">{el.viName}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* View All */}
            <div className="text-center mt-10">
                <Link
                    to="/periodic-table"
                    className="inline-flex items-center gap-2 bg-[#1e2a4a] hover:bg-[#162040] text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md hover:-translate-y-0.5"
                >
                    Xem toàn bộ bảng tuần hoàn <ArrowRight size={16} />
                </Link>
            </div>
        </section>
    );
};

export default PeriodicTableSection;
