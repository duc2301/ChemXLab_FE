
import { message } from "antd";
import type { UserAccount } from "../../entities/Account";
import type { LoginForm, RegisterForm } from "../../entities/Auth/Login"
import type { ResponseDTO } from "../../entities/Response";
import api from "../../shared/api/axios"

export const Login = async (LoginData : LoginForm) : Promise<string | null> => {
  const response = await api.post("Auth/Login", LoginData);
  const data : ResponseDTO<UserAccount> = response.data;
  if (data.isSuccess) {
    localStorage.setItem("jwtToken", "token");    
    window.location.href = "/";
    message.success("Login successful");
    return "success";
  } 
  else {
    message.error(data.message || "Login failed");
    return "false";
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