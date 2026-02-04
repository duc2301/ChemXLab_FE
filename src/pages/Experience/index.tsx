import { Button, Modal, Spin } from "antd";
import { ArrowRight, Check, Crown, Sparkles, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import type { Package } from "../../entities/Package";
import { getAllPackages } from "../../features/Package";
import { useNavigate } from "react-router-dom";
import { createPayment } from "../../features/Payment";
import type { Payment } from "../../entities/Payment";

const ExperiencePage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleBuyPackage = async (packageId: number) => {
    if (packageId === 1) return;
    const createPaymentResponse: Payment = await createPayment(packageId.toString());
    navigate("/payment", { state: { paymentData: createPaymentResponse } });
  }

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
    } finally {
      setLoading(false);
    }
  };

  // Sort packages by price and exclude enterprise
  const standardPackages = [...packages]
    .filter((p) => p.name !== "DIAMOND")
    .sort((a, b) => a.price - b.price);
  const enterprisePackage = packages.find((p) => p.name === "DIAMOND");

  const formatPrice = (price: number) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  // Get icon for each plan
  const getPlanIcon = (name: string) => {
    switch (name.toUpperCase()) {
      case "FREE":
        return <Zap className="w-6 h-6" />;
      case "SMART LAB":
        return <Star className="w-6 h-6" />;
      case "GENIUS LAB":
        return <Crown className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  // Determine if this is the recommended plan
  const isRecommended = (name: string) => {
    return name.toUpperCase() === "SMART LAB";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-cyan-500/30">
            <Sparkles className="w-4 h-4" />
            Bắt đầu miễn phí, nâng cấp bất cứ lúc nào
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Chọn gói phù hợp với
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"> nhu cầu của bạn</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-200/80 max-w-2xl mx-auto">
            Trải nghiệm phòng thí nghiệm hóa học ảo với công nghệ mô phỏng 3D tiên tiến.
            An toàn, hiệu quả và không giới hạn.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <Spin size="large" />
              <div className="text-blue-300">Đang tải dữ liệu...</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {standardPackages.map((plan) => {
                const recommended = isRecommended(plan.name);
                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:scale-105 ${recommended
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white scale-105 shadow-2xl shadow-cyan-500/30 z-10 border-2 border-cyan-400/50"
                      : "bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10"
                      }`}
                  >
                    {/* Recommended Badge */}
                    {recommended && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          Phổ biến nhất
                        </div>
                      </div>
                    )}

                    {/* Plan Header */}
                    <div className="mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${recommended
                        ? "bg-white/20 text-white"
                        : "bg-cyan-500/20 text-cyan-400"
                        }`}>
                        {getPlanIcon(plan.name)}
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${recommended ? "text-white" : "text-white"}`}>
                        {plan.name}
                      </h3>
                      <p className={`text-sm ${recommended ? "text-cyan-100" : "text-blue-300/70"}`}>
                        {plan.durationDays > 0 ? `${plan.durationDays} ngày sử dụng` : "Dùng thử không giới hạn"}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-bold ${recommended
                          ? "text-white"
                          : "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"
                          }`}>
                          {formatPrice(plan.price)}
                        </span>
                        {plan.price > 0 && (
                          <span className={`text-sm ${recommended ? "text-cyan-100" : "text-blue-300/70"}`}>
                            /gói
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${recommended ? "bg-white/20" : "bg-cyan-500/20"
                            }`}>
                            <Check className={`w-3 h-3 ${recommended ? "text-white" : "text-cyan-400"}`} />
                          </div>
                          <span className={`text-sm ${recommended ? "text-cyan-50" : "text-blue-200/80"}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleBuyPackage(plan.id)}
                      className={`w-full py-3.5 rounded-xl font-semibold transition-all ${plan.name === "FREE"
                          ? "bg-transparent border cursor-disabled border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 cursor-not-allowed"
                          : recommended
                            ? "bg-white text-blue-600 hover:bg-cyan-50 shadow-lg"
                            : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/20"
                        }`}
                    >
                      {plan.price === 0 ? "Trải nghiệm miễn phí" : "Chọn gói này"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Enterprise Section */}
          {enterprisePackage && (
            <div className="mt-12 bg-gradient-to-r from-slate-800/80 to-slate-800/60 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-amber-500/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-medium mb-4 border border-amber-500/30">
                    <Crown className="w-4 h-4" />
                    Dành cho doanh nghiệp
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {enterprisePackage.name}
                  </h3>
                  <p className="text-blue-200/70 max-w-lg">
                    Giải pháp toàn diện cho trường học và doanh nghiệp.
                    Tùy chỉnh theo nhu cầu, hỗ trợ VIP và triển khai riêng.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/contact")}
                  className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 px-8 py-4 rounded-xl font-bold hover:from-amber-300 hover:to-orange-300 transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-amber-500/20"
                >
                  Liên hệ tư vấn
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            So sánh tính năng
          </h2>
          <p className="text-blue-200/70 text-center mb-12 max-w-2xl mx-auto">
            Xem chi tiết các tính năng được hỗ trợ trong mỗi gói dịch vụ
          </p>

          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-4 px-6 font-semibold text-white">Tính năng</th>
                  {standardPackages.map((plan) => (
                    <th key={plan.id} className="py-4 px-4 text-center">
                      <span className={`text-sm font-semibold ${isRecommended(plan.name) ? "text-cyan-400" : "text-blue-300"}`}>
                        {plan.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Thí nghiệm hóa học 3D", values: [true, true, true] },
                  { feature: "Bảng tuần hoàn tương tác", values: [true, true, true] },
                  { feature: "Tạo thí nghiệm mới", values: ["1/ngày", "10/ngày", "Không giới hạn"] },
                  { feature: "AI Chatbox hỗ trợ", values: ["Cơ bản", "Nâng cao", "Toàn diện"] },
                  { feature: "Lưu trữ dữ liệu", values: ["100MB", "5GB", "50GB"] },
                  { feature: "Hỗ trợ VR/AR", values: [false, true, true] },
                  { feature: "Xuất báo cáo PDF", values: [false, true, true] },
                  { feature: "Hỗ trợ ưu tiên", values: [false, false, true] },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/20 transition-colors">
                    <td className="py-4 px-6 text-sm text-blue-100">{row.feature}</td>
                    {row.values.map((value, j) => (
                      <td key={j} className="py-4 px-4 text-center">
                        {typeof value === "boolean" ? (
                          value ? (
                            <Check className="w-5 h-5 text-cyan-400 mx-auto" />
                          ) : (
                            <span className="text-slate-500">—</span>
                          )
                        ) : (
                          <span className="text-sm text-blue-200/80">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Câu hỏi thường gặp
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Tôi có thể dùng thử miễn phí không?",
                a: "Có! Gói FREE hoàn toàn miễn phí và không yêu cầu thẻ tín dụng. Bạn có thể nâng cấp bất cứ lúc nào."
              },
              {
                q: "Chính sách hoàn tiền như thế nào?",
                a: "Chúng tôi có chính sách hoàn tiền trong 7 ngày đầu tiên nếu bạn không hài lòng với dịch vụ."
              },
              {
                q: "Tôi có thể hủy đăng ký bất cứ lúc nào không?",
                a: "Có, bạn có thể hủy bất cứ lúc nào. Gói của bạn vẫn hoạt động đến hết kỳ thanh toán hiện tại."
              },
              {
                q: "Có thể nâng cấp gói giữa chừng không?",
                a: "Hoàn toàn có thể! Chi phí sẽ được tính toán lại dựa trên thời gian còn lại của gói hiện tại."
              },
            ].map((faq, i) => (
              <div key={i} className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-colors">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-blue-200/70 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl p-12 border border-cyan-500/30">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu hành trình?
          </h2>
          <p className="text-blue-200/80 text-lg mb-8">
            Đăng ký ngay để trải nghiệm phòng thí nghiệm hóa học ảo miễn phí
          </p>
          <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold hover:from-cyan-400 hover:to-blue-400 transition-all inline-flex items-center gap-2 shadow-xl shadow-cyan-500/25">
            Bắt đầu miễn phí
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ExperiencePage;
