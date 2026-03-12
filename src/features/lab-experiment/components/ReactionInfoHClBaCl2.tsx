import { Html } from "@react-three/drei";

export const ReactionInfoHClBaCl2 = () => {
  return (
    <Html
      position={[1.2, 0.22, 0]}
      center
      pointerEvents="none"
      style={{ userSelect: "none", zIndex: 100 }}
    >
      <div
        style={{
          background: "rgba(10, 15, 25, 0.95)",
          border: `1px solid #c084fc`, // Viền tím mộng mơ
          borderRadius: "7px",
          padding: "8px 12px",
          minWidth: "230px",
          color: "white",
          fontFamily: "sans-serif",
          fontSize: "11px",
          boxShadow: `0 0 12px rgba(192, 132, 252, 0.3)`,
          whiteSpace: "nowrap",
          lineHeight: 1.6,
        }}
      >
        <h4
          style={{
            margin: "0 0 5px 0",
            color: "#e879f9",
            fontSize: "12px",
            letterSpacing: "0.3px",
          }}
        >
          🧪 Thử nghiệm tính chất
        </h4>

        <div
          style={{
            color: "#d8b4fe",
            fontWeight: "bold",
            fontSize: "11px",
            marginBottom: "5px",
            fontStyle: "italic",
          }}
        >
          HCl + BaCl₂ → (Không phản ứng)
        </div>

        <div style={{ marginBottom: "3px" }}>
          <span style={{ color: "#94a3b8" }}>Hiện tượng: </span>
          <span style={{ color: "#f8fafc", fontWeight: "bold" }}>
            Dung dịch hòa lẫn, trong suốt ✨
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "4px",
            borderTop: "1px dashed rgba(100,116,139,0.4)",
            paddingTop: "4px",
          }}
        >
          <div>
            <span style={{ color: "#94a3b8" }}>Kết quả: </span>
            <span style={{ color: "#ffffff", fontWeight: "bold" }}>
              Không có bọt khí, không kết tủa
            </span>
          </div>
        </div>
      </div>
    </Html>
  );
};
