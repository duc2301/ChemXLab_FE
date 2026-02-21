import { 
  CheckSquare, 
  Edit, 
  FlaskConical, 
  Plus, 
  Search, 
  Square, 
  Trash2, 
  Upload, 
  X,
  Box 
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  createChemical,
  deleteChemical,
  getAllChemicals,
  updateChemical,
  uploadFile 
} from "../../../features/Admin";
import type {
  ChemicalAdmin,
  CreateChemicalForm,
} from "../../../entities/Admin";

// --- Types ---
interface MolecularDataState {
  color_hex: string;
  flammable: boolean;
  density?: string;
  melting_point?: string;
  boiling_point?: string;
  description?: string;
}

const AdminChemicalsPage = () => {
  // --- MẸO FIX LỖI TYPESCRIPT: Gán thẻ tag thành biến any ---
  // TypeScript sẽ bỏ qua kiểm tra lỗi cho biến này
  const ModelViewer = "model-viewer" as any;

  // --- State ---
  const [chemicals, setChemicals] = useState<ChemicalAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- Form State ---
  const [formData, setFormData] = useState({
    formula: "",
    commonName: "",
    iupacName: "",
    stateAtRoomTemp: "LIQUID",
    structure3dUrl: "",
    isPublic: true,
  });

  const [molData, setMolData] = useState<MolecularDataState>({
    color_hex: "#FFFFFF",
    flammable: false,
    density: "",
    melting_point: "",
    boiling_point: "",
    description: ""
  });

  // --- Helper: Parse dữ liệu an toàn ---
  const getSafeMolData = (data: any): MolecularDataState => {
    let parsed: any = {};
    try {
      if (!data) {
        parsed = {};
      } else if (Array.isArray(data)) {
        if (data.length > 0) {
          const firstItem = data[0];
          parsed = typeof firstItem === 'string' ? JSON.parse(firstItem) : firstItem;
        }
      } else if (typeof data === 'string') {
        try {
          parsed = JSON.parse(data);
          if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        } catch { parsed = {}; }
      } else if (typeof data === 'object') {
        parsed = data;
      }
    } catch (error) {
      console.error("Lỗi parse JSON:", error);
      parsed = {};
    }

    return {
      color_hex: parsed.color_hex || parsed.Color_hex || "#FFFFFF",
      flammable: parsed.flammable || parsed.Flammable || false,
      density: parsed.density || parsed.Density || "",
      melting_point: parsed.melting_point || parsed.Melting_point || "",
      boiling_point: parsed.boiling_point || parsed.Boiling_point || "",
      description: parsed.description || parsed.Description || ""
    };
  };

  // --- Fetch Data ---
  const fetchChemicals = async () => {
    setLoading(true);
    try {
      const data = await getAllChemicals();
      setChemicals(data || []);
    } catch (error) {
      console.error("Failed to fetch chemicals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChemicals();
  }, []);

  // --- Handlers ---
  const handleOpenModal = (chem?: ChemicalAdmin) => {
    if (chem) {
      setEditingId(chem.id);
      setFormData({
        formula: chem.formula,
        commonName: chem.commonName || "",
        iupacName: chem.iupacName || "",
        stateAtRoomTemp: chem.stateAtRoomTemp || "LIQUID",
        structure3dUrl: chem.structure3dUrl || "",
        isPublic: chem.isPublic,
      });
      setMolData(getSafeMolData(chem.molecularData));
    } else {
      setEditingId(null);
      setFormData({
        formula: "",
        commonName: "",
        iupacName: "",
        stateAtRoomTemp: "LIQUID",
        structure3dUrl: "",
        isPublic: true,
      });
      setMolData({
        color_hex: "#FFFFFF",
        flammable: false,
        density: "",
        melting_point: "",
        boiling_point: "",
        description: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['glb', 'gltf', 'usdz'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !validExtensions.includes(fileExt)) {
      alert("Chỉ chấp nhận file .glb, .gltf hoặc .usdz");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert("File quá lớn! Vui lòng chọn file < 20MB.");
      return;
    }

    setIsUploading(true);
    const url = await uploadFile(file);
    setIsUploading(false);

    if (url) {
      setFormData(prev => ({ ...prev, structure3dUrl: url }));
      e.target.value = ''; 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalMolecularData = { ...molData };
    
    const payload: CreateChemicalForm = {
      ...formData,
      molecularData: finalMolecularData,
      isPublic: formData.isPublic,
    };

    let success = false;
    let result: any = null;

    if (editingId) {
      result = await updateChemical(editingId, payload);
      success = !!result; 
    } else {
      result = await createChemical(payload);
      success = !!result;
    }

    if (success) {
      setIsModalOpen(false);
      if (editingId) {
        setChemicals(prev => prev.map(c => 
          c.id === editingId 
            ? { ...c, ...payload, molecularData: finalMolecularData } 
            : c
        ));
      } else {
        fetchChemicals();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hóa chất này?")) {
      const success = await deleteChemical(id);
      if (success) fetchChemicals();
    }
  };

  const filteredList = chemicals
    .filter(
      (c) =>
        c.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.commonName && c.commonName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => a.formula.localeCompare(b.formula));

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FlaskConical className="text-indigo-600" /> Quản lý Hóa chất
          </h1>
          <p className="text-gray-500 text-sm mt-1">Danh sách nguyên tố và hợp chất hóa học.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md"
        >
          <Plus size={18} /> Thêm Hóa chất
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo công thức hoặc tên..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4 border-b border-gray-100">Công thức</th>
                <th className="p-4 border-b border-gray-100">Tên thông thường</th>
                <th className="p-4 border-b border-gray-100">Trạng thái</th>
                <th className="p-4 border-b border-gray-100 text-center">Mô hình</th>
                <th className="p-4 border-b border-gray-100 text-center">Màu sắc</th>
                <th className="p-4 border-b border-gray-100">Hiển thị</th>
                <th className="p-4 border-b border-gray-100 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      Đang tải...
                    </div>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">Không tìm thấy dữ liệu.</td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const safeMolData = getSafeMolData(item.molecularData);
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-4 font-bold text-indigo-900">{item.formula}</td>
                      <td className="p-4 text-gray-700">{item.commonName || "-"}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold 
                          ${item.stateAtRoomTemp === "GAS" ? "bg-pink-100 text-pink-700" : 
                            item.stateAtRoomTemp === "LIQUID" ? "bg-blue-100 text-blue-700" : 
                            "bg-gray-200 text-gray-700"}`}>
                          {item.stateAtRoomTemp}
                        </span>
                      </td>
                      
                      {/* --- Cột Mô hình 3D --- */}
                      <td className="p-4 text-center">
                        {item.structure3dUrl ? (
                          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
                            {/* DÙNG THẺ ModelViewer (Biến any) thay vì model-viewer */}
                            <ModelViewer
                              src={item.structure3dUrl}
                              disable-zoom
                              auto-rotate
                              loading="lazy"
                              style={{ width: '100%', height: '100%' }}
                            ></ModelViewer>
                            <a href={item.structure3dUrl} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" title="Mở file gốc"></a>
                          </div>
                        ) : (
                          <div className="w-12 h-12 mx-auto flex items-center justify-center text-gray-300">
                            <Box size={20} />
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        <div 
                          className="w-6 h-6 rounded-full border border-gray-300 shadow-sm mx-auto"
                          style={{ backgroundColor: safeMolData.color_hex }}
                          title={safeMolData.color_hex}
                        />
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${item.isPublic ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {item.isPublic ? "Công khai" : "Ẩn"}
                        </span>
                      </td>
                      <td className="p-4 flex justify-center gap-2">
                        <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "Cập nhật Hóa chất" : "Thêm Hóa chất mới"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Công thức *</label>
                  <input required type="text" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.formula} onChange={(e) => setFormData({ ...formData, formula: e.target.value })} placeholder="VD: H2O" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên thông thường</label>
                  <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.commonName} onChange={(e) => setFormData({ ...formData, commonName: e.target.value })} placeholder="VD: Nước" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên IUPAC</label>
                  <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.iupacName} onChange={(e) => setFormData({ ...formData, iupacName: e.target.value })} placeholder="VD: Oxidane" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={formData.stateAtRoomTemp} onChange={(e) => setFormData({ ...formData, stateAtRoomTemp: e.target.value })}>
                    <option value="SOLID">Rắn (Solid)</option>
                    <option value="LIQUID">Lỏng (Liquid)</option>
                    <option value="GAS">Khí (Gas)</option>
                    <option value="PLASMA">Plasma</option>
                  </select>
                </div>
              </div>

              {/* Upload 3D trong Modal */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <label className="block text-sm font-medium text-blue-800 mb-2">Mô hình 3D (USDZ/GLB)</label>
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input type="text" placeholder="URL file..." 
                      className="w-full p-2.5 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                      value={formData.structure3dUrl} onChange={(e) => setFormData({ ...formData, structure3dUrl: e.target.value })} />
                  </div>
                  <label className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm ${isUploading ? 'opacity-70' : ''}`}>
                    {isUploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload size={18} />}
                    <span className="text-sm font-medium whitespace-nowrap">Upload</span>
                    <input type="file" className="hidden" accept=".glb,.gltf,.usdz" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                </div>
                {/* Preview to trong Modal */}
                {formData.structure3dUrl && (
                  <div className="mt-3 h-40 bg-white rounded border border-gray-200 overflow-hidden relative">
                     {/* DÙNG THẺ ModelViewer (Biến any) */}
                     <ModelViewer
                        src={formData.structure3dUrl}
                        camera-controls
                        auto-rotate
                        style={{ width: '100%', height: '100%' }}
                     ></ModelViewer>
                  </div>
                )}
              </div>

              {/* Molecular Data Form */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-200 pb-2">Thuộc tính hóa học</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Màu sắc đặc trưng</label>
                    <div className="flex items-center gap-3">
                      <input type="color" className="w-10 h-10 rounded cursor-pointer border-0 p-0 shadow-sm"
                        value={molData.color_hex} onChange={(e) => setMolData({...molData, color_hex: e.target.value})} />
                      <span className="text-sm text-gray-600 font-mono bg-white px-2 py-1 rounded border border-gray-200">{molData.color_hex}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-0 sm:pt-4">
                    <button type="button" onClick={() => setMolData({...molData, flammable: !molData.flammable})}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all shadow-sm ${molData.flammable ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-300 text-gray-600'}`}>
                      {molData.flammable ? <CheckSquare size={18} /> : <Square size={18} />}
                      <span className="text-sm font-medium">Dễ cháy (Flammable)</span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Khối lượng riêng (g/cm3)" className="w-full p-2 border border-gray-300 rounded text-sm outline-none"
                    value={molData.density} onChange={(e) => setMolData({...molData, density: e.target.value})} />
                  <input type="text" placeholder="Điểm nóng chảy (°C)" className="w-full p-2 border border-gray-300 rounded text-sm outline-none"
                    value={molData.melting_point} onChange={(e) => setMolData({...molData, melting_point: e.target.value})} />
                  <input type="text" placeholder="Điểm sôi (°C)" className="w-full p-2 border border-gray-300 rounded text-sm outline-none"
                    value={molData.boiling_point} onChange={(e) => setMolData({...molData, boiling_point: e.target.value})} />
                </div>
                <textarea rows={2} className="w-full p-2 border border-gray-300 rounded text-sm outline-none" placeholder="Thông tin bổ sung..."
                  value={molData.description} onChange={(e) => setMolData({...molData, description: e.target.value})} />
              </div>

              {/* Public */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <input type="checkbox" id="isPublic" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300 cursor-pointer"
                  checked={formData.isPublic} onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })} />
                <label htmlFor="isPublic" className="text-sm font-medium text-gray-700 cursor-pointer select-none">Công khai</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors font-medium shadow-sm">Hủy bỏ</button>
                <button type="submit" disabled={isUploading} className={`px-5 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium shadow-md ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {editingId ? "Lưu thay đổi" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChemicalsPage;