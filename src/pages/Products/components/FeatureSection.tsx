import { ArrowRight, Box } from "lucide-react";
import { Link } from "react-router-dom";

const FeatureSection = () => {
    return (
        <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Methane Card */}
                <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden text-white group cursor-pointer hover:shadow-2xl transition-all">
                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-3">
                            Khám phá cấu trúc 3D của metan
                        </h3>
                        <p className="text-blue-200 mb-8 max-w-xs">
                            Viên gạch đầu tiên trong thế giới hóa học hữu cơ
                        </p>
                        <Link to="/methane" className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-bold hover:bg-white hover:text-blue-900 transition-colors">
                            Xem ngay
                        </Link>
                    </div>

                    {/* 3D Model Decoration */}
                    <div className="absolute right-0 bottom-0 w-64 h-64 transform translate-x-1/4 translate-y-1/4">
                        {/* Simple CSS Molecule */}
                        <div className="relative w-full h-full flex items-center justify-center animate-spin-slow" style={{ animationDuration: '20s' }}>
                            <div className="w-16 h-16 bg-blue-500 rounded-full shadow-[inset_-5px_-5px_10px_rgba(0,0,0,0.3)] z-10"></div> {/* C */}
                            <div className="absolute top-10 left-10 w-10 h-10 bg-slate-200 rounded-full shadow-lg"></div> {/* H */}
                            <div className="absolute top-10 right-10 w-10 h-10 bg-slate-200 rounded-full shadow-lg"></div> {/* H */}
                            <div className="absolute bottom-16 right-16 w-10 h-10 bg-slate-200 rounded-full shadow-lg"></div> {/* H */}
                            <div className="absolute bottom-6 left-20 w-10 h-10 bg-slate-200 rounded-full shadow-lg"></div> {/* H */}
                        </div>
                    </div>
                </div>

                {/* Electron Movement Card */}
                <div className="bg-blue-50 rounded-[2.5rem] p-10 relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all border border-blue-100">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                    <div className="relative z-10 grid grid-cols-2 gap-4 h-full">
                        <div className="flex flex-col justify-center">
                            <h3 className="text-3xl font-bold text-slate-900 mb-3 text-balance">
                                Khám phá ngay chuyển động electron
                            </h3>
                            <p className="text-slate-600 mb-8 text-sm">
                                Quan sát sự phân tầng năng lượng trong nguyên tử
                            </p>
                            <div className="mt-auto">
                                <Link to="/electron" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
                                    Khám phá <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>

                        {/* Abstract Electron Visualization */}
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-40 h-40 border border-blue-200 rounded-full animate-[spin_5s_linear_infinite]"></div>
                            <div className="absolute w-40 h-40 border border-blue-200 rounded-full animate-[spin_7s_linear_infinite_reverse] rotate-45"></div>
                            <div className="absolute w-40 h-40 border border-blue-200 rounded-full animate-[spin_6s_linear_infinite] -rotate-45"></div>

                            {/* Nucleus */}
                            <div className="w-8 h-8 bg-blue-600 rounded-full shadow-lg relative z-10 grid place-items-center">
                                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                            </div>

                            {/* Electrons */}
                            <div className="absolute w-full h-full animate-[spin_3s_linear_infinite]">
                                <div className="absolute top-0 left-1/2 w-3 h-3 bg-red-500 rounded-full shadow transform -translate-x-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
