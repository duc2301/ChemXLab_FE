import { ArrowRight, Beaker, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 pt-20">
      <div className="container mx-auto px-6 py-16">
        {/* Virtual Lab Section */}
        <section className="mb-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold text-slate-900 leading-tight">
                Phòng thí nghiệm ảo
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Trải nghiệm phòng thí nghiệm ảo với các công cụ và thiết bị
                chuyên nghiệp. Thực hành an toàn, không giới hạn thời gian và
                không tốn chi phí.
              </p>
              <Link
                to="/labtest"
                className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Khám phá <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 aspect-video flex items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-6 right-6 bg-blue-500 text-white text-sm px-4 py-2 rounded-full font-semibold shadow-lg">
                Phòng thí nghiệm
              </div>
              <div className="relative">
                <div className="w-40 h-40 bg-blue-500/20 rounded-full absolute -top-16 -left-16 blur-2xl"></div>
                <div className="w-32 h-32 bg-purple-500/20 rounded-full absolute -bottom-12 -right-12 blur-2xl"></div>
                <Beaker
                  className="w-40 h-40 text-blue-400 drop-shadow-2xl"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Periodic Table Section */}
        <section className="mb-28">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Bảng tuần hoàn tương tác
            </h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Khám phá bảng tuần hoàn các nguyên tố hóa học với giao diện tương
              tác, dễ sử dụng và đầy đủ thông tin chi tiết.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              {
                num: 1,
                name: "Hydrogen",
                symbol: "H",
                color: "from-blue-600 to-blue-800",
              },
              {
                num: 2,
                name: "Helium",
                symbol: "He",
                color: "from-blue-700 to-blue-900",
              },
              {
                num: 3,
                name: "Lithium",
                symbol: "Li",
                color: "from-blue-600 to-blue-800",
              },
              {
                num: 4,
                name: "Beryllium",
                symbol: "Be",
                color: "from-blue-700 to-blue-900",
              },
              {
                num: 5,
                name: "Boron",
                symbol: "B",
                color: "from-blue-600 to-blue-800",
              },
            ].map((element, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${element.color} rounded-2xl p-6 aspect-[3/4] flex flex-col justify-between text-white hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl`}
              >
                <div className="text-xs opacity-80 font-semibold">
                  Element {element.num}
                </div>
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl mx-auto flex items-center justify-center border-2 border-white/30 shadow-lg">
                    <span className="text-3xl font-bold">{element.symbol}</span>
                  </div>
                  <p className="text-sm font-bold">{element.name}</p>
                </div>
                <div className="text-xs text-center opacity-80">
                  Xem chi tiết →
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3D Models Section */}
        <section className="mb-28">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-6 left-6 bg-white/20 backdrop-blur text-white text-sm px-4 py-2 rounded-full font-semibold border border-white/30">
                Mô hình 3D
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end space-y-6">
                <h3 className="text-4xl font-bold leading-tight">
                  Khám phá các mô hình 3D tương tác
                </h3>
                <p className="text-blue-100 text-lg">
                  Xem và tương tác với các mô hình phân tử 3D chi tiết, xoay 360
                  độ
                </p>
                <Link
                  to="/experience"
                  className="inline-flex items-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-all w-fit shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Khám phá <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
                <div className="w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="w-32 h-32 bg-white/10 rounded-full absolute top-12 left-12 blur-2xl"></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 aspect-video flex items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-6 right-6 bg-pink-500 text-white text-sm px-4 py-2 rounded-full font-semibold shadow-lg">
                3D Model
              </div>
              <div className="relative">
                <div className="w-32 h-32 bg-pink-500 rounded-full absolute top-0 left-0 animate-pulse blur-xl opacity-50"></div>
                <div
                  className="w-24 h-24 bg-red-500 rounded-full absolute bottom-0 right-0 animate-pulse blur-xl opacity-50"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <FlaskConical
                  className="w-40 h-40 text-pink-400 relative z-10 drop-shadow-2xl"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Topics Section */}
        <section className="mb-28">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-slate-900 mb-6">
              Khám phá ngay chuyên đề
            </h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">
              Tìm hiểu các chuyên đề hóa học thú vị và bổ ích
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 rounded-3xl p-12 text-white relative overflow-hidden group cursor-pointer shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
              <div className="absolute top-6 left-6 bg-white/20 backdrop-blur text-white text-sm px-4 py-2 rounded-full font-semibold border border-white/30">
                Chuyên đề
              </div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-bold">Phản ứng hóa học cơ bản</h3>
                <p className="text-blue-50 text-lg">
                  Tìm hiểu các phản ứng hóa học phổ biến trong đời sống hàng
                  ngày
                </p>
                <div className="inline-flex items-center gap-3 text-white font-bold group-hover:gap-5 transition-all">
                  Xem ngay <ArrowRight className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-1/3 translate-y-1/3 blur-2xl"></div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 aspect-video flex items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-6 right-6 bg-blue-500 text-white text-sm px-4 py-2 rounded-full font-semibold shadow-lg">
                Preview
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="w-20 h-20 bg-pink-500 rounded-2xl animate-pulse shadow-xl"></div>
                <div
                  className="w-20 h-20 bg-blue-500 rounded-2xl animate-pulse shadow-xl"
                  style={{ animationDelay: "0.3s" }}
                ></div>
                <div
                  className="w-20 h-20 bg-red-500 rounded-2xl animate-pulse shadow-xl"
                  style={{ animationDelay: "0.6s" }}
                ></div>
                <div
                  className="w-20 h-20 bg-purple-500 rounded-2xl animate-pulse shadow-xl"
                  style={{ animationDelay: "0.9s" }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center py-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-2xl">
          <div className="text-white space-y-8">
            <h3 className="text-4xl font-bold">Đăng ký trải nghiệm</h3>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Bắt đầu hành trình khám phá hóa học của bạn ngay hôm nay
            </p>
            <Link
              to="/experience"
              className="inline-flex items-center gap-3 bg-white text-blue-900 px-12 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Dùng thử miễn phí <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductsPage;
