import { useGoogleLogin } from "@react-oauth/google";
import { message } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { RegisterForm } from "../../../entities/Auth";
import { GoogleLogin as GoogleLoginAuth, register, SendRegisterOtp, verifyOtp } from "../../../features/Auth";

// Import icons
import { ArrowLeft, Eye, EyeOff, LogIn, Mail, ShieldCheck, UserPlus } from "lucide-react";

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
        await register(registerData);
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none" />

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] p-8 relative z-10">

        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => navigate('/login')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-gray-500 hover:bg-gray-50`}
          >
            <LogIn size={18} />
            Đăng nhập
          </button>
          <button
            onClick={() => navigate('/register')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all bg-gray-100 font-semibold text-gray-900`}
          >
            <UserPlus size={18} />
            Đăng ký
          </button>
        </div>

        {/* Step 1: Register Form */}
        {step === 1 && (
          <>
            <div className="space-y-5" onKeyDown={handleKeyDown}>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Địa chỉ email</label>
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  required
                  value={registerData?.email}
                  onChange={e => setRegisterData({ ...registerData, email: e.target.value } as RegisterForm)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên của bạn"
                  required
                  value={registerData?.fullName}
                  onChange={e => setRegisterData({ ...registerData, fullName: e.target.value } as RegisterForm)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu của bạn (ít nhất 6 ký tự)"
                    required
                    value={registerData?.passwordHash}
                    onChange={e => setRegisterData({ ...registerData, passwordHash: e.target.value } as RegisterForm)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu của bạn"
                  required
                  value={registerData?.confirmPassword}
                  onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value } as RegisterForm)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
                />
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className={`w-full bg-[#1a1b2e] text-white font-medium py-3.5 rounded-lg hover:bg-[#2e3048] transition-colors mt-2 flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? "Đang gửi mã xác thực..." : "Tiếp tục"}
              </button>
            </div>

            {/* Divider OR */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400">HOẶC</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => googleLogin()}
                disabled={isGoogleLoading}
                className={`w-full border border-gray-200 rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors font-medium text-gray-700 text-sm ${isGoogleLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                {isGoogleLoading ? "Đang xử lý..." : "Tiếp tục với Google"}
              </button>
            </div>
          </>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="space-y-6" onKeyDown={handleKeyDown}>
            {/* Header */}
            <div className="text-center">
              <div className="bg-emerald-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={28} className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Xác thực email</h3>
              <p className="mt-2 text-sm text-gray-500">
                Mã xác thực đã được gửi đến
              </p>
              <p className="text-sm font-semibold text-gray-900 flex items-center justify-center gap-1.5 mt-1">
                <Mail size={14} className="text-gray-400" />
                {registerData?.email}
              </p>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
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
                  className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl transition-all focus:outline-none
                    ${value
                      ? "border-emerald-500 bg-emerald-50/50 text-emerald-700"
                      : "border-gray-200 text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-black/5"
                    }`}
                />
              ))}
            </div>

            {/* Countdown & Resend */}
            <div className="text-center text-sm">
              {countdown > 0 ? (
                <p className="text-gray-500">
                  Gửi lại mã sau <span className="font-bold text-gray-900">{countdown}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-blue-600 font-semibold hover:underline disabled:opacity-50"
                >
                  {isLoading ? "Đang gửi..." : "Gửi lại mã OTP"}
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-3.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={handleVerifyAndRegister}
                disabled={isVerifying || otpValues.join("").length !== OTP_LENGTH}
                className={`flex-[2] bg-[#1a1b2e] text-white font-medium py-3.5 rounded-lg hover:bg-[#2e3048] transition-colors flex justify-center items-center ${isVerifying || otpValues.join("").length !== OTP_LENGTH ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isVerifying ? "Đang xác nhận..." : "Xác nhận & Đăng ký"}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Đã có tài khoản? <Link to="/login" className="font-semibold text-gray-900 hover:underline decoration-1 underline-offset-2">Đăng nhập</Link>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Về trang chủ
          </Link>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;