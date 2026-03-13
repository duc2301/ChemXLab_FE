import { useGoogleLogin } from "@react-oauth/google";
import { message } from "antd";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { LoginForm } from "../../../entities/Auth";
import { GoogleLogin as GoogleLoginAuth, Login } from "../../../features/Auth";

// Import icons
import { ArrowLeft, Eye, EyeOff, LogIn, Mail, Lock, UserPlus } from "lucide-react";

// Import assets
import logo from "../../../shared/assets/Logo/logo.png";
import splashBackground from "../../../shared/assets/illustrations/h.png";
import splashBackgroundHe from "../../../shared/assets/illustrations/he.png";
import splashBackgroundHee from "../../../shared/assets/illustrations/hee.png";
import loginIllustration from "../../../shared/assets/mascot/7.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      message.warning("Vui lòng nhập email và mật khẩu");
      return;
    }

    setIsLoading(true);
    try {
      const loginData: LoginForm = {
        email,
        password
      };

      const result: boolean | null = await Login(loginData);
      if (result) {
        const role = localStorage.getItem("Role");
        if (role?.toUpperCase() === "ADMIN") {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error("Login capture:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const googleLogin = useGoogleLogin({
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
      } catch (err) {
        console.error("Google login capture:", err);
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
      handleLogin();
    }
  }

  // Palette:
  // Clouds: #FFF8E7
  // Clear Skies: #8CC1E9
  // Deep Ocean: #12284B
  // Blueberry: #0055A0
  // Bluebird: #438BC4

  return (
    <div className="min-h-screen bg-[#12284B] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">

      {/* Background Scattered Bubbles - Denser & Richer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large atmospheric loang bubbles */}
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[40%] bg-[#0055A0] rounded-full blur-[140px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[40%] bg-[#438BC4] rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[40%] bg-[#0055A0]/25 rounded-full blur-[150px] z-0" />
        <div className="absolute bottom-[20%] right-[30%] w-[40%] h-[30%] bg-[#8CC1E9]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[30%] left-[-10%] w-[50%] h-[40%] bg-[#438BC4]/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-[5%] left-[40%] w-[40%] h-[30%] bg-[#8CC1E9]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-5%] right-[25%] w-[35%] h-[35%] bg-[#438BC4]/15 rounded-full blur-[80px]" />

        {/* Tiny Focal Bubbles - Shimmering - Fixed Visibility */}
        <div className="absolute top-[10%] left-[20%] w-2 h-2 bg-[#FFF8E7] rounded-full blur-[2px] opacity-60 animate-pulse" style={{ animationDuration: '2s' }} />
        <div className="absolute top-[30%] right-[15%] w-4 h-4 bg-[#8CC1E9] rounded-full blur-[4px] opacity-50 animate-pulse" style={{ animationDuration: '3.5s' }} />
        <div className="absolute top-[15%] right-[5%] w-2 h-2 bg-[#8CC1E9] rounded-full blur-[1px] opacity-50 animate-pulse" style={{ animationDuration: '1.8s' }} />
        <div className="absolute bottom-[20%] left-[25%] w-5 h-5 bg-[#0055A0] rounded-full blur-[6px] opacity-55 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[10%] right-[3%] w-1.5 h-1.5 bg-[#FFF8E7] rounded-full blur-[0.5px] opacity-60 animate-pulse" style={{ animationDuration: '2.5s' }} />
        <div className="absolute bottom-[2%] left-[15%] w-3 h-3 bg-[#8CC1E9]/40 rounded-full blur-[3px] animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-[15%] right-[10%] w-5 h-5 bg-[#0055A0]/50 rounded-full blur-[8px] animate-pulse" style={{ animationDuration: '4.2s' }} />
        <div className="absolute top-[40%] right-[5%] w-2.5 h-2.5 bg-[#8CC1E9]/40 rounded-full blur-[2px] animate-pulse" style={{ animationDuration: '2.2s' }} />

        {/* Vast Field of Glowing Stars */}
        <div className="absolute top-[5%] left-[5%] w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_6px_2px_white] animate-pulse" />
        <div className="absolute top-[15%] right-[20%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.7)] animate-pulse" style={{ animationDuration: '2.5s' }} />
        <div className="absolute top-[35%] left-[15%] w-[1px] h-[1px] bg-[#8CC1E9] rounded-full shadow-[0_0_6px_2px_#8CC1E9] animate-pulse" style={{ animationDuration: '4.5s' }} />
        <div className="absolute top-[65%] right-[8%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_3px_rgba(255,255,255,0.4)] animate-pulse" style={{ animationDuration: '3.5s' }} />
        <div className="absolute bottom-[10%] left-[5%] w-[1.5px] h-[1.5px] bg-[#FFF8E7] rounded-full shadow-[0_0_10px_3px_rgba(255,248,231,0.5)] animate-pulse" style={{ animationDuration: '5.5s' }} />
        <div className="absolute bottom-[30%] right-[20%] w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_6px_2px_white] animate-pulse" style={{ animationDuration: '2s' }} />
        <div className="absolute top-[25%] left-[40%] w-1 h-1 bg-[#8CC1E9] rounded-full shadow-[0_0_8px_2px_rgba(140,193,233,0.6)] animate-pulse" />
        <div className="absolute bottom-[5%] right-[45%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_2px_white] animate-pulse" style={{ animationDuration: '6.5s' }} />
        <div className="absolute top-[55%] left-[10%] w-[1px] h-[1px] bg-white rounded-full shadow-[0_0_4px_1px_white] animate-pulse" />
        <div className="absolute bottom-[40%] right-[10%] w-[1.5px] h-[1.5px] bg-[#8CC1E9] rounded-full shadow-[0_0_6px_2px_rgba(140,193,233,0.5)] animate-pulse" />
        <div className="absolute top-[8%] left-[75%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_2px_white] animate-pulse" />
        <div className="absolute top-[50%] right-[40%] w-[0.5px] h-[0.5px] bg-white rounded-full shadow-[0_0_6px_2px_white] opacity-60" />
        <div className="absolute bottom-[15%] left-[60%] w-1.5 h-1.5 bg-[#8CC1E9] rounded-full shadow-[0_0_12px_4px_rgba(140,193,233,0.4)] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-[80%] left-[30%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_2px_white] animate-pulse" />
        <div className="absolute bottom-[8%] right-[85%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_2px_white] animate-pulse" />
        <div className="absolute top-[20%] left-[90%] w-1 h-1 bg-[#FFF8E7] rounded-full shadow-[0_0_10px_3px_rgba(255,248,231,0.4)]" />

        {/* 10 Additional Subtle Background Stars */}
        <div className="absolute top-[45%] left-[3%] w-[1px] h-[1px] bg-white/40 rounded-full shadow-[0_0_4px_1px_rgba(255,255,255,0.3)] animate-pulse" style={{ animationDuration: '4.2s' }} />
        <div className="absolute top-[2%] right-[35%] w-[1px] h-[1px] bg-[#8CC1E9]/30 rounded-full shadow-[0_0_4px_1px_rgba(140,193,233,0.2)]" />
        <div className="absolute bottom-[45%] left-[8%] w-[0.5px] h-[0.5px] bg-white/50 rounded-full shadow-[0_0_3px_1px_white]" />
        <div className="absolute top-[75%] left-[45%] w-[1px] h-[1px] bg-white/30 rounded-full shadow-[0_0_4px_1px_rgba(255,255,255,0.2)] animate-pulse" />
        <div className="absolute bottom-[2%] right-[10%] w-[1px] h-[1px] bg-[#FFF8E7]/30 rounded-full shadow-[0_0_4px_1px_rgba(255,248,231,0.2)]" />
        <div className="absolute top-[30%] right-[45%] w-[0.8px] h-[0.8px] bg-white/40 rounded-full shadow-[0_0_3px_1px_white] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-[35%] right-[5%] w-[1px] h-[1px] bg-[#8CC1E9]/40 rounded-full shadow-[0_0_5px_2px_rgba(140,193,233,0.3)]" />
        <div className="absolute top-[60%] left-[85%] w-[0.5px] h-[0.5px] bg-white/50 rounded-full shadow-[0_0_2px_1px_white]" />
        <div className="absolute bottom-[15%] right-[90%] w-[1px] h-[1px] bg-white/30 rounded-full shadow-[0_0_4px_1px_white] animate-pulse" style={{ animationDuration: '5.2s' }} />
        <div className="absolute top-[18%] left-[25%] w-[1px] h-[1px] bg-[#8CC1E9]/30 rounded-full shadow-[0_0_4px_1px_rgba(140,193,233,0.2)]" />

        {/* Relocated Mascot Atmosphere (Was inside Left Column) */}
        <div className="absolute w-[40%] h-[40%] bg-[#8CC1E9]/18 rounded-full blur-[100px] z-[0] top-[30%] left-[10%] animate-pulse" />
        <div className="absolute top-[20%] left-[5%] w-[30%] h-[30%] bg-[#0055A0]/15 rounded-full blur-[80px] z-[0] animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-[20%] left-[15%] w-[35%] h-[35%] bg-[#438BC4]/15 rounded-full blur-[70px] z-[0]" />

        {/* Relocated Form Atmosphere (Was inside Right Column) */}
        <div className="absolute top-[25%] right-[10%] w-[35%] h-[35%] bg-blue-500/15 rounded-full blur-[100px] z-[0]" />
        <div className="absolute bottom-[15%] right-[5%] w-[30%] h-[30%] bg-[#8CC1E9]/12 rounded-full blur-[80px] z-[0] animate-pulse" style={{ animationDuration: '8s' }} />

        {/* Relocated Small Flickering Bubbles */}
        <div className="absolute top-[25%] left-[15%] w-3.5 h-3.5 bg-[#8CC1E9]/60 rounded-full blur-[3px] animate-pulse" style={{ animationDuration: '2.2s' }} />
        <div className="absolute bottom-[35%] left-[10%] w-5 h-5 bg-[#FFF8E7]/50 rounded-full blur-[6px] opacity-80 animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute top-[45%] left-[20%] w-2 h-2 bg-[#8CC1E9]/70 rounded-full blur-[1px] animate-pulse" style={{ animationDuration: '1.5s' }} />
        <div className="absolute top-[20%] right-[20%] w-3.5 h-3.5 bg-white/20 rounded-full blur-[3px] animate-pulse" style={{ animationDuration: '2s' }} />
        <div className="absolute bottom-[25%] right-[15%] w-4.5 h-4.5 bg-blue-400/25 rounded-full blur-[5px] animate-pulse" style={{ animationDuration: '3.2s' }} />
        <div className="absolute bottom-[40%] right-[25%] w-7 h-7 bg-blue-600/20 rounded-full blur-[8px] animate-pulse" style={{ animationDuration: '4s' }} />
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

        {/* Left Column - Seamless curved white background */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full md:w-1/2 p-8 md:p-10 flex flex-col items-center justify-between relative"
        >
          {/* Fluid S-Curved Background - Curvier top, balanced lower bulge */}
          <div className="hidden md:block absolute inset-y-0 left-0 right-[-180px] z-0 pointer-events-none">
            <svg viewBox="0 0 700 800" className="h-full w-full" preserveAspectRatio="none">
              <path
                d="M0,0 L520,0 C600,300 350,550 680,800 L0,800 Z"
                fill="white"
              />
            </svg>
          </div>
          {/* Mobile Background */}
          <div className="md:hidden absolute inset-0 bg-white z-0" />
          {/* Logo */}
          <div className="w-full flex justify-start mb-6 relative z-10">
            <img src={logo} alt="Logo" className="h-12 object-contain" />
          </div>

          {/* Illustration with background focal glow and splash */}
          <div className="flex-1 flex items-center justify-center w-full max-w-[320px] relative">
            {/* Deepest background: Majestic atmospheric loang - Rescaled to fit */}
            <div className="absolute inset-0 flex items-center justify-center overflow-visible pointer-events-none z-0">
              <img
                src={splashBackgroundHee}
                alt=""
                className="w-[280%] h-[280%] object-contain opacity-100 animate-pulse blur-[80px] saturate-[2.5] brightness-110"
                style={{ animationDuration: '10s' }}
              />
            </div>

            {/* Bottom-most background: Atmospheric color bleed - Rescaled to fit */}
            <div className="absolute inset-0 flex items-center justify-center overflow-visible pointer-events-none z-[1]">
              <img
                src={splashBackgroundHe}
                alt=""
                className="w-[200%] h-[200%] object-contain opacity-100 animate-pulse blur-[60px] saturate-[3.0] brightness-120"
                style={{ animationDuration: '10s' }}
              />
            </div>

            {/* Middle background: Focal splash - Rescaled to fit */}
            <img
              src={splashBackground}
              alt=""
              className="absolute w-[130%] h-[130%] object-contain opacity-50 blur-[15px] z-[2]"
            />


            <img
              src={loginIllustration}
              alt="Lab Illustration"
              className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_40px_rgba(140,193,233,0.3)]"
            />
          </div>

          {/* Compact Copyright */}
          <div className="w-full mt-8 text-[9px] text-white/40 font-bold uppercase tracking-widest text-center md:text-left relative z-20">
            © 2024 ChemXLab Laboratory
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-white relative"
        >
          <div className="max-w-[340px] mx-auto w-full relative z-10">
            {/* Header / Tabs - Tighter margin */}
            <div className="flex justify-start gap-6 mb-6">
              <button onClick={() => navigate('/login')} className="text-[10px] font-black uppercase tracking-widest text-[#8CC1E9] border-b-2 border-[#8CC1E9] pb-1 flex items-center gap-2">
                <LogIn size={14} /> Đăng nhập
              </button>
              <button onClick={() => navigate('/register')} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center gap-2">
                <UserPlus size={14} /> Đăng ký
              </button>
            </div>

            <div className="mb-10">
              <h1 className="text-3xl font-black tracking-tight mb-2">Đăng nhập</h1>
            </div>

            <div className="space-y-5" onKeyDown={handleKeyDown}>
              {/* Account Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/70 flex items-center gap-2 uppercase tracking-widest">
                  <Mail size={12} className="text-[#8CC1E9]" />
                  Tên đăng nhập hoặc Email
                </label>
                <input
                  type="email"
                  placeholder="admin@chemxlab.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-transparent rounded-2xl px-5 py-4 focus:outline-none focus:border-[#8CC1E9]/50 transition-all text-sm placeholder:text-white/30"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-white/70 flex items-center gap-2 uppercase tracking-widest">
                    <Lock size={12} className="text-[#8CC1E9]" />
                    Mật khẩu
                  </label>
                  <Link to="/forgot-password" className="text-[10px] font-bold text-[#8CC1E9] hover:text-white transition-colors">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/[0.04] border border-transparent rounded-2xl px-5 py-4 pr-14 focus:outline-none focus:border-[#8CC1E9]/50 transition-all text-sm placeholder:text-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login Action */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-[#8CC1E9] text-[#12284B] font-black py-4 rounded-2xl hover:bg-white transform active:scale-[0.98] transition-all mt-4 shadow-xl flex items-center justify-center gap-2"
              >
                {isLoading ? "Đang đăng nhập..." : <><LogIn size={18} /> Vào Lab</>}
              </button>
            </div>

            {/* Social Divider */}
            <div className="mt-10">
              <div className="relative flex items-center mb-6">
                <div className="flex-grow border-t border-gray-800/50"></div>
                <span className="flex-shrink mx-4 text-[9px] text-white/40 uppercase tracking-widest font-black">hoặc tiếp tục với</span>
                <div className="flex-grow border-t border-gray-800/50"></div>
              </div>

              <button
                onClick={() => googleLogin()}
                disabled={isGoogleLoading}
                className="w-full bg-white/[0.03] border border-transparent rounded-2xl py-3.5 flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-bold text-xs"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
                Đăng nhập bằng Google
              </button>
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 font-medium tracking-tight">
                Bạn chưa có tài khoản?{" "}
                <Link to="/register" className="font-bold text-[#8CC1E9] hover:text-white transition-colors">
                  Tham gia ngay
                </Link>
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-[10px] text-white-400 hover:text-white transition-all font-black uppercase tracking-widest"
                >
                  <ArrowLeft size={14} />
                  Quay lại trang chủ
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginPage;