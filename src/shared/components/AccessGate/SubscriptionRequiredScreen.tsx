import { Modal } from "antd";
import { Crown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../../Widget/components/Navbar";

interface SubscriptionRequiredScreenProps {
    featureName: string;
}

const SubscriptionRequiredScreen = ({ featureName }: SubscriptionRequiredScreenProps) => {
    const navigate = useNavigate();

    return (
        <div className="h-screen bg-[#FBFBFB] flex items-center justify-center relative overflow-hidden">
            <Navbar />
            <Modal open footer={null} closable={false} centered className="login-modal rounded-[24px]">
                <div className="text-center py-6 px-4">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#0060A8] flex items-center justify-center shadow-lg">
                        <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-[24px] font-space font-bold text-[#12284B] mb-3">
                        Yêu cầu mua gói
                    </h2>
                    <p className="font-inter text-slate-500 mb-8 px-4 leading-relaxed">
                        Tài khoản của bạn chưa sở hữu gói nào của <strong className="text-[#438BC4]">ChemXLab</strong>. Vui lòng mua gói để tiếp tục sử dụng {featureName}.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate("/")}
                            className="px-6 py-3 border border-slate-200 rounded-[12px] text-slate-600 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                        >
                            Quay lại
                        </button>
                        <Link
                            to="/pricing"
                            className="px-6 py-3 bg-[#0060A8] shadow-md hover:shadow-lg text-white rounded-[12px] font-semibold transition-all active:scale-95"
                        >
                            Xem các gói
                        </Link>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SubscriptionRequiredScreen;
