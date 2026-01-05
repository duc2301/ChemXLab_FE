import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { LabStyle } from './style';
import Reaction from './reaction';


const Atom3DViewer = ({ src, isRotating, id, style }: { src: string, isRotating: boolean, id: string, style?: React.CSSProperties }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Setup Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 0, 4); // Lùi camera ra xa hơn một chút để bao quát

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);

    // --- KHẮC PHỤC LỖI ĐEN VÀ TỐI ---
    // 1. Hệ màu chuẩn: Giúp texture không bị xỉn màu
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // 2. Tone Mapping: Cân bằng sáng tối giống mắt người
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2; // Tăng độ phơi sáng lên
    // -------------------------------

    mountRef.current.appendChild(renderer.domElement);

    // 3. Lighting & Environment (QUAN TRỌNG NHẤT)
    // Tạo môi trường giả lập (Reflection)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnvironment = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnvironment).texture;
    // scene.background = null; // Giữ nền trong suốt

    // Ánh sáng bổ sung (Fill Light) để làm sáng các vùng tối
    // Tăng cường độ đèn DirectionalLight từ 3 lên 5
    const dirLight = new THREE.DirectionalLight(0xffffff, 5);

    // Tăng cường độ đèn AmbientLight từ 0.8 lên 1.2
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);

    const backLight = new THREE.DirectionalLight(0xffffff, 2);
    backLight.position.set(-5, 5, -5); // Đèn hắt từ phía sau để tạo khối
    scene.add(backLight);

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true; // Cho phép zoom nếu muốn soi kỹ

    // 5. Animation Loop
    let requestID: number;
    const animate = () => {
      requestID = requestAnimationFrame(animate);
      if (modelRef.current && isRotating) {
        modelRef.current.rotation.y += 0.005;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 6. Load Model
    const loader = new GLTFLoader();
    const loadModel = (url: string) => {
      if (modelRef.current) scene.remove(modelRef.current);

      loader.load(url, (gltf) => {
        const model = gltf.scene;

        // Căn giữa và Scale to lên (Vì trong ảnh của bạn nó đang hơi bé)
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Reset vị trí về tâm (0,0,0)
        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y);
        model.position.z += (model.position.z - center.z);

        // Scale fit view (Tăng số 2.0 lên nếu muốn to hơn nữa)
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.0 / maxDim;
        model.scale.setScalar(scale);

        // Duyệt qua từng bộ phận của model để bật bóng đổ (Shadow)
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).castShadow = true;
            (child as THREE.Mesh).receiveShadow = true;
            // Nếu model quá tối, có thể ép vật liệu sáng lên (Hack)
            // const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
            // if (mat.map) mat.envMapIntensity = 1.5; 
          }
        });

        scene.add(model);
        modelRef.current = model;
      });
    };

    loadModel(src);

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestID);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      pmremGenerator.dispose();
      roomEnvironment.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update logic khi đổi src
  useEffect(() => {
    if (!sceneRef.current) return;
    const loader = new GLTFLoader();
    loader.load(src, (gltf) => {
      if (modelRef.current) sceneRef.current?.remove(modelRef.current);
      const model = gltf.scene;

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      model.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      model.scale.setScalar(2.0 / maxDim); // Nhớ chỉnh số này giống bên trên

      sceneRef.current?.add(model);
      modelRef.current = model;
    });
  }, [src]);

  return <div id={id} ref={mountRef} style={style} />;
};


