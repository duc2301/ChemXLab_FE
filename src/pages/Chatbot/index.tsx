import { Modal, Spin } from "antd";
import { ArrowLeft, FlaskConical, LogIn, Menu, X } from "lucide-react";
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

    // Load sessions on mount (only if logged in)
    useEffect(() => {
        if (!isLoggedIn) return;

        const initializeChat = async () => {
            setIsInitialLoading(true);
            const sessionList = await getAllSessions();
            setSessions(sessionList);

            const savedSessionId = localStorage.getItem(STORAGE_KEY);
            if (savedSessionId) {
                const existingSession = sessionList.find(
                    (s) => s.sessionId === savedSessionId
                );
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

    // Login Required Modal
    if (!isLoggedIn) {
        return (
            <div className="h-screen bg-[#0F172A] flex items-center justify-center">
                <Modal
                    open={showLoginModal}
                    footer={null}
                    closable={false}
                    centered
                    className="login-modal"
                >
                    <div className="text-center py-4">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Yêu cầu đăng nhập
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Vui lòng đăng nhập để sử dụng ChemXLab AI
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => navigate("/")}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Quay lại
                            </button>
                            <Link
                                to="/login"
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
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
            <div className="h-screen bg-[#0F172A] flex items-center justify-center">
                <div className="text-center">
                    <Spin size="large" />
                    <p className="text-slate-400 mt-4">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-[#0F172A]">
            {/* Sidebar */}
            <div
                className={`
                    fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300
                    lg:relative lg:translate-x-0
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <ChatSidebar
                    sessions={sessions}
                    activeSessionId={activeSessionId}
                    onSelectSession={(id) => {
                        handleSelectSession(id);
                        setIsSidebarOpen(false);
                    }}
                    onNewChat={handleNewChat}
                    onDeleteSession={handleDeleteSession}
                    onClearAll={handleClearAll}
                />
            </div>

            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-14 border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur-xl flex items-center px-4 gap-4 flex-shrink-0">
                    {/* Mobile menu */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 hover:bg-slate-800 rounded-lg text-slate-400"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Back button */}
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm hidden sm:inline">Trang chủ</span>
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <FlaskConical className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold">ChemXLab AI</span>
                    </div>

                    <div className="flex-1" />

                    {/* Session topic */}
                    {sessionTopic && (
                        <span className="hidden md:block text-sm text-slate-500 truncate max-w-xs">
                            {sessionTopic}
                        </span>
                    )}
                </header>

                {/* Chat Area */}
                <div className="flex-1 overflow-hidden">
                    <ChatArea
                        messages={messages}
                        isLoading={isLoading}
                        sessionTopic={sessionTopic}
                    />
                </div>

                {/* Input */}
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default ChatbotPage;
