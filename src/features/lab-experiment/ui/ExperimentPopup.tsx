import { useEffect, useRef } from 'react';
import { useExperimentStore } from '../services/experimentStore';
import { EquipmentPanel } from '../components/EquipmentPanel';
import { ExperimentEnvironment } from './ExperimentEnvironment';
import { X } from 'lucide-react';
import type { DroppedItem } from '../types/equipment';
import { generateUUID } from '../services/idGenerator';
import { getEquipmentById } from '../services/equipmentRegistry';

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
    setCursorVisible,
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

    // Map to 3D space (table is at center, adjust based on camera view)
    // Canvas center is (0.5, 0.5)
    const tableX = (canvasX - 0.5) * 3; // Range: -1.5 to 1.5
    const tableZ = (canvasY - 0.5) * 3; // Range: -1.5 to 1.5

    const droppedItem: DroppedItem = {
      id: generateUUID(),
      equipmentId: equipment.id,
      position: [tableX, 1.2, tableZ], // Y = table height + offset for physics
      rotation: [0, Math.random() * Math.PI * 2, 0], // Random rotation
      timestamp: Date.now(),
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
              <p>Kéo dụng cụ từ bên trái xuống bàn. Nhấn ESC để thoát.</p>
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
              />
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="px-4 py-2 bg-gray-900 border-t border-gray-700 text-xs text-gray-500">
          <span>Items: {droppedItems.size} </span>
        </div>
      </div>
    </>
  );
};
