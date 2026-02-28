import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { EquipmentPanel } from '../components/EquipmentPanel';
import { getEquipmentById } from '../services/equipmentRegistry';
import { useExperimentStore } from '../services/experimentStore';
import { generateUUID } from '../services/idGenerator';
import type { DroppedItem } from '../types/equipment';
import { ExperimentEnvironment } from './ExperimentEnvironment';

/**
 * Experiment Popup Modal
 * 
 * Hiển thị giao diện thí nghiệm khi người dùng bấm F gần bàn
 * - Panel công cụ bên trái (có thể kéo thả)
 * - Canvas 3D bên phải (bàn thí nghiệm cố định)
 * - ESC để đóng
 * - Ẩn chuột ngoài (show cursor bên trong)
 */
export const ExperimentPopup = () => {
  const {
    isModalOpen,
    closeModal,
    droppedItems,
    addDroppedItem,
    removeDroppedItem,
    setCursorVisible,
    contextMenu,
    setContextMenu,
  } = useExperimentStore();

  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle ESC key
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        setCursorVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal, setCursorVisible]);

  // Đóng context menu khi click ra ngoài hoặc nhấn Escape
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

  // Cursor visibility management
  useEffect(() => {
    if (isModalOpen) {
      // Tắt pointer lock hoàn toàn, show cursor
      try {
        document.exitPointerLock?.();
      } catch (e) {
        console.log('exitPointerLock failed', e);
      }
      setCursorVisible(true);
      document.body.style.cursor = 'auto';
      // Đảm bảo pointer lock không hoạt động
      document.addEventListener('click', () => {
        document.exitPointerLock?.();
      }, { once: true });
    } else {
      // Restore default cursor
      document.body.style.cursor = 'auto';
    }

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [isModalOpen, setCursorVisible]);

  // Handle drag over canvas
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Handle drop on canvas
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const equipmentId = e.dataTransfer.getData('equipmentId');
    console.log('Drop event fired. Equipment ID:', equipmentId);

    if (!equipmentId) {
      console.warn('Drop failed: no equipment ID in dataTransfer');
      return;
    }

    // Get equipment from registry
    const equipment = getEquipmentById(equipmentId);
    if (!equipment) {
      console.warn(`Equipment not found in registry: ${equipmentId}`);
      return;
    }

    // Calculate drop position on table surface
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('Canvas ref not found');
      return;
    }

    const rect = canvas.getBoundingClientRect();

    // Get position relative to canvas
    const canvasX = (e.clientX - rect.left) / rect.width;
    const canvasY = (e.clientY - rect.top) / rect.height;

    // Map to 3D space (table surface at Y=0.85, size 6x3)
    // Canvas center is (0.5, 0.5)
    const tableX = (canvasX - 0.5) * 5; // Range: -2.5 to 2.5 (within table bounds)
    const tableZ = (canvasY - 0.5) * 2.5; // Range: -1.25 to 1.25 (within table bounds)

    const droppedItem: DroppedItem = {
      id: generateUUID(),
      equipmentId: equipment.id,
      position: [tableX, 1.5, tableZ], // Y = above table for physics drop
      rotation: [0, 0, 0],
      timestamp: Date.now(),
      collider: "cuboid"
    };

    console.log('Item dropped:', equipment.name, 'at position:', droppedItem.position);
    addDroppedItem(droppedItem);
  };

  if (!isModalOpen) return null;

  return (
    <>
      {/* Fullscreen backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* Modal container */}
      <div className="fixed inset-4 z-50 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-white font-bold text-lg">Bàn Thí Nghiệm</h1>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Đóng (ESC)"
          >
            <X size={24} className="text-gray-300 hover:text-white" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel - Equipment list */}
          <EquipmentPanel
            onSelectEquipment={() => {
              // Selection callback no longer needed - we get ID from dataTransfer
            }}
          />

          {/* Right area - Canvas & Info */}
          <div className="flex-1 flex flex-col">
            {/* Info bar */}
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 text-sm text-gray-400">
              <p>Kéo dụng cụ từ bên trái xuống bàn. Click giữ để di chuyển. Chuột phải để xóa. Nhấn ESC để thoát.</p>
            </div>

            {/* Canvas */}
            <div
              ref={canvasRef}
              className="flex-1 bg-black cursor-move"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <ExperimentEnvironment
                droppedItems={droppedItems}
                onItemDropped={addDroppedItem}
                onRemove={removeDroppedItem}
              />
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="px-4 py-2 bg-gray-900 border-t border-gray-700 text-xs text-gray-500">
          <span>Dụng cụ: {droppedItems.size} </span>
        </div>
      </div>

      {/* Context menu xóa vật thể - render ở đây, ngoài Canvas */}
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
            minWidth: "160px",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              padding: "4px 8px 6px",
              fontSize: "11px",
              color: "#6b7280",
              borderBottom: "1px solid #374151",
              marginBottom: "4px",
              userSelect: "none",
            }}
          >
            Vật thể
          </div>
          <button
            onClick={() => {
              removeDroppedItem(contextMenu.itemId);
              setContextMenu(null);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              padding: "8px 12px",
              background: "none",
              border: "none",
              borderRadius: "6px",
              color: "#f87171",
              fontSize: "13px",
              cursor: "pointer",
              transition: "background 0.15s",
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
