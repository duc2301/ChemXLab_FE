import { useState } from "react";
import type { LoginForm } from "../../../entities/Auth";
import { Login } from "../../../features/Auth";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

// Import icons
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      message.warning("Please enter both email and password");
      return;
    }

    setIsLoading(true); 
    const loginData: LoginForm = {
      email,
      password
    };

    const result : boolean | null = await Login(loginData);      
    if (result) {
      navigate('/');
    } 
    else {
      message.error("Login failed");
    }
    setIsLoading(false);

  }

  // 2. Hàm xử lý phím Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none"/>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] p-8 relative z-10">
        
        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-8">
          <button 
            onClick={() => navigate('/login')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all bg-gray-100 font-semibold text-gray-900 `}
          >
            <LogIn size={18} />
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-gray-500 hover:bg-gray-50`}
          >
            <UserPlus size={18} />
            Sign Up
          </button>
        </div>

        <div className="space-y-5" onKeyDown={handleKeyDown}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email address</label>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-xs font-semibold text-gray-900 hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
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

          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full bg-[#1a1b2e] text-white font-medium py-3.5 rounded-lg hover:bg-[#2e3048] transition-colors mt-2 flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </div>

        {/* Divider OR */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400">OR</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <button className="w-full border border-gray-200 rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors font-medium text-gray-700 text-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>
          {/* <button className="w-full border border-gray-200 rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors font-medium text-gray-700 text-sm">
            <img src="https://www.svgrepo.com/show/508762/apple.svg" className="w-5 h-5" alt="Apple" />
            Continue with Apple
          </button>
           <button className="w-full border border-gray-200 rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors font-medium text-gray-700 text-sm">
            <img src="https://www.svgrepo.com/show/331309/binance.svg" className="w-5 h-5" alt="Binance" />
            Continue with Binance
          </button>
           <button className="w-full border border-gray-200 rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors font-medium text-gray-700 text-sm">
            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-[10px]">W</div>
            Continue with Wallet
          </button> */}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account yet? <a href="#" className="font-semibold text-gray-900 hover:underline decoration-1 underline-offset-2">Sign up</a>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;