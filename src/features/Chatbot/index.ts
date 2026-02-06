import { message } from "antd";
import type {
    ChatResponse,
    ConversationHistory,
    CreateSessionRequest,
    SendMessageRequest,
    SessionDTO,
} from "../../entities/Chatbot";
import type { ResponseDTO } from "../../entities/Response";
import api from "../../shared/api/axios";

const CHATBOT_API = "chatbot";

/**
 * Tạo session mới (bắt đầu cuộc trò chuyện)
 */
export const createSession = async (
    topic?: string
): Promise<SessionDTO | null> => {
    try {
        const request: CreateSessionRequest = { topic };
        const response = await api.post<ResponseDTO<SessionDTO>>(
            `${CHATBOT_API}/sessions`,
            request
        );
        if (response.data.isSuccess) {
            return response.data.result;
        }
        message.error(response.data.message || "Không thể tạo cuộc trò chuyện");
        return null;
    } catch (error) {
        console.error("Failed to create session:", error);
        message.error("Lỗi kết nối. Vui lòng thử lại.");
        return null;
    }
};

/**
 * Gửi câu hỏi cho AI
 */
export const sendMessage = async (
    sessionId: string,
    messageContent: string
): Promise<ChatResponse | null> => {
    try {
        const request: SendMessageRequest = {
            sessionId,
            message: messageContent,
        };
        const response = await api.post<ResponseDTO<ChatResponse>>(
            `${CHATBOT_API}/ask`,
            request
        );
        if (response.data.isSuccess) {
            return response.data.result;
        }
        message.error(response.data.message || "Không thể gửi tin nhắn");
        return null;
    } catch (error) {
        console.error("Failed to send message:", error);
        message.error("Lỗi kết nối. Vui lòng thử lại.");
        return null;
    }
};

/**
 * Lấy lịch sử cuộc trò chuyện
 */
export const getConversationHistory = async (
    sessionId: string
): Promise<ConversationHistory | null> => {
    try {
        const response = await api.get<ResponseDTO<ConversationHistory>>(
            `${CHATBOT_API}/sessions/${sessionId}/history`
        );
        if (response.data.isSuccess) {
            return response.data.result;
        }
        return null;
    } catch (error) {
        console.error("Failed to get conversation history:", error);
        return null;
    }
};

/**
 * Lấy danh sách tất cả cuộc trò chuyện
 */
export const getAllSessions = async (): Promise<SessionDTO[]> => {
    try {
        const response = await api.get<ResponseDTO<SessionDTO[]>>(
            `${CHATBOT_API}/sessions`
        );
        if (response.data.isSuccess) {
            return response.data.result;
        }
        return [];
    } catch (error) {
        console.error("Failed to get sessions:", error);
        return [];
    }
};

/**
 * Xóa một cuộc trò chuyện
 */
export const deleteSession = async (sessionId: string): Promise<boolean> => {
    try {
        const response = await api.delete<ResponseDTO<null>>(
            `${CHATBOT_API}/sessions/${sessionId}`
        );
        if (response.data.isSuccess) {
            message.success("Đã xóa cuộc trò chuyện");
            return true;
        }
        message.error(response.data.message || "Không thể xóa cuộc trò chuyện");
        return false;
    } catch (error) {
        console.error("Failed to delete session:", error);
        message.error("Lỗi kết nối. Vui lòng thử lại.");
        return false;
    }
};

/**
 * Xóa tất cả cuộc trò chuyện
 */
export const clearAllSessions = async (): Promise<boolean> => {
    try {
        const response = await api.delete<ResponseDTO<null>>(
            `${CHATBOT_API}/sessions/clear-all`
        );
        if (response.data.isSuccess) {
            message.success("Đã xóa tất cả cuộc trò chuyện");
            return true;
        }
        message.error(
            response.data.message || "Không thể xóa tất cả cuộc trò chuyện"
        );
        return false;
    } catch (error) {
        console.error("Failed to clear all sessions:", error);
        message.error("Lỗi kết nối. Vui lòng thử lại.");
        return false;
    }
};
