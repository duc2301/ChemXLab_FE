import { useState } from 'react';
import { getAllCategories, getEquipmentByCategory } from '../services/equipmentRegistry';
import type { EquipmentItem } from '../types/equipment';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EquipmentPanelProps {
  onSelectEquipment: (equipment: EquipmentItem) => void;
  selectedId?: string;
}

export const EquipmentPanel = ({ onSelectEquipment, selectedId }: EquipmentPanelProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(getAllCategories())
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      tools: 'Dụng cụ',
      containers: 'Bình chứa',
      substances: 'Chất',
      measuring: 'Công cụ đo',
    };
    return labels[category] || category;
  };

  const categories = getAllCategories();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="text-white font-semibold text-sm">Công cụ & Chất liệu</h2>
      </div>

      {/* Categories & Items */}
      <div className="flex-1 overflow-y-auto">
        {categories.map((category) => {
          const items = getEquipmentByCategory(category);
          const isExpanded = expandedCategories.has(category);

          return (
            <div key={category} className="border-b border-gray-800">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-800 transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp size={16} className="text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
                <span className="text-gray-300 text-sm font-medium">
                  {getCategoryLabel(category)}
                </span>
                <span className="ml-auto text-xs text-gray-500">{items.length}</span>
              </button>

              {isExpanded && (
                <div className="bg-gray-800 bg-opacity-50 px-2 py-2 space-y-1">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectEquipment(item)}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer?.setData('equipmentId', item.id);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs rounded transition-all flex items-start gap-2 ${
                        selectedId === item.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      }`}
                    >
                      <span className="text-lg">📦</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        {item.description && (
                          <p className="text-gray-400 text-xs truncate">{item.description}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Footer */}
      <div className="px-4 py-2 border-t border-gray-700 bg-gray-950 text-xs text-gray-400">
        <p>Kéo thả vào bàn để đặt</p>
      </div>
    </div>
  );
};
