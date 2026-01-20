import type { EquipmentItem } from '../types/equipment';

/**
 * Equipment registry - Danh sách tất cả công cụ, chất, dụng cụ thí nghiệm
 * Dễ mở rộng: chỉ cần thêm item mới vào danh sách
 */

export const EQUIPMENT_REGISTRY: EquipmentItem[] = [
  // Containers
  {
    id: 'beaker-150ml',
    name: 'Cốc thủy tinh 150ml',
    category: 'containers',
    modelPath: '/models/150ml-beaker.glb',
    mass: 0.15,
    isDraggable: true,
    dimensions: { width: 0.06, height: 0.08, depth: 0.06 },
    description: 'Cốc đo thể tích 150ml',
  },
  {
    id: 'beaker-250ml',
    name: 'Cốc thủy tinh 250ml',
    category: 'containers',
    modelPath: '/models/250ml-beaker.glb',
    mass: 0.2,
    isDraggable: true,
    dimensions: { width: 0.07, height: 0.1, depth: 0.07 },
    description: 'Cốc đo thể tích 250ml',
  },
  {
    id: 'beaker-500ml',
    name: 'Bình tam giác 500ml',
    category: 'containers',
    modelPath: '/models/500ml-binhtamgiac.glb',
    mass: 0.25,
    isDraggable: true,
    dimensions: { width: 0.08, height: 0.12, depth: 0.08 },
    description: 'Bình tam giác 500ml',
  },
  {
    id: 'flask-round',
    name: 'Bình tròn đáy phẳng',
    category: 'containers',
    modelPath: '/models/binhtron.glb',
    mass: 0.25,
    isDraggable: true,
    dimensions: { width: 0.08, height: 0.12, depth: 0.08 },
    description: 'Bình tròn đáy phẳng',
  },
  {
    id: 'test-tube',
    name: 'Ống nghiệm',
    category: 'containers',
    modelPath: '/models/duathuytinh.glb',
    mass: 0.05,
    isDraggable: true,
    dimensions: { width: 0.02, height: 0.15, depth: 0.02 },
    description: 'Ống nghiệm tiêu chuẩn',
  },

  // Tools
  {
    id: 'thermometer',
    name: 'Nhiệt kế',
    category: 'tools',
    modelPath: '/models/decodinhongnghiem.glb',
    mass: 0.02,
    isDraggable: true,
    dimensions: { width: 0.005, height: 0.3, depth: 0.005 },
    description: 'Đo nhiệt độ',
  },
  {
    id: 'dropper',
    name: 'Pipet nhỏ giọt',
    category: 'tools',
    modelPath: '/models/pippet.glb',
    mass: 0.03,
    isDraggable: true,
    dimensions: { width: 0.01, height: 0.12, depth: 0.01 },
    description: 'Nhỏ giọt chất lỏng',
  },
  {
    id: 'funnel',
    name: 'Phễu',
    category: 'tools',
    modelPath: '/models/pheu.glb',
    mass: 0.03,
    isDraggable: true,
    dimensions: { width: 0.08, height: 0.1, depth: 0.08 },
    description: 'Phễu đổ chất lỏng',
  },
  {
    id: 'alcohol-lamp',
    name: 'Đèn cồn',
    category: 'tools',
    modelPath: '/models/dencon.glb',
    mass: 0.1,
    isDraggable: true,
    dimensions: { width: 0.06, height: 0.1, depth: 0.06 },
    description: 'Đèn đốt bằng cồn',
  },
  {
    id: 'iron-ring',
    name: 'Vòng kẹp sắt',
    category: 'tools',
    modelPath: '/models/khaydungong.glb',
    mass: 0.2,
    isDraggable: true,
    dimensions: { width: 0.15, height: 0.15, depth: 0.15 },
    description: 'Vòng kẹp để đỡ thiết bị',
  },
  {
    id: 'cap-connector',
    name: 'Nắp/kết nối',
    category: 'tools',
    modelPath: '/models/napdencon.glb',
    mass: 0.05,
    isDraggable: true,
    dimensions: { width: 0.03, height: 0.03, depth: 0.03 },
    description: 'Nắp hoặc kết nối ống',
  },
  {
    id: 'filter-paper',
    name: 'Giấy lọc',
    category: 'tools',
    modelPath: '/models/nen.glb',
    mass: 0.01,
    isDraggable: true,
    dimensions: { width: 0.1, height: 0.001, depth: 0.1 },
    description: 'Giấy lọc dùng trong phòng thí nghiệm',
  },
];

/**
 * Group equipment by category
 */
export const getEquipmentByCategory = (category: EquipmentItem['category']): EquipmentItem[] => {
  return EQUIPMENT_REGISTRY.filter((item) => item.category === category);
};

/**
 * Get equipment item by ID
 */
export const getEquipmentById = (id: string): EquipmentItem | undefined => {
  return EQUIPMENT_REGISTRY.find((item) => item.id === id);
};

/**
 * Get all unique categories
 */
export const getAllCategories = (): EquipmentItem['category'][] => {
  const categories = new Set(EQUIPMENT_REGISTRY.map((item) => item.category));
  return Array.from(categories);
};
