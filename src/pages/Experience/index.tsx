import { Spin } from "antd";
import { Check, Minus, Plus, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Package } from "../../entities/Package";
import type { Payment } from "../../entities/Payment";
import { getAllPackages } from "../../features/Package";
import { createPayment } from "../../features/Payment";

const ExperiencePage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const navigate = useNavigate();

  const handleBuyPackage = async (packageId: string) => {
    const createPaymentResponse: Payment = await createPayment(packageId.toString());
    const selectedPackage = packages.find(p => p.id === packageId);
    navigate("/payment", { state: { paymentId: createPaymentResponse.id, packageName: selectedPackage?.name || "Unknown Package" } });
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

  const standardPackages = [...packages]
    .filter((p) => p.name !== "DIAMOND")
    .sort((a, b) => a.price - b.price);

  const formatPrice = (price: number) => {
    if (price === 0) return "0đ";
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const isRecommended = (name: string) => {
    return name.toUpperCase() === "SMART LAB";
  };

  const getPlanLabel = (name: string) => {
    switch (name.toUpperCase()) {
      case "FREE": return "Gói cơ bản";
      case "SMART LAB": return "Phổ biến nhất";
      case "GENIUS LAB": return "Chuyên nghiệp";
      default: return name;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section
        className="pt-28 pb-14 lg:pt-36 lg:pb-16 relative overflow-hidden"
        style={{ background: "radial-gradient(ellipse at center, rgba(56,189,248,0.12) 0%, rgba(56,189,248,0.06) 40%, rgba(240,244,250,0.5) 70%, white 100%)" }}
      >
        <div className="max-w-2xl mx-auto text-center space-y-5 relative z-10 px-6">
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-sky-600 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
            ● BẢNG GIÁ
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1e2a4a] leading-[1.15] tracking-tight">
            Chọn gói phù hợp{" "}
            <br className="hidden md:block" />
            với <span className="text-sky-600">mục tiêu của bạn</span>
          </h1>

          <p className="text-[15px] text-slate-500 max-w-lg mx-auto leading-relaxed font-medium">
            Chọn gói phù hợp với nhu cầu và mường tượng năng suất học tập cùng ChemXLab
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRICING CARDS
      ═══════════════════════════════════════ */}
      <section className="pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <Spin size="large" />
              <div className="text-slate-400">Đang tải dữ liệu...</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {standardPackages.map((plan) => {
                const recommended = isRecommended(plan.name);
                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 ${recommended
                      ? "bg-white border-2 border-sky-500 shadow-xl shadow-sky-200/40 scale-[1.03] z-10"
                      : "bg-white border border-slate-200 shadow-sm hover:shadow-md"
                      }`}
                  >
                    {/* Badge */}
                    {recommended && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <div className="bg-sky-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
                          <Star className="w-3 h-3 fill-current" />
                          Phổ biến nhất
                        </div>
                      </div>
                    )}

                    {/* Plan Label */}
                    <div className="text-xs font-semibold text-sky-600 uppercase tracking-wider mb-1">
                      {getPlanLabel(plan.name)}
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-lg font-bold text-[#1e2a4a] mb-1">{plan.name}</h3>

                    {/* Price */}
                    <div className="mb-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-[#1e2a4a]">
                          {formatPrice(plan.price)}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-sm text-slate-400 font-medium">/gói</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {plan.durationDays > 0 ? `${plan.durationDays} ngày sử dụng` : "Miễn phí vĩnh viễn"}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleBuyPackage(plan.id)}
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition-all mb-6 ${plan.name === "FREE"
                        ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                        : recommended
                          ? "bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-300/30"
                          : "bg-[#1e2a4a] hover:bg-[#162040] text-white shadow-md"
                        }`}
                    >
                      {plan.price === 0 ? "Gói hiện tại" : "Chọn gói này →"}
                    </button>

                    {/* Features */}
                    <ul className="space-y-2.5 grow">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-sky-50 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-sky-600" />
                          </div>
                          <span className="text-sm text-slate-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRUST BADGES / STATS
      ═══════════════════════════════════════ */}
      <section className="py-12 bg-white px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-slate-400 font-semibold mb-8 uppercase tracking-wider">Được tin dùng bởi</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
            {[
              { value: "200+", label: "Trường học" },
              { value: "2,000+", label: "Giáo viên" },
              { value: "50,000+", label: "Học sinh" },
              { value: "4.9/5", label: "Đánh giá" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-extrabold text-sky-600">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES COMPARISON TABLE
      ═══════════════════════════════════════ */}
      <section className="py-16 px-6 bg-[#f7f8fa]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4 space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e2a4a]">
              So sánh chi tiết tính năng
            </h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Xem chi tiết và lựa chọn gói phù hợp nhất cho nhu cầu của bạn.
            </p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm mt-10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-4 px-6 font-semibold text-[#1e2a4a] text-sm">Tính năng</th>
                  {standardPackages.map((plan) => (
                    <th key={plan.id} className="py-4 px-4 text-center">
                      <span className={`text-sm font-bold ${isRecommended(plan.name) ? "text-sky-600" : "text-[#1e2a4a]"}`}>
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
                  { feature: "Lưu trữ dữ liệu", values: ["100MB", "5GB", "50GB/aloha"] },
                  { feature: "Hỗ trợ VR/AR", values: [false, true, true] },
                  { feature: "Xuất báo cáo PDF", values: [false, true, true] },
                  { feature: "Hỗ trợ ưu tiên", values: [false, false, true] },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-sky-50/30 transition-colors">
                    <td className="py-3.5 px-6 text-sm text-slate-600">{row.feature}</td>
                    {row.values.map((value, j) => (
                      <td key={j} className="py-3.5 px-4 text-center">
                        {typeof value === "boolean" ? (
                          value ? (
                            <Check className="w-5 h-5 text-sky-600 mx-auto" />
                          ) : (
                            <span className="text-slate-300">—</span>
                          )
                        ) : (
                          <span className="text-sm text-slate-600 font-medium">{value}</span>
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

      {/* ═══════════════════════════════════════
          FAQ SECTION
      ═══════════════════════════════════════ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e2a4a]">
              Câu hỏi thường gặp
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "ChemXLab là gì",
                a: "ChemXLab là nền tảng phòng thí nghiệm ảo \"tất cả trong một\", được thiết kế để đơn giản hóa các bài thực hành, tự động hóa báo cáo, theo dõi tiến độ học tập theo thời gian thực và đảm bảo một môi trường học tập an toàn cho học sinh cũng như trường học ở mọi quy mô."
              },
              {
                q: "ChemXLab hoạt động như thế nào?",
                a: "ChemXLab sử dụng công nghệ mô phỏng 3D tiên tiến để tái tạo các thí nghiệm hóa học. Bạn chỉ cần chọn thí nghiệm, tương tác với mô hình và nhận kết quả giải thích chi tiết."
              },
              {
                q: "Dữ liệu trên ChemXLab có được bảo mật an toàn không?",
                a: "Có, chúng tôi sử dụng mã hóa SSL và tuân thủ các tiêu chuẩn bảo mật quốc tế để đảm bảo dữ liệu của bạn luôn an toàn."
              },
              {
                q: "ChemXLab có thể tích hợp với các phần mềm học tập khác không?",
                a: "Có, ChemXLab hỗ trợ tích hợp với nhiều hệ thống quản lý học tập (LMS) phổ biến thông qua API."
              },
              {
                q: "ChemXLab hỗ trợ những phương thức thanh toán nào?",
                a: "Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng/ghi nợ, ví điện tử (MoMo, ZaloPay) và chuyển khoản ngân hàng."
              },
              {
                q: "ChemXLab phù hợp với quy mô trường học như thế nào?",
                a: "ChemXLab được thiết kế linh hoạt cho mọi quy mô — từ cá nhân tự học đến trường học hàng ngàn học sinh, với các gói dịch vụ phù hợp."
              },
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

// FAQ Item component with smooth expand/collapse animation
const FaqItem = ({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`bg-white border rounded-xl overflow-hidden transition-colors duration-200 ${isOpen ? "border-sky-200" : "border-slate-200 hover:border-slate-300"}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left group"
      >
        <h3 className="font-semibold text-[#1e2a4a] text-[15px] pr-4">{question}</h3>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${isOpen ? "bg-[#1e2a4a] text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"}`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>
      <div
        ref={contentRef}
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight ? contentRef.current.scrollHeight + 20 + "px" : "500px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-6 pb-5">
          <p className="text-slate-500 text-sm leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default ExperiencePage;
