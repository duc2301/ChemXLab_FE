// Curriculum data for Grade 10 - Hóa học
// Chân Trời Sáng Tạo 2024-2025

import type { Topic } from "./grade6";

export const grade10Topics: Topic[] = [
    {
        id: "10-1",
        title: "Cấu tạo nguyên tử",
        description: "Thành phần, cấu trúc nguyên tử và cấu hình electron",
        lessons: [
            {
                id: "10-1-1",
                title: "Thành phần nguyên tử",
                content: `**Nguyên tử** gồm hạt nhân và vỏ electron.

**Hạt nhân:**
| Hạt | Ký hiệu | Điện tích | Khối lượng |
|-----|---------|-----------|------------|
| Proton | p | +1 | 1 u |
| Neutron | n | 0 | 1 u |

**Vỏ electron:**
| Hạt | Ký hiệu | Điện tích | Khối lượng |
|-----|---------|-----------|------------|
| Electron | e | -1 | 0.00055 u |

**Các đại lượng:**
- **Số hiệu nguyên tử (Z):** Z = số p = số e
- **Số khối (A):** A = Z + N (N là số neutron)
- **Ký hiệu nguyên tử:** ᴬzX

**Ví dụ:** ²³₁₁Na
- Z = 11 (11 proton, 11 electron)
- A = 23 → N = 23 - 11 = 12 neutron`,
                keyPoints: [
                    "Hạt nhân: proton (+) và neutron (0)",
                    "Vỏ: electron (-)",
                    "Z = số p = số e (nguyên tử trung hòa)",
                    "A = Z + N (số khối = số p + số n)",
                ],
            },
            {
                id: "10-1-2",
                title: "Đồng vị và Nguyên tử khối trung bình",
                content: `**Đồng vị** là những nguyên tử có cùng số proton nhưng khác số neutron.

**Ví dụ đồng vị của Hydrogen:**
- ¹₁H (Protium): 1p, 0n
- ²₁H (Deuterium - D): 1p, 1n
- ³₁H (Tritium - T): 1p, 2n

**Ví dụ đồng vị của Carbon:**
- ¹²₆C: 98.9%
- ¹³₆C: 1.1%
- ¹⁴₆C: vết (dùng định tuổi khảo cổ)

**Nguyên tử khối trung bình:**
Ā = (A₁.x₁ + A₂.x₂ + ...)/100

Trong đó:
- A₁, A₂: số khối các đồng vị
- x₁, x₂: % số nguyên tử mỗi đồng vị

**Ví dụ:** Chlorine có:
- ³⁵Cl: 75.77%
- ³⁷Cl: 24.23%
→ Ā = (35×75.77 + 37×24.23)/100 = 35.5`,
                keyPoints: [
                    "Đồng vị: cùng Z, khác N (khác A)",
                    "Đồng vị có tính chất hóa học giống nhau",
                    "NTK trung bình tính theo % các đồng vị",
                    "Chlorine: 35.5 do có 2 đồng vị",
                ],
            },
            {
                id: "10-1-3",
                title: "Cấu hình electron nguyên tử",
                content: `**Cấu hình electron** mô tả sự phân bố electron trong nguyên tử.

**Các lớp và phân lớp:**
| Lớp | n | Phân lớp | Số e tối đa |
|-----|---|----------|-------------|
| K | 1 | s | 2 |
| L | 2 | s, p | 8 |
| M | 3 | s, p, d | 18 |
| N | 4 | s, p, d, f | 32 |

**Số electron tối đa:**
- Phân lớp s: 2e
- Phân lớp p: 6e
- Phân lớp d: 10e
- Phân lớp f: 14e

**Thứ tự mức năng lượng:**
1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p < 5s...

**Ví dụ:**
- Na (Z=11): 1s² 2s² 2p⁶ 3s¹
- Fe (Z=26): 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²
             hoặc [Ar] 3d⁶ 4s²`,
                keyPoints: [
                    "Electron điền theo thứ tự mức năng lượng tăng dần",
                    "1s → 2s → 2p → 3s → 3p → 4s → 3d...",
                    "Lớp ngoài cùng quyết định tính chất hóa học",
                    "Viết gọn: dùng cấu hình khí hiếm trước đó",
                ],
            },
        ],
    },
    {
        id: "10-2",
        title: "Bảng tuần hoàn các nguyên tố",
        description: "Cấu tạo bảng tuần hoàn và xu hướng biến đổi",
        lessons: [
            {
                id: "10-2-1",
                title: "Cấu tạo bảng tuần hoàn",
                content: `**Bảng tuần hoàn** sắp xếp các nguyên tố theo số hiệu nguyên tử tăng dần.

**Cấu trúc:**
- 7 chu kỳ (hàng ngang)
- 18 nhóm (cột dọc)
- 8 nhóm A + 8 nhóm B

**Chu kỳ:**
- Số chu kỳ = Số lớp electron
- Chu kỳ 1: 2 nguyên tố
- Chu kỳ 2, 3: 8 nguyên tố
- Chu kỳ 4, 5: 18 nguyên tố
- Chu kỳ 6, 7: 32 nguyên tố

**Nhóm A:**
- Số nhóm A = Số e lớp ngoài cùng
- IA: Kim loại kiềm (Li, Na, K...)
- IIA: Kim loại kiềm thổ (Mg, Ca...)
- VIIA: Halogen (F, Cl, Br, I)
- VIIIA: Khí hiếm (He, Ne, Ar...)

**Nhóm B:** Kim loại chuyển tiếp
- Cấu hình (n-1)d¹⁻¹⁰ ns¹⁻²`,
                keyPoints: [
                    "7 chu kỳ, 18 nhóm (8A + 8B)",
                    "Chu kỳ = số lớp electron",
                    "Nhóm A = số e lớp ngoài cùng",
                    "Kim loại kiềm nhóm IA, halogen nhóm VIIA",
                ],
            },
            {
                id: "10-2-2",
                title: "Xu hướng biến đổi tính chất",
                content: `**Trong một chu kỳ (trái → phải):**
- Bán kính nguyên tử: giảm
- Độ âm điện: tăng
- Tính kim loại: giảm
- Tính phi kim: tăng
- Tính acid oxide: tăng
- Tính base oxide: giảm

**Trong một nhóm A (trên → dưới):**
- Bán kính nguyên tử: tăng
- Độ âm điện: giảm
- Tính kim loại: tăng
- Tính phi kim: giảm

**Độ âm điện (χ):**
- Đo khả năng hút electron
- F có χ cao nhất (3.98)
- Cs có χ thấp nhất (0.79)

**Ứng dụng:**
- Dự đoán tính chất nguyên tố
- So sánh tính acid-base của oxide, hydroxide`,
                keyPoints: [
                    "Chu kỳ: R↓, χ↑, tính KL↓, tính PK↑",
                    "Nhóm: R↑, χ↓, tính KL↑, tính PK↓",
                    "F có độ âm điện cao nhất",
                    "Kim loại kiềm hoạt động mạnh nhất ở đáy nhóm IA",
                ],
            },
        ],
    },
    {
        id: "10-3",
        title: "Liên kết hóa học",
        description: "Liên kết ion, cộng hóa trị và liên kết yếu",
        lessons: [
            {
                id: "10-3-1",
                title: "Liên kết ion",
                content: `**Liên kết ion** hình thành do lực hút tĩnh điện giữa các ion trái dấu.

**Điều kiện:**
- Giữa kim loại điển hình và phi kim điển hình
- Hiệu độ âm điện Δχ ≥ 1.7

**Quá trình hình thành:**
1. Kim loại nhường e → cation
2. Phi kim nhận e → anion
3. Cation và anion hút nhau

**Ví dụ NaCl:**
Na → Na⁺ + e⁻
Cl + e⁻ → Cl⁻
Na⁺ + Cl⁻ → NaCl

**Tính chất hợp chất ion:**
- Tinh thể rắn, cứng, giòn
- Nhiệt độ nóng chảy, sôi cao
- Dẫn điện khi nóng chảy hoặc hòa tan
- Thường tan trong nước`,
                keyPoints: [
                    "Liên kết ion: KL điển hình + PK điển hình",
                    "Δχ ≥ 1.7 → liên kết ion",
                    "Hình thành do cho-nhận electron",
                    "Hợp chất ion: rắn, nhiệt độ nc/s cao, dẫn điện khi tan",
                ],
            },
            {
                id: "10-3-2",
                title: "Liên kết cộng hóa trị",
                content: `**Liên kết cộng hóa trị** hình thành do sự góp chung electron.

**Điều kiện:**
- Giữa các phi kim
- Hiệu độ âm điện Δχ < 1.7

**Phân loại:**

**1. Liên kết CHT không phân cực:**
- Δχ = 0 hoặc rất nhỏ
- Cặp e chung ở giữa
- Ví dụ: H₂, O₂, N₂, Cl₂

**2. Liên kết CHT phân cực:**
- 0 < Δχ < 1.7
- Cặp e lệch về nguyên tử có χ lớn hơn
- Ví dụ: HCl, H₂O, NH₃

**Liên kết đôi và ba:**
- Liên kết đơn: 1 cặp e (σ)
- Liên kết đôi: 2 cặp e (1σ + 1π) - Ví dụ: O=O
- Liên kết ba: 3 cặp e (1σ + 2π) - Ví dụ: N≡N`,
                keyPoints: [
                    "CHT: góp chung electron giữa phi kim",
                    "CHT không phân cực: Δχ ≈ 0 (H₂, Cl₂)",
                    "CHT phân cực: 0 < Δχ < 1.7 (HCl, H₂O)",
                    "Liên kết đôi, ba có thêm liên kết π",
                ],
            },
            {
                id: "10-3-3",
                title: "Liên kết hydrogen và Van der Waals",
                content: `**Liên kết hydrogen:**
- Liên kết yếu giữa H (liên kết với F, O, N) với F, O, N của phân tử khác
- Ký hiệu: ···

**Điều kiện:**
- H liên kết với nguyên tử có độ âm điện cao (F, O, N)
- Tương tác với cặp e chưa liên kết của F, O, N

**Ví dụ:**
- H₂O···H-O-H (giữa các phân tử nước)
- NH₃···H-NH₂

**Ảnh hưởng:**
- Làm tăng nhiệt độ sôi, nóng chảy
- H₂O lỏng ở điều kiện thường (do liên kết H)
- DNA: liên kết H giữa các base

**Tương tác Van der Waals:**
- Lực hút yếu giữa các phân tử
- Tăng theo khối lượng phân tử
- Giải thích nhiệt độ sôi tăng dần: F₂ < Cl₂ < Br₂ < I₂`,
                keyPoints: [
                    "Liên kết H: H(liên kết F,O,N) với F,O,N",
                    "H₂O có nhiệt độ sôi cao do liên kết hydrogen",
                    "Van der Waals: lực hút yếu giữa phân tử",
                    "Cả hai đều là liên kết yếu, dễ đứt",
                ],
            },
        ],
    },
    {
        id: "10-4",
        title: "Phản ứng oxi hóa - khử",
        description: "Số oxi hóa, chất khử, chất oxi hóa và cân bằng",
        lessons: [
            {
                id: "10-4-1",
                title: "Số oxi hóa",
                content: `**Số oxi hóa** là điện tích quy ước của nguyên tử trong hợp chất.

**Quy tắc xác định:**

1. **Đơn chất:** Số oxi hóa = 0
   Fe, O₂, N₂, S: số oxi hóa = 0

2. **Ion đơn nguyên tử:** Số oxi hóa = điện tích ion
   Na⁺: +1, Cl⁻: -1, Fe³⁺: +3

3. **Hợp chất:**
   - H thường +1 (trừ trong hydrua: -1)
   - O thường -2 (trừ trong OF₂: +2, peroxide: -1)
   - Tổng số oxi hóa = 0

4. **Ion đa nguyên tử:**
   Tổng số oxi hóa = điện tích ion

**Ví dụ xác định số oxi hóa:**
H₂SO₄: 2(+1) + x + 4(-2) = 0 → x = +6
SO₄²⁻: x + 4(-2) = -2 → x = +6`,
                keyPoints: [
                    "Đơn chất: số oxi hóa = 0",
                    "H thường +1, O thường -2",
                    "Tổng số oxi hóa trong phân tử = 0",
                    "Tổng số oxi hóa trong ion = điện tích ion",
                ],
            },
            {
                id: "10-4-2",
                title: "Phản ứng oxi hóa - khử",
                content: `**Phản ứng oxi hóa - khử** là phản ứng có sự thay đổi số oxi hóa.

**Khái niệm:**
- **Sự oxi hóa:** Tăng số oxi hóa (nhường e)
- **Sự khử:** Giảm số oxi hóa (nhận e)
- **Chất khử:** Nhường e, bị oxi hóa
- **Chất oxi hóa:** Nhận e, bị khử

**Ví dụ:**
Zn + H₂SO₄ → ZnSO₄ + H₂↑

Zn⁰ → Zn²⁺ + 2e (Zn là chất khử, bị oxi hóa)
2H⁺ + 2e → H₂⁰ (H⁺ là chất oxi hóa, bị khử)

**Cách cân bằng (phương pháp thăng bằng electron):**
1. Xác định số oxi hóa thay đổi
2. Viết quá trình oxi hóa và quá trình khử
3. Cân bằng electron cho-nhận
4. Đặt hệ số vào phương trình
5. Kiểm tra lại`,
                keyPoints: [
                    "Chất khử: nhường e, số oxi hóa tăng",
                    "Chất oxi hóa: nhận e, số oxi hóa giảm",
                    "Số e cho = Số e nhận",
                    "Dùng PP thăng bằng electron để cân bằng",
                ],
            },
        ],
    },
    {
        id: "10-5",
        title: "Năng lượng hóa học",
        description: "Enthalpy và biến thiên enthalpy của phản ứng",
        lessons: [
            {
                id: "10-5-1",
                title: "Enthalpy và biến thiên enthalpy",
                content: `**Enthalpy (H):** Năng lượng tổng của hệ.

**Biến thiên enthalpy (ΔH):**
ΔH = H(sản phẩm) - H(chất tham gia)

**Phân loại phản ứng:**

**1. Phản ứng tỏa nhiệt:**
- ΔH < 0
- Hệ tỏa nhiệt ra môi trường
- Ví dụ: Đốt cháy nhiên liệu
C + O₂ → CO₂ ; ΔH = -393.5 kJ/mol

**2. Phản ứng thu nhiệt:**
- ΔH > 0
- Hệ thu nhiệt từ môi trường
- Ví dụ: Phân hủy CaCO₃
CaCO₃ → CaO + CO₂ ; ΔH = +178 kJ/mol

**Enthalpy tạo thành chuẩn (ΔHf°):**
- Enthalpy tạo thành 1 mol chất từ đơn chất
- Điều kiện chuẩn: 25°C, 1 atm
- ΔHf° của đơn chất bền = 0`,
                keyPoints: [
                    "ΔH < 0: tỏa nhiệt, ΔH > 0: thu nhiệt",
                    "Đốt cháy là phản ứng tỏa nhiệt",
                    "Phân hủy thường là phản ứng thu nhiệt",
                    "ΔHf° của đơn chất bền = 0",
                ],
            },
        ],
    },
    {
        id: "10-6",
        title: "Tốc độ phản ứng hóa học",
        description: "Khái niệm và các yếu tố ảnh hưởng",
        lessons: [
            {
                id: "10-6-1",
                title: "Tốc độ phản ứng và các yếu tố ảnh hưởng",
                content: `**Tốc độ phản ứng** là đại lượng đo sự thay đổi nồng độ theo thời gian.

**Công thức:** v = ΔC/Δt

**Các yếu tố ảnh hưởng:**

**1. Nồng độ:**
- Nồng độ tăng → tốc độ tăng
- Nhiều va chạm giữa các phân tử hơn

**2. Nhiệt độ:**
- Nhiệt độ tăng → tốc độ tăng
- Quy tắc Van't Hoff: t° tăng 10°C → v tăng 2-4 lần

**3. Áp suất (với chất khí):**
- Áp suất tăng → nồng độ tăng → v tăng

**4. Diện tích tiếp xúc:**
- Chia nhỏ → diện tích tăng → v tăng
- Ví dụ: bột Zn phản ứng nhanh hơn Zn miếng

**5. Chất xúc tác:**
- Tăng tốc độ phản ứng
- Không bị tiêu hao sau phản ứng
- Ví dụ: MnO₂ xúc tác phân hủy H₂O₂`,
                keyPoints: [
                    "5 yếu tố: nồng độ, nhiệt độ, áp suất, diện tích, xúc tác",
                    "Nhiệt độ +10°C → tốc độ tăng 2-4 lần",
                    "Chất xúc tác không bị tiêu hao",
                    "Tăng diện tích tiếp xúc để tăng tốc độ",
                ],
            },
        ],
    },
    {
        id: "10-7",
        title: "Nguyên tố nhóm VIIA - Halogen",
        description: "Tính chất và các hợp chất của halogen",
        lessons: [
            {
                id: "10-7-1",
                title: "Đơn chất halogen",
                content: `**Halogen** gồm: F, Cl, Br, I, At (nhóm VIIA).

**Cấu tạo:**
- Cấu hình: ns² np⁵
- 7 electron lớp ngoài cùng
- Tồn tại dạng phân tử X₂

**Tính chất vật lý:**
| Halogen | Trạng thái | Màu sắc |
|---------|------------|---------|
| F₂ | Khí | Vàng lục nhạt |
| Cl₂ | Khí | Vàng lục |
| Br₂ | Lỏng | Nâu đỏ |
| I₂ | Rắn | Tím đen |

**Tính chất hóa học (tính oxi hóa mạnh):**

*1. Với kim loại:*
2Na + Cl₂ → 2NaCl
2Fe + 3Cl₂ → 2FeCl₃

*2. Với hydrogen:*
H₂ + Cl₂ → 2HCl (nổ khi có ánh sáng)
H₂ + I₂ ⇌ 2HI (thuận nghịch, cần t°)

*3. Với nước:*
Cl₂ + H₂O ⇌ HCl + HClO (nước clo)

**Tính oxi hóa giảm:** F₂ > Cl₂ > Br₂ > I₂`,
                keyPoints: [
                    "F₂ khí, Cl₂ khí, Br₂ lỏng, I₂ rắn",
                    "Halogen có tính oxi hóa mạnh",
                    "Tính oxi hóa: F₂ > Cl₂ > Br₂ > I₂",
                    "Cl₂ + H₂O → HCl + HClO (khử trùng)",
                ],
            },
            {
                id: "10-7-2",
                title: "Hydrogen halide và Halide",
                content: `**Hydrogen halide (HX):**

**Tính chất vật lý:**
- Đều là chất khí không màu
- Mùi hắc, tan nhiều trong nước

**Tính acid trong nước:**
- HF: acid yếu (ăn mòn thủy tinh)
- HCl, HBr, HI: acid mạnh
- Tính acid: HF < HCl < HBr < HI

**Tính chất hóa học HCl (đại diện):**

*1. Làm đỏ quỳ tím*

*2. Với kim loại (trước H):*
Zn + 2HCl → ZnCl₂ + H₂↑

*3. Với base:*
HCl + NaOH → NaCl + H₂O

*4. Với oxide base:*
2HCl + CuO → CuCl₂ + H₂O

*5. Với muối:*
2HCl + CaCO₃ → CaCl₂ + H₂O + CO₂↑

**Nhận biết ion halide:**
- Cl⁻ + Ag⁺ → AgCl↓ (trắng)
- Br⁻ + Ag⁺ → AgBr↓ (vàng nhạt)
- I⁻ + Ag⁺ → AgI↓ (vàng đậm)`,
                keyPoints: [
                    "Tính acid: HF < HCl < HBr < HI",
                    "HCl có đầy đủ tính chất acid mạnh",
                    "HF ăn mòn thủy tinh (SiO₂)",
                    "Nhận biết: AgCl trắng, AgBr vàng nhạt, AgI vàng",
                ],
            },
        ],
    },
];
