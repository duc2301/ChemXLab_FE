import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const [orderId, setOrderId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setOrderId(sessionStorage.getItem('TransactionCode') || "");
  }, []);

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        {/* Main Text */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
        </p>

        {/* Order Details Box */}
        <div className="bg-gray-50 p-4 rounded-md text-left mb-6 border border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Mã giao dịch:</span>
            <span className="font-medium text-gray-800">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Phương thức:</span>
            <span className="font-medium text-gray-800">Chuyển khoản ngân hàng</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link onClick={() => { navigate("/"); sessionStorage.removeItem('TransactionCode'); }}
            to="/"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded transition duration-200"
          >
            Quay về trang chủ
          </Link>

          {/* <Link
            to="/"
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded border border-gray-300 transition duration-200"
          >
            Quay về trang chủ
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;