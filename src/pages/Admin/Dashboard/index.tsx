import {
    GraduationCap,
    RefreshCw,
    TrendingUp,
    UserCog,
    Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

// ─── SVG Line Chart ──────────────────────────────────────────────────────────
interface ChartPoint {
    label: string;
    value: number;
}

const LineChart = ({ points }: { points: ChartPoint[] }) => {
    const W = 780;
    const H = 280;
    const PAD = { top: 30, right: 30, bottom: 50, left: 80 };

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

    // Build smooth polyline path using cardinal spline
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

    // Y-axis tick values
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
            style={{ height: H }}
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

            {/* Horizontal grid lines */}
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

            {/* Area fill */}
            <path d={buildAreaPath()} fill={`url(#${areaGradientId})`} />

            {/* Line */}
            <path
                d={buildPath()}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Data points + x-labels + tooltips */}
            {points.map((p, i) => {
                const x = xScale(i);
                const y = yScale(p.value);
                return (
                    <g key={i}>
                        {/* X axis label */}
                        <text
                            x={x}
                            y={PAD.top + chartH + 20}
                            textAnchor="middle"
                            fontSize={10}
                            fill="#94a3b8"
                        >
                            {p.label}
                        </text>

                        {/* Dot with hover */}
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

// ─── Stat card ───────────────────────────────────────────────────────────────
const StatCard = ({
    title,
    value,
    icon,
    color,
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm text-[#475569] font-medium font-lexend">{title}</p>
                <p className="text-3xl font-bold text-[#12284B] mt-2 font-space">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                {icon}
            </div>
        </div>
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

    // Auto-fetch when dates change
    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Aggregate transactions per day for chart ──────────────────────────────
    const chartPoints: ChartPoint[] = (() => {
        const map: Record<string, number> = {};
        transactions
            .filter((t) => t.status === "PAID")
            .forEach((t) => {
                const day = t.paidAt.slice(0, 10); // yyyy-mm-dd
                map[day] = (map[day] ?? 0) + t.amount;
            });
        return Object.entries(map)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, value]) => ({
                label: date.slice(5), // mm-dd
                value,
            }));
    })();

    const totalRevenue = transactions
        .filter((t) => t.status === "PAID")
        .reduce((s, t) => s + t.amount, 0);

    const countByRole = (role: string) => users.filter((u) => u.role === role).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#12284B] font-space">Bảng điều khiển</h1>
                <p className="text-[#475569] mt-1 font-lexend">Tổng quan hoạt động hệ thống</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng người dùng"
                    value={usersLoading ? "—" : users.length.toLocaleString()}
                    icon={<Users size={24} className="text-white" />}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatCard
                    title="Học sinh"
                    value={usersLoading ? "—" : countByRole("STUDENT")}
                    icon={<GraduationCap size={24} className="text-white" />}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                />
                <StatCard
                    title="Giáo viên"
                    value={usersLoading ? "—" : countByRole("TEACHER")}
                    icon={<UserCog size={24} className="text-white" />}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <StatCard
                    title="Doanh thu (kỳ đã chọn)"
                    value={isLoading ? "—" : formatCurrency(totalRevenue)}
                    icon={<TrendingUp size={24} className="text-white" />}
                    color="bg-gradient-to-br from-[#025D9E] to-[#3298DC]"
                />
            </div>

            {/* Revenue Line Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-[#12284B] font-space">Thống kê doanh thu</h2>
                        <p className="text-sm text-[#475569] font-lexend">Doanh thu giao dịch PAID theo ngày</p>
                    </div>

                    {/* Date range picker */}
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

            {/* Users table */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#12284B] font-space">Danh sách người dùng</h2>
                    <p className="text-sm text-[#475569] font-lexend">Tất cả người dùng trong hệ thống</p>
                </div>
                {usersLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
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
                                {users.map((u) => (
                                    <tr
                                        key={u.id}
                                        className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors"
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
                )}
            </div>

            {/* Transaction list */}
            {transactions.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-[#12284B] font-space">Danh sách giao dịch</h2>
                        <p className="text-sm text-[#475569] font-lexend">
                            {transactions.length} giao dịch trong kỳ đã chọn
                        </p>
                    </div>
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
                                {transactions.map((t) => (
                                    <tr
                                        key={t.id}
                                        className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors"
                                    >
                                        <td className="py-3 px-4 text-sm font-mono text-gray-600 max-w-[200px] truncate">
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
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
