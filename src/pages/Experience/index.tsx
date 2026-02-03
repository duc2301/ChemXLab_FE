import { Button, Modal, Spin } from "antd";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import type { Package } from "../../entities/Package";
import { getAllPackages } from "../../features/Package";

const ExperiencePage = () => {
  const [showEnterprise, setShowEnterprise] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await getAllPackages();
      setPackages(data);
    } catch (error) {
      console.error(error);
      // Error message handled in feature layer
    } finally {
      setLoading(false);
    }
  };

  const standardPackages = packages.filter((p) => p.name !== "DIAMOND");
  const enterprisePackage = packages.find((p) => p.name === "DIAMOND");

  const formatPrice = (price: number) => {
    if (price === 0) return "0đ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleOpenDetail = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  const handleCloseDetail = () => {
    setSelectedPackage(null);
  };

  // Static features for the "Features Section"
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
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 pt-16 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nâng cấp trải nghiệm
          </h1>
          <p className="text-blue-200 text-lg mb-8 max-w-3xl mx-auto">
            Chọn gói phù hợp với nhu cầu của bạn
          </p>

          {/* Toggle Button */}
          <button
            onClick={() => setShowEnterprise(!showEnterprise)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            {showEnterprise ? "Xem gói cá nhân" : "Xem gói doanh nghiệp"}
          </button>
        </section>

        {/* Pricing Plans */}
        <section className="mb-20 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <Spin size="large" />
              <div className="text-blue-200">Đang tải dữ liệu...</div>
            </div>
          ) : !showEnterprise ? (
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {standardPackages.map((plan) => {
                const isHighlighted = plan.name === "SMART LAB"; // Example logic for highlighting
                return (
                  <div
                    key={plan.id}
                    className={`rounded-3xl p-6 md:p-8 transition-all duration-300 flex flex-col ${isHighlighted
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 transform scale-105 shadow-2xl z-10"
                      : "bg-blue-800/40 backdrop-blur-xl shadow-xl hover:shadow-2xl"
                      } border-2 ${isHighlighted ? "border-cyan-400" : "border-blue-600/30"
                      }`}
                  >
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-blue-100 text-sm mb-4">
                      {plan.durationDays > 0 ? `${plan.durationDays} ngày` : "Vĩnh viễn/Liên hệ"}
                    </p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">
                        {formatPrice(plan.price)}
                      </span>
                    </div>

                    {/* Features Preview - Limit to first 4 */}
                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.slice(0, 4).map((feature, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                          <span className="text-blue-50 text-sm text-left">{feature}</span>
                        </li>
                      ))}
                      {plan.features.length > 4 && (
                        <li className="flex items-start gap-3">
                          <span className="text-blue-200 text-sm italic ml-8">...và nhiều hơn nữa</span>
                        </li>
                      )}
                    </ul>

                    <div className="mt-auto space-y-3">
                      <button
                        onClick={() => handleOpenDetail(plan)}
                        className={`w-full py-2 rounded-full font-semibold text-sm transition-all border ${isHighlighted
                          ? "border-white text-white hover:bg-white/10"
                          : "border-blue-400 text-blue-100 hover:bg-blue-700/50"
                          }`}
                      >
                        Xem chi tiết
                      </button>
                      <button
                        className={`w-full py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 ${isHighlighted
                          ? "bg-white text-blue-900 hover:bg-blue-50"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                      >
                        Chọn gói
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 rounded-3xl p-8 md:p-12 border-2 border-cyan-400/40 shadow-2xl">
                {enterprisePackage ? (
                  <>
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold mb-2">
                        {enterprisePackage.name}
                      </h3>
                      <p className="text-blue-200 text-lg">
                        Gói dành cho doanh nghiệp
                      </p>
                    </div>
                    <ul className="grid md:grid-cols-2 gap-4 mb-10">
                      {enterprisePackage.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-6 h-6 text-cyan-300 flex-shrink-0 mt-0.5" />
                          <span className="text-blue-50 text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => handleOpenDetail(enterprisePackage)} className="w-full bg-white text-blue-900 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                      Liên hệ tư vấn
                    </button>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <h3 className="text-2xl font-bold mb-2">Đang cập nhật gói doanh nghiệp</h3>
                  </div>
                )}

              </div>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Khám phá các tính năng
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-blue-800/30 backdrop-blur-xl rounded-2xl p-6 border border-blue-600/30 hover:bg-blue-700/40 hover:border-cyan-400/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <h3 className="font-bold mb-2 text-lg text-cyan-300">
                  {feature.title}
                </h3>
                <p className="text-blue-200 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Các câu hỏi thường gặp
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-blue-800/30 backdrop-blur-xl rounded-2xl p-6 border border-blue-600/30 hover:border-cyan-400/50 transition-all shadow-xl hover:shadow-2xl"
              >
                <h3 className="font-bold mb-2 text-lg text-cyan-300">
                  {faq.question}
                </h3>
                <p className="text-blue-200 leading-relaxed text-sm">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center py-12">
          <h3 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu?</h3>
          <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
            Đăng ký ngay để trải nghiệm ChemXLab
          </p>
          <button className="bg-white text-blue-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3">
            Bắt đầu ngay <ArrowRight className="w-5 h-5" />
          </button>
        </section>
      </div>

      {/* Detail Modal */}
      <Modal
        title={<div className="text-xl font-bold text-blue-900">{selectedPackage?.name}</div>}
        open={!!selectedPackage}
        onCancel={handleCloseDetail}
        footer={[
          <Button key="close" onClick={handleCloseDetail}>
            Đóng
          </Button>,
          <Button key="buy" type="primary" className="bg-blue-600 hover:bg-blue-500">
            {selectedPackage?.name === "DIAMOND" ? "Liên hệ tư vấn" : "Chọn gói này"}
          </Button>
        ]}
        centered
      >
        <div className="py-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-bold text-blue-600">
              {selectedPackage ? formatPrice(selectedPackage.price) : ""}
            </span>
            <span className="text-gray-500 font-medium">
              {selectedPackage?.durationDays && selectedPackage.durationDays > 0 ? `${selectedPackage.durationDays} ngày` : ""}
            </span>
          </div>

          <h4 className="font-semibold mb-3 text-gray-800">Chi tiết tính năng:</h4>
          <ul className="space-y-3">
            {selectedPackage?.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default ExperiencePage;
