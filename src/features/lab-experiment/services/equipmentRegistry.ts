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
    scale: 4,
    rotation: { x: 0, y: 0, z: 0 }
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
    scale: 4,
    rotation: { x: 0, y: 0, z: 0 }
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
    scale: 3,
    rotation: { x: 0, y: 0, z: 0 }
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
    scale: 3,
    rotation: { x: 0, y: 0, z: 0 }
  },
  {
    id: 'test-tube',
    name: 'Ống nghiệm',
    category: 'containers',
    modelPath: '/models/ong_nghiem_init.glb',
    mass: 0.05,
    isDraggable: true,
    dimensions: { width: 0.02, height: 0.15, depth: 0.02 },
    description: 'Ống nghiệm tiêu chuẩn',
    scale: 3,
    rotation: { x: 0, y: 0, z: 0 }
  },

  // Tools
  {
    id: 'thermometer',
    name: 'Giá đỡ',
    category: 'tools',
    modelPath: '/models/decodinhongnghiem.glb',
    mass: 0.02,
    isDraggable: true,
    dimensions: { width: 0.005, height: 0.3, depth: 0.005 },
    description: 'Giá đỡ ống nghiệm',
    scale: 3,
    rotation: { x: 0, y: 0, z: 0 }
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
    scale: 4,
    rotation: { x: 0, y: 0, z: 0 }
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
    scale: 4,
    rotation: { x: 0, y: 0, z: 0 }
  },
  {
    id: 'magnet',
    name: 'Nam Châm',
    category: 'tools',
    modelPath: '/models/magnet.glb',
    mass: 0.03,
    isDraggable: true,
    dimensions: { width: 0.06, height: 0.5, depth: 0.06 },
    rotation: { x: 0, y: Math.PI / 2, z: 0 },
    description: 'Nam châm 2 cực',
    scale: 3,
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
    scale: 3,
    rotation: { x: 0, y: 0, z: 0 }
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
    scale: 3,
    rotation: { x: 0, y: 0, z: 0 }
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
    scale: 4,
    rotation: { x: 0, y: 0, z: 0 }
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
    scale: 4,
    rotation: { x: 0, y: 0, z: 0 }
  },
  {
    id: 'FE-powder',
    name: 'FE',
    category: 'substances',
    modelPath: '/models/bot_fe.glb',
    mass: 0.01,
    isDraggable: true,
    dimensions: { width: 0.1, height: 0.001, depth: 0.1 },
    description: 'Bột sắt',
    scale: 2.5,
    isMagnetic: true,
    rotation: { x: 0, y: 0, z: 0 },
    physicalState: 'powder',
  },
  {
    id: 'S-powder',
    name: 'S',
    category: 'substances',
    modelPath: '/models/bot_s.glb',
    mass: 0.01,
    isDraggable: true,
    dimensions: { width: 0.1, height: 0.001, depth: 0.1 },
    description: 'Bột lưu huỳnh',
    scale: 2.5,
    rotation: { x: 0, y: 0, z: 0 },
    physicalState: 'powder',
  },
  {
    id: 'FeS-powder',
    name: 'FeS',
    category: 'substances',
    modelPath: '/models/bot_s.glb', // Use S powder model as placeholder or same logic
    mass: 0.01,
    isDraggable: true,
    dimensions: { width: 0.1, height: 0.001, depth: 0.1 },
    description: 'Sắt(II) sulfide',
    scale: 2.5,
    isMagnetic: false,
    rotation: { x: 0, y: 0, z: 0 },
    hideInMenu: true,
    physicalState: 'powder',
  },
  {
    id: 'Zn-powder',
    name: 'Viên Zn',
    category: 'substances',
    modelPath: '/models/zn.glb',
    mass: 0.01,
    isDraggable: true,
    dimensions: { width: 0.1, height: 0.001, depth: 0.1 },
    description: 'Viên kẽm',
    rotation: { x: 0, y: 0, z: 0 },
    scale: 2.5,
    physicalState: 'solid',
    isExtractable: false,
  },
  {
    id: 'HCL-solution',
    name: 'Dung dịch HCL',
    category: 'substances',
    modelPath: '/models/HCl.glb',
    mass: 0.01,
    isDraggable: true,
    dimensions: { width: 0.1, height: 0.001, depth: 0.1 },
    description: 'Dung dịch HCl',
    scale: 2.5,
    rotation: { x: 0, y: 0, z: 0 },
    isMagnetic: false,
    physicalState: 'solution',
  },
  {
    id: 'Na2SO4-solution',
    name: 'Natri Sunfat (Na₂SO₄)',
    category: 'substances',
    modelPath: '/models/Na2SO4.glb',
    mass: 0.01,
    isDraggable: true,
    dimensions: { width: 0.1, height: 0.001, depth: 0.1 },
    description: 'Dung dịch Natri Sunfat',
    scale: 2.5,
    rotation: { x: 0, y: 0, z: 0 },
    isMagnetic: false,
    physicalState: 'solution',
  },
  {
    id: 'BaCl2-solution',
    name: 'Bari Clorua (BaCl₂)',
    category: 'substances',
    modelPath: '/models/BaCl2.glb',
    mass: 0.01,
    isDraggable: true,
    dimensions: { width: 0.1, height: 0.001, depth: 0.1 },
    description: 'Dung dịch Bari Clorua',
    scale: 2.5,
    rotation: { x: 0, y: 0, z: 0 },
    isMagnetic: false,
    physicalState: 'solution',
  },
];

