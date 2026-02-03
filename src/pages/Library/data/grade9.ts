// Curriculum data for Grade 9 - Khoa học tự nhiên (Chemistry part)
// Chân Trời Sáng Tạo 2024-2025

import type { Topic } from "./grade6";

export const grade9Topics: Topic[] = [
    {
        id: "9-1",
        title: "Tính chất chung của Kim loại",
        description: "Tính chất vật lý và hóa học của kim loại",
        lessons: [
            {
                id: "9-1-1",
                title: "Tính chất vật lý của Kim loại",
                content: `**Tính chất vật lý chung của kim loại:**

**1. Tính dẻo:**
- Có thể dát mỏng, kéo sợi
- Au, Ag, Cu, Al có tính dẻo cao

**2. Tính dẫn điện:**
- Kim loại dẫn điện tốt
- Thứ tự: Ag > Cu > Au > Al > Fe
- Dây điện thường làm bằng Cu, Al

**3. Tính dẫn nhiệt:**
- Truyền nhiệt tốt
- Nồi, chảo thường làm bằng Al, inox

**4. Ánh kim:**
- Bề mặt sáng bóng, phản xạ ánh sáng
- Au, Ag, Cu có ánh kim đẹp

**5. Khối lượng riêng:**
- KL nhẹ: Li, Na, K, Mg, Al
- KL nặng: Fe, Cu, Pb, Au, Pt

**6. Nhiệt độ nóng chảy:**
- Thấp nhất: Hg (-39°C)
- Cao nhất: W (3422°C)`,
                keyPoints: [
                    "4 tính chất: dẻo, dẫn điện, dẫn nhiệt, ánh kim",
                    "Ag dẫn điện tốt nhất, Cu đứng thứ 2",
                    "Kim loại nhẹ: Li, Na, K, Mg, Al",
                    "Hg (thủy ngân) là kim loại lỏng ở nhiệt độ thường",
                ],
            },
            {
                id: "9-1-2",
                title: "Tính chất hóa học của Kim loại",
                content: `**1. Tác dụng với phi kim:**

*a) Với oxygen:*
- 4Al + 3O₂ → 2Al₂O₃
- 3Fe + 2O₂ → Fe₃O₄
- 2Cu + O₂ → 2CuO

*b) Với chlorine:*
- 2Fe + 3Cl₂ → 2FeCl₃
- Cu + Cl₂ → CuCl₂

*c) Với sulfur:*
- Fe + S → FeS
- 2Al + 3S → Al₂S₃

**2. Tác dụng với nước:**
- 2Na + 2H₂O → 2NaOH + H₂↑
- Ca + 2H₂O → Ca(OH)₂ + H₂↑
- (Chỉ kim loại kiềm, kiềm thổ)

**3. Tác dụng với acid:**
- Zn + 2HCl → ZnCl₂ + H₂↑
- Fe + H₂SO₄(loãng) → FeSO₄ + H₂↑
- (Kim loại đứng trước H trong dãy HĐHH)

**4. Tác dụng với dung dịch muối:**
- Fe + CuSO₄ → FeSO₄ + Cu↓
- (Kim loại mạnh đẩy kim loại yếu ra khỏi muối)`,
                keyPoints: [
                    "Kim loại + O₂ → Oxide",
                    "Kim loại kiềm + H₂O → Base + H₂",
                    "Kim loại (trước H) + Acid → Muối + H₂",
                    "Kim loại mạnh đẩy kim loại yếu khỏi muối",
                ],
            },
        ],
    },
    {
        id: "9-2",
        title: "Dãy hoạt động hóa học của Kim loại",
        description: "Ý nghĩa và ứng dụng dãy hoạt động",
        lessons: [
            {
                id: "9-2-1",
                title: "Dãy hoạt động hóa học",
                content: `**Dãy hoạt động hóa học của kim loại:**

K > Na > Ca > Mg > Al > Zn > Fe > Ni > Sn > Pb > (H) > Cu > Hg > Ag > Pt > Au

**Cách nhớ:**
"Khi Nào Cần Mua Áo Záp Sắt Nhìn Sang Phố Hỏi Cửa Hàng Á Phi Âu"

**Ý nghĩa:**

**1. Mức độ hoạt động giảm dần từ trái sang phải**

**2. Kim loại đứng trước Mg:**
- Phản ứng với nước ở nhiệt độ thường
- Tạo base tan + H₂

**3. Kim loại từ Mg đến Pb:**
- Phản ứng với acid loãng (HCl, H₂SO₄ loãng)
- Tạo muối + H₂

**4. Kim loại sau H:**
- Không phản ứng với HCl, H₂SO₄ loãng
- Có thể phản ứng với H₂SO₄ đặc, HNO₃

**5. Kim loại mạnh đẩy kim loại yếu khỏi muối:**
- Fe + CuSO₄ → FeSO₄ + Cu
- (Fe đứng trước Cu)`,
                keyPoints: [
                    "K, Na, Ca, Mg, Al, Zn, Fe, Ni, Sn, Pb, H, Cu, Hg, Ag, Pt, Au",
                    "Kim loại trước Mg: phản ứng với H₂O",
                    "Kim loại trước H: phản ứng với acid loãng",
                    "Kim loại mạnh đẩy kim loại yếu khỏi dung dịch muối",
                ],
            },
        ],
    },
    {
        id: "9-3",
        title: "Hợp chất hữu cơ - Hydrocarbon",
        description: "Giới thiệu hợp chất hữu cơ và hydrocarbon",
        lessons: [
            {
                id: "9-3-1",
                title: "Giới thiệu hợp chất hữu cơ",
                content: `**Hợp chất hữu cơ** là hợp chất của carbon (trừ CO, CO₂, muối carbonate...).

**Đặc điểm:**
- Thành phần: C, H và có thể có O, N, S, halogen
- Liên kết: chủ yếu liên kết cộng hóa trị
- Số lượng: hàng triệu hợp chất

**Phân biệt hợp chất hữu cơ và vô cơ:**

| Hữu cơ | Vô cơ |
|--------|-------|
| Chứa C (trừ ngoại lệ) | Không chứa C |
| Dễ cháy | Khó cháy |
| Thường không tan trong nước | Nhiều chất tan trong nước |
| Nhiệt độ nóng chảy thấp | Nhiệt độ nóng chảy cao |

**Ví dụ hợp chất hữu cơ:**
- CH₄ (methane)
- C₂H₅OH (ethanol)
- CH₃COOH (acetic acid)
- C₆H₁₂O₆ (glucose)`,
                keyPoints: [
                    "Hợp chất hữu cơ chứa carbon",
                    "Ngoại lệ: CO, CO₂, H₂CO₃, muối carbonate là vô cơ",
                    "Hữu cơ: liên kết CHT, dễ cháy, không tan trong nước",
                    "Có hàng triệu hợp chất hữu cơ",
                ],
            },
            {
                id: "9-3-2",
                title: "Alkane (Methane)",
                content: `**Methane (CH₄)** là hydrocarbon đơn giản nhất.

**Cấu tạo phân tử:**
- CTPT: CH₄
- Cấu trúc: 1C liên kết với 4H
- Hình tứ diện đều

**Tính chất vật lý:**
- Chất khí không màu, không mùi
- Nhẹ hơn không khí
- Ít tan trong nước

**Tính chất hóa học:**

*1. Phản ứng cháy:*
CH₄ + 2O₂ → CO₂ + 2H₂O + Q
(Tỏa nhiều nhiệt)

*2. Phản ứng thế với halogen (có ánh sáng):*
CH₄ + Cl₂ --as--> CH₃Cl + HCl

**Ứng dụng:**
- Nhiên liệu (gas, khí thiên nhiên)
- Nguyên liệu hóa học
- Chất đốt trong công nghiệp`,
                keyPoints: [
                    "Methane CH₄ - hydrocarbon đơn giản nhất",
                    "Khí không màu, nhẹ hơn không khí",
                    "CH₄ + 2O₂ → CO₂ + 2H₂O (cháy)",
                    "Là thành phần chính của khí thiên nhiên, biogas",
                ],
            },
            {
                id: "9-3-3",
                title: "Alkene (Ethylene)",
                content: `**Ethylene (C₂H₄)** là alkene đơn giản nhất, có liên kết đôi C=C.

**Cấu tạo phân tử:**
- CTPT: C₂H₄
- CTCT: CH₂=CH₂
- Có 1 liên kết đôi C=C

**Tính chất vật lý:**
- Chất khí không màu
- Mùi ngọt nhẹ
- Ít tan trong nước

**Tính chất hóa học:**

*1. Phản ứng cháy:*
C₂H₄ + 3O₂ → 2CO₂ + 2H₂O

*2. Phản ứng cộng (đặc trưng):*
- C₂H₄ + Br₂ → C₂H₄Br₂ (làm mất màu Br₂)
- C₂H₄ + H₂ --Ni,t°--> C₂H₆

*3. Phản ứng trùng hợp:*
nCH₂=CH₂ → (-CH₂-CH₂-)ₙ (Polyethylene - PE)

**Ứng dụng:**
- Làm chín trái cây
- Sản xuất nhựa PE, PVC
- Tổng hợp ethanol`,
                keyPoints: [
                    "Ethylene C₂H₄ có liên kết đôi C=C",
                    "Làm mất màu dung dịch bromine (phân biệt với alkane)",
                    "Phản ứng cộng và trùng hợp",
                    "Sản xuất nhựa PE, làm chín trái cây",
                ],
            },
        ],
    },
    {
        id: "9-4",
        title: "Ethylic alcohol và Acetic acid",
        description: "Tính chất và ứng dụng của rượu và acid hữu cơ",
        lessons: [
            {
                id: "9-4-1",
                title: "Ethylic alcohol (Ethanol)",
                content: `**Ethanol (C₂H₅OH)** là rượu thông dụng nhất.

**Công thức:**
- CTPT: C₂H₆O
- CTCT: CH₃-CH₂-OH
- Có nhóm -OH (hydroxyl)

**Tính chất vật lý:**
- Chất lỏng không màu
- Mùi thơm đặc trưng
- Sôi ở 78.3°C
- Tan vô hạn trong nước

**Tính chất hóa học:**

*1. Phản ứng cháy:*
C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O

*2. Phản ứng với Na:*
2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑

*3. Phản ứng với acid (ester hóa):*
C₂H₅OH + CH₃COOH ⇌ CH₃COOC₂H₅ + H₂O

**Điều chế:**
- Lên men tinh bột, đường:
C₆H₁₂O₆ --enzyme--> 2C₂H₅OH + 2CO₂

**Ứng dụng:**
- Đồ uống có cồn
- Dung môi
- Nhiên liệu (ethanol 95)
- Sát trùng y tế`,
                keyPoints: [
                    "Ethanol C₂H₅OH có nhóm -OH",
                    "Lỏng, mùi thơm, tan vô hạn trong nước",
                    "Điều chế: lên men đường, tinh bột",
                    "Ứng dụng: đồ uống, dung môi, nhiên liệu, y tế",
                ],
            },
            {
                id: "9-4-2",
                title: "Acetic acid (Giấm)",
                content: `**Acetic acid (CH₃COOH)** là acid hữu cơ phổ biến nhất.

**Công thức:**
- CTPT: C₂H₄O₂
- CTCT: CH₃-COOH
- Có nhóm -COOH (carboxyl)

**Tính chất vật lý:**
- Lỏng không màu
- Mùi chua đặc trưng (giấm)
- Sôi ở 118°C
- Tan vô hạn trong nước

**Tính chất hóa học:**

*1. Tính acid yếu (làm quỳ hồng):*
CH₃COOH ⇌ CH₃COO⁻ + H⁺

*2. Tác dụng với base:*
CH₃COOH + NaOH → CH₃COONa + H₂O

*3. Tác dụng với kim loại:*
2CH₃COOH + Zn → (CH₃COO)₂Zn + H₂↑

*4. Phản ứng ester hóa:*
CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O

**Điều chế:**
- Lên men giấm: C₂H₅OH + O₂ --enzyme--> CH₃COOH + H₂O

**Ứng dụng:**
- Gia vị (giấm ăn 3-5%)
- Sản xuất tơ acetate
- Dung môi`,
                keyPoints: [
                    "Acetic acid CH₃COOH có nhóm -COOH",
                    "Là acid yếu, có mùi chua (giấm)",
                    "Có đầy đủ tính chất của acid",
                    "Giấm ăn là dung dịch 3-5% acetic acid",
                ],
            },
        ],
    },
    {
        id: "9-5",
        title: "Chất béo (Lipid)",
        description: "Cấu tạo và tính chất của chất béo",
        lessons: [
            {
                id: "9-5-1",
                title: "Chất béo (Lipid)",
                content: `**Chất béo** là ester của glycerol với acid béo.

**Công thức tổng quát:**
(RCOO)₃C₃H₅ hoặc viết gọn là lipid

**Thành phần:**
- Glycerol: C₃H₅(OH)₃
- Acid béo: RCOOH (R là gốc hydrocarbon dài)

**Phân loại:**
| Loại | Trạng thái | Nguồn gốc | Ví dụ |
|------|------------|-----------|-------|
| Mỡ | Rắn | Động vật | Mỡ lợn, bò |
| Dầu | Lỏng | Thực vật | Dầu đậu, dầu dừa |

**Tính chất hóa học:**

*1. Phản ứng thủy phân (xà phòng hóa):*
Lipid + 3NaOH → Glycerol + 3 muối acid béo (xà phòng)

*2. Phản ứng cộng hydrogen (dầu → mỡ):*
Dầu thực vật + H₂ --Ni--> Margarine (bơ thực vật)

**Vai trò:**
- Cung cấp năng lượng (9 kcal/g)
- Dự trữ năng lượng
- Cách nhiệt, bảo vệ cơ quan`,
                keyPoints: [
                    "Chất béo = Glycerol + Acid béo",
                    "Mỡ (rắn) từ động vật, Dầu (lỏng) từ thực vật",
                    "Thủy phân + NaOH → xà phòng",
                    "1g chất béo cho 9 kcal năng lượng",
                ],
            },
        ],
    },
    {
        id: "9-6",
        title: "Carbohydrate - Protein - Polymer",
        description: "Các hợp chất hữu cơ thiên nhiên quan trọng",
        lessons: [
            {
                id: "9-6-1",
                title: "Carbohydrate (Glucid)",
                content: `**Carbohydrate** là hợp chất hữu cơ chứa C, H, O (H:O = 2:1).

**Phân loại:**

**1. Monosaccharide:**
- **Glucose (C₆H₁₂O₆):** Đường nho
  - Có trong trái cây, mật ong
  - Làm thuốc tiêm tĩnh mạch
- **Fructose (C₆H₁₂O₆):** Đường trái cây
  - Ngọt hơn glucose
  - Có nhiều trong mật ong

**2. Disaccharide:**
- **Saccharose (C₁₂H₂₂O₁₁):** Đường kính
  - Từ mía, củ cải đường
  - C₁₂H₂₂O₁₁ + H₂O → C₆H₁₂O₆ + C₆H₁₂O₆

**3. Polysaccharide:**
- **Tinh bột (C₆H₁₀O₅)ₙ:**
  - Có trong gạo, khoai, ngô
  - Thủy phân → glucose
  - Phản ứng với I₂ → màu xanh

- **Cellulose (C₆H₁₀O₅)ₙ:**
  - Thành tế bào thực vật
  - Làm giấy, vải cotton`,
                keyPoints: [
                    "Glucose C₆H₁₂O₆ - đường đơn",
                    "Saccharose - đường kính (từ mía)",
                    "Tinh bột + I₂ → màu xanh",
                    "Cellulose - thành tế bào thực vật",
                ],
            },
            {
                id: "9-6-2",
                title: "Protein",
                content: `**Protein** là polymer của các amino acid.

**Thành phần:**
- C, H, O, N và có thể có S, P

**Cấu tạo:**
- Đơn vị: amino acid (khoảng 20 loại)
- Liên kết peptide: -CO-NH-

**Tính chất:**

*1. Tính chất vật lý:*
- Không tan trong nước (đa số)
- Tan trong dung dịch muối loãng

*2. Phản ứng thủy phân:*
Protein --acid/enzyme--> Amino acid

*3. Sự đông tụ:*
- Khi đun nóng (luộc trứng)
- Khi gặp acid, base mạnh
- Khi gặp muối kim loại nặng

*4. Phản ứng màu biuret:*
Protein + Cu(OH)₂ → màu tím

**Vai trò:**
- Xây dựng tế bào, mô
- Enzyme, hormone, kháng thể
- Cung cấp năng lượng (4 kcal/g)`,
                keyPoints: [
                    "Protein = polymer của amino acid",
                    "Liên kết peptide -CO-NH-",
                    "Đông tụ khi đun nóng, gặp acid/muối KL nặng",
                    "Phản ứng biuret: màu tím đặc trưng",
                ],
            },
            {
                id: "9-6-3",
                title: "Polymer",
                content: `**Polymer** là hợp chất có phân tử khối rất lớn, tạo bởi nhiều mắt xích.

**Khái niệm:**
- Monomer: phân tử nhỏ ban đầu
- Polymer: chuỗi nhiều monomer
- Mắt xích: đơn vị lặp lại

**Phân loại:**

**1. Polymer thiên nhiên:**
- Cellulose, tinh bột
- Protein, cao su thiên nhiên

**2. Polymer tổng hợp:**
| Tên | Monomer | Ứng dụng |
|-----|---------|----------|
| PE | Ethylene | Túi nhựa |
| PP | Propylene | Hộp đựng |
| PVC | Vinyl chloride | Ống nước |
| PS | Styrene | Hộp xốp |

**Phản ứng trùng hợp:**
nCH₂=CH₂ → (-CH₂-CH₂-)ₙ (PE)
nCH₂=CHCl → (-CH₂-CHCl-)ₙ (PVC)

**Vấn đề môi trường:**
- Nhựa khó phân hủy
- Cần giảm sử dụng, tái chế
- Phát triển nhựa phân hủy sinh học`,
                keyPoints: [
                    "Polymer = nhiều monomer liên kết",
                    "PE, PP, PVC, PS là polymer tổng hợp phổ biến",
                    "Phản ứng trùng hợp tạo polymer",
                    "Nhựa gây ô nhiễm - cần tái chế",
                ],
            },
        ],
    },
];
