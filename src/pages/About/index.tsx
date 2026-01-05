import { ArrowRight, Award, Globe, Target, Users } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 pt-20">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8">
            Về <span className="text-blue-600">ChemXLab</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            ChemXLab là nền tảng tiên phong trong việc ứng dụng công nghệ thực
            tế ảo và mô phỏng 3D vào giáo dục và nghiên cứu hóa học. Chúng tôi
            tin rằng việc trực quan hóa các khái niệm trừu tượng sẽ mở ra cánh
            cửa mới cho sự hiểu biết và sáng tạo.
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-28">
          {[
            {
              icon: <Target className="w-12 h-12 text-white" />,
              title: "Sứ mệnh",
              desc: "Phổ cập kiến thức hóa học thông qua công nghệ tiên tiến, giúp mọi người tiếp cận khoa học dễ dàng hơn.",
              color: "from-red-500 to-red-700",
            },
            {
              icon: <Globe className="w-12 h-12 text-white" />,
              title: "Tầm nhìn",
              desc: "Trở thành nền tảng giáo dục STEM hàng đầu khu vực, kết nối cộng đồng yêu khoa học toàn cầu.",
              color: "from-green-500 to-green-700",
            },
            {
              icon: <Award className="w-12 h-12 text-white" />,
              title: "Giá trị",
              desc: "Sáng tạo, Chính xác, và Đam mê là những giá trị cốt lõi thúc đẩy mọi hoạt động của chúng tôi.",
              color: "from-yellow-500 to-yellow-700",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${item.color} rounded-3xl p-10 text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300`}
            >
              <div className="mb-6 bg-white/20 backdrop-blur w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-white/90 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 md:p-16 shadow-2xl mb-28">
          <div className="grid md:grid-cols-2 items-center gap-12">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-6">Đội ngũ chuyên gia</h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Đội ngũ của chúng tôi bao gồm các giáo sư, tiến sĩ hóa học và
                các kỹ sư phần mềm tài năng, cùng nhau xây dựng nên những sản
                phẩm chất lượng nhất.
              </p>
              <button className="bg-white text-blue-900 px-10 py-4 rounded-full font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3">
                Gặp gỡ đội ngũ <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border-2 border-white/20 hover:bg-white/20 transition-all shadow-xl"
                >
                  <Users className="w-16 h-16 text-white/60" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-28">
          {[
            { number: "10,000+", label: "Người dùng" },
            { number: "500+", label: "Thí nghiệm" },
            { number: "50+", label: "Chuyên gia" },
            { number: "99%", label: "Hài lòng" },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-100 hover:border-blue-400 hover:shadow-2xl transition-all"
            >
              <div className="text-5xl font-bold text-blue-600 mb-3">
                {stat.number}
              </div>
              <div className="text-slate-600 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
