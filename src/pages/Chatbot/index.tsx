import { Modal, Spin } from "antd";
import { LogIn } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { MessageHistory, SessionDTO } from "../../entities/Chatbot";
import {
    clearAllSessions,
    createSession,
    deleteSession,
    getAllSessions,
    getConversationHistory,
    sendMessage,
} from "../../features/Chatbot";
import Navbar from "../../Widget/components/Navbar";
import ChatArea from "./components/ChatArea";
import ChatInput from "./components/ChatInput";
import ChatSidebar from "./components/ChatSidebar";

const STORAGE_KEY = "chatbot_session_id";

const ChatbotPage = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<SessionDTO[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageHistory[]>([]);
    const [sessionTopic, setSessionTopic] = useState<string>("");
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Check if user is logged in
    const token = localStorage.getItem("token") || localStorage.getItem("jwtToken");
    const isLoggedIn = !!token;

    // Show login modal if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            setIsInitialLoading(false);
        }
    }, [isLoggedIn]);

    // Load sessions on mount
    useEffect(() => {
        if (!isLoggedIn) return;

        const initializeChat = async () => {
            setIsInitialLoading(true);
            const sessionList = await getAllSessions();
            setSessions(sessionList);

            const savedSessionId = localStorage.getItem(STORAGE_KEY);
            if (savedSessionId) {
                const existingSession = sessionList.find((s) => s.sessionId === savedSessionId);
                if (existingSession) {
                    await handleSelectSession(savedSessionId);
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                }
            }
            setIsInitialLoading(false);
        };
        initializeChat();
    }, [isLoggedIn]);

    const refreshSessions = useCallback(async () => {
        const sessionList = await getAllSessions();
        setSessions(sessionList);
    }, []);

    const handleNewChat = useCallback(async () => {
        const newSession = await createSession("Cuộc trò chuyện mới");
        if (newSession) {
            setActiveSessionId(newSession.sessionId);
            setSessionTopic(newSession.topic);
            setMessages([]);
            localStorage.setItem(STORAGE_KEY, newSession.sessionId);
            await refreshSessions();
        }
    }, [refreshSessions]);

    const handleSelectSession = useCallback(async (sessionId: string) => {
        setActiveSessionId(sessionId);
        localStorage.setItem(STORAGE_KEY, sessionId);
        const history = await getConversationHistory(sessionId);
        if (history) {
            setMessages(history.messages);
            setSessionTopic(history.topic);
        } else {
            setMessages([]);
            setSessionTopic("");
        }
    }, []);

    const handleSendMessage = useCallback(
        async (content: string) => {
            let currentSessionId = activeSessionId;

            if (!currentSessionId) {
                const newSession = await createSession(content.slice(0, 50));
                if (!newSession) return;
                currentSessionId = newSession.sessionId;
                setActiveSessionId(currentSessionId);
                setSessionTopic(newSession.topic);
                localStorage.setItem(STORAGE_KEY, currentSessionId);
                await refreshSessions();
            }

            const userMessage: MessageHistory = {
                role: "user",
                content,
                toolsUsed: [],
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, userMessage]);

            setIsLoading(true);
            const response = await sendMessage(currentSessionId, content);
            setIsLoading(false);

            if (response) {
                const aiMessage: MessageHistory = {
                    role: "assistant",
                    content: response.response,
                    toolsUsed: response.toolsUsed,
                    timestamp: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, aiMessage]);
                await refreshSessions();
            }
        },
        [activeSessionId, refreshSessions]
    );

    const handleSuggestionClick = (suggestionText: string) => {
        setInputValue(suggestionText);
    };

    const handleDeleteSession = useCallback(
        async (sessionId: string) => {
            const success = await deleteSession(sessionId);
            if (success) {
                if (activeSessionId === sessionId) {
                    setActiveSessionId(null);
                    setMessages([]);
                    setSessionTopic("");
                    localStorage.removeItem(STORAGE_KEY);
                }
                await refreshSessions();
            }
        },
        [activeSessionId, refreshSessions]
    );

    const handleClearAll = useCallback(async () => {
        const success = await clearAllSessions();
        if (success) {
            setSessions([]);
            setActiveSessionId(null);
            setMessages([]);
            setSessionTopic("");
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    if (!isLoggedIn) {
        return (
            <div className="h-screen bg-[#FBFBFB] flex items-center justify-center relative overflow-hidden">
                <Navbar />
                <Modal open={showLoginModal} footer={null} closable={false} centered className="login-modal rounded-[24px]">
                    <div className="text-center py-6 px-4">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#0060A8] flex items-center justify-center shadow-lg">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-[24px] font-space font-bold text-[#12284B] mb-3">
                            Yêu cầu đăng nhập
                        </h2>
                        <p className="font-inter text-slate-500 mb-8 px-4 leading-relaxed">
                            Vui lòng đăng nhập vào tài khoản <strong className="text-[#438BC4]">ChemXLab</strong> để tiếp tục sử dụng trợ lý AI.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate("/")}
                                className="px-6 py-3 border border-slate-200 rounded-[12px] text-slate-600 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                            >
                                Quay lại
                            </button>
                            <Link
                                to="/login"
                                className="px-6 py-3 bg-[#0060A8] shadow-md hover:shadow-lg text-white rounded-[12px] font-semibold transition-all active:scale-95"
                            >
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }

    if (isInitialLoading) {
        return (
            <div className="h-screen bg-[#FBFBFB] flex items-center justify-center relative overflow-hidden">
                <Navbar />
                <Spin size="large" />
                <p className="text-[#12284B]/60 mt-4 font-inter font-medium absolute top-[55%]">Đang chuẩn bị không gian làm việc...</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-[#FCFCFD] relative overflow-hidden">
            <Navbar />
            {/* ═══════════════════════════════════════
                PAGE BACKGROUND DECORATIONS
            ═══════════════════════════════════════ */}
            <div className="absolute right-[192px] top-[140px] w-[96px] h-[96px] bg-[#69529A]/5 rounded-2xl flex items-center justify-center opacity-40 blur-[1px] pointer-events-none">
                {/* Visual grid dots decoration could go here */}
            </div>

            <div className="absolute right-[8%] top-[50%] opacity-[0.03] pointer-events-none grid grid-cols-4 gap-2">
                {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-[#12284B] rounded-full" />
                ))}
            </div>

            {/* ═══════════════════════════════════════
                FULL SCREEN LAYOUT
            ═══════════════════════════════════════ */}

            {/* Sidebar Desktop */}
            <div className="hidden lg:flex pt-[137px] pb-[40px] pl-0 h-full z-20">
                <ChatSidebar
                    sessions={sessions}
                    activeSessionId={activeSessionId}
                    onSelectSession={handleSelectSession}
                    onNewChat={handleNewChat}
                    onDeleteSession={handleDeleteSession}
                    onClearAll={handleClearAll}
                />
            </div>

            {/* Sidebar Mobile Overlay */}
            {isSidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
                    <div className="relative pt-[137px] h-full transform transition-transform shadow-2xl bg-white w-[288px] rounded-r-[32px]">
                        <ChatSidebar
                            sessions={sessions}
                            activeSessionId={activeSessionId}
                            onSelectSession={(id) => {
                                handleSelectSession(id);
                                setIsSidebarOpen(false);
                            }}
                            onNewChat={() => {
                                handleNewChat();
                                setIsSidebarOpen(false);
                            }}
                            onDeleteSession={handleDeleteSession}
                            onClearAll={handleClearAll}
                        />
                    </div>
                </div>
            )}

            {/* Main Chat Content */}
            <div className="flex-1 flex flex-col min-w-0 pt-[137px] relative z-10 h-full pb-0 bg-transparent items-center">

                {/* Desktop Chat Area Container */}
                <div className="flex-1 flex flex-col w-full max-w-[1200px] h-full bg-transparent overflow-hidden relative">

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-hidden relative">
                        <ChatArea
                            messages={messages}
                            isLoading={isLoading}
                            sessionTopic={sessionTopic}
                            onSuggestionClick={handleSuggestionClick}
                        />
                    </div>

                    {/* Chat Input */}
                    <div className="flex-none pb-[40px] px-4 w-full flex justify-center">
                        <ChatInput
                            value={inputValue}
                            onChange={setInputValue}
                            onSend={handleSendMessage}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

            </div>

        </div>
    );
};

export default ChatbotPage;
