import { message } from "antd";
import { ArrowLeft, KeyRound, Lock, Mail } from "lucide-react";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ResetPassword, SendOtp } from "../../../features/Auth";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();


  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);


  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      message.warning("Vui lòng nhập email");
      return;
    }

    setLoading(true);
    const success = await SendOtp(email);
    setLoading(false);

    if (success) {
      setStep(2);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      message.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (newPassword.length < 6) {
      message.warning("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    const success = await ResetPassword({
      email,
      otpCode: otp,
      newPassword,
      confirmPassword
    });
    setLoading(false);

    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none" />

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] p-8 relative z-10">

        <div className="text-center mb-8">
          <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <KeyRound size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 ? 'Quên mật khẩu?' : 'Đặt lại mật khẩu'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1
              ? 'Nhập email của bạn để nhận mã xác thực OTP'
              : `Nhập mã OTP đã gửi tới ${email}`
            }
          </p>
        </div>

        {/* Form */}
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Địa chỉ email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#1a1b2e] text-white font-medium py-3.5 rounded-lg hover:bg-[#2e3048] transition-colors flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Mã OTP</label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors text-center tracking-widest font-bold"
                placeholder="------"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
                  placeholder="Nhập mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-3.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-[2] bg-[#1a1b2e] text-white font-medium py-3.5 rounded-lg hover:bg-[#2e3048] transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận đổi'}
              </button>
            </div>
          </form>
        )}

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={16} />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;