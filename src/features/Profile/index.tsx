import { message } from "antd";
import type { ChangePasswordForm, UpdateProfileForm } from "../../entities/Profile";
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

export const ChangePassword = async (userId: string, data: ChangePasswordForm): Promise<boolean> => {
  try {
    const response = await api.post(`User/change-password`, { 
        userId: userId,
        ...data
    });
    const resData: ResponseDTO<any> = response.data;
    if (resData.isSuccess) {
      message.success("Đổi mật khẩu thành công!");
      return true;
    }
    message.error(resData.message || "Đổi mật khẩu thất bại");
    return false;
  } catch (error: any) {
    message.error(error.response?.data?.message || "Lỗi hệ thống");
    return false;
  }
};