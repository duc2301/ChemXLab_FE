import { Facebook, Mail, Youtube } from "lucide-react";

const CTASection = () => {
    return (
        <section className="bg-blue-50/50 rounded-[3rem] py-16 px-12 mb-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-12">

                {/* Registration Form */}
                <div className="flex-1 max-w-lg space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">Đăng ký thông tin</h3>
                        <p className="text-slate-500 text-sm mt-1">Đăng ký thông tin để nhận ngay những tin tức mới nhất về ChemXLab</p>
                    </div>

                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full bg-white/50 border border-slate-200 rounded-full py-3 px-6 pr-16 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-slate-600 placeholder:text-slate-400"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-slate-700 transition-colors">
                            Gửi
                        </button>
                    </div>
                </div>

                {/* Logo Center (Optional, skipping if not available, replacing with text for now) */}
                <div className="flex-1 flex justify-center">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 drop-shadow-sm select-none">
                        CHEMXLAB
                    </h2>
                </div>

                {/* Social Links */}
                <div className="flex-1 flex flex-col items-end space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">Liên hệ</h3>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 hover:shadow-md transition-all">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 hover:shadow-md transition-all">
                            <Mail className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:text-red-600 hover:shadow-md transition-all">
                            <Youtube className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
