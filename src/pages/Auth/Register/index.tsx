import { useGoogleLogin } from "@react-oauth/google";
import { message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { RegisterForm } from "../../../entities/Auth";
import { GoogleLogin as GoogleLoginAuth, register, SendRegisterOtp, verifyOtp } from "../../../features/Auth";

// Import icons
import { ArrowLeft, Eye, EyeOff, LogIn, Mail, ShieldCheck, UserPlus, User, Lock } from "lucide-react";

// Import assets
import logo from "../../../shared/assets/Logo/logo.png";
import splashBackground from "../../../shared/assets/illustrations/h.png";
import splashBackgroundHe from "../../../shared/assets/illustrations/he.png";
import splashBackgroundHee from "../../../shared/assets/illustrations/hee.png";
import registerIllustration from "../../../shared/assets/mascot/7.png";

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 60;

const RegisterPage = () => {
  const navigate = useNavigate();

  // Step: 1 = form, 2 = OTP verification
  const [step, setStep] = useState(1);

  const [registerData, setRegisterData] = useState<RegisterForm>();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // OTP state
  const [otpValues, setOtpValues] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Step 1: Validate form & send OTP
  const handleSendOtp = async () => {
    if (!registerData?.email || !registerData?.passwordHash || !registerData?.fullName || !registerData?.confirmPassword) {
      message.warning("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (registerData.passwordHash.length < 6) {
      message.warning("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (registerData.passwordHash !== registerData.confirmPassword) {
      message.warning("Mật khẩu xác nhận không khớp");
      return;
    }

    setIsLoading(true);
    try {
      const success = await SendRegisterOtp(registerData.email);
      if (success) {
        setStep(2);
        setCountdown(COUNTDOWN_SECONDS);
        setOtpValues(Array(OTP_LENGTH).fill(""));
        // Focus first OTP input after render
        setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || !registerData?.email) return;
    setIsLoading(true);
    try {
      const success = await SendRegisterOtp(registerData.email);
      if (success) {
        setCountdown(COUNTDOWN_SECONDS);
        setOtpValues(Array(OTP_LENGTH).fill(""));
        otpInputsRef.current[0]?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // OTP input handlers
  const handleOtpChange = useCallback((index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtpValues(prev => {
      const newValues = [...prev];
      newValues[index] = digit;
      return newValues;
    });

    // Auto-focus next input
    if (digit && index < OTP_LENGTH - 1) {
      otpInputsRef.current[index + 1]?.focus();
    }
  }, []);

  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  }, [otpValues]);

  const handleOtpPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pastedData) {
      const newValues = Array(OTP_LENGTH).fill("");
      for (let i = 0; i < pastedData.length; i++) {
        newValues[i] = pastedData[i];
      }
      setOtpValues(newValues);
      // Focus the next empty or last input
      const focusIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
      otpInputsRef.current[focusIndex]?.focus();
    }
  }, []);

  // Step 2: Verify OTP & Register
  const handleVerifyAndRegister = async () => {
    const otpCode = otpValues.join("");
    if (otpCode.length !== OTP_LENGTH) {
      message.warning("Vui lòng nhập đủ mã OTP");
      return;
    }

    if (!registerData?.email) return;

    setIsVerifying(true);
    try {
      const isValid = await verifyOtp(registerData.email, otpCode);
      if (isValid) {
        // OTP verified, now register
        const result: string | null = await register(registerData);
        if(result === "success") navigate("/login")
      } else {
        message.error("Mã OTP không đúng hoặc đã hết hạn. Vui lòng thử lại.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        const result = await GoogleLoginAuth(tokenResponse.access_token);
        if (result) {
          const role = localStorage.getItem("Role");
          if (role?.toUpperCase() === "ADMIN") {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      message.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 1) {
        handleSendOtp();
      } else {
        handleVerifyAndRegister();
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#12284B] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      
      {/* Background Scattered Bubbles - Synchronized with Login */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large atmospheric loang bubbles */}
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[40%] bg-[#0055A0] rounded-full blur-[140px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[40%] bg-[#438BC4] rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[40%] bg-[#0055A0]/25 rounded-full blur-[150px] z-0" />
        <div className="absolute bottom-[20%] right-[30%] w-[40%] h-[30%] bg-[#8CC1E9]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
        
        {/* Tiny Focal Bubbles - Shimmering */}
        <div className="absolute top-[10%] left-[20%] w-2 h-2 bg-[#FFF8E7] rounded-full blur-[2px] opacity-60 animate-pulse" style={{ animationDuration: '2s' }} />
        <div className="absolute top-[30%] right-[15%] w-4 h-4 bg-[#8CC1E9] rounded-full blur-[4px] opacity-50 animate-pulse" style={{ animationDuration: '3.5s' }} />
        <div className="absolute top-[15%] right-[5%] w-2 h-2 bg-[#8CC1E9] rounded-full blur-[1px] opacity-50 animate-pulse" style={{ animationDuration: '1.8s' }} />
        <div className="absolute bottom-[20%] left-[25%] w-5 h-5 bg-[#0055A0] rounded-full blur-[6px] opacity-55 animate-pulse" style={{ animationDuration: '4s' }} />

        {/* Vast Field of Glowing Stars */}
        <div className="absolute top-[5%] left-[5%] w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_6px_2px_white] animate-pulse" />
        <div className="absolute top-[15%] right-[20%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.7)] animate-pulse" style={{ animationDuration: '2.5s' }} />
        <div className="absolute top-[35%] left-[15%] w-[1px] h-[1px] bg-[#8CC1E9] rounded-full shadow-[0_0_6px_2px_#8CC1E9] animate-pulse" style={{ animationDuration: '4.5s' }} />
        <div className="absolute bottom-[10%] left-[5%] w-[1.5px] h-[1.5px] bg-[#FFF8E7] rounded-full shadow-[0_0_10px_3px_rgba(255,248,231,0.5)] animate-pulse" style={{ animationDuration: '5.5s' }} />

        {/* Relocated Atmosphere Bubbles */}
        <div className="absolute w-[40%] h-[40%] bg-[#8CC1E9]/18 rounded-full blur-[100px] z-[0] top-[30%] left-[10%] animate-pulse" />
        <div className="absolute top-[25%] right-[10%] w-[35%] h-[35%] bg-blue-500/15 rounded-full blur-[100px] z-[0]" />
        <div className="absolute bottom-[15%] right-[5%] w-[30%] h-[30%] bg-[#8CC1E9]/12 rounded-full blur-[80px] z-[0] animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.8
        }}
        className="bg-white/[0.03] rounded-[60px] shadow-[0_32px_100px_-20px_rgba(0,0,0,0.8)] w-full max-w-[1000px] flex flex-col md:flex-row overflow-hidden relative z-10 backdrop-blur-2xl"
      >
        
        {/* Left Column - Mascot & Illustration */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full md:w-1/2 p-8 md:p-10 flex flex-col items-center justify-between relative"
        >
          <div className="hidden md:block absolute inset-y-0 left-0 right-[-180px] z-0 pointer-events-none">
            <svg viewBox="0 0 700 800" className="h-full w-full" preserveAspectRatio="none">
              <path d="M0,0 L520,0 C600,300 350,550 680,800 L0,800 Z" fill="white" />
            </svg>
          </div>
          <div className="md:hidden absolute inset-0 bg-white z-0" />
          
          <div className="w-full flex justify-start mb-6 relative z-10">
            <img src={logo} alt="Logo" className="h-12 object-contain" />
          </div>

          <div className="flex-1 flex items-center justify-center w-full max-w-[280px] relative">
            {/* Majestic Background Layers - Rescaled to fit */}
            <div className="absolute inset-0 flex items-center justify-center overflow-visible pointer-events-none z-0">
              <img src={splashBackgroundHee} alt="" className="w-[280%] h-[280%] object-contain opacity-100 animate-pulse blur-[80px] saturate-[2.5] brightness-110" style={{ animationDuration: '10s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center overflow-visible pointer-events-none z-[1]">
              <img src={splashBackgroundHe} alt="" className="w-[200%] h-[200%] object-contain opacity-100 animate-pulse blur-[60px] saturate-[3.0] brightness-120" style={{ animationDuration: '10s' }} />
            </div>
            <img src={splashBackground} alt="" className="absolute w-[130%] h-[130%] object-contain opacity-50 blur-[15px] z-[2]" />

            <img
              src={registerIllustration}
              alt="Lab Illustration"
              className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_40px_rgba(140,193,233,0.3)]"
            />
          </div>

          <div className="w-full mt-8 text-[9px] text-white/40 font-bold uppercase tracking-widest text-center md:text-left relative z-20">
            © 2024 ChemXLab Laboratory
          </div>
        </motion.div>

        {/* Right Column - Unified dark form - Made more compact */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center text-white relative"
        >
          <div className="max-w-[340px] mx-auto w-full relative z-10">
            
            {/* Header / Tabs - Tighter margin */}
            <div className="flex justify-start gap-6 mb-6">
              <button onClick={() => navigate('/login')} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center gap-2">
                <LogIn size={14} /> Đăng nhập
              </button>
              <button onClick={() => navigate('/register')} className="text-[10px] font-black uppercase tracking-widest text-[#8CC1E9] border-b-2 border-[#8CC1E9] pb-1 flex items-center gap-2">
                <UserPlus size={14} /> Đăng ký
              </button>
            </div>

            {/* Step 1: Register Form - Tighter spacing */}
            {step === 1 && (
              <div className="space-y-3.5" onKeyDown={handleKeyDown}>
                <h1 className="text-2xl font-black tracking-tight mb-4">Tạo tài khoản</h1>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/70 flex items-center gap-2 uppercase tracking-widest">
                    <Mail size={12} className="text-[#8CC1E9]" /> Email
                  </label>
                  <input
                    type="email"
                    placeholder="example@chemxlab.com"
                    value={registerData?.email}
                    onChange={e => setRegisterData({ ...registerData, email: e.target.value } as RegisterForm)}
                    className="w-full bg-white/[0.04] border border-transparent rounded-2xl px-5 py-3 focus:outline-none focus:border-[#8CC1E9]/50 transition-all text-sm placeholder:text-white/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/70 flex items-center gap-2 uppercase tracking-widest">
                    <User size={12} className="text-[#8CC1E9]" /> Họ và tên
                  </label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={registerData?.fullName}
                    onChange={e => setRegisterData({ ...registerData, fullName: e.target.value } as RegisterForm)}
                    className="w-full bg-white/[0.04] border border-transparent rounded-2xl px-5 py-3 focus:outline-none focus:border-[#8CC1E9]/50 transition-all text-sm placeholder:text-white/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/70 flex items-center gap-2 uppercase tracking-widest">
                    <Lock size={12} className="text-[#8CC1E9]" /> Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Ít nhất 6 ký tự"
                      value={registerData?.passwordHash}
                      onChange={e => setRegisterData({ ...registerData, passwordHash: e.target.value } as RegisterForm)}
                      className="w-full bg-white/[0.04] border border-transparent rounded-2xl px-5 py-3 pr-14 focus:outline-none focus:border-[#8CC1E9]/50 transition-all text-sm placeholder:text-white/30"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/70 flex items-center gap-2 uppercase tracking-widest">
                    <ShieldCheck size={12} className="text-[#8CC1E9]" /> Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={registerData?.confirmPassword}
                    onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value } as RegisterForm)}
                    className="w-full bg-white/[0.04] border border-transparent rounded-2xl px-5 py-3 focus:outline-none focus:border-[#8CC1E9]/50 transition-all text-sm placeholder:text-white/30"
                  />
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="w-full bg-[#8CC1E9] text-[#12284B] font-black py-3.5 rounded-2xl hover:bg-white transform active:scale-[0.98] transition-all mt-2 shadow-xl flex items-center justify-center gap-2"
                >
                  {isLoading ? "Đang gửi mã..." : "Tiếp tục"}
                </button>

                <div className="mt-4">
                  <button onClick={() => googleLogin()} className="w-full bg-white/[0.03] border border-transparent rounded-2xl py-3 flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-bold text-xs">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" /> Tiếp tục với Google
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <div className="space-y-8" onKeyDown={handleKeyDown}>
                <div className="text-center">
                  <h3 className="text-2xl font-black mb-2">Xác thực Email</h3>
                  <p className="text-xs text-white/50 mb-4 px-4 leading-relaxed">Mã xác thực đã được gửi đến <span className="text-[#8CC1E9] font-bold">{registerData?.email}</span></p>
                </div>

                <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      ref={el => { otpInputsRef.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={value}
                      onChange={e => handleOtpChange(index, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-black bg-white/[0.04] border border-transparent rounded-xl focus:outline-none focus:border-[#8CC1E9] transition-all"
                    />
                  ))}
                </div>

                <div className="text-center text-[10px] uppercase tracking-widest font-black">
                  {countdown > 0 ? (
                    <span className="text-white/40">Gửi lại mã sau <span className="text-[#8CC1E9]">{countdown}s</span></span>
                  ) : (
                    <button onClick={handleResendOtp} disabled={isLoading} className="text-[#8CC1E9] hover:text-white transition-all">Gửi lại mã OTP</button>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={() => setStep(1)} className="flex-1 bg-white/[0.04] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Quay lại</button>
                  <button
                    onClick={handleVerifyAndRegister}
                    disabled={isVerifying || otpValues.join("").length !== OTP_LENGTH}
                    className="flex-[2] bg-[#8CC1E9] text-[#12284B] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all"
                  >
                    {isVerifying ? "Đang xác nhận..." : "Xác nhận & Đăng ký"}
                  </button>
                </div>
              </div>
            )}

            {/* Footer - Tighter spacing */}
            <div className="mt-6 text-center">
              <p className="text-xs text-white/40">
                Đã có tài khoản? <Link to="/login" className="font-bold text-[#8CC1E9] hover:text-white transition-colors">Đăng nhập</Link>
              </p>
              <div className="mt-4">
                <Link to="/" className="inline-flex items-center gap-2 text-[10px] text-white/40 hover:text-white transition-all font-black uppercase tracking-widest">
                  <ArrowLeft size={14} /> Quay lại trang chủ
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;