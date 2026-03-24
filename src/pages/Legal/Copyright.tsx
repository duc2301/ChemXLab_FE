import { ArrowLeft, Copyright } from "lucide-react";
import { Link } from "react-router-dom";

const CopyrightPage = () => {
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
              <Copyright size={24} className="text-[#025D9E]" />
            </div>
            <div>
              <h1 className="font-space text-[36px] md:text-[48px] font-bold text-[#12284B] leading-[1.1]">
                Bản quyền
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
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">Quyền sở hữu</h2>
              <p className="font-lexend text-[#475569] text-[15px] leading-[1.7]">
                © 2026 ChemXLab. Tất cả quyền được bảo lưu. ChemXLab và logo ChemXLab là nhãn hiệu của ChemXLab. Nền tảng phòng thí nghiệm hóa học ảo 3D này được phát triển bởi đội ngũ ChemXLab.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">Nội dung được bảo vệ</h2>
              <p className="font-lexend text-[#475569] text-[15px] leading-[1.7]">
                Tất cả nội dung hiển thị trên ChemXLab đều được bảo vệ bởi luật bản quyền, bao gồm:
              </p>
              <ul className="font-lexend text-[#475569] text-[15px] leading-[1.7] list-disc pl-6 space-y-2">
                <li><strong className="text-[#12284B]">Mô hình 3D:</strong> Tất cả mô hình phân tử, nguyên tử và dụng cụ thí nghiệm 3D.</li>
                <li><strong className="text-[#12284B]">Nội dung giáo dục:</strong> Bài thí nghiệm, hướng dẫn, giải thích và tài liệu học tập.</li>
                <li><strong className="text-[#12284B]">Thiết kế giao diện:</strong> Bố cục, hình ảnh, biểu tượng và thiết kế đồ họa.</li>
                <li><strong className="text-[#12284B]">Mã nguồn:</strong> Toàn bộ mã nguồn của nền tảng và các công cụ liên quan.</li>
                <li><strong className="text-[#12284B]">Nhân vật mascot:</strong> Các nhân vật mascot ChemXLab và hình ảnh liên quan.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">Sử dụng hợp pháp</h2>
              <p className="font-lexend text-[#475569] text-[15px] leading-[1.7]">
                Bạn được phép sử dụng nội dung trên ChemXLab cho mục đích:
              </p>
              <ul className="font-lexend text-[#475569] text-[15px] leading-[1.7] list-disc pl-6 space-y-2">
                <li>Học tập cá nhân và nghiên cứu phi thương mại.</li>
                <li>Giảng dạy trong lớp học với tài khoản được cấp phép.</li>
                <li>Chia sẻ kết quả thí nghiệm cho mục đích giáo dục (kèm ghi nguồn).</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">Hành vi bị cấm</h2>
              <ul className="font-lexend text-[#475569] text-[15px] leading-[1.7] list-disc pl-6 space-y-2">
                <li>Sao chép, phân phối hoặc xuất bản nội dung mà không có sự cho phép bằng văn bản.</li>
                <li>Sử dụng nội dung cho mục đích thương mại.</li>
                <li>Sửa đổi, tạo tác phẩm phái sinh từ nội dung của ChemXLab.</li>
                <li>Xóa hoặc thay đổi các thông báo bản quyền trên nội dung.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-space text-[22px] font-bold text-[#12284B]">Báo cáo vi phạm</h2>
              <p className="font-lexend text-[#475569] text-[15px] leading-[1.7]">
                Nếu bạn phát hiện nội dung vi phạm bản quyền trên nền tảng của chúng tôi, hoặc nội dung của ChemXLab bị sử dụng trái phép, vui lòng liên hệ ngay với chúng tôi.
              </p>
            </div>

            <div className="pt-6 border-t border-[#E2E8F0]">
              <p className="font-lexend text-[#94A3B8] text-[14px]">
                Mọi thắc mắc về bản quyền, vui lòng liên hệ: <a href="mailto:chemxlab567@gmail.com" className="text-[#3298DC] font-semibold hover:underline">chemxlab567@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CopyrightPage;
