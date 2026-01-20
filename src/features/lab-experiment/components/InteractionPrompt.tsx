import { useEffect, useState } from 'react';

interface InteractionPromptProps {
  isVisible: boolean;
}

export const InteractionPrompt = ({ isVisible }: InteractionPromptProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className="bg-black bg-opacity-70 px-4 py-2 rounded-lg border border-yellow-500 flex items-center gap-2">
        <span className="text-yellow-400 text-lg font-bold">F</span>
        <span className="text-white text-sm font-medium">Bắt đầu thí nghiệm</span>
      </div>
    </div>
  );
};
