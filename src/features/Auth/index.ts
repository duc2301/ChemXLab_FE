import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import type { UserAccount } from "../../entities/Account";
import type { JwtDecode, LoginForm, RegisterForm } from "../../entities/Auth";
import type { ResponseDTO } from "../../entities/Response";
import api from "../../shared/api/axios";

export const Login = async (LoginData: LoginForm): Promise<boolean | null> => {
  try {
    const response = await api.post("Auth/Login", LoginData);
    const data: ResponseDTO<string> = response.data;

    if (data.isSuccess) {
      localStorage.setItem("jwtToken", data.result);

      const decodedToken: any = await DecodeJwt(data.result);

      if (decodedToken) {
        console.log("Decoded Token:", decodedToken);

        const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
          || decodedToken.nameid
          || decodedToken.sub
          || decodedToken.UserId;

        if (userId) {
          localStorage.setItem("UserId", userId);
        } else {
          console.error("Không tìm thấy UserId trong token!");
        }

        localStorage.setItem("Email", decodedToken.email || decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "");
        localStorage.setItem("Role", decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "");
        localStorage.setItem("AvatarUrl", decodedToken.AvatarUrl || "");
      }

      message.success("Đăng nhập thành công");
      return true;
    }
    else {
      message.error(data.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
      return false;
    }
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || "Lỗi kết nối đến server. Vui lòng thử lại sau.";
    message.error(errorMsg);
    return false;
  }
}

export const Logout = (): void => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("UserId");
  localStorage.removeItem("Email");
  localStorage.removeItem("Role");
  localStorage.removeItem("AvatarUrl");
}

export const register = async (RegisterData: RegisterForm): Promise<string | null> => {
  try {
    const response = await api.post("Auth/Register", RegisterData);
    const data: ResponseDTO<UserAccount> = response.data;
    if (data.isSuccess) {
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      window.location.href = "/login";
      return "success";
    }
    else if (data.errors && data.errors.length > 0) {
      data.errors.forEach((error) => {
        message.error(error.message);
      });
      return null;
    }
    else {
      message.error(data.message || "Đăng ký thất bại. Vui lòng thử lại.");
      return null;
    }
  } catch (error: any) {
    const responseData = error.response?.data;
    if (responseData?.errors && responseData.errors.length > 0) {
      responseData.errors.forEach((err: any) => {
        message.error(err.message);
      });
    } else {
      const errorMsg = responseData?.message || "Lỗi kết nối đến server. Vui lòng thử lại sau.";
      message.error(errorMsg);
    }
    return null;
  }
}

export const DecodeJwt = async (token: string): Promise<JwtDecode | null> => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid Token:", error);
    return null;
  }
}

export const SendRegisterOtp = async (email: string): Promise<boolean> => {
  try {
    const response = await api.post("Auth/send-otp", { email });
    const data: ResponseDTO<null> = response.data;

    if (data.isSuccess) {
      message.success("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra!");
      return true;
    } else {
      message.error(data.message || "Không thể gửi OTP. Vui lòng thử lại.");
      return false;
    }
  } catch (error: any) {
    const responseData = error.response?.data;
    if (responseData?.errors && responseData.errors.length > 0) {
      responseData.errors.forEach((err: any) => {
        message.error(err.message);
      });
    } else {
      const errorMsg = responseData?.message || "Lỗi kết nối đến server. Vui lòng thử lại sau.";
      message.error(errorMsg);
    }
    return false;
  }
};

export const SendOtp = async (email: string): Promise<boolean> => {
  try {
    const response = await api.post("Auth/forgot-password", { email });
    const data: ResponseDTO<null> = response.data;

    if (data.isSuccess) {
      message.success("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra!");
      return true;
    } else {
      message.error(data.message || "Không thể gửi OTP. Vui lòng thử lại.");
      return false;
    }
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || "Lỗi kết nối đến server";
    message.error(errorMsg);
    return false;
  }
};

export const verifyOtp = async (email: string, otpCode: string): Promise<boolean> => {
  try {
    const response = await api.post("Auth/verify-otp", { email, otpCode });
    const data: ResponseDTO<boolean> = response.data;
    return data.isSuccess;
  } catch (error) {
    return false;
  }
};

export const ResetPassword = async (payload: any): Promise<boolean> => {
  try {
    const response = await api.post("Auth/reset-password", payload);
    const data: ResponseDTO<null> = response.data;

    if (data.isSuccess) {
      message.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      return true;
    } else {
      message.error(data.message || "Đổi mật khẩu thất bại.");
      return false;
    }
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn.";
    message.error(errorMsg);
    return false;
  }
};

export const GoogleLogin = async (credential: string): Promise<boolean> => {
  try {
    const response = await api.post("Auth/GoogleLogin", { idToken: credential });
    const data: ResponseDTO<string> = response.data;

    if (data.isSuccess) {
      localStorage.setItem("jwtToken", data.result);

      const decodedToken: any = await DecodeJwt(data.result);

      if (decodedToken) {
        const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
          || decodedToken.nameid
          || decodedToken.sub
          || decodedToken.UserId;

        if (userId) {
          localStorage.setItem("UserId", userId);
        }

        localStorage.setItem("Email", decodedToken.email || decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "");
        localStorage.setItem("Role", decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "");
        localStorage.setItem("AvatarUrl", decodedToken.AvatarUrl || "");
      }

      message.success("Đăng nhập bằng Google thành công!");
      return true;
    } else {
      message.error(data.message || "Đăng nhập bằng Google thất bại.");
      return false;
    }
  } catch (error: any) {
    const responseData = error.response?.data;
    if (responseData?.errors && responseData.errors.length > 0) {
      responseData.errors.forEach((err: any) => {
        message.error(err.message);
      });
    } else {
      const errorMsg = responseData?.message || "Lỗi kết nối đến server. Vui lòng thử lại sau.";
      message.error(errorMsg);
    }
    return false;
  }
};
