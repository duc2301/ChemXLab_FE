import { X, Beaker, Zap } from 'lucide-react';
import { GUIDED_EXPERIMENTS } from '../services/equipmentRegistry';

export const ExperimentModeMenu = ({ 
  onSelectFree, 
  onSelectGuided, 
  onClose 
}: { 
  onSelectFree: () => void; 
  onSelectGuided: (expId: string) => void;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 w-[500px] rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
          <h2 className="text-white font-bold text-lg">Chọn Chế Độ Thí Nghiệm</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20}/></button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Option 1: Tự do */}
          <button 
            onClick={onSelectFree}
            className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-blue-900/30 border border-gray-700 hover:border-blue-500 rounded-lg transition-all group"
          >
            <div className="p-3 bg-blue-500/20 rounded-full text-blue-400 group-hover:scale-110 transition-transform">
              <Beaker size={24} />
            </div>
            <div className="text-left">
              <div className="text-white font-semibold">Thí nghiệm tự do</div>
              <div className="text-gray-400 text-xs">Bạn tự chọn và sắp xếp dụng cụ theo ý muốn</div>
            </div>
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-800"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-gray-900 px-2 text-gray-500">Hoặc chọn mẫu</span></div>
          </div>

          {/* Option 2: Thí nghiệm có sẵn */}
          <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {GUIDED_EXPERIMENTS.map((exp) => (
              <button
                key={exp.id}
                onClick={() => onSelectGuided(exp.id)}
                className="w-full text-left p-3 bg-gray-800/50 hover:bg-yellow-900/20 border border-gray-700 hover:border-yellow-600 rounded-lg text-sm text-gray-300 transition-colors flex items-center gap-3"
              >
                <Zap size={14} className="text-yellow-500" />
                {exp.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};