import { useState } from "react";
import type { LoginForm, RegisterForm } from "../../../entities/Auth/Login";
import { Login, register } from "../../../features/Auth";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

// Import icons
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState<RegisterForm>();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!registerData?.email || !registerData?.passwordHash || !registerData?.fullName || !registerData?.confirmPassword) {
      message.warning("Please enter all fields");
      return;
    }

    if (registerData.passwordHash !== registerData.confirmPassword) {
      message.warning("Passwords do not match");
      return;
    }

    setIsLoading(true); 
    await register(registerData);    
  }

  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRegister();
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-gray-500 hover:bg-gray-50`}
          >
            <LogIn size={18} />
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all bg-gray-100 font-semibold text-gray-900`}
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
              value={registerData?.email}
              onChange={e => setRegisterData({ ...registerData, email: e.target.value } as RegisterForm)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              required 
              value={registerData?.fullName}
              onChange={e => setRegisterData({ ...registerData, fullName: e.target.value } as RegisterForm)}
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
            <label className="text-sm font-medium text-gray-700">Confirm password</label>
            <input 
              type="password" 
              placeholder="Confirm your password" 
              required 
              value={registerData?.confirmPassword}
              onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value } as RegisterForm)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
            />
          </div>

          <button 
            onClick={handleRegister}
            disabled={isLoading}
            className={`w-full bg-[#1a1b2e] text-white font-medium py-3.5 rounded-lg hover:bg-[#2e3048] transition-colors mt-2 flex justify-center items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? "Registering..." : "Register"}
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
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          You had an account ? <a href="#" className="font-semibold text-gray-900 hover:underline decoration-1 underline-offset-2">Login</a>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;