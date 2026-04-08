import {
    ChevronLeft,
    ChevronRight,
    Filter,
    RefreshCw,
    Search,
    TrendingUp,
    Users,
    X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { UserAdmin } from "../../../entities/Admin";
import type { DashboardTransaction } from "../../../entities/Dashboard";
import { getAllUsers } from "../../../features/Admin";
import { getDashboardTransactions } from "../../../features/Dashboard";

// ─── helpers ────────────────────────────────────────────────────────────────
const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const toLocalDatetimeInput = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toApiDateTime = (localInputValue: string) =>
    localInputValue ? new Date(localInputValue).toISOString().slice(0, 19) : "";

const ITEMS_PER_PAGE = 8;

// ─── SVG Line Chart ──────────────────────────────────────────────────────────
interface ChartPoint {
    label: string;
    value: number;
}

const LineChart = ({ points }: { points: ChartPoint[] }) => {
    const W = 1200;
    const H = 320;
    const PAD = { top: 30, right: 40, bottom: 50, left: 80 };

    if (points.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center text-gray-400 text-sm">
                Không có dữ liệu trong khoảng thời gian này
            </div>
        );
    }

    const maxV = Math.max(...points.map((p) => p.value), 1);
    const minV = 0;
    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top - PAD.bottom;

    const xScale = (i: number) =>
        points.length === 1
            ? PAD.left + chartW / 2
            : PAD.left + (i / (points.length - 1)) * chartW;
    const yScale = (v: number) =>
        PAD.top + chartH - ((v - minV) / (maxV - minV)) * chartH;

    const buildPath = () => {
        if (points.length === 1) {
            const x = xScale(0);
            const y = yScale(points[0].value);
            return `M ${x} ${y}`;
        }
        const coords = points.map((p, i) => [xScale(i), yScale(p.value)]);
        let d = `M ${coords[0][0]} ${coords[0][1]}`;
        for (let i = 0; i < coords.length - 1; i++) {
            const [x0, y0] = coords[i];
            const [x1, y1] = coords[i + 1];
            const cpx = (x0 + x1) / 2;
            d += ` C ${cpx} ${y0}, ${cpx} ${y1}, ${x1} ${y1}`;
        }
        return d;
    };

    const buildAreaPath = () => {
        const linePart = buildPath();
        const last = points.length - 1;
        return `${linePart} L ${xScale(last)} ${PAD.top + chartH} L ${xScale(0)} ${PAD.top + chartH} Z`;
    };

    const ticks = 5;
    const yTicks = Array.from({ length: ticks + 1 }, (_, i) =>
        Math.round((maxV / ticks) * i)
    );

    const gradientId = "lineChartGrad";
    const areaGradientId = "areaGrad";

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ maxHeight: 340 }}
            preserveAspectRatio="xMidYMid meet"
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#025D9E" />
                    <stop offset="100%" stopColor="#3298DC" />
                </linearGradient>
                <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3298DC" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3298DC" stopOpacity="0" />
                </linearGradient>
            </defs>

            {yTicks.map((tick) => {
                const y = yScale(tick);
                return (
                    <g key={tick}>
                        <line
                            x1={PAD.left}
                            y1={y}
                            x2={W - PAD.right}
                            y2={y}
                            stroke="#f1f5f9"
                            strokeWidth={1}
                        />
                        <text
                            x={PAD.left - 10}
                            y={y + 4}
                            textAnchor="end"
                            fontSize={11}
                            fill="#94a3b8"
                        >
                            {tick >= 1000000
                                ? `${(tick / 1000000).toFixed(1)}M`
                                : tick >= 1000
                                    ? `${(tick / 1000).toFixed(0)}K`
                                    : tick}
                        </text>
                    </g>
                );
            })}

            <path d={buildAreaPath()} fill={`url(#${areaGradientId})`} />

            <path
                d={buildPath()}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {points.map((p, i) => {
                const x = xScale(i);
                const y = yScale(p.value);
                return (
                    <g key={i}>
                        <text
                            x={x}
                            y={PAD.top + chartH + 20}
                            textAnchor="middle"
                            fontSize={10}
                            fill="#94a3b8"
                        >
                            {p.label}
                        </text>
                        <circle cx={x} cy={y} r={5} fill="#025D9E" stroke="#fff" strokeWidth={2} />
                        <title>
                            {p.label}: {formatCurrency(p.value)}
                        </title>
                    </g>
                );
            })}
        </svg>
    );
};

