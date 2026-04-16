import { motion } from "framer-motion";
import {
    AlertTriangle,
    Atom,
    Edit,
    Eye,
    Filter,
    Loader2,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Pagination, { ITEMS_PER_PAGE } from "../../../components/Admin/Pagination";
import type { CreateElementForm, ElementAdmin, ElementProperties, UpdateElementForm } from "../../../entities/Admin";
import {
    createElement,
    deleteElement,
    getAllElements,
    getElementById,
    updateElement,
} from "../../../features/Admin";

const CATEGORY_OPTIONS = [
    { value: "", label: "Tất cả" },
    { value: "nonmetal", label: "Phi kim" },
    { value: "noble gas", label: "Khí hiếm" },
    { value: "alkali metal", label: "Kim loại kiềm" },
    { value: "alkaline earth metal", label: "Kim loại kiềm thổ" },
    { value: "metalloid", label: "Á kim" },
    { value: "halogen", label: "Halogen" },
    { value: "metal", label: "Kim loại" },
    { value: "transition metal", label: "Kim loại chuyển tiếp" },
    { value: "post-transition metal", label: "Kim loại sau chuyển tiếp" },
    { value: "lanthanide", label: "Lanthanide" },
    { value: "actinide", label: "Actinide" },
];

// ============== VIEW ELEMENT MODAL ==============
interface ViewElementModalProps {
    element: ElementAdmin;
    onClose: () => void;
}

const ViewElementModal = ({ element, onClose }: ViewElementModalProps) => {
    const [detailData, setDetailData] = useState<ElementAdmin>(element);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    // Fetch fresh data by ID on mount
    useEffect(() => {
        const fetchDetail = async () => {
            setIsLoadingDetail(true);
            const data = await getElementById(element.id);
            if (data) {
                setDetailData(data);
            }
            setIsLoadingDetail(false);
        };
        fetchDetail();
    }, [element.id]);

    const props = parseProperties(detailData.properties);
    const colorHex = props.color_hex || "#6366f1";
    const category = props.category || "—";

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl w-full max-w-lg shadow-xl relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
                >
                    <X size={18} className="text-gray-500" />
                </button>

                {isLoadingDetail ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 size={32} className="animate-spin text-[#3298DC]" />
                            <p className="text-sm text-gray-400">Đang tải chi tiết...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Header with element preview */}
                        <div
                            className="relative px-6 pt-8 pb-6 text-white"
                            style={{ background: `linear-gradient(135deg, ${colorHex}, ${colorHex}cc)` }}
                        >
                            <div className="absolute inset-0 bg-black/10" />
                            <div className="relative z-10 flex items-center gap-5">
                                {/* Element card */}
                                <div className="w-24 h-28 rounded-2xl bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center border border-white/30 shadow-lg">
                                    <span className="text-[10px] font-medium opacity-80">{detailData.id}</span>
                                    <span className="text-3xl font-bold leading-none mt-0.5">{detailData.symbol}</span>
                                    <span className="text-[11px] font-medium mt-1.5">{detailData.name}</span>
                                    <span className="text-[10px] opacity-75 mt-0.5">{detailData.atomicMass}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-2xl font-bold truncate">{detailData.name}</h2>
                                    <p className="text-white/80 text-sm mt-1">{props.englishName || detailData.name}</p>
                                    <div className="mt-2">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 border border-white/30 backdrop-blur-sm">
                                            {category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detail sections */}
                        <div className="px-6 py-5 space-y-5 max-h-[50vh] overflow-y-auto">
                            {/* Basic Info */}
                            <div>
                                <h4 className="text-xs font-bold text-[#025D9E] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#025D9E]" />
                                    Thông tin cơ bản
                                </h4>
                                <div className="space-y-2.5">
                                    <DetailRow label="Số hiệu nguyên tử" value={String(detailData.id)} />
                                    <DetailRow label="Ký hiệu" value={detailData.symbol} />
                                    <DetailRow label="Khối lượng nguyên tử" value={String(detailData.atomicMass)} mono />
                                    <DetailRow label="Nhóm" value={props.group != null ? String(props.group) : "—"} />
                                    <DetailRow label="Chu kỳ" value={props.period != null ? String(props.period) : "—"} />
                                    <DetailRow label="Phân loại" badge={category} badgeClass={getCategoryColor(category)} />
                                    <DetailRow label="Cấu hình electron" value={props.electronConfiguration || "—"} mono />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Mã màu</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-4 h-4 rounded-full border border-gray-200 shadow-inner" style={{ backgroundColor: colorHex }} />
                                            <span className="text-xs font-mono text-gray-600">{colorHex}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Physical Properties */}
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Tính chất vật lý
                                </h4>
                                <div className="space-y-2.5">
                                    <DetailRow label="Khối lượng riêng" value={props.density || "—"} />
                                    <DetailRow label="Nhiệt độ nóng chảy" value={props.meltingPoint || "—"} />
                                    <DetailRow label="Nhiệt độ sôi" value={props.boilingPoint || "—"} />
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-500 mt-0.5">Số oxi hóa</span>
                                        <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                                            {Array.isArray(props.oxidationStates) && props.oxidationStates.length > 0
                                                ? props.oxidationStates.map((state: string, i: number) => (
                                                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#E6F4FF] text-[#025D9E] text-xs font-bold border border-[#B6DCFE]">
                                                        {state}
                                                    </span>
                                                ))
                                                : <span className="text-sm text-gray-400">—</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Discovery Info */}
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    Thông tin khám phá
                                </h4>
                                <div className="space-y-2.5">
                                    <DetailRow label="Người phát hiện" value={props.discoverer || "—"} />
                                    <DetailRow label="Năm phát hiện" value={props.yearDiscovered || "—"} />
                                </div>
                            </div>

                            {/* Description */}
                            {props.description && (
                                <div className="pt-4 border-t border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                        Mô tả
                                    </h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">{props.description}</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

// Helper component for detail rows
const DetailRow = ({ label, value, mono, badge, badgeClass }: {
    label: string;
    value?: string;
    mono?: boolean;
    badge?: string;
    badgeClass?: string;
}) => (
    <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{label}</span>
        {badge ? (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>{badge}</span>
        ) : (
            <span className={`text-sm font-semibold text-gray-800 ${mono ? "font-mono" : ""}`}>{value}</span>
        )}
    </div>
);

// ============== ELEMENT MODAL (Create/Edit) ==============
interface ElementModalProps {
    element?: ElementAdmin;
    onClose: () => void;
    onSave: (data: CreateElementForm | UpdateElementForm, id?: number) => Promise<boolean>;
}

const ElementModal = ({ element, onClose, onSave }: ElementModalProps) => {
    const isEditing = !!element;
    const initialData = useRef<CreateElementForm | null>(null);

    const [formData, setFormData] = useState<CreateElementForm>(() => {
        const data: CreateElementForm = {
            symbol: element?.symbol || "",
            name: element?.name || "",
            atomicMass: element?.atomicMass || 0,
            properties: typeof element?.properties === "object"
                ? JSON.stringify(element.properties, null, 2)
                : (element?.properties as string) || JSON.stringify({
                    englishName: "",
                    category: "nonmetal",
                    group: 1,
                    period: 1,
                    density: "",
                    meltingPoint: "",
                    boilingPoint: "",
                    discoverer: "",
                    yearDiscovered: "",
                    color_hex: "#FFFFFF",
                    description: "",
                    electronConfiguration: "",
                    oxidationStates: []
                }, null, 2),
        };
        return data;
    });

    const [propertiesError, setPropertiesError] = useState("");
    const [formError, setFormError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    // Store initial data on mount to track dirty state
    useEffect(() => {
        initialData.current = { ...formData };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isDirty = () => {
        if (!initialData.current) return false;
        return (
            formData.symbol !== initialData.current.symbol ||
            formData.name !== initialData.current.name ||
            formData.atomicMass !== initialData.current.atomicMass ||
            formData.properties !== initialData.current.properties
        );
    };

    const handleClose = () => {
        if (isDirty()) {
            setShowCloseConfirm(true);
        } else {
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        // Validate atomicMass > 0
        if (formData.atomicMass <= 0) {
            setFormError("Khối lượng nguyên tử phải lớn hơn 0");
            return;
        }

        // Validate JSON
        try {
            JSON.parse(formData.properties);
            setPropertiesError("");
        } catch {
            setPropertiesError("Properties phải là JSON hợp lệ");
            return;
        }

        setIsSaving(true);
        try {
            const success = await onSave(formData, isEditing ? element?.id : undefined);
            if (!success) {
                setFormError("Thao tác thất bại. Vui lòng thử lại.");
            }
        } catch {
            setFormError("Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };

    const formatJson = () => {
        try {
            const parsed = JSON.parse(formData.properties);
            setFormData({ ...formData, properties: JSON.stringify(parsed, null, 2) });
            setPropertiesError("");
        } catch {
            setPropertiesError("Properties phải là JSON hợp lệ");
        }
    };

    const loadTemplate = () => {
        setFormData({
            ...formData,
            properties: JSON.stringify({
                englishName: "",
                category: "nonmetal",
                group: 1,
                period: 1,
                density: "",
                meltingPoint: "",
                boilingPoint: "",
                discoverer: "",
                yearDiscovered: "",
                description: "",
                electronConfiguration: "",
                oxidationStates: [],
                color_hex: "#FFFFFF"
            }, null, 2)
        });
        setPropertiesError("");
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
            >
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isEditing ? "Chỉnh sửa nguyên tố" : "Tạo nguyên tố mới"}
                    </h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" disabled={isSaving}>
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {formError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            <AlertTriangle size={16} className="flex-shrink-0" />
                            {formError}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ký hiệu</label>
                            <input
                                type="text"
                                value={formData.symbol}
                                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                                placeholder="VD: H, He, Li..."
                                required
                                maxLength={3}
                                disabled={isSaving}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3298DC]/20 focus:border-[#3298DC] text-center font-bold text-lg disabled:opacity-50 disabled:bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Khối lượng nguyên tử</label>
                            <input
                                type="text"
                                value={formData.atomicMass}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || !isNaN(Number(val))) {
                                        setFormData({ ...formData, atomicMass: val === "" ? 0 : Number(val) });
                                        setFormError("");
                                    }
                                }}
                                placeholder="VD: 1.008"
                                required
                                disabled={isSaving}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3298DC]/20 focus:border-[#3298DC] disabled:opacity-50 disabled:bg-gray-50"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên nguyên tố</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="VD: Hydrogen, Helium..."
                            required
                            disabled={isSaving}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3298DC]/20 focus:border-[#3298DC] disabled:opacity-50 disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm font-medium text-gray-700">Properties (JSON)</label>
                            <div className="flex gap-3">
                                <button type="button" onClick={loadTemplate} disabled={isSaving}
                                    className="text-xs text-[#025D9E] hover:text-[#12284B] font-medium disabled:opacity-50">
                                    Mẫu chuẩn
                                </button>
                                <button type="button" onClick={formatJson} disabled={isSaving}
                                    className="text-xs text-[#025D9E] hover:text-[#12284B] font-medium disabled:opacity-50">
                                    Format JSON
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={formData.properties}
                            onChange={(e) => { setFormData({ ...formData, properties: e.target.value }); setPropertiesError(""); }}
                            placeholder='{"group": 1, "period": 1, "category": "nonmetal"}'
                            rows={6}
                            required
                            disabled={isSaving}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3298DC]/20 focus:border-[#3298DC] font-mono text-sm disabled:opacity-50 disabled:bg-gray-50 ${propertiesError ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                        />
                        {propertiesError && <p className="text-red-500 text-xs mt-1">{propertiesError}</p>}
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={handleClose} disabled={isSaving}
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">
                            Hủy
                        </button>
                        <button type="submit" disabled={isSaving}
                            className="flex-1 px-4 py-2.5 bg-[#025D9E] text-white rounded-lg font-medium hover:bg-[#12284B] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            {isSaving && <Loader2 size={16} className="animate-spin" />}
                            {isSaving ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo nguyên tố"}
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* Close confirmation overlay */}
            {showCloseConfirm && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[60]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl w-full max-w-xs p-6 shadow-xl"
                    >
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                                <AlertTriangle size={24} className="text-amber-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bỏ thay đổi?</h3>
                            <p className="text-gray-500 text-sm mb-5">Bạn có dữ liệu chưa lưu. Bạn có chắc muốn đóng không?</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowCloseConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
                                    Tiếp tục sửa
                                </button>
                                <button onClick={onClose}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm">
                                    Bỏ thay đổi
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

// ============== DELETE MODAL ==============
interface DeleteModalProps {
    element: ElementAdmin;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
}

const DeleteModal = ({ element, onClose, onConfirm, isDeleting }: DeleteModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl"
            >
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={24} className="text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Xác nhận xóa</h2>
                    <p className="text-gray-500 mb-6">
                        Bạn có chắc chắn muốn xóa nguyên tố{" "}
                        <strong>{element.name} ({element.symbol})</strong>?
                    </p>
                    <div className="flex gap-3">
                        <button onClick={onClose} disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">
                            Hủy
                        </button>
                        <button onClick={onConfirm} disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            {isDeleting && <Loader2 size={16} className="animate-spin" />}
                            {isDeleting ? "Đang xóa..." : "Xóa"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// ============== HELPERS ==============
const parseProperties = (props: ElementProperties | string): ElementProperties => {
    if (typeof props === "object" && props !== null) {
        return props;
    }
    try {
        return JSON.parse(props);
    } catch {
        return {};
    }
};

const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
        "nonmetal": "bg-green-100 text-green-700",
        "noble gas": "bg-purple-100 text-purple-700",
        "noble-gas": "bg-purple-100 text-purple-700",
        "alkali metal": "bg-red-100 text-red-700",
        "alkali-metal": "bg-red-100 text-red-700",
        "alkaline earth metal": "bg-orange-100 text-orange-700",
        "alkaline-earth": "bg-orange-100 text-orange-700",
        "metalloid": "bg-teal-100 text-teal-700",
        "halogen": "bg-yellow-100 text-yellow-700",
        "metal": "bg-blue-100 text-blue-700",
        "transition metal": "bg-pink-100 text-pink-700",
        "transition-metal": "bg-pink-100 text-pink-700",
        "post-transition metal": "bg-indigo-100 text-indigo-700",
        "post-transition": "bg-indigo-100 text-indigo-700",
        "lanthanide": "bg-cyan-100 text-cyan-700",
        "actinide": "bg-amber-100 text-amber-700",
        "unknown-properties": "bg-gray-100 text-gray-500",
    };
    return colors[category?.toLowerCase()] || "bg-gray-100 text-gray-700";
};

// ============== MAIN COMPONENT ==============
const AdminElements = () => {
    const [elements, setElements] = useState<ElementAdmin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingElement, setEditingElement] = useState<ElementAdmin | null>(null);
    const [deletingElement, setDeletingElement] = useState<ElementAdmin | null>(null);
    const [viewingElement, setViewingElement] = useState<ElementAdmin | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch elements
    const fetchElements = async () => {
        const data = await getAllElements();
        setElements(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchElements();
    }, []);

    // Filter elements with search + category
    const filteredElements = useMemo(() => {
        let result = elements;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter((el) => {
                const props = parseProperties(el.properties);
                const category = props.category || "";
                return (
                    el.symbol.toLowerCase().includes(q) ||
                    el.name.toLowerCase().includes(q) ||
                    el.id.toString().includes(q) ||
                    category.toLowerCase().includes(q)
                );
            });
        }
        if (categoryFilter) {
            result = result.filter((el) => {
                const props = parseProperties(el.properties);
                return props.category?.toLowerCase() === categoryFilter.toLowerCase();
            });
        }
        return result;
    }, [elements, searchQuery, categoryFilter]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredElements.length / ITEMS_PER_PAGE));
    const paginatedElements = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredElements.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredElements, currentPage]);

    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, categoryFilter]);

    // Handle create
    const handleCreate = async (data: CreateElementForm): Promise<boolean> => {
        const success = await createElement(data);
        if (success) {
            await fetchElements();
            setShowCreateModal(false);
        }
        return success;
    };

    // Handle update
    const handleUpdate = async (data: UpdateElementForm, id?: number): Promise<boolean> => {
        if (id !== undefined) {
            const success = await updateElement(id, data);
            if (success) {
                await fetchElements();
                setEditingElement(null);
            }
            return success;
        }
        return false;
    };

    // Handle delete
    const handleDelete = async () => {
        if (!deletingElement) return;
        setIsDeleting(true);
        try {
            const success = await deleteElement(deletingElement.id);
            if (success) {
                await fetchElements();
                setDeletingElement(null);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle save (create or update)
    const handleSave = async (data: CreateElementForm | UpdateElementForm, id?: number): Promise<boolean> => {
        if (id !== undefined) {
            return await handleUpdate(data, id);
        } else {
            return await handleCreate(data);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-120px)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#3298DC] border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#12284B] font-space">Quản lý nguyên tố</h1>
                    <p className="text-[#475569] mt-1 font-lexend">
                        Quản lý các nguyên tố hóa học · {elements.length} nguyên tố
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#025D9E] text-white rounded-lg font-medium hover:bg-[#12284B] transition-colors"
                >
                    <Plus size={18} />
                    Thêm nguyên tố
                </button>
            </div>

            {/* Search + Category Filter */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm theo ký hiệu, tên, ID hoặc phân loại..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3298DC]/20 focus:border-[#3298DC]"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3298DC]/20 focus:border-[#3298DC] bg-white text-sm appearance-none cursor-pointer min-w-[180px]"
                        >
                            {CATEGORY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {(searchQuery || categoryFilter) && (
                    <p className="text-xs text-gray-400 mt-2">
                        Hiển thị {filteredElements.length} / {elements.length} nguyên tố
                    </p>
                )}
            </div>

            {/* Elements Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ký hiệu</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Khối lượng</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phân loại</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedElements.map((el) => {
                                const props = parseProperties(el.properties);
                                const category = props.category || "—";
                                const colorHex = props.color_hex || "#6366f1";
                                return (
                                    <tr
                                        key={el.id}
                                        className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                                        onClick={() => setViewingElement(el)}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{el.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-sm"
                                                    style={{ backgroundColor: colorHex }}
                                                >
                                                    {el.symbol}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-900 group-hover:text-[#025D9E] transition-colors">{el.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 font-mono">{el.atomicMass}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                                                {category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setViewingElement(el); }}
                                                    className="p-2 text-[#025D9E] bg-[#E6F4FF] hover:bg-[#B6DCFE]/40 rounded-lg transition-all"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setEditingElement(el); }}
                                                    className="p-2 hover:bg-[#E6F4FF] rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit size={16} className="text-gray-400 group-hover:text-[#025D9E]" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setDeletingElement(el); }}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={16} className="text-gray-400 group-hover:text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredElements.length === 0 && (
                    <div className="p-12 text-center">
                        <Atom size={48} className="text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                            {searchQuery || categoryFilter
                                ? "Không tìm thấy nguyên tố phù hợp"
                                : "Chưa có nguyên tố nào"}
                        </p>
                    </div>
                )}

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredElements.length}
                    itemName="nguyên tố"
                />
            </div>

            {/* Modals */}
            {viewingElement && (
                <ViewElementModal
                    element={viewingElement}
                    onClose={() => setViewingElement(null)}
                />
            )}
            {showCreateModal && (
                <ElementModal onClose={() => setShowCreateModal(false)} onSave={handleSave} />
            )}
            {editingElement && (
                <ElementModal element={editingElement} onClose={() => setEditingElement(null)} onSave={handleSave} />
            )}
            {deletingElement && (
                <DeleteModal
                    element={deletingElement}
                    onClose={() => setDeletingElement(null)}
                    onConfirm={handleDelete}
                    isDeleting={isDeleting}
                />
            )}
        </div>
    );
};

export default AdminElements;
