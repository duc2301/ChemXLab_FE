// Curriculum data for Grade 7 - Khoa học tự nhiên (Chemistry part)
// Chân Trời Sáng Tạo 2024-2025

import type { Topic } from "./grade6";

export const grade7Topics: Topic[] = [
    {
        id: "7-1",
        title: "Nguyên tử",
        description: "Cấu tạo và mô hình nguyên tử",
        lessons: [
            {
                id: "7-1-1",
                title: "Khái niệm nguyên tử",
                content: `**Nguyên tử** là hạt vô cùng nhỏ, trung hòa về điện, cấu tạo nên các chất.

**Cấu tạo nguyên tử:**
- **Hạt nhân:** Ở tâm nguyên tử
  - Proton (p): điện tích dương (+)
  - Neutron (n): không mang điện
- **Lớp vỏ electron:** 
  - Electron (e): điện tích âm (-)
  - Chuyển động quanh hạt nhân

**Khối lượng:**
- Proton ≈ Neutron ≈ 1 đvC
- Electron rất nhỏ (≈ 1/1836 proton)
- Khối lượng nguyên tử ≈ khối lượng hạt nhân

**Điện tích:**
- Số proton = Số electron → Nguyên tử trung hòa điện`,
                keyPoints: [
                    "Nguyên tử gồm: hạt nhân (proton, neutron) + vỏ electron",
                    "Proton mang điện (+), electron mang điện (-)",
                    "Số p = Số e → nguyên tử trung hòa điện",
                    "Khối lượng nguyên tử tập trung ở hạt nhân",
                ],
            },
            {
                id: "7-1-2",
                title: "Mô hình nguyên tử",
                content: `**Lịch sử phát triển mô hình nguyên tử:**

**1. Mô hình Dalton (1803):**
- Nguyên tử là quả cầu đặc, không thể chia nhỏ

**2. Mô hình Thomson (1904):**
- "Bánh pudding nho khô"
- Electron phân bố trong khối cầu tích điện dương

**3. Mô hình Rutherford (1911):**
- Hạt nhân nhỏ, mang điện dương ở tâm
- Electron chuyển động xung quanh
- Phần lớn nguyên tử là không gian trống

**4. Mô hình Bohr (1913):**
- Electron chuyển động trên các quỹ đạo xác định
- Các lớp electron: K, L, M, N...

**5. Mô hình hiện đại:**
- Electron tồn tại trong các orbital
- Đám mây electron bao quanh hạt nhân`,
                keyPoints: [
                    "Mô hình nguyên tử phát triển qua nhiều giai đoạn",
                    "Rutherford phát hiện hạt nhân nguyên tử",
                    "Bohr: electron chuyển động trên quỹ đạo xác định",
                    "Mô hình hiện đại: orbital và đám mây electron",
                ],
            },
        ],
    },
    {
        id: "7-2",
        title: "Nguyên tố hóa học",
        description: "Khái niệm nguyên tố, ký hiệu và nguyên tử khối",
        lessons: [
            {
                id: "7-2-1",
                title: "Nguyên tố hóa học",
                content: `**Nguyên tố hóa học** là tập hợp những nguyên tử có cùng số proton trong hạt nhân.

**Số hiệu nguyên tử (Z):**
- Z = Số proton = Số electron
- Đặc trưng cho mỗi nguyên tố
- Ví dụ: Z(H) = 1, Z(C) = 6, Z(O) = 8

**Ký hiệu nguyên tố:**
- Chữ cái đầu viết hoa
- Một số có thêm chữ cái thứ hai viết thường
- Ví dụ: H, C, O, Na, Ca, Fe, Cu

**Bảng một số nguyên tố quan trọng:**
| Tên | Ký hiệu | Z |
|-----|---------|---|
| Hydrogen | H | 1 |
| Carbon | C | 6 |
| Nitrogen | N | 7 |
| Oxygen | O | 8 |
| Sodium | Na | 11 |
| Chlorine | Cl | 17 |
| Iron | Fe | 26 |`,
                keyPoints: [
                    "Nguyên tố là tập hợp nguyên tử có cùng số proton",
                    "Số hiệu nguyên tử Z = số proton",
                    "Mỗi nguyên tố có ký hiệu riêng",
                    "Hiện nay đã biết 118 nguyên tố hóa học",
                ],
            },
            {
                id: "7-2-2",
                title: "Nguyên tử khối",
                content: `**Nguyên tử khối** là khối lượng của nguyên tử tính bằng đơn vị cacbon (đvC).

**Đơn vị cacbon (u hoặc đvC):**
- 1 đvC = 1/12 khối lượng nguyên tử Carbon-12
- 1 đvC ≈ 1.66 × 10⁻²⁴ g

**Công thức tính:**
Nguyên tử khối ≈ Số proton + Số neutron

**Nguyên tử khối một số nguyên tố:**
| Nguyên tố | Ký hiệu | NTK |
|-----------|---------|-----|
| Hydrogen | H | 1 |
| Carbon | C | 12 |
| Nitrogen | N | 14 |
| Oxygen | O | 16 |
| Sodium | Na | 23 |
| Magnesium | Mg | 24 |
| Sulfur | S | 32 |
| Chlorine | Cl | 35.5 |
| Calcium | Ca | 40 |
| Iron | Fe | 56 |

**Lưu ý:** Cần ghi nhớ nguyên tử khối các nguyên tố thường gặp!`,
                keyPoints: [
                    "Nguyên tử khối đo bằng đơn vị cacbon (đvC)",
                    "NTK ≈ Số p + Số n",
                    "H=1, C=12, N=14, O=16, Na=23, Cl=35.5",
                    "S=32, Ca=40, Fe=56",
                ],
            },
        ],
    },
    {
        id: "7-3",
        title: "Sơ lược về Bảng tuần hoàn",
        description: "Cấu tạo và cách sử dụng bảng tuần hoàn",
        lessons: [
            {
                id: "7-3-1",
                title: "Cấu tạo bảng tuần hoàn",
                content: `**Bảng tuần hoàn các nguyên tố hóa học** do Mendeleev lập ra năm 1869.

**Cấu tạo:**
- **118 nguyên tố** (đến nay)
- **7 chu kỳ** (hàng ngang)
- **18 nhóm** (cột dọc)

**Chu kỳ:**
- Gồm các nguyên tố có cùng số lớp electron
- Chu kỳ 1: 2 nguyên tố (H, He)
- Chu kỳ 2: 8 nguyên tố (Li → Ne)
- Chu kỳ 3: 8 nguyên tố (Na → Ar)

**Nhóm:**
- Nhóm A (IA → VIIIA): nguyên tố nhóm chính
- Nhóm B: nguyên tố chuyển tiếp

**Phân loại:**
- Kim loại: bên trái và giữa
- Phi kim: bên phải
- Khí hiếm: nhóm VIIIA`,
                keyPoints: [
                    "Bảng tuần hoàn có 7 chu kỳ và 18 nhóm",
                    "Chu kỳ = số lớp electron",
                    "Nguyên tố cùng nhóm có tính chất tương tự",
                    "Kim loại bên trái, phi kim bên phải",
                ],
            },
            {
                id: "7-3-2",
                title: "Cách sử dụng bảng tuần hoàn",
                content: `**Đọc thông tin từ ô nguyên tố:**

Mỗi ô chứa:
- Số hiệu nguyên tử (Z)
- Ký hiệu nguyên tố
- Tên nguyên tố
- Nguyên tử khối

**Ví dụ ô nguyên tố Sodium:**
\`\`\`
    11
    Na
  Sodium
   23
\`\`\`

**Xác định vị trí:**
- Số thứ tự = Số hiệu nguyên tử
- Chu kỳ = Số lớp electron
- Nhóm A = Số electron lớp ngoài cùng

**Ví dụ: Nguyên tố X có 17 proton**
- Số hiệu: 17 → Vị trí 17 → Chlorine (Cl)
- Cấu hình: 2, 8, 7
- Chu kỳ 3, nhóm VIIA`,
                keyPoints: [
                    "Mỗi ô cho biết: Z, ký hiệu, tên, NTK",
                    "Vị trí trong bảng cho biết cấu tạo nguyên tử",
                    "Chu kỳ = số lớp e, nhóm A = số e lớp ngoài",
                    "Nguyên tố cùng nhóm có tính chất hóa học tương tự",
                ],
            },
        ],
    },
    {
        id: "7-4",
        title: "Phân tử",
        description: "Khái niệm phân tử, đơn chất và hợp chất",
        lessons: [
            {
                id: "7-4-1",
                title: "Phân tử",
                content: `**Phân tử** là hạt đại diện cho chất, gồm một số nguyên tử liên kết với nhau.

**Đặc điểm:**
- Thể hiện đầy đủ tính chất hóa học của chất
- Các nguyên tử liên kết theo tỷ lệ xác định
- Có khối lượng xác định

**Phân tử khối:**
- Là tổng nguyên tử khối của các nguyên tử trong phân tử
- Đơn vị: đvC

**Ví dụ:**
- H₂O: PTK = 2×1 + 16 = 18 đvC
- CO₂: PTK = 12 + 2×16 = 44 đvC
- H₂SO₄: PTK = 2×1 + 32 + 4×16 = 98 đvC
- NaCl: PTK = 23 + 35.5 = 58.5 đvC`,
                keyPoints: [
                    "Phân tử gồm các nguyên tử liên kết với nhau",
                    "Phân tử khối = Tổng NTK của các nguyên tử",
                    "PTK(H₂O) = 18, PTK(CO₂) = 44",
                    "Phân tử thể hiện tính chất hóa học của chất",
                ],
            },
            {
                id: "7-4-2",
                title: "Đơn chất và Hợp chất",
                content: `**Đơn chất:**
- Tạo bởi một nguyên tố hóa học
- Ví dụ: O₂, N₂, Fe, Cu, S, C

**Phân loại đơn chất:**
1. Kim loại: Fe, Cu, Al, Au...
2. Phi kim: O₂, S, C, P...
3. Khí hiếm: He, Ne, Ar...

**Hợp chất:**
- Tạo bởi hai hay nhiều nguyên tố hóa học
- Ví dụ: H₂O, NaCl, CO₂, H₂SO₄

**Phân loại hợp chất:**
1. Hợp chất vô cơ: NaCl, H₂O, H₂SO₄
2. Hợp chất hữu cơ: CH₄, C₂H₅OH, C₆H₁₂O₆

**So sánh:**
| Đơn chất | Hợp chất |
|----------|----------|
| 1 nguyên tố | ≥2 nguyên tố |
| O₂, Fe, S | H₂O, NaCl |`,
                keyPoints: [
                    "Đơn chất: tạo bởi 1 nguyên tố",
                    "Hợp chất: tạo bởi 2+ nguyên tố",
                    "Kim loại, phi kim là đơn chất",
                    "Nước, muối ăn là hợp chất",
                ],
            },
        ],
    },
    {
        id: "7-5",
        title: "Liên kết hóa học và Hóa trị",
        description: "Các loại liên kết và khái niệm hóa trị",
        lessons: [
            {
                id: "7-5-1",
                title: "Liên kết hóa học",
                content: `**Liên kết hóa học** là sự kết hợp giữa các nguyên tử tạo thành phân tử.

**1. Liên kết ion:**
- Hình thành do sự cho và nhận electron
- Giữa kim loại và phi kim
- Ví dụ: NaCl, MgO, CaCl₂

Na → Na⁺ + e⁻ (nhường electron)
Cl + e⁻ → Cl⁻ (nhận electron)
Na⁺ + Cl⁻ → NaCl

**2. Liên kết cộng hóa trị:**
- Hình thành do sự góp chung electron
- Giữa các phi kim
- Ví dụ: H₂, O₂, H₂O, CO₂

H• + •H → H:H (H₂)
Mỗi H góp 1e → cặp e chung

**Đặc điểm:**
- Liên kết ion: chất rắn, dẫn điện khi tan/nóng chảy
- Liên kết CHT: có thể rắn/lỏng/khí, thường không dẫn điện`,
                keyPoints: [
                    "Liên kết ion: cho-nhận electron (KL + PK)",
                    "Liên kết cộng hóa trị: góp chung electron (PK + PK)",
                    "Liên kết ion tạo hợp chất ion (NaCl, MgO)",
                    "Liên kết CHT tạo phân tử (H₂O, CO₂)",
                ],
            },
            {
                id: "7-5-2",
                title: "Hóa trị",
                content: `**Hóa trị** là con số biểu thị khả năng liên kết của nguyên tử.

**Quy ước:**
- Hóa trị của H = I
- Hóa trị của O = II

**Hóa trị một số nguyên tố:**
| Nguyên tố | Hóa trị |
|-----------|---------|
| H, Na, K, Ag | I |
| O, Ca, Mg, Ba, Zn | II |
| Al | III |
| C, Si | IV |
| N | III, V |
| S | II, IV, VI |
| Fe | II, III |
| Cu | I, II |

**Hóa trị nhóm nguyên tử:**
| Nhóm | Hóa trị |
|------|---------|
| OH (hydroxide) | I |
| NO₃ (nitrate) | I |
| SO₄ (sulfate) | II |
| CO₃ (carbonate) | II |
| PO₄ (phosphate) | III |`,
                keyPoints: [
                    "Hóa trị H = I, hóa trị O = II",
                    "Một số nguyên tố có nhiều hóa trị: Fe(II,III), Cu(I,II)",
                    "Nhóm OH, NO₃ hóa trị I; SO₄, CO₃ hóa trị II",
                    "Hóa trị dùng để lập công thức hóa học",
                ],
            },
            {
                id: "7-5-3",
                title: "Công thức hóa học",
                content: `**Công thức hóa học (CTHH)** biểu diễn thành phần của chất.

**Cấu tạo:**
- Ký hiệu nguyên tố
- Chỉ số (số nguyên tử mỗi loại)

**Ví dụ:**
- H₂O: 2 nguyên tử H, 1 nguyên tử O
- H₂SO₄: 2H, 1S, 4O
- Ca(OH)₂: 1Ca, 2O, 2H

**Quy tắc hóa trị:**
Trong hợp chất AxBy: a × x = b × y

Với: a, b là hóa trị của A, B
     x, y là chỉ số

**Ví dụ lập CTHH của Nhôm và Oxygen:**
- Al hóa trị III, O hóa trị II
- III × x = II × y
- x = 2, y = 3
→ CTHH: Al₂O₃`,
                keyPoints: [
                    "CTHH gồm ký hiệu nguyên tố và chỉ số",
                    "Quy tắc: a × x = b × y",
                    "Áp dụng để lập và kiểm tra CTHH",
                    "Chỉ số = 1 không cần ghi",
                ],
            },
        ],
    },
];
