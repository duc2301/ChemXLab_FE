import { Modal } from "antd";
import { Clock, HelpCircle, Plus, Trash2 } from "lucide-react";
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

    const activeSession = sessions.find(s => s.sessionId === activeSessionId) || sessions[0];
    const historySessions = sessions.filter(s => s.sessionId !== activeSession?.sessionId);

    return (
        <div className="h-[calc(100vh-137px-40px)] w-[288px] bg-[#EFF4F9] rounded-tr-[48px] rounded-br-[48px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col p-6 pt-8 z-20 relative">
            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-8">

                {/* Chat hiện tại */}
                {activeSession && (
                    <div className="flex flex-col gap-3">
                        <h3 className="uppercase text-[11px] leading-4 tracking-[1.1px] font-bold text-slate-500 px-2">
                            CHAT HIỆN TẠI
                        </h3>
                        {/* Active Item */}
                        <div
                            className="relative flex items-center justify-between px-3 py-3 bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl group"
                        >
                            {/* Blue Edge Line */}
                            <div className="absolute left-[-2px] top-[20%] bottom-[20%] w-1 bg-[#0060A8] rounded-r-full" />

                            <div className="flex items-center gap-3 overflow-hidden pl-1 flex-1">
                                <span className="font-inter font-bold text-[14px] text-[#12284B] truncate">
                                    {activeSession.topic || "ChemXLab AI"}
                                </span>
                            </div>

                            {/* Actions & Online dot */}
                            <div className="flex items-center gap-1 shrink-0 px-1">
                                <button
                                    onClick={(e) => handleDeleteSession(e, activeSession.sessionId)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-500 transition-all"
                                    title="Xóa đoạn chat này"
                                >
                                    <Trash2 className="w-[14px] h-[14px]" />
                                </button>
                                <div className="w-[6px] h-[6px] bg-[#22C55E] rounded-full ml-1" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Lịch sử */}
                {historySessions.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <h3 className="uppercase text-[11px] leading-4 tracking-[1.1px] font-bold text-slate-500 px-2 flex justify-between items-center group/header">
                            <span>LỊCH SỬ</span>
                            <button
                                onClick={handleClearAll}
                                className="opacity-0 group-hover/header:opacity-100 hover:text-red-500 text-slate-400 transition-all"
                                title="Xóa tất cả chức trò chuyện"
                            >
                                <Trash2 className="w-[14px] h-[14px]" />
                            </button>
                        </h3>
                        <div className="flex flex-col gap-0.5">
                            {historySessions.map((session) => (
                                <div
                                    key={session.sessionId}
                                    onClick={() => onSelectSession(session.sessionId)}
                                    className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden text-slate-500 group-hover:text-slate-700 flex-1">
                                        <Clock className="w-4 h-4 shrink-0 opacity-70" strokeWidth={2} />
                                        <span className="font-inter font-medium text-[13.5px] truncate pr-2">
                                            {session.topic}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteSession(e, session.sessionId)}
                                        className="shrink-0 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-500 transition-all"
                                        title="Xóa đoạn chat này"
                                    >
                                        <Trash2 className="w-[14px] h-[14px]" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Section */}
            <div className="pt-6 shrink-0 mt-auto flex flex-col gap-4">
                <button
                    onClick={onNewChat}
                    className="w-full h-[52px] bg-[#0060A8] hover:bg-[#00518f] text-white rounded-[16px] flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(0,96,168,0.3)] transition-all hover:shadow-[0_6px_16px_rgba(0,96,168,0.4)]"
                >
                    <Plus className="w-5 h-5" strokeWidth={2.5} />
                    <span className="font-lexend font-semibold text-[15px]">Đoạn chat mới</span>
                </button>

                <div className="flex items-center gap-2 justify-start px-3 py-2 text-slate-500 hover:text-slate-700 cursor-pointer transition-colors w-max">
                    <HelpCircle className="w-[18px] h-[18px]" strokeWidth={2} />
                    <span className="font-inter font-medium text-[13.5px]">Help Center</span>
                </div>
            </div>
        </div>
    );
};

export default ChatSidebar;
