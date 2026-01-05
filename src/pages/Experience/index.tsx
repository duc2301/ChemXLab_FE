import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

const ExperiencePage = () => {
  const [showEnterprise, setShowEnterprise] = useState(false);

  const standardPlans = [
    {
      name: "FREE",
      price: "0đ",
      period: "Dùng thử miễn phí",
      features: [
        "Truy cập giới hạn vào thư viện thí nghiệm",
        "Chỉ xem được 3 thí nghiệm cơ bản",
        "Không có quyền tải xuống tài liệu",
        "Hỗ trợ qua email trong 48h",
        "Không có quyền truy cập vào các công cụ nâng cao",
      ],
      highlighted: false,
    },
    {
      name: "SMART LAB",
      price: "199,000đ",
      period: "Hàng tháng / người",
      features: [
        "Truy cập đầy đủ thư viện thí nghiệm",
        "Xem không giới hạn các thí nghiệm",
        "Tải xuống tài liệu học tập",
        "Hỗ trợ qua email ưu tiên trong 24h",
        "Truy cập vào các công cụ phân tích cơ bản",
      ],
      highlighted: true,
    },
    {
      name: "GENIUS LAB",
      price: "499,000đ",
      period: "Hàng tháng / người",
      features: [
        "Tất cả tính năng của Smart Lab",
        "Truy cập vào các thí nghiệm nâng cao và chuyên sâu",
        "Công cụ mô phỏng 3D tương tác",
        "Hỗ trợ qua chat trực tiếp 24/7",
        "Báo cáo và phân tích chi tiết",
      ],
      highlighted: false,
    },
  ];

  const enterprisePlan = {
    name: "DIAMOND",
    subtitle: "Gói dành cho doanh nghiệp",
    features: [
      "Tất cả tính năng của Genius Lab",
      "Quản lý nhiều người dùng với bảng điều khiển quản trị",
      "Tùy chỉnh nội dung theo nhu cầu doanh nghiệp",
      "Đào tạo và hỗ trợ triển khai chuyên sâu",
      "API tích hợp với hệ thống hiện có",
      "Báo cáo phân tích nâng cao và tùy chỉnh",
    ],
  };

  const features = [
    {
      title: "Môi Trường Nâng Cao",
      description:
        "Trải nghiệm phòng thí nghiệm ảo với công nghệ mô phỏng tiên tiến, cho phép thực hành an toàn và hiệu quả.",
    },
    {
      title: "Phòng Thí Nghiệm An Toàn",
      description:
        "Môi trường học tập an toàn, không lo ngại về tai nạn hay hóa chất độc hại trong quá trình thực hành.",
    },
    {
      title: "Bảng Tuần Hoàn Tương Tác",
      description:
        "Khám phá bảng tuần hoàn tương tác với thông tin chi tiết về từng nguyên tố và các phản ứng hóa học.",
    },
    {
      title: "Phân Tích Thực Tế",
      description:
        "Công cụ phân tích mạnh mẽ giúp bạn hiểu sâu hơn về các phản ứng và kết quả thí nghiệm.",
    },
    {
      title: "Lưu Trữ Dữ Liệu",
      description:
        "Lưu trữ và quản lý dữ liệu thí nghiệm của bạn một cách an toàn và dễ dàng truy cập bất cứ lúc nào.",
    },
    {
      title: "Chia Sẻ & Giao Diện Tùy Biến",
      description:
        "Chia sẻ kết quả với đồng nghiệp và tùy chỉnh giao diện theo sở thích cá nhân.",
    },
    {
      title: "Hỗ trợ VR/AR",
      description:
        "Trải nghiệm thực tế ảo và thực tế tăng cường để học tập hóa học một cách sinh động và hấp dẫn.",
    },
    {
      title: "Diễn Đàn & Nhóm Học",
      description:
        "Tính năng học nhóm và diễn đàn thảo luận giúp tăng cường sự tương tác và hợp tác trong học tập.",
    },
  ];

  const faqs = [
    {
      question: "ChemXLab là gì?",
      answer:
        "ChemXLab là nền tảng học tập hóa học trực tuyến với công nghệ mô phỏng 3D, giúp bạn thực hành thí nghiệm một cách an toàn và hiệu quả.",
    },
    {
      question: "Chính sách về dùng thử hoặc hoàn tiền?",
      answer:
        "Chúng tôi cung cấp gói dùng thử miễn phí để bạn trải nghiệm. Đối với các gói trả phí, chúng tôi có chính sách hoàn tiền trong 7 ngày đầu tiên nếu bạn không hài lòng.",
    },
    {
      question: "Tôi có thể hủy bỏ gói trải nghiệm vào bất kỳ lúc nào không?",
      answer:
        "Có, bạn có thể hủy bỏ gói đăng ký của mình bất cứ lúc nào. Gói của bạn sẽ vẫn hoạt động cho đến hết kỳ thanh toán hiện tại.",
    },
    {
      question: "Có nhiều gói không?",
      answer:
        "Có, chúng tôi cung cấp nhiều gói khác nhau từ miễn phí đến cao cấp, phù hợp với nhu cầu của từng cá nhân và doanh nghiệp.",
    },
    {
      question:
        "Tôi có thể nâng cấp lên gói cao hơn (Ví dụ: Chuyển từ Genius Lab đến Diamond) không?",
      answer:
        "Hoàn toàn có thể! Bạn có thể nâng cấp gói của mình bất cứ lúc nào. Chúng tôi sẽ tính toán lại chi phí dựa trên thời gian còn lại của gói hiện tại.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 pt-20 text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Nâng cấp trải nghiệm
          </h1>
          <p className="text-blue-200 text-xl mb-10 max-w-3xl mx-auto">
            Chọn gói phù hợp với nhu cầu của bạn
          </p>

          {/* Toggle Button */}
          <button
            onClick={() => setShowEnterprise(!showEnterprise)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-10 py-4 rounded-full font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            {showEnterprise ? "Xem gói cá nhân" : "Xem gói doanh nghiệp"}
          </button>
        </section>

        {/* Pricing Plans */}
        <section className="mb-28">
          {!showEnterprise ? (
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {standardPlans.map((plan, i) => (
                <div
                  key={i}
                  className={`rounded-3xl p-10 transition-all duration-300 ${
                    plan.highlighted
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 transform scale-105 shadow-2xl"
                      : "bg-blue-800/40 backdrop-blur-xl shadow-xl hover:shadow-2xl"
                  } border-2 ${
                    plan.highlighted ? "border-cyan-400" : "border-blue-600/30"
                  }`}
                >
                  <h3 className="text-3xl font-bold mb-3">{plan.name}</h3>
                  <p className="text-blue-200 text-sm mb-6">{plan.period}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold">{plan.price}</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <Check className="w-6 h-6 text-cyan-300 flex-shrink-0 mt-0.5" />
                        <span className="text-blue-50">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 ${
                      plan.highlighted
                        ? "bg-white text-blue-900 hover:bg-blue-50"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Chọn gói
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 rounded-3xl p-12 border-2 border-cyan-400/40 shadow-2xl">
                <div className="text-center mb-10">
                  <h3 className="text-4xl font-bold mb-3">
                    {enterprisePlan.name}
                  </h3>
                  <p className="text-blue-200 text-lg">
                    {enterprisePlan.subtitle}
                  </p>
                </div>
                <ul className="space-y-5 mb-12">
                  {enterprisePlan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <Check className="w-7 h-7 text-cyan-300 flex-shrink-0 mt-0.5" />
                      <span className="text-blue-50 text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-white text-blue-900 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                  Liên hệ tư vấn
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="mb-28">
          <h2 className="text-4xl font-bold text-center mb-16">
            Khám phá các tính năng
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-blue-800/30 backdrop-blur-xl rounded-2xl p-8 border border-blue-600/30 hover:bg-blue-700/40 hover:border-cyan-400/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <h3 className="font-bold mb-3 text-xl text-cyan-300">
                  {feature.title}
                </h3>
                <p className="text-blue-200 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-28">
          <h2 className="text-4xl font-bold text-center mb-16">
            Các câu hỏi thường gặp
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-blue-800/30 backdrop-blur-xl rounded-2xl p-8 border border-blue-600/30 hover:border-cyan-400/50 transition-all shadow-xl hover:shadow-2xl"
              >
                <h3 className="font-bold mb-3 text-xl text-cyan-300">
                  {faq.question}
                </h3>
                <p className="text-blue-200 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center py-16">
          <h3 className="text-4xl font-bold mb-6">Sẵn sàng bắt đầu?</h3>
          <p className="text-blue-200 text-xl mb-10 max-w-2xl mx-auto">
            Đăng ký ngay để trải nghiệm ChemXLab
          </p>
          <button className="bg-white text-blue-900 px-12 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3">
            Bắt đầu ngay <ArrowRight className="w-6 h-6" />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ExperiencePage;
