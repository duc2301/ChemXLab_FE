import { ArrowLeft, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { EquipmentPanel } from '../components/EquipmentPanel';
import { EQUIPMENT_IDS, SUBSTANCE_COLORS, getEquipmentById } from '../services/equipmentRegistry';
import { useExperimentStore } from '../services/experimentStore';
import { generateUUID } from '../services/idGenerator';
import type { DroppedItem } from '../types/equipment';
import { ExperimentEnvironment } from './ExperimentEnvironment';

const menuBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  padding: "8px 12px",
  background: "none",
  border: "none",
  borderRadius: "6px",
  fontSize: "13px",
  cursor: "pointer",
  transition: "background 0.15s",
};

export const ExperimentPopup = ({ onBackToMenu }: { onBackToMenu: () => void }) => {
  const {
    isModalOpen,
    closeModal,
    droppedItems,
    addDroppedItem,
    removeDroppedItem,
    setCursorVisible,
    contextMenu,
    setContextMenu,
    heldSubstance,
    setHeldSubstance,
    testTubeContents,
    stirredTubes,
    stirTestTube,
    alcoholLampStatus,
    toggleAlcoholLamp,
    clearItems,
  } = useExperimentStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Track mouse for badge overlay
  useEffect(() => {
    if (!heldSubstance) return;
    const move = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    document.addEventListener('mousemove', move);
    return () => document.removeEventListener('mousemove', move);
  }, [heldSubstance]);

  // ESC → cancel holding or close modal
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (heldSubstance) {
          setHeldSubstance(null);
        } else {
          closeModal();
          setCursorVisible(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal, setCursorVisible, heldSubstance, setHeldSubstance]);

  // Close context menu on outside click
  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', handleKey);
    };
  }, [contextMenu, setContextMenu]);

  // Cursor style when holding powder
  useEffect(() => {
    document.body.style.cursor = heldSubstance ? 'crosshair' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [heldSubstance]);

  // Cursor visibility management
  useEffect(() => {
    if (isModalOpen) {
      try { document.exitPointerLock?.(); } catch { /* ignore */ }
      setCursorVisible(true);
      document.body.style.cursor = 'auto';
      document.addEventListener('click', () => { document.exitPointerLock?.(); }, { once: true });
    } else {
      document.body.style.cursor = 'auto';
    }
    return () => { document.body.style.cursor = 'auto'; };
  }, [isModalOpen, setCursorVisible]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const equipmentId = e.dataTransfer.getData('equipmentId');
    if (!equipmentId) return;
    const equipment = getEquipmentById(equipmentId);
    if (!equipment) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const canvasX = (e.clientX - rect.left) / rect.width;
    const canvasY = (e.clientY - rect.top) / rect.height;
    const tableX = (canvasX - 0.5) * 5;
    const tableZ = (canvasY - 0.5) * 2.5;
    const droppedItem: DroppedItem = {
      id: generateUUID(),
      equipmentId: equipment.id,
      position: [tableX, 1.5, tableZ],
      rotation: [0, 0, 0],
      timestamp: Date.now(),
      collider: "cuboid",
    };
    addDroppedItem(droppedItem);
  };

  const contextMenuItem = contextMenu
    ? droppedItems.get(contextMenu.itemId)
    : null;
  const contextEquipment = contextMenuItem
    ? getEquipmentById(contextMenuItem.equipmentId)
    : null;
  const isSubstance = contextEquipment?.category === 'substances';
  const isTestTubeItem = contextEquipment?.id === EQUIPMENT_IDS.TEST_TUBE;
  const tubeContents = contextMenu ? (testTubeContents.get(contextMenu.itemId) ?? []) : [];
  const uniquePowderTypes = new Set(tubeContents).size;
  const stirredCount = contextMenu ? (stirredTubes[contextMenu.itemId] ?? 0) : 0;
  const canStir = isTestTubeItem && uniquePowderTypes >= 2 && stirredCount < tubeContents.length;
  const alreadyStirred = isTestTubeItem && stirredCount >= tubeContents.length && tubeContents.length > 0;
  const isAlcoholLamp = contextEquipment?.id === EQUIPMENT_IDS.ALCOHOL_LAMP;
  const isBurning = contextMenu ? (alcoholLampStatus.get(contextMenu.itemId) ?? false) : false;

  if (!isModalOpen) return null;

  const handleBack = () => {
    clearItems();     // 1. Dọn sạch bàn
    closeModal();     // 2. Đóng popup hiện tại
    onBackToMenu();   // 3. Gọi callback để hiện lại ModeMenu
  };

  return (
    <>
      {/* Fullscreen backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* Modal container */}
      <div className="fixed inset-4 z-50 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* NÚT QUAY LẠI */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-colors text-sm font-medium border border-gray-600"
            >
              <ArrowLeft size={16} />
              Chọn thí nghiệm khác
            </button>
            <h1 className="text-white font-bold text-lg">Bàn Thí Nghiệm</h1>
          </div>

          <button onClick={closeModal} className="p-1 hover:bg-gray-700 rounded transition-colors">
            <X size={24} className="text-gray-300 hover:text-white" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          <EquipmentPanel onSelectEquipment={() => { }} />

          <div className="flex-1 flex flex-col">
            {/* Info bar */}
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 text-sm text-gray-400">
              {heldSubstance ? (
                <p style={{ color: heldSubstance.color }}>
                  🧪 Đang cầm <strong>{heldSubstance.amount}g {heldSubstance.name}</strong> — Click vào ống nghiệm để đổ vào. ESC để huỷ.
                </p>
              ) : (
                <p>Kéo dụng cụ từ bên trái xuống bàn. Chuột phải để xem tùy chọn. ESC để thoát.</p>
              )}
            </div>

            {/* Canvas */}
            <div
              ref={canvasRef}
              className="flex-1 bg-black"
              style={{ cursor: heldSubstance ? 'crosshair' : 'auto' }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              // Click ra ngoài ống nghiệm → hủy cầm bột
              onClick={heldSubstance ? () => setHeldSubstance(null) : undefined}
            >
              <ExperimentEnvironment
                onItemDropped={addDroppedItem}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Cursor badge khi đang cầm bột ─────────────────────────── */}
      {heldSubstance && (
        <div
          style={{
            position: "fixed",
            top: cursorPos.y + 18,
            left: cursorPos.x + 12,
            zIndex: 10000,
            pointerEvents: "none",
            background: "#1e2530",
            border: `2px solid ${heldSubstance.color}`,
            borderRadius: "99px",
            padding: "3px 10px",
            fontSize: "10px",
            fontWeight: 600,
            color: heldSubstance.color,
            boxShadow: `0 2px 12px ${heldSubstance.color}66`,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            userSelect: "none",
          }}
        >
          <span style={{
            width: 10, height: 10, borderRadius: "50%",
            background: heldSubstance.color, flexShrink: 0,
          }} />
          {heldSubstance.name}
        </div>
      )}

      {/* ─── Context menu ───────────────────────────────────────────── */}
      {contextMenu && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 9999,
            background: "#1e2530",
            border: "1px solid #374151",
            borderRadius: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            padding: "4px",
            minWidth: "170px",
            fontFamily: "sans-serif",
          }}
        >
          {/* Tên vật thể */}
          <div style={{
            padding: "4px 8px 6px",
            fontSize: "11px",
            color: "#6b7280",
            borderBottom: "1px solid #374151",
            marginBottom: "4px",
            userSelect: "none",
          }}>
            {contextEquipment?.name ?? "Vật thể"}
          </div>

          {/* Khuấy bột — chỉ hiện khi là ống nghiệm có ≥ 2 loại bột và chưa khuấy hết */}
          {canStir && (
            <button
              style={{ ...menuBtnStyle, color: "#a78bfa" }}
              onClick={() => {
                stirTestTube(contextMenu!.itemId, tubeContents.length);
                setContextMenu(null);
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(167,139,250,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
              }}
            >
              🥄&nbsp; {stirredCount > 0 ? "Khuấy tiếp" : "Khuấy bột"}
            </button>
          )}

          {/* Hiện thị trạng thái đã khuấy */}
          {alreadyStirred && (
            <div style={{
              padding: "6px 12px",
              fontSize: "12px",
              color: "#a78bfa",
              opacity: 0.7,
              userSelect: "none",
            }}>
              ✨ Đã khuấy trộn
            </div>
          )}


          {isSubstance && contextEquipment && (
            <div style={{ display: "flex", gap: "4px", padding: "0 4px" }}>
              <input
                id="powder-amount-input"
                type="number"
                min={0.1}
                max={15}
                step={0.1}
                defaultValue={1}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                style={{
                  width: "70px",
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid #374151",
                  borderRadius: "4px",
                  color: "white",
                  padding: "2px 4px",
                  fontSize: "12px",
                  outline: "none"
                }}
                title="Số gram bột cần lấy"
              />
              <button
                style={{ ...menuBtnStyle, flex: 1, color: SUBSTANCE_COLORS[contextEquipment.id] ?? "#a3e635" }}
                onClick={() => {
                  const input = document.getElementById("powder-amount-input") as HTMLInputElement;
                  let amt = parseFloat(input?.value || "1");
                  if (isNaN(amt) || amt <= 0) amt = 1;

                  setHeldSubstance({
                    substanceId: contextEquipment.id,
                    name: contextEquipment.name,
                    color: SUBSTANCE_COLORS[contextEquipment.id] ?? "#a3e635",
                    amount: amt,
                  });
                  setContextMenu(null);
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(163,230,53,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "none";
                }}
              >
                🧪&nbsp; Lấy bột
              </button>
            </div>
          )}

          {isAlcoholLamp && (
            <button
              style={{
                ...menuBtnStyle,
                color: isBurning ? "#f59e0b" : "#60a5fa"
              }}
              onClick={() => {
                toggleAlcoholLamp(contextMenu.itemId);
                setContextMenu(null);
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(245,158,11,0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
              {isBurning ? "🔥 Tắt lửa" : "🔥 Thắp lửa"}
            </button>
          )}

          {/* Xóa vật thể */}
          <button
            style={{ ...menuBtnStyle, color: "#f87171" }}
            onClick={() => {
              removeDroppedItem(contextMenu.itemId);
              setContextMenu(null);
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "none";
            }}
          >
            🗑&nbsp; Xóa vật thể
          </button>
        </div>
      )}
    </>
  );
};
