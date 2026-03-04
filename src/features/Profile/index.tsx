import { message } from "antd";
import type { ChangePasswordForm, IPaymentTransaction, ISubscription, UpdateProfileForm } from "../../entities/Profile";
import type { ResponseDTO } from "../../entities/Response";
import api from "../../shared/api/axios";
import { supabase } from "../../shared/config/supabase";

export const GetUserProfile = async (_userId: string): Promise<any | null> => {
  try {
    const response = await api.get(`User/profile`);
    const data: ResponseDTO<any> = response.data;
    if (data.isSuccess) {
      return data.result;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const UpdateProfile = async (_userId: string, data: UpdateProfileForm): Promise<boolean> => {
  try {
    const response = await api.put(`User/profile`, data);
    const resData: ResponseDTO<any> = response.data;
    if (resData.isSuccess) {
      message.success("Cập nhật thông tin thành công!");
      return true;
    }
    message.error(resData.message || "Cập nhật thất bại");
    return false;
  } catch (error: any) {
    message.error(error.response?.data?.message || "Lỗi hệ thống");
    return false;
  }
};

export const uploadAvatarToFirebase = async (file: File, userId: string): Promise<string | null> => {
  try {
    // Check if user is authenticated with Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.warn("No Supabase auth session. Using unauthenticated upload (requires RLS disabled)");
      // Continue anyway - if RLS is disabled, upload will work
      // If RLS is enabled, this will fail with proper error message
    }

    const timestamp = Date.now();
    const fileName = `${userId}_${timestamp}_${file.name}`;
    const filePath = `avatars/${fileName}`;

    // Upload file to Supabase Storage
    const { error } = await supabase.storage
      .from("avatars") // Bucket name - you need to create this bucket in Supabase
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase Upload Error:", error);

      // Provide helpful error message for RLS errors
      if (error.message.includes("row-level security")) {
        message.error("RLS Policy Error: Vui lòng liên hệ admin hoặc disable RLS trong Supabase");
      } else {
        message.error("Lỗi khi tải ảnh lên!");
      }
      return null;
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return publicData?.publicUrl || null;
  } catch (error) {
    console.error("Supabase Upload Error:", error);
    message.error("Lỗi khi tải ảnh lên!");
    return null;
  }
};

export const ChangePassword = async (_userId: string, data: ChangePasswordForm): Promise<boolean> => {
  try {
    const response = await api.put(`User/change-password`, {
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword
    });

    const resData: ResponseDTO<any> = response.data;
    if (resData.isSuccess) {
      message.success("Đổi mật khẩu thành công!");
      return true;
    }
    message.error(resData.message || "Đổi mật khẩu thất bại");
    return false;
  } catch (error: any) {
    console.error("Change Password Error:", error);
    const errorMsg = error.response?.data?.message ||
      (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : "Lỗi hệ thống");
    message.error(errorMsg);
    return false;
  }
};

export const GetMySubscription = async (): Promise<ISubscription[]> => {
  try {
    const response = await api.get('Subscription/my-subscription');
    const data: ResponseDTO<ISubscription[]> = response.data;
    if (data.isSuccess && data.result) {
      return data.result;
    }
    return [];
  } catch (error) {
    console.error("Get Subscription Error:", error);
    return [];
  }
};

export const GetMyTransactions = async (): Promise<IPaymentTransaction[]> => {
  try {
    const response = await api.get('payments/My-Transaction');
    const data: ResponseDTO<IPaymentTransaction[]> = response.data;
    if (data.isSuccess) {
      return data.result || [];
    }
    return [];
  } catch (error) {
    console.error("Get Transactions Error:", error);
    return [];
  }
};