export const EQUIPMENT_IDS = {
  BEAKER_150ML: "beaker-150ml",
  BEAKER_250ML: "beaker-250ml",
  BEAKER_500ML: "beaker-500ml",
  FLASK_ROUND: "flask-round",
  TEST_TUBE: "test-tube",
  THERMOMETER: "thermometer",
  DROPPER: "dropper",
  FUNNEL: "funnel",
  ALCOHOL_LAMP: "alcohol-lamp",
  MAGNET: "magnet",
  IRON_RING: "iron-ring",
  CAP_CONNECTOR: "cap-connector",
  FILTER_PAPER: "filter-paper",
  FE_POWDER: "FE-powder",
  S_POWDER: "S-powder",
  FES_POWDER: "FeS-powder",
  ZN_POWDER: "Zn-powder",
  HCL_SOLUTION: "HCL-solution",
  Na2SO4_SOLUTION: "Na2SO4-solution",
  BaCl2_SOLUTION: "BaCl2-solution",
};

export interface GuideStep {
  icon?: string;
  title: string;
  content: string;
  tip?: string;
}

export interface GuideObservation {
  question: string;
  answer: string;
}

export interface GuideData {
  reference: string;
  title: string;
  subtitle: string;
  equation: string;
  objective: string;
  steps: GuideStep[];
  observations: GuideObservation[];
  safetyNotes: string[];
}

export interface GuidedExperiment {
  id: string;
  name: string;
  description: string;
  equipment: { id: string; position: number[]; rotation: number[] }[];
  guide?: GuideData;
}

