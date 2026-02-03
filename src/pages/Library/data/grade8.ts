// Curriculum data for Grade 8 - Khoa học tự nhiên (Chemistry part)
// Chân Trời Sáng Tạo 2024-2025

import type { Topic } from "./grade6";

export const grade8Topics: Topic[] = [
    {
        id: "8-1",
        title: "Acid",
        description: "Tính chất và phân loại acid",
        lessons: [
            {
                id: "8-1-1",
                title: "Khái niệm và phân loại Acid",
                content: `**Acid** là hợp chất mà phân tử có nguyên tử H liên kết với gốc acid.

**Công thức tổng quát:** HₓA (A là gốc acid)

**Phân loại:**

**1. Acid không có oxygen (Hydrohalic acid):**
- HCl: Hydrochloric acid (acid clohidric)
- HBr: Hydrobromic acid
- H₂S: Hydrosulfuric acid

**2. Acid có oxygen (Oxyacid):**
- H₂SO₄: Sulfuric acid
- HNO₃: Nitric acid
- H₃PO₄: Phosphoric acid
- H₂CO₃: Carbonic acid

**Acid mạnh vs Acid yếu:**
| Acid mạnh | Acid yếu |
|-----------|----------|
| HCl, H₂SO₄, HNO₃ | H₂CO₃, H₂S, CH₃COOH |
| Phân li hoàn toàn | Phân li một phần |`,
                keyPoints: [
                    "Acid = H + Gốc acid",
                    "Acid không có oxygen: HCl, H₂S",
                    "Acid có oxygen: H₂SO₄, HNO₃, H₃PO₄",
                    "Acid mạnh: HCl, H₂SO₄, HNO₃",
                ],
            },
            {
                id: "8-1-2",
                title: "Tính chất hóa học của Acid",
                content: `**1. Làm đổi màu chất chỉ thị:**
- Quỳ tím → Đỏ
- Phenolphthalein: không đổi màu

**2. Tác dụng với kim loại (trước H):**
Acid + Kim loại → Muối + H₂↑

- 2HCl + Zn → ZnCl₂ + H₂↑
- H₂SO₄(loãng) + Fe → FeSO₄ + H₂↑
- 6HCl + 2Al → 2AlCl₃ + 3H₂↑

**3. Tác dụng với base:**
Acid + Base → Muối + H₂O (phản ứng trung hòa)

- HCl + NaOH → NaCl + H₂O
- H₂SO₄ + 2KOH → K₂SO₄ + 2H₂O

**4. Tác dụng với oxide base:**
Acid + Oxide base → Muối + H₂O

- 2HCl + CaO → CaCl₂ + H₂O
- H₂SO₄ + CuO → CuSO₄ + H₂O

**5. Tác dụng với muối:** (sẽ học ở bài muối)`,
                keyPoints: [
                    "Acid làm quỳ tím hóa đỏ",
                    "Acid + KL(trước H) → Muối + H₂",
                    "Acid + Base → Muối + H₂O (trung hòa)",
                    "Acid + Oxide base → Muối + H₂O",
                ],
            },
        ],
    },
    {
        id: "8-2",
        title: "Base",
        description: "Tính chất và phân loại base",
        lessons: [
            {
                id: "8-2-1",
                title: "Khái niệm và phân loại Base",
                content: `**Base** là hợp chất mà phân tử có nguyên tử kim loại liên kết với nhóm hydroxide (OH).

**Công thức tổng quát:** M(OH)ₙ
(M: kim loại, n: hóa trị kim loại)

**Phân loại:**

**1. Base tan (Kiềm):**
- NaOH: Sodium hydroxide (xút ăn da)
- KOH: Potassium hydroxide
- Ca(OH)₂: Calcium hydroxide (vôi tôi)
- Ba(OH)₂: Barium hydroxide

**2. Base không tan:**
- Cu(OH)₂: Copper(II) hydroxide - xanh lam
- Fe(OH)₂: Iron(II) hydroxide - trắng xanh
- Fe(OH)₃: Iron(III) hydroxide - nâu đỏ
- Mg(OH)₂: Magnesium hydroxide - trắng
- Al(OH)₃: Aluminum hydroxide - trắng`,
                keyPoints: [
                    "Base = Kim loại + OH",
                    "Base tan (kiềm): NaOH, KOH, Ca(OH)₂, Ba(OH)₂",
                    "Base không tan: Cu(OH)₂, Fe(OH)₃, Mg(OH)₂",
                    "Mỗi base có màu sắc đặc trưng",
                ],
            },
            {
                id: "8-2-2",
                title: "Tính chất hóa học của Base",
                content: `**1. Làm đổi màu chất chỉ thị:**
- Quỳ tím → Xanh
- Phenolphthalein không màu → Hồng

**2. Tác dụng với acid:**
Base + Acid → Muối + H₂O

- NaOH + HCl → NaCl + H₂O
- Ca(OH)₂ + 2HNO₃ → Ca(NO₃)₂ + 2H₂O

**3. Tác dụng với oxide acid (chỉ base tan):**
Base + Oxide acid → Muối (+ H₂O)

- 2NaOH + CO₂ → Na₂CO₃ + H₂O
- Ca(OH)₂ + SO₂ → CaSO₃ + H₂O

**4. Base không tan bị nhiệt phân hủy:**
Base không tan → Oxide + H₂O

- Cu(OH)₂ --t°--> CuO + H₂O
- 2Fe(OH)₃ --t°--> Fe₂O₃ + 3H₂O

**5. Tác dụng với muối:** (sẽ học ở bài muối)`,
                keyPoints: [
                    "Base làm quỳ tím hóa xanh",
                    "Phenolphthalein + base → màu hồng",
                    "Base + Acid → Muối + H₂O",
                    "Base không tan bị nhiệt phân hủy",
                ],
            },
        ],
    },
    {
        id: "8-3",
        title: "Thang pH",
        description: "Khái niệm pH và ứng dụng",
        lessons: [
            {
                id: "8-3-1",
                title: "Thang pH",
                content: `**pH** là đại lượng đặc trưng cho tính acid-base của dung dịch.

**Thang pH:** Từ 0 đến 14

| pH | Tính chất |
|----|-----------|
| pH < 7 | Môi trường acid |
| pH = 7 | Môi trường trung tính |
| pH > 7 | Môi trường base (kiềm) |

**Quy luật:**
- pH càng nhỏ → tính acid càng mạnh
- pH càng lớn → tính base càng mạnh

**Ví dụ pH một số chất:**
| Chất | pH |
|------|-----|
| Dịch dạ dày | 1-2 |
| Nước chanh | 2-3 |
| Nước mưa | 5.5-6 |
| Nước tinh khiết | 7 |
| Máu người | 7.35-7.45 |
| Xà phòng | 9-10 |
| Nước vôi | 12-13 |`,
                keyPoints: [
                    "pH từ 0-14, trung tính = 7",
                    "pH < 7: acid, pH > 7: base",
                    "pH càng nhỏ → acid càng mạnh",
                    "Máu người có pH ≈ 7.4 (hơi kiềm)",
                ],
            },
            {
                id: "8-3-2",
                title: "Xác định pH",
                content: `**Cách xác định pH:**

**1. Chất chỉ thị màu:**
- Quỳ tím: đỏ (acid), xanh (base)
- Phenolphthalein: không màu (acid/trung tính), hồng (base)

**2. Giấy pH:**
- So màu với thang màu chuẩn
- Cho kết quả pH gần đúng

**3. Máy đo pH:**
- Cho kết quả chính xác
- Dùng trong phòng thí nghiệm, công nghiệp

**Ứng dụng pH trong đời sống:**
- Nông nghiệp: kiểm tra pH đất
- Y tế: kiểm tra pH máu, nước tiểu
- Thực phẩm: kiểm soát quá trình lên men
- Môi trường: giám sát chất lượng nước
- Bể cá: duy trì pH phù hợp cho cá`,
                keyPoints: [
                    "Dùng quỳ tím, giấy pH hoặc máy đo pH",
                    "Giấy pH cho kết quả gần đúng",
                    "pH quan trọng trong nông nghiệp, y tế, môi trường",
                    "Cần kiểm soát pH trong nuôi trồng thủy sản",
                ],
            },
        ],
    },
    {
        id: "8-4",
        title: "Oxide",
        description: "Phân loại và tính chất oxide",
        lessons: [
            {
                id: "8-4-1",
                title: "Khái niệm và phân loại Oxide",
                content: `**Oxide** là hợp chất của oxygen với một nguyên tố khác.

**Công thức tổng quát:** MₓOᵧ

**Phân loại:**

**1. Oxide base:**
- Oxide của kim loại
- Tác dụng với acid tạo muối + nước
- Ví dụ: Na₂O, CaO, FeO, Fe₂O₃, CuO

**2. Oxide acid:**
- Oxide của phi kim (thường)
- Tác dụng với base tạo muối + nước
- Ví dụ: CO₂, SO₂, SO₃, P₂O₅, N₂O₅

**3. Oxide lưỡng tính:**
- Tác dụng với cả acid và base
- Ví dụ: Al₂O₃, ZnO

**4. Oxide trung tính:**
- Không tác dụng với acid và base
- Ví dụ: CO, NO, N₂O`,
                keyPoints: [
                    "Oxide = Nguyên tố + Oxygen",
                    "Oxide base: oxide của kim loại",
                    "Oxide acid: oxide của phi kim",
                    "Oxide lưỡng tính: Al₂O₃, ZnO",
                ],
            },
            {
                id: "8-4-2",
                title: "Tính chất hóa học của Oxide",
                content: `**OXIDE BASE:**

**1. Tác dụng với nước (oxide của KL kiềm/kiềm thổ):**
- Na₂O + H₂O → 2NaOH
- CaO + H₂O → Ca(OH)₂

**2. Tác dụng với acid:**
- CuO + 2HCl → CuCl₂ + H₂O
- Fe₂O₃ + 6HCl → 2FeCl₃ + 3H₂O

**OXIDE ACID:**

**1. Tác dụng với nước (trừ SiO₂):**
- CO₂ + H₂O → H₂CO₃
- SO₃ + H₂O → H₂SO₄

**2. Tác dụng với base (kiềm):**
- CO₂ + 2NaOH → Na₂CO₃ + H₂O
- SO₂ + Ca(OH)₂ → CaSO₃ + H₂O

**3. Tác dụng với oxide base:**
- CaO + CO₂ → CaCite (CaCO₃)`,
                keyPoints: [
                    "Oxide base + Acid → Muối + H₂O",
                    "Oxide acid + Base → Muối + H₂O",
                    "CaO, Na₂O tan trong nước tạo base",
                    "CO₂, SO₃ tan trong nước tạo acid",
                ],
            },
        ],
    },
    {
        id: "8-5",
        title: "Muối",
        description: "Tính chất và phân loại muối",
        lessons: [
            {
                id: "8-5-1",
                title: "Khái niệm và phân loại Muối",
                content: `**Muối** là hợp chất gồm kim loại (hoặc NH₄⁺) liên kết với gốc acid.

**Công thức tổng quát:** MₓAᵧ

**Phân loại:**

**1. Muối trung hòa:**
- Gốc acid không còn H có thể thay thế
- Ví dụ: NaCl, Na₂SO₄, CaCO₃, FeCl₃

**2. Muối acid:**
- Gốc acid còn H có thể thay thế bằng kim loại
- Ví dụ: NaHCO₃, NaH₂PO₄, Ca(HCO₃)₂

**Tên gọi muối:**
| Gốc acid | Tên gốc | Ví dụ |
|----------|---------|-------|
| Cl⁻ | chloride | NaCl |
| SO₄²⁻ | sulfate | CuSO₄ |
| NO₃⁻ | nitrate | KNO₃ |
| CO₃²⁻ | carbonate | CaCO₃ |
| PO₄³⁻ | phosphate | Ca₃(PO₄)₂ |`,
                keyPoints: [
                    "Muối = Kim loại + Gốc acid",
                    "Muối trung hòa: không còn H thay thế được",
                    "Muối acid: còn H có thể thay thế (NaHCO₃)",
                    "Nhớ tên gọi các gốc acid thường gặp",
                ],
            },
            {
                id: "8-5-2",
                title: "Tính chất hóa học của Muối",
                content: `**1. Tác dụng với kim loại:**
Muối + KL (mạnh hơn) → Muối mới + KL mới

- CuSO₄ + Fe → FeSO₄ + Cu↓
- AgNO₃ + Cu → Cu(NO₃)₂ + Ag↓

**2. Tác dụng với acid:**
Muối + Acid → Muối mới + Acid mới

- CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑
- Na₂SO₃ + H₂SO₄ → Na₂SO₄ + H₂O + SO₂↑

**3. Tác dụng với base:**
Muối + Base → Muối mới + Base mới

- CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄
- FeCl₃ + 3KOH → Fe(OH)₃↓ + 3KCl

**4. Tác dụng với muối:**
Muối + Muối → 2 Muối mới (có kết tủa)

- NaCl + AgNO₃ → AgCl↓ + NaNO₃
- BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl

**5. Phản ứng nhiệt phân:** (một số muối)
- CaCO₃ → CaO + CO₂`,
                keyPoints: [
                    "Muối + KL mạnh hơn → KL yếu hơn bị đẩy ra",
                    "CaCO₃ + Acid → CO₂ (sủi bọt)",
                    "Muối + Base → kết tủa hydroxide",
                    "Muối + Muối → điều kiện: có kết tủa",
                ],
            },
        ],
    },
    {
        id: "8-6",
        title: "Phân bón hóa học",
        description: "Các loại phân bón và vai trò",
        lessons: [
            {
                id: "8-6-1",
                title: "Phân bón và các nguyên tố dinh dưỡng",
                content: `**Phân bón** cung cấp chất dinh dưỡng cho cây trồng.

**Nguyên tố đa lượng:**
- **Nitrogen (N):** Phát triển thân lá
- **Phosphorus (P):** Phát triển rễ, ra hoa kết quả
- **Potassium (K):** Tăng sức đề kháng, chất lượng quả

**Nguyên tố trung lượng:** Ca, Mg, S

**Nguyên tố vi lượng:** Fe, Mn, Zn, Cu, B, Mo

**Biểu hiện thiếu dinh dưỡng:**
| Thiếu | Biểu hiện |
|-------|-----------|
| N | Lá vàng, cây còi cọc |
| P | Lá tím, rễ kém phát triển |
| K | Mép lá cháy, quả nhỏ |`,
                keyPoints: [
                    "N-P-K là 3 nguyên tố đa lượng chính",
                    "N: thân lá, P: rễ và hoa, K: sức đề kháng",
                    "Thiếu N: lá vàng, thiếu P: lá tím",
                    "Vi lượng cần ít nhưng rất quan trọng",
                ],
            },
            {
                id: "8-6-2",
                title: "Các loại phân bón hóa học",
                content: `**1. Phân đạm (N):**
- Urê: CO(NH₂)₂ - 46% N
- Ammonium sulfate: (NH₄)₂SO₄ - 21% N
- Ammonium nitrate: NH₄NO₃ - 35% N

**2. Phân lân (P):**
- Superphosphate: Ca(H₂PO₄)₂
- Phosphate tự nhiên: Ca₃(PO₄)₂

**3. Phân kali (K):**
- Potassium chloride: KCl - 60% K₂O
- Potassium sulfate: K₂SO₄

**4. Phân hỗn hợp NPK:**
- Chứa cả N, P, K
- Ví dụ: NPK 16-16-8 (16%N, 16%P₂O₅, 8%K₂O)

**Lưu ý sử dụng:**
- Bón đúng loại, đúng lượng, đúng lúc
- Không bón quá nhiều gây ô nhiễm
- Kết hợp phân hữu cơ và vô cơ`,
                keyPoints: [
                    "Phân đạm: Urê (46% N) phổ biến nhất",
                    "Phân lân: Superphosphate",
                    "Phân kali: KCl (60% K₂O)",
                    "NPK là phân hỗn hợp tiện dụng",
                ],
            },
        ],
    },
];