// --- DATA (GIỮ NGUYÊN) ---
const ATOM_DATA: Record<string, any> = {
  potassium: {
    name: 'Kali (K)',
    description: 'Kim loại kiềm, phản ứng mạnh với nước. Số hiệu nguyên tử: 19',
    file: '/src/shared/assets/models/element_019_potassium.glb',
    details: {
      title: 'Mô hình nguyên tử của Bohr',
      mainDescription: 'Kali là kim loại kiềm, phản ứng mạnh với nước, chiếm khoảng 2.6% khối lượng của vỏ trái đất.',
      symbol: 'K',
      atomicMass: '39.0983 u',
      density: '0.828 g/cm³',
      meltingPoint: '63.5°C',
      boilingPoint: '759°C',
      discoverer: 'Humphry Davy',
      yearDiscovered: '1807'
    }
  },
  hydrogen: {
    name: 'Hiđrô (H)',
    description: 'Khí nhẹ nhất, không màu, không mùi. Số hiệu nguyên tử: 1',
    file: '/src/shared/assets/models/element_001_hydrogen.glb',
    details: {
      title: 'Mô hình nguyên tử của Bohr',
      mainDescription: 'Hiđrô là nguyên tố phổ biến nhất trong vũ trụ, chiếm khoảng 75% khối lượng của vũ trụ.',
      symbol: 'H',
      atomicMass: '1.00784 u',
      density: '0.07099 g/cm³',
      meltingPoint: '-252.87°C',
      boilingPoint: '-259.16°C',
      discoverer: 'Henry Cavendish',
      yearDiscovered: '1766'
    }
  },
  oxygen: {
    name: 'Oxy (O)',
    description: 'Khí cần thiết cho sự sống, hỗ trợ đốt cháy. Số hiệu nguyên tử: 8',
    file: '/src/shared/assets/models/element_008_oxygen.glb',
    details: {
      title: 'Mô hình nguyên tử của Bohr',
      mainDescription: 'Oxy là nguyên tố cần thiết cho sự sống, chiếm khoảng 21% khí quyển và 46% khối lượng vỏ trái đất.',
      symbol: 'O',
      atomicMass: '15.999 u',
      density: '1.429 g/L',
      meltingPoint: '-218.79°C',
      boilingPoint: '-182.95°C',
      discoverer: 'Carl Wilhelm Scheele',
      yearDiscovered: '1774'
    }
  }
};