// ─── Premium Stat Card ───────────────────────────────────────────────────────
const StatCard = ({
    title,
    value,
    icon,
    gradient,
    accentLight,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    gradient: string;
    accentLight: string;
}) => (
    <div
        className={`relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${gradient}`}
    >
        {/* Decorative circles */}
        <div
            className={`absolute -top-6 -right-6 w-28 h-28 rounded-full ${accentLight} opacity-20`}
        />
        <div
            className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full ${accentLight} opacity-10`}
        />
        <div className="relative z-10 flex items-start justify-between">
            <div>
                <p className="text-sm text-white/80 font-medium font-lexend">{title}</p>
                <p className="text-3xl font-bold text-white mt-2 font-space tracking-tight">
                    {value}
                </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/10">
                {icon}
            </div>
        </div>
    </div>
);

// ─── Pagination component ────────────────────────────────────────────────────
const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemName,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemName: string;
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    const from = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const to = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500 font-lexend">
                Hiển thị {from}–{to} / {totalItems} {itemName}
            </span>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
                {getPageNumbers().map((p, i) =>
                    p === "..." ? (
                        <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">
                            ...
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p as number)}
                            className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === p
                                ? "bg-[#025D9E] text-white shadow-md shadow-blue-200"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

// ─── Search bar component ────────────────────────────────────────────────────
const SearchBar = ({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
}) => (
    <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3298DC]/40 focus:border-[#3298DC] transition-all"
        />
        {value && (
            <button
                onClick={() => onChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X size={14} />
            </button>
        )}
    </div>
);

// ─── Filter pill component ───────────────────────────────────────────────────
const FilterPill = ({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`appearance-none pl-3 pr-8 py-2.5 border rounded-xl text-sm font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3298DC]/40 ${value
                ? "border-[#3298DC] bg-[#3298DC]/5 text-[#025D9E]"
                : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
        >
            <option value="">{label}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
        <Filter
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
    </div>
);

