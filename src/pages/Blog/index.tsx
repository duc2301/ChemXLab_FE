import { ArrowRight, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white pt-20">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="mb-28 relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 aspect-[21/9] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center text-white space-y-6 px-6">
                <h1 className="text-5xl md:text-7xl font-bold drop-shadow-2xl">
                  Hội thảo Hóa học Ẩm thực
                </h1>
                <p className="text-blue-200 text-xl max-w-3xl mx-auto">
                  Khám phá những bài viết mới nhất về hóa học và khoa học
                </p>
              </div>
            </div>
            {/* Placeholder for hero image */}
            <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900"></div>
          </div>
        </section>

        {/* Featured Article */}
        <section className="mb-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl aspect-video overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-blue-800 via-purple-800 to-pink-800 flex items-center justify-center">
                <div className="text-white text-center space-y-4">
                  <div className="w-32 h-32 bg-white/20 backdrop-blur rounded-3xl mx-auto flex items-center justify-center border-2 border-white/30 shadow-xl">
                    <Calendar className="w-16 h-16" />
                  </div>
                  <p className="text-2xl font-bold">Bài viết nổi bật</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>21 Tháng 11, 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Admin</span>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                Khám phá các phản ứng hóa học trong nấu ăn
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Hóa học không chỉ tồn tại trong phòng thí nghiệm mà còn hiện
                diện trong mọi món ăn chúng ta nấu hàng ngày. Từ việc làm bánh
                mì nở đến việc tạo ra màu sắc hấp dẫn cho món ăn, tất cả đều là
                những phản ứng hóa học thú vị.
              </p>
              <Link
                to="#"
                className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Đọc thêm <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Research Techniques Section */}
        <section className="mb-28">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">
            Kỹ thuật nghiên cứu
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Phương pháp phân tích",
                color: "from-blue-600 to-blue-800",
                icon: "🔬",
              },
              {
                title: "Kỹ thuật tổng hợp",
                color: "from-purple-600 to-purple-800",
                icon: "⚗️",
              },
              {
                title: "Nghiên cứu ứng dụng",
                color: "from-pink-600 to-pink-800",
                icon: "🧪",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${item.color} rounded-3xl p-10 text-white relative overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all hover:scale-105`}
              >
                <div className="relative z-10 space-y-6">
                  <div className="text-6xl">{item.icon}</div>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-white/80">
                    Tìm hiểu các phương pháp và kỹ thuật nghiên cứu hiện đại
                  </p>
                  <div className="inline-flex items-center gap-3 font-bold group-hover:gap-5 transition-all">
                    Xem thêm <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full transform translate-x-1/3 translate-y-1/3 blur-2xl"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-28">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Danh mục bài viết
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Hóa học hữu cơ",
              "Hóa học vô cơ",
              "Hóa học phân tích",
              "Hóa học lý thuyết",
              "Hóa sinh học",
              "Hóa học môi trường",
              "Hóa học ứng dụng",
              "Thí nghiệm",
            ].map((category, i) => (
              <button
                key={i}
                className="bg-white border-2 border-blue-200 hover:border-blue-600 text-slate-800 hover:text-blue-600 px-6 py-4 rounded-full font-bold transition-all shadow-md hover:shadow-xl hover:scale-105"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Registration Section */}
        <section className="mb-28 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-16 text-center text-white shadow-2xl">
          <h3 className="text-4xl font-bold mb-6">
            Đăng nhập để trải nghiệm đầy đủ
          </h3>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Truy cập tất cả các bài viết, tài liệu và tính năng độc quyền
          </p>
          <Link
            to="/experience"
            className="inline-flex items-center gap-3 bg-white text-blue-900 px-12 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Đăng nhập ngay <ArrowRight className="w-6 h-6" />
          </Link>
        </section>

        {/* Gallery Section */}
        <section className="mb-28">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">
            Vật liệu và Công nghệ
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Vật liệu nano", color: "from-cyan-600 to-blue-700" },
              {
                title: "Polymer sinh học",
                color: "from-purple-600 to-pink-700",
              },
              { title: "Vật liệu xanh", color: "from-green-600 to-teal-700" },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${item.color} rounded-3xl aspect-[4/5] relative overflow-hidden group cursor-pointer shadow-2xl hover:shadow-3xl transition-all hover:scale-105`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                <div className="absolute bottom-8 left-8 z-20 text-white space-y-2">
                  <p className="text-xs font-bold opacity-80">CHEMXLAB</p>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Xem chi tiết <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;
