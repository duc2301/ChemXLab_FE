import {
    Check,
    Edit,
    Package as PackageIcon,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { CreatePackageForm, PackageAdmin, UpdatePackageForm } from "../../../entities/Admin";
import {
    createPackage,
    deletePackage,
    getAllPackagesAdmin,
    updatePackage,
} from "../../../features/Admin";

// Format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};

// Package Modal
interface PackageModalProps {
    pkg?: PackageAdmin;
    onClose: () => void;
    onSave: (data: CreatePackageForm | UpdatePackageForm, id?: number) => void;
}

const PackageModal = ({ pkg, onClose, onSave }: PackageModalProps) => {
    const isEditing = !!pkg;
    const [formData, setFormData] = useState<CreatePackageForm>({
        name: pkg?.name || "",
        price: pkg?.price || 0,
        durationDays: pkg?.durationDays || 30,
        features: pkg?.features || [""],
    });

    const handleAddFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ""] });
    };

    const handleRemoveFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index),
        });
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanedFeatures = formData.features.filter((f) => f.trim() !== "");
        const data = {
            name: formData.name,
            price: formData.price,
            durationDays: formData.durationDays,
            features: cleanedFeatures,
        };

        onSave(data, isEditing ? pkg?.id : undefined);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isEditing ? "Chỉnh sửa gói" : "Tạo gói mới"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên gói</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="VD: Gói Premium"
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá (VNĐ)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                min="0"
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Thời hạn (ngày)</label>
                            <input
                                type="number"
                                value={formData.durationDays}
                                onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                                min="0"
                                required
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Tính năng</label>
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                            >
                                <Plus size={16} />
                                Thêm
                            </button>
                        </div>
                        <div className="space-y-2">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        placeholder="Nhập tính năng..."
                                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                    />
                                    {formData.features.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFeature(index)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X size={18} className="text-red-500" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            {isEditing ? "Lưu thay đổi" : "Tạo gói"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Delete Confirmation Modal
interface DeleteModalProps {
    pkg: PackageAdmin;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteModal = ({ pkg, onClose, onConfirm }: DeleteModalProps) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={24} className="text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Xác nhận xóa</h2>
                    <p className="text-gray-500 mb-6">
                        Bạn có chắc chắn muốn xóa gói <strong>{pkg.name}</strong>?
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminPackages = () => {
    const [packages, setPackages] = useState<PackageAdmin[]>([]);
    const [filteredPackages, setFilteredPackages] = useState<PackageAdmin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState<PackageAdmin | null>(null);
    const [deletingPackage, setDeletingPackage] = useState<PackageAdmin | null>(null);

    // Fetch packages
    const fetchPackages = async () => {
        const data = await getAllPackagesAdmin();
        setPackages(data);
        setFilteredPackages(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    // Filter packages
    useEffect(() => {
        if (searchQuery) {
            setFilteredPackages(
                packages.filter((pkg) =>
                    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setFilteredPackages(packages);
        }
    }, [packages, searchQuery]);

    // Handle create package
    const handleCreatePackage = async (data: CreatePackageForm) => {
        const success = await createPackage(data);
        if (success) {
            await fetchPackages();
            setShowCreateModal(false);
        }
    };

    // Handle update package
    const handleUpdatePackage = async (data: UpdatePackageForm, id?: number) => {
        if (id !== undefined) {
            const success = await updatePackage(id, data);
            if (success) {
                await fetchPackages();
                setEditingPackage(null);
            }
        }
    };

    // Handle delete package
    const handleDeletePackage = async () => {
        if (!deletingPackage) return;
        const success = await deletePackage(deletingPackage.id);
        if (success) {
            await fetchPackages();
            setDeletingPackage(null);
        }
    };

    // Handle save (create or update)
    const handleSave = async (data: CreatePackageForm | UpdatePackageForm, id?: number) => {
        if (id !== undefined) {
            await handleUpdatePackage(data, id);
        } else {
            await handleCreatePackage(data);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-120px)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
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
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý gói</h1>
                    <p className="text-gray-500 mt-1">Quản lý các gói dịch vụ</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={18} />
                    Tạo gói mới
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên gói..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                    <div
                        key={pkg.id}
                        className="bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent transition-all hover:shadow-md hover:border-indigo-100"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <PackageIcon size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                                    <p className="text-sm text-gray-500">ID: {pkg.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                            <p className="text-3xl font-bold text-gray-900">
                                {pkg.price === 0 ? "Miễn phí" : formatCurrency(pkg.price)}
                            </p>
                            <p className="text-sm text-gray-500">
                                {pkg.durationDays === 0 ? "Theo hợp đồng" : `${pkg.durationDays} ngày`}
                            </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-2 mb-6 max-h-32 overflow-y-auto">
                            {pkg.features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-600">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditingPackage(pkg)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                <Edit size={16} />
                                Sửa
                            </button>
                            <button
                                onClick={() => setDeletingPackage(pkg)}
                                className="px-4 py-2.5 border border-red-200 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredPackages.length === 0 && (
                <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
                    <PackageIcon size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Không có gói nào</p>
                </div>
            )}

            {/* Modals */}
            {showCreateModal && (
                <PackageModal onClose={() => setShowCreateModal(false)} onSave={handleSave} />
            )}
            {editingPackage && (
                <PackageModal
                    pkg={editingPackage}
                    onClose={() => setEditingPackage(null)}
                    onSave={handleSave}
                />
            )}
            {deletingPackage && (
                <DeleteModal
                    pkg={deletingPackage}
                    onClose={() => setDeletingPackage(null)}
                    onConfirm={handleDeletePackage}
                />
            )}
        </div>
    );
};

export default AdminPackages;
