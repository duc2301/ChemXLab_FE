import { message } from "antd";
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-[#12284B] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Scattered Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[30%] bg-[#0055A0] rounded-full blur-[120px] opacity-40 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[40%] bg-[#8CC1E9] rounded-full blur-[100px] opacity-20 animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[40%] right-[30%] w-[50%] h-[30%] bg-[#438BC4]/20 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '12s' }} />

        {/* Tiny Focal Bubbles */}
        <div className="absolute top-[15%] right-[15%] w-3 h-3 bg-[#FFF8E7] rounded-full blur-[2px] opacity-60 animate-pulse" style={{ animationDuration: '2.5s' }} />
        <div className="absolute bottom-[25%] left-[15%] w-4 h-4 bg-[#8CC1E9] rounded-full blur-[3px] opacity-50 animate-pulse" style={{ animationDuration: '4s' }} />

        {/* Stars */}
        <div className="absolute top-[20%] left-[30%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.7)] animate-pulse" />
        <div className="absolute bottom-[10%] right-[20%] w-1.5 h-1.5 bg-[#FFF8E7] rounded-full shadow-[0_0_10px_3px_rgba(255,248,231,0.5)] animate-pulse" style={{ animationDuration: '3.5s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.8 }}
        className="bg-white/[0.03] backdrop-blur-2xl rounded-[40px] shadow-[0_32px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5 w-full max-w-[480px] p-8 md:p-10 relative z-10"
      >

        <div className="text-center mb-8">
          <div className="bg-[#8CC1E9]/10 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#8CC1E9] border border-[#8CC1E9]/20 shadow-[0_0_20px_rgba(140,193,233,0.3)]">
            <KeyRound size={28} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white font-space tracking-tight">
            {step === 1 ? 'Quên mật khẩu?' : 'Đặt lại mật khẩu'}
          </h2>
          <p className="mt-3 text-sm text-white/60 font-lexend leading-relaxed px-4">
            {step === 1
              ? 'Nhập email của bạn để nhận mã xác thực OTP khôi phục truy cập'
              : `Nhập mã OTP đã được gửi tới email ${email}`
            }
          </p>
        </div>

        {/* Form */}
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/70 flex items-center gap-2 uppercase tracking-widest font-lexend">
                <Mail size={12} className="text-[#8CC1E9]" />
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full bg-white/[0.04] border border-transparent rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-[#8CC1E9]/50 transition-all text-sm text-white placeholder:text-white/30"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8CC1E9]/60" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#8CC1E9] text-[#12284B] font-black py-4 rounded-2xl shadow-xl hover:bg-white transform active:scale-[0.98] transition-all flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Đang gửi mã...' : 'Gửi mã OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/70 flex items-center gap-2 uppercase tracking-widest font-lexend">
                <KeyRound size={12} className="text-[#8CC1E9]" />
                Mã OTP
              </label>
              <input
                type="text"
                required
                className="w-full bg-white/[0.04] border border-transparent rounded-2xl px-5 py-4 focus:outline-none focus:border-[#8CC1E9]/50 transition-all text-center tracking-[0.3em] font-black text-lg text-white placeholder:text-white/30 placeholder:tracking-normal"
                placeholder="Nhập 6 số"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/70 flex items-center gap-2 uppercase tracking-widest font-lexend">
                <Lock size={12} className="text-[#8CC1E9]" />
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full bg-white/[0.04] border border-transparent rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-[#8CC1E9]/50 transition-all text-sm text-white placeholder:text-white/30"
                  placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8CC1E9]/60" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/70 flex items-center gap-2 uppercase tracking-widest font-lexend">
                <Lock size={12} className="text-[#8CC1E9]" />
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full bg-white/[0.04] border border-transparent rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-[#8CC1E9]/50 transition-all text-sm text-white placeholder:text-white/30"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8CC1E9]/60" size={18} />
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-[1] bg-white/[0.04] text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-colors border border-white/10"
              >
                Trở lại
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-[2] bg-[#8CC1E9] text-[#12284B] font-black py-4 rounded-2xl shadow-xl hover:bg-white transform active:scale-[0.98] transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận đổi'}
              </button>
            </div>
          </form>
        )}

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-[#8CC1E9]/70 hover:text-[#8CC1E9] transition-colors uppercase tracking-widest">
            <ArrowLeft size={14} />
            Quay lại đăng nhập
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;