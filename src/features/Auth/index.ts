import { message } from "antd";
import type { UserAccount } from "../../entities/Account";
import type { JwtDecode, LoginForm, RegisterForm } from "../../entities/Auth"
import type { ResponseDTO } from "../../entities/Response";
import api from "../../shared/api/axios"
import { jwtDecode } from "jwt-decode";

export const Login = async (LoginData : LoginForm) : Promise<boolean | null> => {
  const response = await api.post("Auth/Login", LoginData);
  const data : ResponseDTO<string> = response.data;
  if (data.isSuccess) {
    localStorage.setItem("jwtToken", data.result);    
    const decodedToken = await DecodeJwt(data.result);
    if (decodedToken) {
      localStorage.setItem("AvatarUrl", decodedToken.AvatarUrl);
      localStorage.setItem("Role", decodedToken.Role);
      localStorage.setItem("Email", decodedToken.email);
    }
    message.success("Login successful");
    return data.isSuccess;
  } 
  else {
    message.error(data.message || "Login failed");
    return false;
  }
}

export const Logout = () : void => {
  localStorage.removeItem("jwtToken");
  window.location.href = "/login";
}

export const register = async (RegisterData : RegisterForm) : Promise<string | null> => {
  const response = await api.post("Auth/Register", RegisterData);
  const data : ResponseDTO<UserAccount> = response.data;
  if (data.isSuccess) {
    message.success("Registration successful");
    window.location.href = "/login";
    return "success";
  }
  else if(data.errors && data.errors.length > 0) {
    data.errors.forEach((error) => {
      message.error(error.message);
    }); 
    return null;
  }
  else {
    message.error(data.message || "Registration failed");
    return null;
  }
}

export const DecodeJwt = async (token: string) : Promise<JwtDecode | null> => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid Token:", error);
    return null;
  }
}