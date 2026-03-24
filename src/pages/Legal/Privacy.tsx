import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPage = () => {
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
              <Shield size={24} className="text-[#025D9E]" />
            </div>
            <div>
              <h1 className="font-space text-[36px] md:text-[48px] font-bold text-[#12284B] leading-[1.1]">
                Chính sách bảo mật
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
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">1. Thông tin chúng tôi thu thập</h2>
              <p className="font-lexend text-[#475569] text-[15px] leading-[1.7]">
                Khi bạn sử dụng ChemXLab, chúng tôi có thể thu thập các thông tin sau:
              </p>
              <ul className="font-lexend text-[#475569] text-[15px] leading-[1.7] list-disc pl-6 space-y-2">
                <li><strong className="text-[#12284B]">Thông tin cá nhân:</strong> Họ tên, địa chỉ email khi đăng ký tài khoản.</li>
                <li><strong className="text-[#12284B]">Thông tin đăng nhập:</strong> Email và mật khẩu đã được mã hóa.</li>
                <li><strong className="text-[#12284B]">Dữ liệu sử dụng:</strong> Lịch sử thí nghiệm, thời gian truy cập và tương tác trên nền tảng.</li>
                <li><strong className="text-[#12284B]">Thông tin thanh toán:</strong> Được xử lý qua bên thứ ba an toàn, chúng tôi không lưu trữ thông tin thẻ.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">2. Mục đích sử dụng</h2>
              <ul className="font-lexend text-[#475569] text-[15px] leading-[1.7] list-disc pl-6 space-y-2">
                <li>Cung cấp, duy trì và cải thiện chất lượng dịch vụ.</li>
                <li>Xác thực tài khoản và bảo mật hệ thống.</li>
                <li>Gửi thông báo quan trọng về dịch vụ.</li>
                <li>Phân tích dữ liệu để nâng cao trải nghiệm học tập.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">3. Bảo vệ dữ liệu</h2>
              <p className="font-lexend text-[#475569] text-[15px] leading-[1.7]">
                Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn công nghiệp để bảo vệ dữ liệu của bạn:
              </p>
              <ul className="font-lexend text-[#475569] text-[15px] leading-[1.7] list-disc pl-6 space-y-2">
                <li>Mã hóa SSL/TLS cho tất cả dữ liệu truyền tải.</li>
                <li>Mật khẩu được băm (hash) an toàn, không lưu trữ dạng text.</li>
                <li>Hệ thống được bảo vệ bởi tường lửa và giám sát liên tục.</li>
                <li>Quyền truy cập dữ liệu được giới hạn theo nguyên tắc tối thiểu.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">4. Chia sẻ thông tin</h2>
              <p className="font-lexend text-[#475569] text-[15px] leading-[1.7]">
                Chúng tôi <strong className="text-[#12284B]">không bán, cho thuê hoặc chia sẻ</strong> thông tin cá nhân của bạn với bên thứ ba, ngoại trừ các trường hợp:
              </p>
              <ul className="font-lexend text-[#475569] text-[15px] leading-[1.7] list-disc pl-6 space-y-2">
                <li>Được sự đồng ý rõ ràng của bạn.</li>
                <li>Theo yêu cầu của pháp luật hoặc cơ quan có thẩm quyền.</li>
                <li>Xử lý thanh toán thông qua đối tác thanh toán uy tín.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">5. Quyền của bạn</h2>
              <ul className="font-lexend text-[#475569] text-[15px] leading-[1.7] list-disc pl-6 space-y-2">
                <li>Truy cập và xem thông tin cá nhân đã cung cấp.</li>
                <li>Yêu cầu chỉnh sửa hoặc cập nhật thông tin.</li>
                <li>Yêu cầu xóa tài khoản và dữ liệu liên quan.</li>
                <li>Từ chối nhận email tiếp thị.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">6. Cookie</h2>
              <p className="font-lexend text-[#475569] text-[15px] leading-[1.7]">
                ChemXLab sử dụng cookie và công nghệ tương tự để cải thiện trải nghiệm người dùng, lưu trữ phiên đăng nhập và phân tích lưu lượng truy cập. Bạn có thể tắt cookie trong cài đặt trình duyệt, nhưng một số tính năng có thể bị ảnh hưởng.
              </p>
            </div>

            <div className="pt-6 border-t border-[#E2E8F0]">
              <p className="font-lexend text-[#94A3B8] text-[14px]">
                Nếu bạn có câu hỏi về chính sách bảo mật, vui lòng liên hệ: <a href="mailto:chemxlab567@gmail.com" className="text-[#3298DC] font-semibold hover:underline">chemxlab567@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
