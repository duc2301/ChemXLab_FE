import { message } from "antd";
import type { UserAccount } from "../../entities/Account";
import type { LoginForm } from "../../entities/Auth/Login";
import type { ResponseDTO } from "../../entities/Response";
import api from "../../shared/api/axios";

export const Login = async (LoginData: LoginForm): Promise<string | null> => {
  const response = await api.post("Auth/Login", LoginData);
  const data: ResponseDTO<UserAccount> = response.data;
  if (data.isSuccess) {
    localStorage.setItem("jwtToken", "token");
    window.location.href = "/";
    return "success";
  } else {
    message.error(data.message || "Login failed");
    return null;
  }
};
