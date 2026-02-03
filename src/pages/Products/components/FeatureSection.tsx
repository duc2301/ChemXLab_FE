import { ArrowRight, Atom, Box, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";

const FeatureSection = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-white to-blue-50/30">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mb-4 tracking-wide">
                        CÔNG NGHỆ GIÁO DỤC 4.0
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        Phòng Thí Nghiệm Hóa Học <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            Trong Tầm Tay Bạn
                        </span>
                    </h2>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        Khám phá thế giới vi mô với công nghệ mô phỏng 3D hiện đại.
                        Biến những lý thuyết khô khan thành trải nghiệm trực quan, sinh động.
                    </p>
                </div>

                {/* Main Feature Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {/* Card 1: 3D Visualization */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg shadow-blue-100/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                            <Box className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                            Mô hình 3D Sống động
                        </h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Quan sát cấu trúc phân tử, nguyên tử từ mọi góc độ. Xoay, phóng to và tương tác trực tiếp.
                        </p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-center gap-2 text-slate-600 text-sm">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                118 Nguyên tố Hóa học
                            </li>
                            <li className="flex items-center gap-2 text-slate-600 text-sm">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                Cấu trúc tinh thể chính xác
                            </li>
                        </ul>
                    </div>

                    {/* Card 2: Interactive Simulation */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg shadow-blue-100/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                            <FlaskConical className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                            Mô phỏng Phản ứng
                        </h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Thực hiện các thí nghiệm hóa học ảo một cách an toàn. Quan sát hiện tượng xảy ra trong thời gian thực.
                        </p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-center gap-2 text-slate-600 text-sm">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                Phản ứng cháy nổ an toàn
                            </li>
                            <li className="flex items-center gap-2 text-slate-600 text-sm">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                Kết tủa & Đổi màu
                            </li>
                        </ul>
                    </div>

                    {/* Card 3: Deep Understanding */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg shadow-blue-100/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                            <Atom className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                            Hiểu sâu Bản chất
                        </h3>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Đi sâu vào thế giới vi hạt. Hiểu rõ cơ chế phản ứng và chuyển động của electron.
                        </p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-center gap-2 text-slate-600 text-sm">
                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                                Lớp vỏ Electron
                            </li>
                            <li className="flex items-center gap-2 text-slate-600 text-sm">
                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                                Liên kết hóa học
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Call to Action Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-500/30">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50" />

                    <div className="relative z-10 text-center md:text-left">
                        <h3 className="text-3xl font-bold text-white mb-2">
                            Sẵn sàng khám phá?
                        </h3>
                        <p className="text-blue-100 text-lg">
                            Truy cập thư viện hóa học ngay hôm nay. Hoàn toàn miễn phí.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/labtest"
                            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center gap-2 group"
                        >
                            Vào phòng thí nghiệm
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        {/* <button className="px-8 py-4 bg-blue-700/50 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors border border-blue-400/30 backdrop-blur-sm">
                            Xem video demo
                        </button> */}
                    </div>
                </div>
            </div>
        </section >
    );
};

export default FeatureSection;
