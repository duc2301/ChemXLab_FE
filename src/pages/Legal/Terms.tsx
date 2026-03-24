import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full pointer-events-none blur-[120px] opacity-20 bg-[#3298DC]" />
        <div className="container mx-auto px-6 relative z-10 max-w-[800px]">
          <Link to="/" className="inline-flex items-center gap-2 text-[#3298DC] font-semibold text-sm mb-8 hover:text-[#025D9E] transition-colors font-lexend">
            <ArrowLeft size={16} /> Quay lại trang chủ
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F4FF] flex items-center justify-center">
              <FileText size={24} className="text-[#025D9E]" />
            </div>
            <div>
              <h1 className="font-space text-[36px] md:text-[48px] font-bold text-[#12284B] leading-[1.1]">
                Điều khoản dịch vụ
              </h1>
            </div>
          </div>
          <p className="font-lexend text-[#475569] text-[16px] mt-4">
            Cập nhật lần cuối: Tháng 3, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-[800px]">
          <div className="bg-white rounded-[24px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E2E8F0] space-y-8">

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">1. Giới thiệu</h2>
              <p className="font-lexend text-[#475569] text-[15px] leading-[1.7]">
                Chào mừng bạn đến với ChemXLab — nền tảng phòng thí nghiệm hóa học ảo 3D. Bằng việc truy cập và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu dưới đây. Vui lòng đọc kỹ trước khi sử dụng.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">2. Tài khoản người dùng</h2>
              <ul className="font-lexend text-[#475569] text-[15px] leading-[1.7] list-disc pl-6 space-y-2">
                <li>Bạn phải cung cấp thông tin chính xác khi đăng ký tài khoản.</li>
                <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.</li>
                <li>Mỗi người chỉ được sở hữu một tài khoản.</li>
                <li>ChemXLab có quyền tạm khóa hoặc xóa tài khoản vi phạm điều khoản.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">3. Quyền sử dụng</h2>
              <p className="font-lexend text-[#475569] text-[15px] leading-[1.7]">
                ChemXLab cấp cho bạn quyền sử dụng có giới hạn, không độc quyền và không thể chuyển nhượng để truy cập nền tảng phục vụ mục đích học tập và giảng dạy hóa học. Bạn không được:
              </p>
              <ul className="font-lexend text-[#475569] text-[15px] leading-[1.7] list-disc pl-6 space-y-2">
                <li>Sao chép, phân phối hoặc bán lại nội dung của nền tảng.</li>
                <li>Sử dụng nền tảng cho mục đích thương mại mà chưa có sự đồng ý bằng văn bản.</li>
                <li>Cố ý gây hại, phá hoại, hoặc can thiệp vào hoạt động của hệ thống.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">4. Nội dung và sở hữu trí tuệ</h2>
              <p className="font-lexend text-[#475569] text-[15px] leading-[1.7]">
                Tất cả nội dung trên ChemXLab, bao gồm nhưng không giới hạn: mô hình 3D, bài thí nghiệm, hình ảnh, văn bản, mã nguồn và thiết kế, đều thuộc quyền sở hữu của ChemXLab hoặc các bên cấp phép. Nội dung được bảo vệ bởi luật sở hữu trí tuệ Việt Nam và quốc tế.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">5. Gói dịch vụ và thanh toán</h2>
              <ul className="font-lexend text-[#475569] text-[15px] leading-[1.7] list-disc pl-6 space-y-2">
                <li>ChemXLab cung cấp cả gói miễn phí và gói trả phí với các tính năng khác nhau.</li>
                <li>Thanh toán được xử lý thông qua các cổng thanh toán an toàn và đáng tin cậy.</li>
                <li>Chính sách hoàn tiền sẽ được áp dụng theo từng trường hợp cụ thể.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">6. Giới hạn trách nhiệm</h2>
              <p className="font-lexend text-[#475569] text-[15px] leading-[1.7]">
                ChemXLab cung cấp dịch vụ "như hiện có" và không đảm bảo rằng dịch vụ sẽ hoạt động liên tục hoặc không có lỗi. Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">7. Thay đổi điều khoản</h2>
              <p className="font-lexend text-[#475569] text-[15px] leading-[1.7]">
                ChemXLab có quyền cập nhật các điều khoản này bất kỳ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải. Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận các thay đổi.
              </p>
            </div>

            <div className="pt-6 border-t border-[#E2E8F0]">
              <p className="font-lexend text-[#94A3B8] text-[14px]">
                Nếu bạn có câu hỏi về điều khoản dịch vụ, vui lòng liên hệ chúng tôi qua email: <a href="mailto:chemxlab567@gmail.com" className="text-[#3298DC] font-semibold hover:underline">chemxlab567@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
