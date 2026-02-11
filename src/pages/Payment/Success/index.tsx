import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const [transactionCode, setTransactionCode] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setTransactionCode(sessionStorage.getItem('TransactionCode') || "");
    setTransactionAmount(sessionStorage.getItem('Amount') || "");
  }, []);

  const handleHome = () => {
    navigate("/");
    sessionStorage.removeItem('TransactionCode');
  };

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center px-4">
      {/* Card Container giống giao diện Mobile */}
      <div className="bg-white p-8 rounded-[40px] shadow-2xl max-w-xl w-full text-center relative overflow-hidden">
        
        {/* Nút đóng (X) ở góc trái */}
        <div className="absolute top-6 left-6 cursor-pointer" onClick={handleHome}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>

        {/* Success Icon với hiệu ứng Glow */}
        <div className="mx-auto mt-6 mb-6 relative flex items-center justify-center">
            {/* Vòng tròn mờ phía sau tạo hiệu ứng tỏa sáng */}
            <div className="absolute w-24 h-24 bg-teal-100 rounded-full animate-pulse"></div>
            {/* Icon chính */}
            <div className="relative z-10 w-20 h-20 bg-[#00A86B] rounded-full flex items-center justify-center shadow-lg shadow-teal-200">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
        </div>

        {/* Main Text */}
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Success!</h2>
        <p className="text-gray-500 mb-8 text-sm">
          Thanh toán của bạn đã được xử lý an toàn.
        </p>

        {/* Order Details Box */}
        <div className="bg-gray-50 py-6 px-2 rounded-3xl mb-8 border border-gray-100">
          {/* Transaction ID */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 text-sm ">Mã giao dịch</span>
            <span className="font-semibold text-gray-800 text-sm ">#{transactionCode}</span>
          </div>
          
          {/* Divider mờ */}
          <div className="border-t border-gray-200 my-2"></div>

          {/* Amount */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-500 text-sm">Số tiền</span>
            <span className="font-bold text-gray-900 text-lg">
                {transactionAmount ? Number(transactionAmount).toLocaleString() : '0'} đ
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleHome}
            className="w-full bg-[#00A86B] hover:bg-[#008f5b] text-white font-bold py-4 px-4 rounded-full transition duration-200 shadow-md shadow-green-100"
          >
            Tiếp tục
          </button>

          <button className="flex items-center justify-center gap-2 w-full text-gray-500 hover:text-gray-800 font-medium py-2 transition duration-200 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Tải hóa đơn {"(Coming soon)"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;