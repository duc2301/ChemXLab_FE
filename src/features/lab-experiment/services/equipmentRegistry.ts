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
    scale: 5,
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
    id: 'aNa2SO4-solution',
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
    hideInMenu: true,
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
    hideInMenu: true,
  },
  {
    id: 'ZnCl2-solution',
    name: 'Kẽm Clorua (ZnCl₂)',
    category: 'substances',
    modelPath: '/models/BaCl2.glb', // Placeholder model
    mass: 0.01,
    isDraggable: false,
    dimensions: { width: 0.1, height: 0.001, depth: 0.1 },
    description: 'Dung dịch Kẽm Clorua',
    scale: 2.5,
    rotation: { x: 0, y: 0, z: 0 },
    isMagnetic: false,
    physicalState: 'solution',
    hideInMenu: true,
  },
  {
    id: 'BaSO4-precipitate',
    name: 'Bari Sunfat (BaSO₄)',
    category: 'substances',
    modelPath: '/models/BaCl2.glb',
    mass: 0.01,
    isDraggable: false,
    dimensions: { width: 0.1, height: 0.001, depth: 0.1 },
    description: 'Kết tủa trắng Bari Sunfat',
    scale: 2.5,
    rotation: { x: 0, y: 0, z: 0 },
    isMagnetic: false,
    physicalState: 'solution',
    hideInMenu: true,
  },
  {
    id: 'NaCl-solution',
    name: 'Natri Clorua (NaCl)',
    category: 'substances',
    modelPath: '/models/BaCl2.glb',
    mass: 0.01,
    isDraggable: false,
    dimensions: { width: 0.1, height: 0.001, depth: 0.1 },
    description: 'Dung dịch Natri Clorua',
    scale: 2.5,
    rotation: { x: 0, y: 0, z: 0 },
    isMagnetic: false,
    physicalState: 'solution',
    hideInMenu: true,
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
  Na2SO4_SOLUTION: "aNa2SO4-solution",
  BaCl2_SOLUTION: "BaCl2-solution",
  BaSO4_PRECIPITATE: "BaSO4-precipitate",
  NACL_SOLUTION: "NaCl-solution",
  ZNCL2_SOLUTION: "ZnCl2-solution",
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
  materials: string[];
  steps: GuideStep[];
  observations: GuideObservation[];
  safetyNotes: string[];
  notes?: string[];
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
        },
        {
          title: 'Bước 2: Chia vào 2 ống nghiệm',
          content: 'Lần lượt cho hỗn hợp vào hai ống nghiệm (1) và (2), mỗi ống 3 thìa hỗn hợp.',
          tip: 'Trong mô phỏng này, bạn chỉ cần đổ vào 1 ống nghiệm và khuấy trộn.',
        },
        {
          title: 'Bước 3: Kiểm tra bằng nam châm (trước phản ứng)',
          content: 'Đưa nam châm lại gần ống nghiệm (1). Quan sát: bột sắt có tính nhiễm từ nên bị nam châm hút → chứng tỏ sắt chưa thay đổi tính chất.',
          tip: 'Kéo nam châm lại gần ống nghiệm có bột Fe+S chưa đun → quan sát hiện tượng hút.',
        },
        {
          title: 'Bước 4: Đun nóng ống nghiệm (2)',
          content: 'Dùng kẹp giữ ống nghiệm (2), đun nóng mạnh đáy ống trên ngọn lửa đèn cồn khoảng 30 giây rồi ngừng đun. Phản ứng Fe + S tỏa nhiệt mạnh, sẽ tự tiếp tục diễn ra.',
          tip: 'Click chuột phải vào đèn cồn → Thắp lửa. Kéo ống nghiệm đã trộn bột lại gần đèn cồn.',
        },
        {
          title: 'Bước 5: Kiểm tra sản phẩm (sau phản ứng)',
          content: 'Để ống nghiệm nguội hoàn toàn. Đưa nam châm lại gần chất rắn mới tạo thành. Quan sát: Sản phẩm FeS KHÔNG bị nam châm hút → đã có chất mới sinh ra!',
          tip: 'Kéo nam châm lại gần ống nghiệm sau phản ứng → sản phẩm FeS không bị hút.',
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
      notes: [
        'Hỗn hợp Fe và S cần được trộn thật đều để phản ứng xảy ra hoàn toàn.',
        'Sau khi đun nóng, hãy đợi ống nghiệm nguội hẳn trước khi đưa nam châm lại gần.',
      ],
    },
  },
  {
    id: 'HCl_Zn',
    name: 'Điều chế Axit Clohidric (HCl) + Kẽm (Zn)',
    description: 'description',
    equipment: [
      { id: EQUIPMENT_IDS.TEST_TUBE, position: [-0.75, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.THERMOMETER, position: [-0.25, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.HCL_SOLUTION, position: [0.25, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.ZN_POWDER, position: [0.75, 1.5, 0], rotation: [0, 0, 0] },
    ],
    guide: {
      title: 'Thí nghiệm: Axit Clohidric (HCl) + Kẽm (Zn)',
      subtitle: 'Phản ứng tạo ra khí Hidro (H₂)',
      reference: 'SGK Khoa học tự nhiên 8 – Kết nối tri thức',
      equation: 'Zn + 2HCl → ZnCl₂ + H₂↑',
      objective: 'Quan sát phản ứng giữa kim loại và axit, nhận biết sự thoát khí Hidro.',
      materials: [
        'Dung dịch Axit Clohidric (HCl)',
        'Kẽm viên (hoặc kẽm bột)',
        'Ống nghiệm',
        'Giá thí nghiệm',
      ],
      steps: [
        {
          title: 'Bước 1: Chuẩn bị ống nghiệm',
          content: 'Đặt ống nghiệm lên giá kẹp trên bàn thí nghiệm.',
          tip: 'Kéo ống nghiệm vào đúng vị trí của giá đỡ.',
        },
        {
          title: 'Bước 2: Cho kẽm vào ống nghiệm',
          content: 'Dùng kẹp gắp viên kẽm hoặc đổ bột kẽm vào ống nghiệm.',
          tip: 'Nên cho kẽm vào trước khi đổ axit.',
        },
        {
          title: 'Bước 3: Đổ dung dịch HCl',
          content: 'Cầm lọ HCl đổ vào ống nghiệm sao cho ngập hết kẽm.',
          tip: 'Đổ từ từ và quan sát sự thay đổi bề mặt viên kẽm.',
        },
        {
          title: 'Bước 4: Quan sát phản ứng',
          content: 'Quan sát các bọt khí nhỏ bắt đầu sủi lên từ bề mặt viên kẽm. Viên kẽm sẽ nhỏ dần theo thời gian.',
          tip: 'Phản ứng tỏa nhiệt và tạo ra khí Hidro (H₂).',
        },
      ],
      observations: [
        { question: 'Hiện tượng gì xảy ra ngay khi viên kẽm chạm vào dung dịch HCl?', answer: 'Có bọt khí xuất hiện sủi lên từ bề mặt viên kẽm.' },
        { question: 'Viên kẽm thay đổi như thế nào sau một thời gian phản ứng?', answer: 'Viên kẽm tan dần và kích thước nhỏ lại.' },
        { question: 'Khí thoát ra trong thí nghiệm này là khí gì?', answer: 'Đó là khí Hidro (H₂).' },
      ],
      safetyNotes: [
        'Axit HCl có tính ăn mòn, tránh để dính vào da hoặc mắt.',
        'Khí Hidro tạo thành dễ cháy nổ khi trộn với không khí theo tỉ lệ nhất định.',
        'Cẩn thận khi thao tác with các dụng cụ thủy tinh.',
      ],
      notes: [
        'Nếu dùng kẽm viên, phản ứng sẽ diễn ra chậm hơn và bọt khí sủi đều hơn so với kẽm bột.',
        'Có thể dùng que đốm đang cháy đưa lại gần miệng ống nghiệm để kiểm tra sự có mặt của khí H₂ (nghe tiếng nổ "póc").',
      ],
    },
  },
  {
    id: 'BaCl2_Na2SO4',
    name: 'Định luật bảo toàn khối lượng (BaCl2 + Na2SO4)',
    description: 'Thí nghiệm phản ứng giữa BaCl₂ và Na₂SO₄ để chứng minh tổng khối lượng không đổi.',
    equipment: [
      { id: EQUIPMENT_IDS.TEST_TUBE, position: [-0.4, 1.6, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.BaCl2_SOLUTION, position: [-0.8, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.Na2SO4_SOLUTION, position: [0.8, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.THERMOMETER, position: [0, 1.5, -0.4], rotation: [0, 0, 0] },
    ],
    guide: {
      title: 'Định luật bảo toàn khối lượng',
      subtitle: 'Phản ứng giữa BaCl₂ và Na₂SO₄',
      reference: 'SGK Khoa học tự nhiên 8 – Kết nối tri thức',
      equation: 'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl',
      objective: 'Quan sát phản ứng tạo kết tủa trắng và tìm hiểu về định luật bảo toàn khối lượng.',
      materials: [
        'Dung dịch Bari Clorua (BaCl₂)',
        'Dung dịch Natri Sunfat (Na₂SO₄)',
        'Ống nghiệm',
        'Giá thí nghiệm',
      ],
      steps: [
        {
          title: 'Bước 1: Chuẩn bị ống nghiệm',
          content: 'Kéo ống nghiệm vào giá kẹp trên bàn thí nghiệm.',
          tip: 'Ống nghiệm sẽ tự động khớp vào vị trí kẹp.',
        },
        {
          title: 'Bước 2: Đổ dung dịch BaCl₂',
          content: 'Cầm lọ BaCl₂ đổ vào ống nghiệm đến khoảng 1/3 ống.',
          tip: 'Dung dịch BaCl₂ có màu trong suốt.',
        },
        {
          title: 'Bước 3: Đổ dung dịch Na₂SO₄',
          content: 'Kéo lọ Na₂SO₄ lại gần miệng ống nghiệm và đổ vào.',
          tip: 'Quan sát hiện tượng kết tủa trắng (BaSO₄) xuất hiện ngay lập tức.',
        },
        {
          title: 'Bước 4: Quan sát hiện tượng',
          content: 'Quan sát sự xuất hiện của chất rắn màu trắng (kết tủa) không tan trong dung dịch.',
          tip: 'Sản phẩm tạo thành là Bari Sunfat (BaSO₄) và Natri Clorua (NaCl).',
        },
      ],
      observations: [
        { question: 'Có xuất hiện bọt khí hay kết tủa sau khi trộn hai dung dịch không?', answer: 'Có kết tủa trắng (BaSO₄) xuất hiện.' },
        { question: 'Hiện tượng này chứng tỏ điều gì?', answer: 'Chứng tỏ đã có phản ứng hóa học xảy ra tạo thành chất mới không tan.' },
      ],
      safetyNotes: [
        'BaCl₂ là hóa chất độc, tuyệt đối không được nếm hoặc hít ngửi trực tiếp.',
        'Tránh để hóa chất tiếp xúc trực tiếp với da.',
        'Sau thí nghiệm, đổ dung dịch thải vào đúng nơi quy định.',
      ],
      notes: [
        'Kết tủa BaSO₄ rất bền và không tan trong các axit thông thường.',
        'Phản ứng này là phản ứng trao đổi đặc trưng dùng để nhận biết ion sunfat (SO₄²⁻).',
      ],
    },
  },
  {
    id: 'BaCl2_HCL',
    name: 'Thí nghiệm phản ứng giữa BaCl₂ và HCl',
    description: 'Thí nghiệm phản ứng giữa BaCl₂ và HCl không xảy ra.',
    equipment: [
      { id: EQUIPMENT_IDS.TEST_TUBE, position: [-0.75, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.THERMOMETER, position: [-0.25, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.HCL_SOLUTION, position: [0.25, 1.5, 0], rotation: [0, 0, 0] },
      { id: EQUIPMENT_IDS.BaCl2_SOLUTION, position: [0.75, 1.5, 0], rotation: [0, 0, 0] },
    ],
    guide: {
      title: 'Thí nghiệm: Axit Clohidric (HCl) + Bari Clorua (BaCl₂)',
      subtitle: 'Quan sát sự trộn lẫn dung dịch (Không phản ứng)',
      reference: 'SGK Khoa học tự nhiên 8 – Kết nối tri thức',
      equation: 'HCl + BaCl₂ → Không phản ứng (No reaction)',
      objective: 'Quan sát hiện tượng khi không có phản ứng hóa học xảy ra giữa axit và muối.',
      materials: [
        'Dung dịch Axit Clohidric (HCl)',
        'Dung dịch Bari Clorua (BaCl₂)',
        'Ống nghiệm',
        'Giá thí nghiệm',
      ],
      steps: [
        {
          title: 'Bước 1: Chuẩn bị ống nghiệm',
          content: 'Kéo ống nghiệm vào giá kẹp trên bàn thí nghiệm.',
          tip: 'Ống nghiệm sẽ tự động khớp vào vị trí kẹp trên giá.',
        },
        {
          title: 'Bước 2: Đổ dung dịch HCl',
          content: 'Cầm lọ HCl đổ vào ống nghiệm đến khoảng 1/3 ống.',
          tip: 'Kéo lọ HCl lại gần miệng ống nghiệm để đổ chất lỏng.',
        },
        {
          title: 'Bước 3: Đổ dung dịch BaCl₂',
          content: 'Kéo lọ BaCl₂ lại gần miệng ống nghiệm và đổ vào.',
          tip: 'Lọ nghiêng và đổ dung dịch trong suốt vào ống nghiệm.',
        },
        {
          title: 'Bước 4: Quan sát hiện tượng',
          content: 'Quan sát hai dung dịch hòa lẫn vào nhau. Kết quả: Không có bọt khí, không đổi màu, không kết tủa.',
          tip: 'Ống nghiệm vẫn chứa dung dịch trong suốt sau khi trộn.',
        },
      ],
      observations: [
        { question: 'Có xuất hiện bọt khí hay kết tủa sau khi trộn HCl và BaCl₂ không?', answer: 'Không – dung dịch vẫn trong suốt và đồng nhất.' },
        { question: 'Tại sao không có hiện tượng gì xảy ra?', answer: 'Vì phản ứng trao đổi giữa axit và muối chỉ xảy ra khi sản phẩm có chất kết tủa, bay hơi hoặc chất điện li yếu.' },
      ],
      safetyNotes: [
        'HCl có tính ăn mòn, tránh để dính vào da hoặc mắt.',
        'BaCl₂ là hóa chất độc, không được nếm hoặc hít ngửi trực tiếp.',
        'Sau khi kết thúc, đổ dung dịch thải vào đúng nơi quy định.',
      ],
      notes: [
        'Thí nghiệm này nhằm minh họa điều kiện để phản ứng trao đổi xảy ra (phải có kết tủa, khí hoặc chất điện li yếu).',
        'Cả HCl và BaCl₂ đều tan tốt và chứa ion Cl⁻ nên không có hiện tượng gì lạ khi trộn.',
      ],
    },
  },
];

/** Màu hiển thị tương ứng với từng chất bột */
export const SUBSTANCE_COLORS: Record<string, string> = {
  "FE-powder": "#9ca3af",  // xám bạc (bột sắt)
  "S-powder": "#fef08a",  // vàng nhạt hơn (lưu huỳnh)
  "FeS-powder": "#2d2d2d", // đen/xám đậm (Sắt(II) sulfide)
  "Zn-powder": "#818cf8", // xám xanh (Kẽm)
  "HCL-solution": "#a5f3fc", // xanh cực nhạt (Axit Clohydric)
  "aNa2SO4-solution": "#f0f9ff", // Trắng xanh nhạt (Natri Sulfat)
  "BaCl2-solution": "#f1f5f9",  // Trắng xám nhạt (Bari Clorua)
  "BaSO4-precipitate": "#ffffff", // Trắng tinh khiết
  "NaCl-solution": "#ffffff",     // Trong suốt/trắng xanh nhạt
  "ZnCl2-solution": "#e0f2fe",    // Trong suốt/xanh trời cực nhạt
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
