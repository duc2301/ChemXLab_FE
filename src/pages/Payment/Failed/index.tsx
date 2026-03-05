import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Mascot2 from '../../../shared/assets/mascot/2.png';

const PaymentFailedPage = () => {
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

    const handleRetry = () => {
        navigate("/payment");
    }

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

                {/* Mascot 2 */}
                <div className="mx-auto mt-2 mb-6 relative flex items-center justify-center">
                    <div className="absolute w-32 h-32 bg-red-100 rounded-full animate-pulse z-0 blur-xl"></div>
                    <img src={Mascot2} alt="Failed Mascot" className="w-[160px] h-auto drop-shadow-xl hover:scale-105 transition-transform duration-300 relative z-10" />
                </div>

                {/* Main Text */}
                <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Thất bại!</h2>
                <p className="text-gray-500 mb-8 text-sm">
                    Giao dịch của bạn đã bị hủy hoặc không thành công.
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
                        onClick={handleRetry}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-4 rounded-full transition duration-200 shadow-md shadow-red-100"
                    >
                        Thử lại
                    </button>

                    <button onClick={handleHome} className="flex items-center justify-center gap-2 w-full text-gray-500 hover:text-gray-800 font-medium py-2 transition duration-200 text-sm">
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailedPage;
