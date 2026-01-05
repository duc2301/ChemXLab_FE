export const LabStyle = () => {
  return (
    <style jsx global>{`
      body {
        margin: 0;
        background-color: #111;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif;
        color: #212529;
        overflow: hidden;
      }

      /* Back to home button */
      #back-to-home {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1002;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 600;
        border-radius: 10px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      #back-to-home:hover {
        background: linear-gradient(135deg, #5a6fd8, #6a4c93);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
      }

      #molecular-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        z-index: 2000;
        display: none;
        justify-content: center;
        align-items: center;
      }

      #molecular-card {
        position: relative;
        width: 90vw;
        height: 80vh;
        max-width: 800px;
        background: #222;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
        overflow: hidden;
      }

      /* Atom Modal Styles */
      #atom-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        z-index: 2000;
        display: none;
        justify-content: center;
        align-items: center;
      }

      #atom-card {
        position: relative;
        width: 90vw;
        height: 80vh;
        max-width: 800px;
        background: #222;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      #atom-selector {
        background: #333;
        padding: 15px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
      }

      .atom-btn {
        background: linear-gradient(135deg, #4f46e5, #3730a3);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.2s ease;
        min-width: 80px;
      }

      .atom-btn:hover {
        background: linear-gradient(135deg, #3730a3, #312e81);
        transform: translateY(-1px);
      }

      .atom-btn.active {
        background: linear-gradient(135deg, #10b981, #059669);
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
      }

      #atom-viewer-container {
        flex: 1;
        position: relative;
        background: #1a1a1a;
        pointer-events: auto;
        touch-action: manipulation;
        display: flex;
        gap: 0;
        overflow: hidden; /* Fix cho ThreeJS */
      }

      #atom-3d-viewer {
        flex: 1;
        position: relative;
        background: #1a1a1a;
        display: flex; /* Để căn chỉnh children */
        justify-content: center;
        align-items: center;
      }

      /* === MỚI: Style cho container ThreeJS === */
      #atom-model {
        width: 100%;
        height: 100%;
        display: block;
      }
      
      #atom-model canvas {
        width: 100% !important;
        height: 100% !important;
        outline: none;
      }

      /* === MỚI: Style cho nút Xoay (Toggle Rotation) === */
      #toggle-rotation {
        position: absolute;
        bottom: 15px;
        right: 15px;
        z-index: 10;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 13px;
        cursor: pointer;
        backdrop-filter: blur(5px);
        transition: all 0.2s;
      }

      #toggle-rotation:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: scale(1.05);
      }

      #atom-details-panel {
        width: 350px;
        background: linear-gradient(135deg, #f8fafc, #e2e8f0);
        border-left: 1px solid rgba(255, 255, 255, 0.1);
        overflow-y: auto;
        padding: 0;
      }

      #atom-details-content {
        padding: 20px;
        height: 100%;
      }

      #detail-title {
        font-size: 18px;
        font-weight: bold;
        color: #1e293b;
        margin: 0 0 16px 0;
        padding-bottom: 10px;
        border-bottom: 2px solid #e2e8f0;
      }

      #detail-description {
        margin-bottom: 20px;
      }

      #main-description {
        font-size: 14px;
        line-height: 1.6;
        color: #334155;
        margin: 0;
        font-weight: 500;
      }

      .detail-item {
        margin-bottom: 12px;
        font-size: 13px;
        line-height: 1.5;
        color: #475569;
      }

      .detail-item strong {
        color: #1e293b;
        font-weight: 600;
      }

      .detail-item span {
        color: #0f172a;
        font-weight: 500;
      }

      .detail-link {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #e2e8f0;
      }

      .detail-link a {
        color: #3b82f6;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: color 0.2s ease;
      }

      .detail-link a:hover {
        color: #1d4ed8;
        text-decoration: underline;
      }

      /* Responsive design for mobile */
      @media (max-width: 768px) {
        #atom-viewer-container {
          flex-direction: column;
        }

        #atom-details-panel {
          width: 100%;
          height: 300px;
          border-left: none;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        #atom-3d-viewer {
          height: 400px;
        }

        #atom-selector {
          flex-wrap: wrap;
          gap: 8px;
        }

        .atom-btn {
          min-width: 70px;
          padding: 8px 16px;
          font-size: 12px;
        }

        #toggle-rotation {
           /* Điều chỉnh vị trí trên mobile nếu cần */
           bottom: 10px;
           right: 10px;
        }
      }

      #atom-info {
        position: absolute;
        bottom: 15px;
        left: 15px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 14px;
        backdrop-filter: blur(10px);
        pointer-events: none; /* Để chuột có thể xoay model xuyên qua text */
        z-index: 5;
      }

      #atom-card-close {
        position: absolute;
        top: 15px;
        right: 15px;
        z-index: 2001;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        font-size: 20px;
        font-weight: bold;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      #atom-card-close:hover {
        background: rgba(255, 255, 255, 0.4);
      }

      #molecular-canvas {
        width: 100%;
        height: 100%;
        display: block;
      }

      #molecular-label-renderer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .atom-label {
        color: white;
        font-family: Arial, sans-serif;
        font-size: 16px;
        font-weight: bold;
        text-shadow: 0 0 5px black, 0 0 5px black;
        pointer-events: none;
      }

      #molecular-card-close {
        position: absolute;
        top: 15px;
        right: 15px;
        z-index: 2001;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        font-size: 20px;
        font-weight: bold;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      #molecular-card-close:hover {
        background: rgba(255, 255, 255, 0.4);
      }

      #info-panel {
        position: absolute;
        top: 20px;
        left: 20px;
        box-sizing: border-box;
        width: calc(100vw - 40px);
        max-width: 340px;
        max-height: calc(100vh - 40px);
        overflow-y: auto;
        background: linear-gradient(135deg,
          rgba(255, 255, 255, 0.95),
          rgba(245, 248, 250, 0.95));
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 24px;
        opacity: 0;
        transform: translateY(-20px);
        pointer-events: none;
        transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
          transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        margin-top: 60px;
      }

      #info-panel.visible {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      /* Style chung cho 2 nút trong Info Panel */
      #info-panel #btn-run-molecular-animation,
      #info-panel #btn-view-atoms {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border: none;
        padding: 14px 24px;
        font-size: 15px;
        font-weight: 600;
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        width: 100%; /* Canh full width cho đẹp */
        margin-bottom: 10px; /* Cách nhau ra một chút */
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
      }
      
      /* Riêng nút View Atoms đổi màu cho khác biệt */
      #info-panel #btn-view-atoms {
         background: linear-gradient(135deg, #3b82f6, #2563eb);
         box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      #info-panel #btn-run-molecular-animation:hover,
      #info-panel #btn-view-atoms:hover {
        transform: translateY(-2px);
        filter: brightness(1.1);
      }

      #info-panel #btn-run-molecular-animation:active,
      #info-panel #btn-view-atoms:active {
        transform: translateY(0);
      }

      #info-panel h3 {
        margin-top: 0;
        margin-bottom: 16px;
        color: #1e40af;
        border-bottom: 3px solid #3b82f6;
        padding-bottom: 10px;
        font-size: 1.3em;
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      #info-panel .equation {
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo,
          Courier, monospace;
        font-weight: 600;
        font-size: 1.15em;
        background: linear-gradient(135deg, #e0f2fe, #dbeafe);
        color: #1e3a8a;
        padding: 14px 16px;
        border-radius: 10px;
        border: 2px solid #93c5fd;
        text-align: center;
        margin: 16px 0;
        display: block;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
      }

      #info-panel p,
      #info-panel li {
        font-size: 0.95em;
        line-height: 1.6;
      }

      #info-panel ul {
        padding-left: 20px;
        margin-top: 10px;
      }

      #info-panel li {
        margin-bottom: 8px;
      }

      .warning {
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        border-left: 4px solid #f59e0b;
        padding: 14px 16px;
        margin-top: 16px;
        margin-bottom: 16px; /* Cách nút bấm ra */
        border-radius: 10px;
        font-size: 0.92em;
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.15);
      }

      .warning strong {
        color: #92400e;
        font-weight: 700;
      }

      #button-container {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 1001;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      #btn-start-reaction {
        padding: 16px 28px;
        font-size: 16px;
        font-weight: 700;
        color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25),
          0 2px 4px rgba(0, 0, 0, 0.15);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        letter-spacing: 0.02em;
        position: relative;
        overflow: hidden;
        background: linear-gradient(135deg, #f97316, #ea580c);
      }

      #btn-start-reaction:hover:not(:disabled) {
        background: linear-gradient(135deg, #ea580c, #dc2626);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4),
          0 3px 6px rgba(0, 0, 0, 0.2);
      }

      #btn-start-reaction:active:not(:disabled) {
        transform: translateY(0);
      }

      #btn-start-reaction:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    `}</style>
  );
};