import { motion } from "framer-motion";
import { FileText, X } from "lucide-react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Mascot8 from '../../../shared/assets/mascot/8.png';

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
    <div className="bg-gradient-to-br from-[#12284B] via-[#0055A0] to-[#12284B] min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Subtle blur orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[30%] bg-[#8CC1E9] rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[40%] bg-white rounded-full blur-[100px] opacity-10 animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        className="bg-white p-8 md:p-10 rounded-[40px] shadow-[0_32px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 max-w-xl w-full text-center relative overflow-hidden z-10"
      >
        {/* Nút đóng (X) */}
        <div className="absolute top-6 left-6 cursor-pointer p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors" onClick={handleHome}>
          <X size={24} className="text-gray-400 hover:text-gray-600" />
        </div>

        {/* Mascot 8 */}
        <div className="mx-auto mt-2 mb-6 relative flex items-center justify-center">
          <div className="absolute w-32 h-32 bg-[#8CC1E9]/30 rounded-full animate-pulse z-0 blur-xl"></div>
          <img src={Mascot8} alt="Success Mascot" className="w-[160px] h-auto drop-shadow-xl hover:scale-105 transition-transform duration-300 relative z-10" />
        </div>

        {/* Main Text */}
        <h2 className="text-3xl font-black text-[#12284B] mb-2 tracking-tight font-space">Thành công!</h2>
        <p className="text-gray-500 mb-8 text-sm font-lexend">
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
        <div className="flex flex-col gap-4 font-lexend">
          <button
            onClick={handleHome}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 px-4 rounded-full transition-all shadow-lg shadow-emerald-500/30 transform active:scale-[0.98]"
          >
            Tiếp tục
          </button>

          <button className="flex items-center justify-center gap-2 w-full text-gray-500 hover:text-gray-800 font-medium py-2 transition-colors text-sm hover:bg-gray-50 rounded-full">
            <FileText size={18} />
            Tải hóa đơn {"(Coming soon)"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;