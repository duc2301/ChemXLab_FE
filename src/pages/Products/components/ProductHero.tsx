import { ArrowRight, Beaker, FlaskConical, Atom, Sparkles, Play } from "lucide-react";
import { Link } from "react-router-dom";
import MoleculeViewer from "../../../components/ThreeD/MoleculeViewer";

const ProductHero = () => {
  return (
    <section className="mb-20">
      {/* Main Hero Card */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl">

        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px]"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 p-8 lg:p-12">

          {/* Left - Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium w-fit backdrop-blur-sm border border-blue-500/20">
              <Sparkles className="w-4 h-4" />
              Công nghệ mô phỏng 3D
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Phòng thí nghiệm
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> ảo</span>
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed max-w-md">
              Trải nghiệm mô phỏng thí nghiệm hóa học trực quan và sinh động ngay trên trình duyệt. An toàn, miễn phí và không cần cài đặt.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/labtest"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                <FlaskConical className="w-5 h-5" />
                Bắt đầu thí nghiệm
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-4 rounded-2xl font-medium hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10"
              >
                <Play className="w-5 h-5" />
                Xem demo
              </Link>
            </div>

            {/* Stats Row */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-slate-400">Thí nghiệm</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">118</div>
                <div className="text-sm text-slate-400">Nguyên tố 3D</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">Free</div>
                <div className="text-sm text-slate-400">Sử dụng</div>
              </div>
            </div>
          </div>

          {/* Right - 3D Viewer */}
          <div className="relative">
            {/* 3D Lab Model Container */}
            <div className="relative aspect-[4/3] lg:aspect-square bg-slate-800/50 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <MoleculeViewer modelPath="/models/phongthinghiem.glb" />

              {/* Overlay Badge */}
              <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white font-medium">Tương tác 3D</span>
              </div>
            </div>

            {/* Floating Element Card */}
            <div className="absolute -bottom-4 -left-4 lg:-left-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 w-52 hidden md:block">
              <div className="h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl mb-3 flex items-center justify-center">
                <Atom className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-sm font-bold text-slate-800">Bộ dụng cụ phòng Lab</div>
              <div className="text-xs text-slate-500 mt-1">Đầy đủ thiết bị thí nghiệm</div>
            </div>

            {/* Floating Badge Right */}
            <div className="absolute -top-2 -right-2 lg:-right-4 bg-gradient-to-br from-purple-500 to-blue-500 p-3 rounded-2xl shadow-lg hidden md:block">
              <Beaker className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
