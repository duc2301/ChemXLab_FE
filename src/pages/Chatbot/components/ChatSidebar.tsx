import { Modal } from "antd";
import { MessageSquarePlus, MessagesSquare, Search, Trash2 } from "lucide-react";
import type { SessionDTO } from "../../../entities/Chatbot";

interface ChatSidebarProps {
    sessions: SessionDTO[];
    activeSessionId: string | null;
    onSelectSession: (sessionId: string) => void;
    onNewChat: () => void;
    onDeleteSession: (sessionId: string) => void;
    onClearAll: () => void;
}

const ChatSidebar = ({
    sessions,
    activeSessionId,
    onSelectSession,
    onNewChat,
    onDeleteSession,
    onClearAll,
}: ChatSidebarProps) => {
    const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        Modal.confirm({
            title: "Xác nhận xóa",
            content: "Bạn có chắc muốn xóa cuộc trò chuyện này?",
            okText: "Xóa",
            cancelText: "Hủy",
            okButtonProps: { danger: true },
            onOk: () => onDeleteSession(sessionId),
        });
    };

    const handleClearAll = () => {
        Modal.confirm({
            title: "Xác nhận xóa tất cả",
            content: "Bạn có chắc muốn xóa TẤT CẢ cuộc trò chuyện?",
            okText: "Xóa tất cả",
            cancelText: "Hủy",
            okButtonProps: { danger: true },
            onOk: onClearAll,
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return "Hôm nay";
        if (days === 1) return "Hôm qua";
        if (days < 7) return `${days} ngày trước`;
        return date.toLocaleDateString("vi-VN");
    };

    return (
        <div className="h-full w-72 bg-[#0B1120] border-r border-slate-800 flex flex-col">
            {/* Header */}
            <div className="p-4 space-y-3">
                {/* New Chat Button */}
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20"
                >
                    <MessageSquarePlus className="w-5 h-5" />
                    Cuộc trò chuyện mới
                </button>

                {/* Search (optional UI) */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                    />
                </div>
            </div>

            {/* Sessions Label */}
            <div className="px-4 py-2">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Cuộc trò chuyện
                </span>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1">
                {sessions.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <MessagesSquare className="w-12 h-12 mx-auto mb-4 text-slate-700" />
                        <p className="text-slate-500 text-sm">Chưa có cuộc trò chuyện</p>
                        <p className="text-slate-600 text-xs mt-1">Bắt đầu bằng cách tạo cuộc trò chuyện mới</p>
                    </div>
                ) : (
                    sessions.map((session) => (
                        <div
                            key={session.sessionId}
                            onClick={() => onSelectSession(session.sessionId)}
                            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${activeSessionId === session.sessionId
                                ? "bg-blue-600/20 border border-blue-500/30 text-white"
                                : "hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent"
                                }`}
                        >
                            <MessagesSquare className="w-4 h-4 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm truncate font-medium">{session.topic}</p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {formatDate(session.createdAt)} · {session.messageCount} tin nhắn
                                </p>
                            </div>
                            <button
                                onClick={(e) => handleDeleteSession(e, session.sessionId)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-md text-slate-500 hover:text-red-400 transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {sessions.length > 0 && (
                <div className="p-3 border-t border-slate-800">
                    <button
                        onClick={handleClearAll}
                        className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 py-2 rounded-lg text-sm transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Xóa tất cả
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatSidebar;