// ─── Main page ───────────────────────────────────────────────────────────────
const AdminDashboard = () => {
    // Default range: last 30 days → now
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const [fromInput, setFromInput] = useState(toLocalDatetimeInput(thirtyDaysAgo));
    const [toInput, setToInput] = useState(toLocalDatetimeInput(now));

    const [transactions, setTransactions] = useState<DashboardTransaction[]>([]);
    const [users, setUsers] = useState<UserAdmin[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [usersLoading, setUsersLoading] = useState(true);

    // ── User filters ─────────────────────────────────────────────────────────
    const [userSearch, setUserSearch] = useState("");
    const [userRoleFilter, setUserRoleFilter] = useState("");
    const [userStatusFilter, setUserStatusFilter] = useState("");
    const [userPage, setUserPage] = useState(1);

    // ── Transaction filters ──────────────────────────────────────────────────
    const [txSearch, setTxSearch] = useState("");
    const [txStatusFilter, setTxStatusFilter] = useState("");
    const [txMethodFilter, setTxMethodFilter] = useState("");
    const [txSortBy, setTxSortBy] = useState("date_desc");
    const [txPage, setTxPage] = useState(1);

    const abortRef = useRef<AbortController | null>(null);

    // Fetch users once
    useEffect(() => {
        getAllUsers().then((u) => {
            setUsers(u);
            setUsersLoading(false);
        });
    }, []);

    const fetchTransactions = async () => {
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();
        setIsLoading(true);
        const data = await getDashboardTransactions(
            toApiDateTime(fromInput),
            toApiDateTime(toInput)
        );
        setTransactions(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Filtered & paginated users ───────────────────────────────────────────
    const filteredUsers = useMemo(() => {
        let result = [...users];

        if (userSearch.trim()) {
            const q = userSearch.toLowerCase().trim();
            result = result.filter(
                (u) =>
                    u.fullName?.toLowerCase().includes(q) ||
                    u.email?.toLowerCase().includes(q)
            );
        }

        if (userRoleFilter) {
            result = result.filter(
                (u) => u.role?.toUpperCase() === userRoleFilter.toUpperCase()
            );
        }

        if (userStatusFilter) {
            result = result.filter(
                (u) => u.status?.toLowerCase() === userStatusFilter.toLowerCase()
            );
        }

        // Default sort: newest first by createdAt
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return result;
    }, [users, userSearch, userRoleFilter, userStatusFilter]);

    const userTotalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
    const paginatedUsers = filteredUsers.slice(
        (userPage - 1) * ITEMS_PER_PAGE,
        userPage * ITEMS_PER_PAGE
    );

    // Reset user page when filters change
    useEffect(() => {
        setUserPage(1);
    }, [userSearch, userRoleFilter, userStatusFilter]);

    // ── Filtered & paginated transactions ────────────────────────────────────
    const filteredTransactions = useMemo(() => {
        let result = [...transactions];

        if (txSearch.trim()) {
            const q = txSearch.toLowerCase().trim();
            result = result.filter(
                (t) =>
                    t.transactionCode?.toLowerCase().includes(q) ||
                    t.id?.toLowerCase().includes(q)
            );
        }

        if (txStatusFilter) {
            result = result.filter(
                (t) => t.status?.toUpperCase() === txStatusFilter.toUpperCase()
            );
        }

        if (txMethodFilter) {
            result = result.filter(
                (t) => t.paymentMethod?.toLowerCase() === txMethodFilter.toLowerCase()
            );
        }

        // Sort
        if (txSortBy === "amount_asc") {
            result.sort((a, b) => a.amount - b.amount);
        } else if (txSortBy === "amount_desc") {
            result.sort((a, b) => b.amount - a.amount);
        } else if (txSortBy === "date_asc") {
            result.sort((a, b) => new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime());
        } else if (txSortBy === "date_desc") {
            result.sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());
        }

        return result;
    }, [transactions, txSearch, txStatusFilter, txMethodFilter, txSortBy]);

    const txTotalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
    const paginatedTransactions = filteredTransactions.slice(
        (txPage - 1) * ITEMS_PER_PAGE,
        txPage * ITEMS_PER_PAGE
    );

    // Reset tx page when filters change
    useEffect(() => {
        setTxPage(1);
    }, [txSearch, txStatusFilter, txMethodFilter, txSortBy]);


    // ── Helpers ──────────────────────────────────────────────────────────────
    const hasActiveUserFilters = userSearch || userRoleFilter || userStatusFilter;
    const hasActiveTxFilters = txSearch || txStatusFilter || txMethodFilter || (txSortBy && txSortBy !== "date_desc");

    const clearUserFilters = () => {
        setUserSearch("");
        setUserRoleFilter("");
        setUserStatusFilter("");
    };

    const clearTxFilters = () => {
        setTxSearch("");
        setTxStatusFilter("");
        setTxMethodFilter("");
        setTxSortBy("date_desc");
    };

    // ── Aggregate transactions per day for chart ─────────────────────────────
    const chartPoints: ChartPoint[] = (() => {
        const map: Record<string, number> = {};
        transactions
            .filter((t) => t.status === "PAID")
            .forEach((t) => {
                const day = t.paidAt.slice(0, 10);
                map[day] = (map[day] ?? 0) + t.amount;
            });
        return Object.entries(map)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, value]) => ({
                label: date.slice(5),
                value,
            }));
    })();

    const totalRevenue = transactions
        .filter((t) => t.status === "PAID")
        .reduce((s, t) => s + t.amount, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#12284B] font-space">Bảng điều khiển</h1>
                <p className="text-[#475569] mt-1 font-lexend">Tổng quan hoạt động hệ thống</p>
            </div>

            {/* Premium Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard
                    title="Tổng người dùng"
                    value={usersLoading ? "—" : users.length.toLocaleString()}
                    icon={<Users size={28} className="text-white" />}
                    gradient="bg-gradient-to-br from-[#1e3a5f] via-[#2563eb] to-[#3b82f6]"
                    accentLight="bg-white"
                />
                <StatCard
                    title="Doanh thu (kỳ đã chọn)"
                    value={isLoading ? "—" : formatCurrency(totalRevenue)}
                    icon={<TrendingUp size={28} className="text-white" />}
                    gradient="bg-gradient-to-br from-[#025D9E] via-[#0284c7] to-[#38bdf8]"
                    accentLight="bg-white"
                />
            </div>

            {/* Revenue Line Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-[#12284B] font-space">Thống kê doanh thu</h2>
                        <p className="text-sm text-[#475569] font-lexend">Doanh thu giao dịch PAID theo ngày</p>
                    </div>

                    <div className="flex flex-wrap items-end gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-500">Từ ngày</label>
                            <input
                                type="datetime-local"
                                value={fromInput}
                                onChange={(e) => setFromInput(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3298DC]/40"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-500">Đến ngày</label>
                            <input
                                type="datetime-local"
                                value={toInput}
                                onChange={(e) => setToInput(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <button
                            onClick={fetchTransactions}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-[#025D9E] hover:bg-[#12284B] disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                            Áp dụng
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="w-8 h-8 border-4 border-[#3298DC] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <LineChart points={chartPoints} />
                )}
            </div>

            {/* ═══════════════ Users table ═══════════════ */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div>
                        <h2 className="text-lg font-semibold text-[#12284B] font-space">
                            Danh sách người dùng
                        </h2>
                        <p className="text-sm text-[#475569] font-lexend">
                            {filteredUsers.length === users.length
                                ? `Tất cả ${users.length} người dùng trong hệ thống`
                                : `${filteredUsers.length} / ${users.length} kết quả`}
                        </p>
                    </div>
                    {hasActiveUserFilters && (
                        <button
                            onClick={clearUserFilters}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <X size={12} />
                            Xoá bộ lọc
                        </button>
                    )}
                </div>

                {/* Search & Filter bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <div className="flex-1 min-w-[200px]">
                        <SearchBar
                            value={userSearch}
                            onChange={setUserSearch}
                            placeholder="Tìm theo tên hoặc email..."
                        />
                    </div>
                </div>

                {usersLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : paginatedUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <Search size={40} className="mb-3 opacity-40" />
                        <p className="text-sm font-medium">Không tìm thấy người dùng nào</p>
                        <p className="text-xs mt-1">Thử thay đổi từ khoá hoặc bộ lọc</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        {["Người dùng", "Vai trò", "Trạng thái", "Ngày tạo"].map((h) => (
                                            <th
                                                key={h}
                                                className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.map((u) => (
                                        <tr
                                            key={u.id}
                                            className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                        {u.avatarUrl ? (
                                                            <img src={u.avatarUrl} alt={u.fullName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-gray-600 font-semibold text-sm">
                                                                {u.fullName?.charAt(0)?.toUpperCase() ?? "?"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{u.fullName}</p>
                                                        <p className="text-xs text-gray-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.role?.toUpperCase() === "ADMIN"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : u.role?.toUpperCase() === "TEACHER"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-green-100 text-green-700"
                                                        }`}
                                                >
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {(() => {
                                                    const s = u.status?.toLowerCase();
                                                    const cls = s === "active"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : s === "banned"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-gray-100 text-gray-600";
                                                    return (
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
                                                            {u.status}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">
                                                {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={userPage}
                            totalPages={userTotalPages}
                            onPageChange={setUserPage}
                            totalItems={filteredUsers.length}
                            itemName="người dùng"
                        />
                    </>
                )}
            </div>

            {/* ═══════════════ Transaction list ═══════════════ */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div>
                        <h2 className="text-lg font-semibold text-[#12284B] font-space">
                            Danh sách giao dịch
                        </h2>
                        <p className="text-sm text-[#475569] font-lexend">
                            {filteredTransactions.length === transactions.length
                                ? `${transactions.length} giao dịch trong kỳ đã chọn`
                                : `${filteredTransactions.length} / ${transactions.length} kết quả`}
                        </p>
                    </div>
                    {hasActiveTxFilters && (
                        <button
                            onClick={clearTxFilters}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <X size={12} />
                            Xoá bộ lọc
                        </button>
                    )}
                </div>

                {/* Search & Filter bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <div className="flex-1 min-w-[200px]">
                        <SearchBar
                            value={txSearch}
                            onChange={setTxSearch}
                            placeholder="Tìm theo mã giao dịch..."
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <FilterPill
                            label="Sắp xếp"
                            value={txSortBy}
                            onChange={setTxSortBy}
                            options={[
                                { value: "amount_desc", label: "Số tiền: Cao → Thấp" },
                                { value: "amount_asc", label: "Số tiền: Thấp → Cao" },
                                { value: "date_desc", label: "Mới nhất" },
                                { value: "date_asc", label: "Cũ nhất" },
                            ]}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="w-8 h-8 border-4 border-[#3298DC] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : paginatedTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <Search size={40} className="mb-3 opacity-40" />
                        <p className="text-sm font-medium">Không tìm thấy giao dịch nào</p>
                        <p className="text-xs mt-1">Thử thay đổi từ khoá hoặc bộ lọc</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        {[
                                            "Mã giao dịch",
                                            "Số tiền",
                                            "Phương thức",
                                            "Trạng thái",
                                            "Ngày thanh toán",
                                        ].map((h) => (
                                            <th
                                                key={h}
                                                className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedTransactions.map((t) => (
                                        <tr
                                            key={t.id}
                                            className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors"
                                        >
                                            <td className="py-3 px-4 text-sm font-mono text-gray-600 whitespace-nowrap">
                                                {t.transactionCode}
                                            </td>
                                            <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                                                {formatCurrency(t.amount)}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {t.paymentMethod}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.status === "PAID"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : t.status === "PENDING"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">
                                                {new Date(t.paidAt).toLocaleString("vi-VN")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={txPage}
                            totalPages={txTotalPages}
                            onPageChange={setTxPage}
                            totalItems={filteredTransactions.length}
                            itemName="giao dịch"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
