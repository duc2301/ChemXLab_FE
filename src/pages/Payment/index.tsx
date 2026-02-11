import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Payment } from '../../entities/Payment';
import { initPaymentSignal } from '../../shared/SignalR';
import { getPaymentById } from '../../features/Payment';

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<Payment | null>(null);

  useEffect(() => {
    const setup = async () => {
      await initPaymentSignal(() => {
        // console.log("Payment success received!");
        navigate("/payment/success");
      });
    };

    setup();

    const fetchPaymentData = async () => {
      const paymentId = location.state.paymentId as string;
      setPaymentData(await getPaymentById(paymentId));
    }
    
    fetchPaymentData();

    return () => {
      // Cleanup logic if needed
    };
  }, []);

  // Lấy dữ liệu payment từ state đã truyền sang
  
  const packagename = location.state?.packageName as string;
  
  // Logic lưu session (giữ nguyên)
  if (paymentData) {
      sessionStorage.setItem('TransactionCode', paymentData.transactionCode || '');
      sessionStorage.setItem('Amount', paymentData.amount.toString() || '');
  }

  // Nếu không có dữ liệu (truy cập trực tiếp), quay lại trang chủ
  if (!paymentData) {
    return (
      <div className="flex flex-col items-center mt-20">
        <p className="text-gray-600 mb-4">Không tìm thấy thông tin thanh toán.</p>
        <button 
          onClick={() => navigate('/')} 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
      {/* Container chính: Card lớn bo góc, chia 2 cột */}
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* CỘT TRÁI: QR CODE (60% width) */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-gray-100">
          <div className="max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Thanh toán qua QR Code</h2>
            <p className="text-gray-500 mb-8 text-sm">
              Mở ứng dụng ngân hàng của bạn để quét mã bên dưới và hoàn tất giao dịch.
            </p>

            {/* Khung chứa QR */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm inline-block relative group">
                {paymentData.qrUrl && paymentData.status === "PENDING" ? (
                  <img 
                    src={paymentData.qrUrl} 
                    alt="Payment QR Code" 
                    className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto"
                  />
                ) : (
                  <div className="w-48 h-48 md:w-56 md:h-56 flex items-center justify-center text-red-500 bg-gray-50 rounded-lg">
                    Phiên giao dịch đã hết hạn
                  </div>
                )}
                
                {/* Logo */}
                {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
                    <div className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                </div> */}
            </div>

            {/* Nút làm mới (Giả lập style giống ảnh) */}
            <div className="mt-8 flex justify-center">
                 <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang chờ thanh toán...
                 </div>
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY (40% width) */}
        <div className="w-full md:w-5/12 bg-gray-50 p-8 md:p-12 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Tóm tắt đơn hàng</h3>

          <div className="flex-1">
            {/* Item 1: Transaction Code */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="font-semibold text-gray-800">Mã giao dịch</p>
              </div>
              <span className="font-mono font-medium text-gray-700 bg-white px-2 py-1 rounded border border-gray-200 text-sm">
                {paymentData.transactionCode}
              </span>
            </div>

             {/* Item 2: Status */}
             <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Trạng thái</span>
              <span className={`px-3 py-1 rounded-full ${paymentData.status === 'EXPIRED' ? 'bg-red-100 text-red-700' : paymentData.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'} text-xs font-bold uppercase tracking-wide`}>
                {paymentData.status} 
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Subtotal / Total section */}
            <div className="space-y-3">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Tạm tính</span>
                <span>{paymentData.amount.toLocaleString()} {paymentData.currency}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Đơn hàng</span>
                <span>{packagename || "Không xác định"}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Phí dịch vụ</span>
                <span>0 {paymentData.currency}</span>
              </div>
              
              <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
                <span className="font-bold text-gray-900 text-lg">Tổng cộng</span>
                <span className="font-bold text-2xl text-blue-500">
                  {paymentData.amount.toLocaleString()} <span className="text-2xl font-bold">{paymentData.currency}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="mt-8">
            <button 
                onClick={() => navigate(-1)}
                className="w-full py-3 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-xl transition shadow-sm"
            >
                Quay lại
            </button>
            <p className="mt-4 text-xs text-gray-400 text-center italic">
                * Hệ thống sẽ tự động chuyển trang ngay khi nhận được tiền.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;