const Lab = () => {
  const reactionRef = useRef<any>(null);
  const [activeAtom, setActiveAtom] = useState<string>('potassium');
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // ĐÃ BỎ: useEffect inject script model-viewer

  const handleAtomChange = (atomKey: string) => setActiveAtom(atomKey);

  const toggleRotation = () => {
    // Logic cũ: thao tác DOM setAttribute -> Không cần thiết với React/ThreeJS Component
    // Nhưng để giữ logic code không đổi, ta chỉ cần update State, component 3D sẽ tự nghe state

    // const viewer = document.getElementById('atom-model') as any; // (Bỏ dòng này vì không dùng custom element nữa)

    // Chỉ cần dòng này là đủ để trigger animation trong ThreeJS
    setIsRotating(!isRotating);
  };

  const openMolecularModal = () => {
    const modal = document.getElementById('molecular-modal-overlay');
    if (modal) modal.style.display = 'flex';
    reactionRef.current?.openMolecular?.();
  };

  const currentAtomData = ATOM_DATA[activeAtom];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Scene Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'auto' }}>
        <Reaction ref={reactionRef} />
      </div>

      {/* UI Overlay */}
      <a href="../home/home.html" id="back-to-home">← Về Trang Chủ</a>

      <div id="info-panel" className="visible">
        <h3>Phản ứng: Kali (K) + Nước (H₂O)</h3>
        <span className="equation">2K + 2H₂O → 2KOH + H₂↑</span>
        <p>
          <strong>Hiện tượng:</strong> Đây là một phản ứng
          <strong>tỏa nhiệt (exothermic) CỰC MẠNH</strong> và diễn ra rất nhanh,
          <strong>dữ dội hơn nhiều so với Natri</strong>.
        </p>
        <ul>
          <li>
            <strong>Kali (K):</strong> Do có khối lượng riêng nhẹ hơn nước (0.86 g/cm³)...
          </li>
          <li>
            <strong>Sản phẩm:</strong>
            <ul>
              <li><strong>Khí Hiđrô (H₂):</strong> Thoát ra mạnh, bốc cháy (lửa tím).</li>
              <li><strong>Kali Hiđroxit (KOH):</strong> Tan trong nước, kiềm mạnh.</li>
            </ul>
          </li>
          <li><strong>Khói (Steam):</strong> Hơi nước bốc lên do nhiệt độ cao.</li>
        </ul>
        <div className="warning">
          <strong>⚠️ Cảnh báo an toàn:</strong> Phản ứng gây nổ mạnh. Không thử tại nhà!
        </div>

        <button id="btn-run-molecular-animation" onClick={openMolecularModal}>
          🔬 Mô Phỏng Phân Tử
        </button>
        <button id="btn-view-atoms" onClick={() => document.getElementById('atom-modal-overlay')!.style.display = 'flex'}>
          🧪 Xem Nguyên Tử
        </button>
      </div>

      <div id="button-container">
        <button id="btn-start-reaction" onClick={() => reactionRef.current?.startReaction?.()}>⚗️ Phản ứng</button>
      </div>

      {/* MOLECULAR SIMULATION MODAL */}
      <div id="molecular-modal-overlay">
        <div id="molecular-card">
          <div id="molecular-label-renderer"></div>
          <canvas id="molecular-canvas"></canvas>
          <button id="molecular-card-close" onClick={(e) => (e.target as HTMLElement).closest('#molecular-modal-overlay')!.style.display = 'none'}>&times;</button>
        </div>
      </div>

      {/* ATOM VIEWER MODAL */}
      <div id="atom-modal-overlay">
        <div id="atom-card">
          <div id="atom-selector">
            {Object.keys(ATOM_DATA).map(key => (
              <button
                key={key}
                className={`atom-btn ${activeAtom === key ? 'active' : ''}`}
                onClick={() => handleAtomChange(key)}
              >
                {ATOM_DATA[key].name}
              </button>
            ))}
            <div style={{ flex: 1 }}></div>
            <button id="atom-card-close" onClick={() => document.getElementById('atom-modal-overlay')!.style.display = 'none'}>Đóng ✕</button>
          </div>

          <div id="atom-viewer-container">
            <div id="atom-3d-viewer">
              {/* THAY THẾ MODEL-VIEWER BẰNG COMPONENT MỚI */}
              <Atom3DViewer
                id="atom-model"
                src={currentAtomData.file}
                isRotating={isRotating}
                style={{ width: '100%', height: '100%' }}
              />

              <div id="atom-info">
                <strong id="atom-name">{currentAtomData.name}</strong>
                <div id="atom-description">{currentAtomData.description}</div>
              </div>
              <button id="toggle-rotation" onClick={toggleRotation}>{isRotating ? '⏸️ Dừng xoay' : '▶️ Xoay'}</button>
            </div>

            <div id="atom-details-panel">
              <div id="atom-details-content">
                <h2 id="detail-title">{currentAtomData.details.title}</h2>
                <p id="main-description">{currentAtomData.details.mainDescription}</p>
                <div className="detail-item"><strong>Ký hiệu:</strong> <span>{currentAtomData.details.symbol}</span></div>
                <div className="detail-item"><strong>Khối lượng:</strong> <span>{currentAtomData.details.atomicMass}</span></div>
                <div className="detail-item"><strong>Mật độ:</strong> <span>{currentAtomData.details.density}</span></div>
                <div className="detail-item"><strong>Nóng chảy:</strong> <span>{currentAtomData.details.meltingPoint}</span></div>
                <div className="detail-item"><strong>Sôi:</strong> <span>{currentAtomData.details.boilingPoint}</span></div>
                <div className="detail-item"><strong>Phát hiện:</strong> <span>{currentAtomData.details.discoverer}</span></div>
                <div className="detail-item"><strong>Năm:</strong> <span>{currentAtomData.details.yearDiscovered}</span></div>
                <div className="detail-link"><a href="#">Xem thêm</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LabStyle />
    </div>
  );
};

export default Lab;