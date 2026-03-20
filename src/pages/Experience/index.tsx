import { Spin } from "antd";
import { Minus, Plus } from "lucide-react";
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

  const getPlanName = (name: string) => {
    switch (name.toUpperCase()) {
      case "FREE": return "FREE";
      case "SMART LAB": return "SMART LAB";
      case "GENIUS LAB": return "GENIUS LAB";
      default: return name;
    }
  };

  const getPlanDesc = (name: string) => {
    switch (name.toUpperCase()) {
      case "FREE": return "Dành cho cá nhân hoặc nhóm nhỏ bắt đầu hành trình học tập";
      case "SMART LAB": return "Được xây dựng cho học sinh cần tính năng nâng cao để học tập hiệu quả";
      case "GENIUS LAB": return "Được xây dựng cho tổ chức lớn với nhu cầu cá nhân hóa và hỗ trợ chuyên nghiệp";
      default: return "";
    }
  };

  const getPlanFeatureHeader = (name: string) => {
    switch (name.toUpperCase()) {
      case "FREE": return "GÓI MIỄN PHÍ BAO GỒM:";
      case "SMART LAB": return "TẤT CẢ TRONG GÓI MIỄN PHÍ CỘNG:";
      case "GENIUS LAB": return "TẤT CẢ TRONG GÓI HỌC SINH CỘNG:";
      default: return "CÁC TÍNH NĂNG:";
    }
  };

  const isRecommended = (name: string) => name.toUpperCase() === "SMART LAB";

  return (
    <div className="w-full bg-white font-sans text-slate-900 overflow-hidden relative">

      {/* Hero Background */}
      <div className="absolute top-0 left-0 w-full h-[1223px] bg-gradient-to-b from-[#F0F7FF] via-[#E0F0FF] to-white pointer-events-none z-0" />

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section className="relative z-10 pt-[160px] pb-16 px-8 flex flex-col items-center">

        {/* Heading */}
        <h1 className="font-space font-bold text-[40px] md:text-[60px] leading-[1] text-center tracking-[-1.8px] text-[#04306E] max-w-[896px] mb-[24px]">
          Chọn gói phù hợp với mục tiêu của bạn
        </h1>

        {/* Subtitle */}
        <p className="font-inter font-medium text-[16px] md:text-[18px] leading-[28px] text-center text-[#64748B] max-w-[672px] mb-[64px]">
          Nền tảng được thiết kế tối ưu cho từng giai đoạn của hành trình giáo dục, từ người học cá nhân đến các tổ chức lớn.
        </p>

        {/* ═══════════════════════════════════════
            PRICING CARDS
        ═══════════════════════════════════════ */}
        <div className="max-w-[1152px] w-full mx-auto flex flex-col lg:flex-row justify-center items-stretch gap-[24px]">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 w-full gap-4">
              <Spin size="large" />
              <div className="text-slate-400">Đang tải dữ liệu...</div>
            </div>
          ) : (
            standardPackages.map((plan) => {
              const recommended = isRecommended(plan.name);
              return (
                <div key={plan.id} className="w-full lg:flex-1 flex flex-col pt-[32px]">
                  <div className={`p-8 flex flex-col w-full h-full min-h-[581px] transition-all duration-300 ease-out hover:-translate-y-2
                    ${recommended
                      ? "bg-white/80 border border-white shadow-xl shadow-[#04306e]/5 backdrop-blur-[10px] rounded-[32px] transform scale-100 lg:scale-[1.03] z-10"
                      : "bg-white/40 border border-white/50 shadow-[0_8px_32px_rgba(4,48,110,0.05)] backdrop-blur-[10px] rounded-[32px]"
                    }
                  `}>
                    <h3 className="font-inter font-medium text-[18px] leading-[28px] text-[#334155] mb-2">
                      {getPlanName(plan.name)}
                    </h3>

                    <div className="flex items-end gap-1 mb-2">
                      <span className="font-inter font-bold text-[40px] lg:text-[48px] leading-[1] text-[#04306E]">
                        {formatPrice(plan.price)}
                      </span>
                      {plan.price > 0 && (
                        <span className="font-inter font-medium text-[14px] leading-[20px] text-[#94A3B8] pb-1">
                          /gói
                        </span>
                      )}
                    </div>

                    <p className="font-inter font-normal text-[14px] leading-[23px] text-[#64748B] min-h-[48px] mb-[28px]">
                      {getPlanDesc(plan.name)}
                    </p>

                    <button
                      onClick={() => handleBuyPackage(plan.id)}
                      className={`w-full py-[14px] rounded-full font-inter font-semibold text-[14px] leading-[20px] text-center transition-all duration-300
                        ${plan.name === "FREE"
                          ? "bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-[#04306E] hover:bg-slate-50"
                          : recommended
                            ? "bg-[#04306E] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] text-white hover:bg-[#032454]"
                            : "bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-[#04306E] hover:bg-slate-50"
                        }`}
                    >
                      {plan.price === 0 ? "Đăng kí miễn phí" : (recommended ? "Dùng thử" : "Bắt đầu ngay")}
                    </button>

                    <div className="w-full mt-[40px] pt-[24px] border-t border-[#E2E8F0]/50 flex-grow">
                      <div className="font-inter font-bold text-[12px] leading-[16px] tracking-[0.6px] uppercase text-[#94A3B8] mb-[16px]">
                        {getPlanFeatureHeader(plan.name)}
                      </div>

                      <ul className="space-y-[16px]">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-[12px]">
                            <div className="mt-[3px] shrink-0 w-[16px] h-[16px] rounded-full bg-[#3398DB] flex items-center justify-center">
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                            <span className="font-inter font-normal text-[14px] leading-[20px] text-[#475569]">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES COMPARISON TABLE
      ═══════════════════════════════════════ */}
      <section className="py-[64px] px-8 bg-white lg:py-[100px] relative z-10 w-full flex justify-center">
        <div className="max-w-[1280px] w-full flex flex-col items-center">

          <div className="text-center mb-[40px] md:mb-[64px]">
            <h2 className="font-space font-bold text-[36px] md:text-[48px] leading-[1] tracking-[-1.2px] text-[#04306E] mb-4">
              So sánh chi tiết tính năng
            </h2>
            <p className="font-inter font-medium text-[18px] md:text-[20px] leading-[28px] text-[#475569]">
              Xem đầy đủ những gì bạn nhận được với mỗi gói
            </p>
          </div>

          <div className="w-full max-w-[1216px] bg-white/40 border border-white/50 backdrop-blur-[10px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-[24px] md:rounded-[40px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-[#F8FAFC] to-white border-b border-[#E2E8F0]">
                    <th className="py-6 px-8 font-inter font-bold text-[18px] leading-[28px] text-[#04306E] w-1/4">
                      Tính năng
                    </th>
                    {standardPackages.map((plan) => (
                      <th key={plan.id} className="py-6 px-6 text-center w-1/4">
                        <span className="font-inter font-bold text-[16px] leading-[19px] text-[#04306E]">
                          {getPlanName(plan.name).replace("Gói ", "")}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-transparent">
                  {[
                    { feature: "Số lượng thí nghiệm", values: ["1 lần/ngày", "Không giới hạn", "Không giới hạn"] },
                    { feature: "Thí nghiệm nâng cao", values: ["Không", "Không", "Có"] },
                    { feature: "AI Assistant", values: ["10 lần/ngày", "Không giới hạn", "Không giới hạn + Tùy chỉnh nâng cao"] },
                    { feature: "Thư viện hóa học", values: ["Không giới hạn", "Không giới hạn", "Không giới hạn"] },
                    { feature: "Hỗ trợ ưu tiên", values: ["Email 24/7", "Email 24/7", "Chuyên viên riêng"] },
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-[#F1F5F9] hover:bg-black/[0.01] transition-colors">
                      <td className="py-5 px-8 font-inter font-semibold text-[16px] leading-[19px] text-[#334155]">
                        {row.feature}
                      </td>
                      {row.values.slice(0, standardPackages.length).map((value, j) => (
                        <td key={j} className="py-5 px-6 text-center">
                          {typeof value === "boolean" ? (
                            value ? (
                              <svg className="w-[18px] h-[18px] mx-auto text-[#22C55E]" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-[15px] h-[20px] mx-auto text-[#CBD5E1]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 10H15" strokeLinecap="round" />
                              </svg>
                            )
                          ) : (
                            <span className={`font-inter text-[16px] leading-[19px] ${j === 2 || (row.values.length > 2 && j === 1 && typeof value === 'string' && value.includes("10")) ? "font-bold text-[#04306E]" : "font-medium text-[#475569]"}`}>
                              {value}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FAQ SECTION
      ═══════════════════════════════════════ */}
      <section className="py-[64px] px-8 bg-white flex justify-center">
        <div className="max-w-[896px] w-full flex flex-col items-center">

          <h2 className="font-space font-bold text-[36px] md:text-[48px] leading-[1.2] text-center mb-[40px] md:mb-[64px]"
            style={{ background: "linear-gradient(103.84deg, #04306E 0%, #3398DB 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Câu hỏi thường gặp
          </h2>

          <div className="w-full space-y-4">
            {[
              {
                q: "ChemXLab là gì",
                a: "ChemXLab là nền tảng phòng thí nghiệm ảo \"tất cả trong một\", được thiết kế để đơn giản hóa các bài thực hành dựa theo sách giáo khoa, đảm bảo một môi trường học tập an toàn cho học sinh."
              },
              {
                q: "ChemXLab hoạt động như thế nào?",
                a: "ChemXLab sử dụng công nghệ mô phỏng 3D tiên tiến để tái tạo các thí nghiệm hóa học. Bạn chỉ cần chọn bài tập, tương tác với hóa chất mô phỏng qua màn hình và nhận phản hồi chi tiết về các phản ứng xảy ra ngay lập tức."
              },
              {
                q: "Dữ liệu trên ChemXLab có được bảo mật an toàn không?",
                a: "Tuyệt đối an toàn. Mọi dữ liệu về cá nhân hay học thuật của học sinh sinh viên đều tuân thủ các quy định bảo mật dữ liệu nghiêm ngặt nhất."
              },
              {
                q: "ChemXLab hỗ trợ những phương thức thanh toán nào?",
                a: "Chúng tôi hỗ trợ phần lớn các phướng thức chuyển khoản ngân hàng phổ biến tại Việt Nam."
              },
              {
                q: "ChemXLab phù hợp với quy mô trường học như thế nào?",
                a: "Nền tảng của chúng tôi có thể tự động mở rộng (auto-scale) dể đáp ứng từ vài chục học sinh đối với các tiết học nhỏ đến hàng trăm học sinh truy cập cùng lúc đối với các bài thi đánh giá toàn trường."
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

// FAQ Item component based on Figma style
const FaqItem = ({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`bg-white/40 backdrop-blur-[10px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] rounded-[16px] transition-all duration-300
      ${isOpen
        ? "border-y border-r border-[#3398DB] border-l-[6px] rounded-[18px]"
        : "border border-white/50 hover:border-[#CBD5E1]"
      }
    `}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-[24px] text-left group"
      >
        <h3 className="font-lexend font-semibold text-[#04306E] text-[18px] leading-[28px] pr-8">{question}</h3>
        <div className="w-[32px] h-[32px] rounded-full flex flex-shrink-0 items-center justify-center bg-gradient-to-br from-[#04306E] to-[#1A4C72] text-white">
          {isOpen ? <Minus className="w-[14px] h-[14px]" /> : <Plus className="w-[14px] h-[14px]" />}
        </div>
      </button>
      <div
        ref={contentRef}
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight ? contentRef.current.scrollHeight + 30 + "px" : "500px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-[24px] pb-[24px]">
          <p className="font-lexend font-normal text-[15px] leading-[23px] text-[#475569] pr-8">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExperiencePage;
