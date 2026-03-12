import MoleculeViewer from "../../../components/ThreeD/MoleculeViewer";

const ProductHero = () => {
  return (
    <section className="pt-28 pb-16 lg:pt-32 lg:pb-20">
      {/* Hero Content */}
      <div className="max-w-3xl mx-auto text-center space-y-5 mb-12">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1e2a4a] leading-[1.15] tracking-tight">
          Trải nghiệm{" "}
          <br className="hidden md:block" />
          <span className="text-sky-600">Phòng Thí Nghiệm Ảo 3D</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[15px] lg:text-base text-slate-500 max-w-lg mx-auto leading-relaxed font-medium">
          ChemXLab mang đến mô hình thí nghiệm hóa học 3D chân thật cho học sinh và giáo viên. Đầy đủ dụng cụ, an toàn và miễn phí.
        </p>
      </div>

      {/* 3D Viewer Card */}
      <div
        className="max-w-3xl mx-auto relative"
        style={{ background: "radial-gradient(ellipse at center, rgba(56,189,248,0.08) 30%, transparent 60%)" }}
      >
        <div className="relative aspect-16/10 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
          <MoleculeViewer modelPath="/models/phongthinghiem.glb" />

          {/* Overlay Badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-[#1e2a4a] font-medium">Tương tác 3D</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