export const GUIDED_EXPERIMENTS: GuidedExperiment[] = [
  {
    id: 'Fe_S',
    name: 'Điều chế Fe + S → FeS',
    description: 'description',
    equipment: [
      { id: EQUIPMENT_IDS.MAGNET, position: [-1, 1.5, 0], rotation: [0, Math.PI / 2, 0] },
      { id: EQUIPMENT_IDS.ALCOHOL_LAMP, position: [-0.5, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.TEST_TUBE, position: [0, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.THERMOMETER, position: [0.5, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.FE_POWDER, position: [1, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.S_POWDER, position: [1.5, 1.5, 0], rotation: [0, 0, 0] },
    ]
  },
  {
    id: 'HCl_Zn',
    name: 'Điều chế Axit Clohidric (HCl) + Kẽm (Zn)',
    description: 'description',
    equipment: [
      { id: EQUIPMENT_IDS.TEST_TUBE, position: [-0.5, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.HCL_SOLUTION, position: [0, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.ZN_POWDER, position: [0.5, 1.5, 0], rotation: [0, 0, 0] },
    ]
  },
  {
    id: 'BaCl2_Na2SO4',
    name: 'Định luật bảo toàn khối lượng (BaCl2 + Na2SO4)',
    description: 'Thí nghiệm phản ứng giữa BaCl₂ và Na₂SO₄ để chứng minh tổng khối lượng không đổi.',
    equipment: [
      { id: EQUIPMENT_IDS.TEST_TUBE, position: [-0.5, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.THERMOMETER, position: [0, 1.5, 0], rotation: [0, 0, 0] },
      // { id: EQUIPMENT_IDS.BaCl2_SOLUTION, position: [0.5, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.Na2SO4_SOLUTION, position: [1, 1.5, 0], rotation: [0, 0, 0] },
    ]
  },
    ],
    guide: {
      title: 'Thí nghiệm về biến đổi hoá học',
      subtitle: 'Điều chế Sắt(II) sunfua (FeS)',
      reference: 'SGK Khoa học tự nhiên 8 – Kết nối tri thức – Bài 2',
      equation: 'Fe (rắn) + S (rắn) → FeS (rắn)',
      objective: 'Quan sát hiện tượng phản ứng hoá học giữa sắt và lưu huỳnh, nhận biết sự hình thành chất mới thông qua các dấu hiệu.',
      materials: [
        'Bột sắt (Fe) và bột lưu huỳnh (S) – tỉ lệ 7:4 về khối lượng',
        'Ống nghiệm chịu nhiệt (2 ống)',
        'Đèn cồn',
        'Giá đỡ ống nghiệm (kẹp)',
        'Nam châm',
      ],
      steps: [
        {
          title: 'Bước 1: Chuẩn bị hỗn hợp',
          content: 'Trộn đều bột sắt (Fe) và bột lưu huỳnh (S) theo tỉ lệ 7:4 về khối lượng. Khuấy đều cho đến khi hỗn hợp đồng nhất.',
          tip: 'Click chuột phải vào lọ bột Fe → Lấy 7g. Click chuột phải lọ S → Lấy 4g. Đổ lần lượt vào ống nghiệm.',
          icon: '🧪',
        },
        {
          title: 'Bước 2: Chia vào 2 ống nghiệm',
          content: 'Lần lượt cho hỗn hợp vào hai ống nghiệm (1) và (2), mỗi ống 3 thìa hỗn hợp.',
          tip: 'Trong mô phỏng này, bạn chỉ cần đổ vào 1 ống nghiệm và khuấy trộn.',
          icon: '🔬',
        },
        {
          title: 'Bước 3: Kiểm tra bằng nam châm (trước phản ứng)',
          content: 'Đưa nam châm lại gần ống nghiệm (1). Quan sát: bột sắt có tính nhiễm từ nên bị nam châm hút → chứng tỏ sắt chưa thay đổi tính chất.',
          tip: 'Kéo nam châm lại gần ống nghiệm có bột Fe+S chưa đun → quan sát hiện tượng hút.',
          icon: '🧲',
        },
        {
          title: 'Bước 4: Đun nóng ống nghiệm (2)',
          content: 'Dùng kẹp giữ ống nghiệm (2), đun nóng mạnh đáy ống trên ngọn lửa đèn cồn khoảng 30 giây rồi ngừng đun. Phản ứng Fe + S tỏa nhiệt mạnh, sẽ tự tiếp tục diễn ra.',
          tip: 'Click chuột phải vào đèn cồn → Thắp lửa. Kéo ống nghiệm đã trộn bột lại gần đèn cồn.',
          icon: '🔥',
        },
        {
          title: 'Bước 5: Kiểm tra sản phẩm (sau phản ứng)',
          content: 'Để ống nghiệm nguội hoàn toàn. Đưa nam châm lại gần chất rắn mới tạo thành. Quan sát: Sản phẩm FeS KHÔNG bị nam châm hút → đã có chất mới sinh ra!',
          tip: 'Kéo nam châm lại gần ống nghiệm sau phản ứng → sản phẩm FeS không bị hút.',
          icon: '✅',
        },
      ],
      observations: [
        { question: 'Sau khi trộn bột sắt và bột lưu huỳnh, hỗn hợp thu được có bị nam châm hút không?', answer: 'Có – bột sắt vẫn giữ tính nhiễm từ.' },
        { question: 'Chất trong ống nghiệm (2) sau khi được đun nóng và để nguội có bị nam châm hút không?', answer: 'Không – sản phẩm FeS không có tính nhiễm từ.' },
        { question: 'Sau khi trộn bột sắt và bột lưu huỳnh, có chất mới được tạo thành không?', answer: 'Chưa – chỉ là hỗn hợp vật lý, chưa xảy ra phản ứng hoá học.' },
        { question: 'Sau khi đun nóng hỗn hợp bột sắt và bột lưu huỳnh, có chất mới được tạo thành không?', answer: 'Có – chất rắn màu đen xám (FeS) có tính chất khác hẳn Fe và S.' },
      ],
      safetyNotes: [
        'Đeo kính bảo hộ và găng tay trong suốt quá trình.',
        'Thực hiện ở nơi thông thoáng (có thể sinh khí SO₂ độc).',
        'Không chạm trực tiếp vào ống nghiệm nóng.',
        'Phản ứng tỏa nhiệt rất mạnh – cẩn thận tránh bỏng.',
      ],
    }
  }
];

/** Màu hiển thị tương ứng với từng chất bột */
export const SUBSTANCE_COLORS: Record<string, string> = {
  "FE-powder": "#9ca3af",  // xám bạc (bột sắt)
  "S-powder": "#fef08a",  // vàng nhạt hơn (lưu huỳnh)
  "FeS-powder": "#2d2d2d", // đen/xám đậm (Sắt(II) sulfide)
  "Zn-powder": "#818cf8", // xám xanh (Kẽm)
  "HCL-solution": "#a5f3fc", // xanh cực nhạt (Axit Clohydric)
};

/**
 * Group equipment by category
 */
export const getEquipmentByCategory = (category: EquipmentItem['category']): EquipmentItem[] => {
  return EQUIPMENT_REGISTRY.filter((item) => item.category === category && !item.hideInMenu);
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
  const categories = new Set(
    EQUIPMENT_REGISTRY.filter((item) => !item.hideInMenu).map((item) => item.category),
  );
  return Array.from(categories);
};
