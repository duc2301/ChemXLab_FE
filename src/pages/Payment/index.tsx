import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Payment } from '../../entities/Payment';
import { initPaymentSignal } from '../../shared/SignalR';


const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

useEffect(() => {
  const setup = async () => {
    await initPaymentSignal(() => {
      console.log("Payment success received!");
      navigate("/paymentSuccess");
    });
  };

  setup();

  return () => {
  };
}, []);

  
  // Lấy dữ liệu payment từ state đã truyền sang
  const paymentData = location.state?.paymentData as Payment;
  sessionStorage.setItem('TransactionCode', paymentData?.transactionCode || '');  

  // Nếu không có dữ liệu (truy cập trực tiếp), quay lại trang chủ
  if (!paymentData) {
    return (
      <div className="flex flex-col items-center mt-20">
        <p>Không tìm thấy thông tin thanh toán.</p>
        <button onClick={() => navigate('/')} className="text-blue-500 underline">Quay lại</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-2">Thanh toán đơn hàng</h2>
        <p className="text-gray-500 mb-6">Vui lòng quét mã QR dưới đây để hoàn tất</p>

        {/* Khu vực hiển thị QR */}
        <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-200 mb-6">
          {paymentData.qrUrl ? (
            <img 
              src={paymentData.qrUrl} 
              alt="Payment QR Code" 
              className="w-64 h-64 mx-auto object-contain"
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center mx-auto text-red-500">
              Không thể tải mã QR
            </div>
          )}
        </div>

        {/* Thông tin thanh toán */}
        <div className="text-left space-y-3 border-t pt-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Số tiền:</span>
            <span className="font-bold text-lg text-green-600">
              {paymentData.amount.toLocaleString()} {paymentData.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mã giao dịch:</span>
            <span className="font-mono text-sm">{paymentData.transactionCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Trạng thái:</span>
            <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
              {paymentData.status}
            </span>
          </div>
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="mt-8 w-full py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold transition shadow-sm"
        >
          Quay lại
        </button>
      </div>
      
      <p className="mt-6 text-sm text-gray-400 italic">
        * Hệ thống sẽ tự động xác nhận sau khi bạn chuyển khoản thành công.
      </p>
    </div>
  );
};

export default PaymentPage;