// Curriculum data for Grade 12 - Hóa học
// Chân Trời Sáng Tạo 2024-2025

import type { Topic } from "./grade6";

export const grade12Topics: Topic[] = [
    {
        id: "12-1",
        title: "Ester - Lipid. Xà phòng",
        description: "Cấu tạo, tính chất và ứng dụng",
        lessons: [
            {
                id: "12-1-1",
                title: "Ester",
                content: `**Ester:** R-COO-R' (sản phẩm của acid và alcohol)

**Danh pháp:** Tên gốc R' + tên gốc acid (-oate)
- CH₃COOC₂H₅: Ethyl acetate
- HCOOCH₃: Methyl formate

**Tính chất vật lý:**
- Thường là chất lỏng
- Mùi thơm đặc trưng (hương hoa quả)
- Ít tan trong nước

**Tính chất hóa học:**

*1. Phản ứng thủy phân:*
- Trong môi trường acid (thuận nghịch):
CH₃COOC₂H₅ + H₂O ⇌ CH₃COOH + C₂H₅OH

- Trong môi trường base (một chiều):
CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH
(Phản ứng xà phòng hóa)

**Điều chế:**
RCOOH + R'OH ⇌ RCOOR' + H₂O (H₂SO₄ đặc, t°)

**Ứng dụng:**
- Dung môi, hương liệu
- Làm nhựa, sơn, keo dán`,
                keyPoints: [
                    "Ester = Acid + Alcohol - H₂O",
                    "Mùi thơm đặc trưng (hương hoa quả)",
                    "Thủy phân trong base: phản ứng xà phòng hóa",
                    "Ứng dụng: dung môi, hương liệu, nhựa",
                ],
            },
            {
                id: "12-1-2",
                title: "Lipid và Xà phòng",
                content: `**Lipid (Chất béo):**
- Ester của glycerol với acid béo
- Công thức: (RCOO)₃C₃H₅

**Phản ứng xà phòng hóa:**
(RCOO)₃C₃H₅ + 3NaOH → C₃H₅(OH)₃ + 3RCOONa
(Lipid + NaOH → Glycerol + Xà phòng)

**Xà phòng:**
- Muối natri/kali của acid béo
- Công thức: RCOONa (R: gốc hydrocarbon dài)

**Cấu tạo phân tử xà phòng:**
- Đầu ưa nước: -COO⁻Na⁺
- Đuôi kị nước: R- (mạch carbon dài)

**Cơ chế tẩy rửa:**
1. Đuôi kị nước bám vào vết bẩn (dầu mỡ)
2. Đầu ưa nước hướng ra nước
3. Hình thành micelle, cuốn vết bẩn vào nước

**Chất giặt rửa tổng hợp:**
- Dẫn xuất sulfate, sulfonate
- Hoạt động tốt trong nước cứng`,
                keyPoints: [
                    "Xà phòng hóa: lipid + NaOH → glycerol + xà phòng",
                    "Xà phòng = RCOONa",
                    "Phân tử có đầu ưa nước + đuôi kị nước",
                    "Chất giặt tổng hợp dùng được trong nước cứng",
                ],
            },
        ],
    },
    {
        id: "12-2",
        title: "Carbohydrate",
        description: "Glucose, Saccharose, Tinh bột, Cellulose",
        lessons: [
            {
                id: "12-2-1",
                title: "Glucose và Fructose",
                content: `**Glucose (C₆H₁₂O₆):**
- Đường nho, đường máu
- Có trong trái cây, mật ong

**Cấu tạo:**
- Mạch hở: CH₂OH-(CHOH)₄-CHO
- Có 5 nhóm -OH và 1 nhóm -CHO

**Tính chất hóa học:**

*1. Tính chất của alcohol đa chức:*
- Hòa tan Cu(OH)₂ → dung dịch xanh lam
- C₆H₁₂O₆ + Cu(OH)₂ → phức đồng xanh

*2. Tính chất của aldehyde:*
- Phản ứng tráng bạc:
C₆H₁₂O₆ + 2[Ag(NH₃)₂]⁺ + 2OH⁻ → C₆H₁₂O₇ + 2Ag↓ + 3NH₃ + H₂O

- Khử Cu(OH)₂:
C₆H₁₂O₆ + 2Cu(OH)₂ --t°--> C₆H₁₂O₇ + Cu₂O↓ (đỏ gạch)

*3. Phản ứng lên men:*
C₆H₁₂O₆ --enzyme--> 2C₂H₅OH + 2CO₂↑

**Fructose (C₆H₁₂O₆):**
- Đồng phân của glucose
- Có nhóm ketone (>C=O) thay vì aldehyde`,
                keyPoints: [
                    "Glucose: aldehyde 5 -OH, CTCT: CHO-(CHOH)₄-CH₂OH",
                    "Glucose cho phản ứng tráng bạc, khử Cu(OH)₂",
                    "Lên men glucose → ethanol + CO₂",
                    "Fructose đồng phân glucose, có nhóm ketone",
                ],
            },
            {
                id: "12-2-2",
                title: "Saccharose, Tinh bột, Cellulose",
                content: `**Saccharose (C₁₂H₂₂O₁₁):** Đường kính
- Disaccharide = Glucose + Fructose
- Không có tính khử (không tráng bạc)

*Thủy phân:*
C₁₂H₂₂O₁₁ + H₂O --H⁺/enzyme--> C₆H₁₂O₆ + C₆H₁₂O₆ (glucose + fructose)

**Tinh bột (C₆H₁₀O₅)ₙ:**
- Polysaccharide từ glucose
- Có trong gạo, khoai, ngô

*Cấu tạo:*
- Amylose: mạch không nhánh
- Amylopectin: mạch nhánh

*Tính chất:*
- Thủy phân → glucose
- Với I₂ → màu xanh tím

**Cellulose (C₆H₁₀O₅)ₙ:**
- Polysaccharide từ glucose
- Thành tế bào thực vật

*Tính chất:*
- Không tan trong nước
- Thủy phân → glucose (khó hơn tinh bột)
- Phản ứng với HNO₃ → cellulose nitrate (thuốc súng)`,
                keyPoints: [
                    "Saccharose không có tính khử",
                    "Tinh bột + I₂ → xanh tím (nhận biết)",
                    "Cellulose: thành tế bào thực vật",
                    "Thủy phân tinh bột/cellulose → glucose",
                ],
            },
        ],
    },
    {
        id: "12-3",
        title: "Hợp chất chứa Nitrogen",
        description: "Amine, Amino acid, Peptide, Protein",
        lessons: [
            {
                id: "12-3-1",
                title: "Amine",
                content: `**Amine:** Dẫn xuất của NH₃ khi thay H bằng gốc hydrocarbon

**Phân loại:**
- Amine bậc I: R-NH₂
- Amine bậc II: R-NH-R'
- Amine bậc III: R-N(-R')-R''

**Tính chất vật lý:**
- Methylamine, dimethylamine: khí, mùi khai
- Aniline (C₆H₅NH₂): lỏng, ít tan trong nước

**Tính chất hóa học:**

*1. Tính base:*
- Làm quỳ tím hóa xanh (trừ aniline)
- CH₃NH₂ + HCl → CH₃NH₃⁺Cl⁻
- C₆H₅NH₂ + HCl → C₆H₅NH₃⁺Cl⁻

*So sánh lực base:*
(CH₃)₂NH > CH₃NH₂ > NH₃ > C₆H₅NH₂

*2. Aniline + Br₂/H₂O:*
C₆H₅NH₂ + 3Br₂ → C₆H₂Br₃NH₂↓ (trắng) + 3HBr
(2,4,6-tribromoaniline)

**Điều chế:**
C₆H₅NO₂ + 3Fe + 7HCl → C₆H₅NH₃Cl + 3FeCl₂ + 2H₂O`,
                keyPoints: [
                    "Amine = NH₃ thay H bằng gốc R",
                    "Amine có tính base (nhận proton)",
                    "Lực base: Amine béo > NH₃ > Aniline",
                    "Aniline + Br₂ → kết tủa trắng (nhận biết)",
                ],
            },
            {
                id: "12-3-2",
                title: "Amino acid và Peptide",
                content: `**Amino acid:** Hợp chất có cả -NH₂ và -COOH

**Công thức chung:** H₂N-R-COOH

**Amino acid thiết yếu:** Không tự tổng hợp được
- Leucine, Isoleucine, Valine, Lysine...

**Tính chất hóa học:**

*1. Tính lưỡng tính:*
- Với acid: H₂N-R-COOH + HCl → ClH₃N-R-COOH
- Với base: H₂N-R-COOH + NaOH → H₂N-R-COONa + H₂O

*2. Phản ứng trùng ngưng:*
Tạo liên kết peptide (-CO-NH-)

**Peptide:**
- Tạo bởi 2+ amino acid qua liên kết peptide
- Dipeptide: 2 amino acid
- Tripeptide: 3 amino acid
- Polypeptide: nhiều amino acid

**Ví dụ:**
Glycine + Alanine → Gly-Ala + H₂O
H₂N-CH₂-CO-NH-CH(CH₃)-COOH`,
                keyPoints: [
                    "Amino acid: H₂N-R-COOH (lưỡng tính)",
                    "Liên kết peptide: -CO-NH-",
                    "Peptide = chuỗi amino acid",
                    "8 amino acid thiết yếu (cần từ thực phẩm)",
                ],
            },
            {
                id: "12-3-3",
                title: "Protein và Enzyme",
                content: `**Protein:**
- Polypeptide có M lớn (hàng ngàn - triệu)
- Cấu tạo từ ~20 loại amino acid

**Cấu trúc:**
1. Bậc I: Trình tự amino acid
2. Bậc II: Xoắn α, gấp β
3. Bậc III: Cuộn 3D
4. Bậc IV: Nhiều chuỗi polypeptide

**Tính chất:**

*1. Phản ứng thủy phân:*
Protein --acid/enzyme--> Amino acid

*2. Sự đông tụ:*
- Khi đun nóng (luộc trứng)
- Gặp acid, base mạnh
- Gặp muối kim loại nặng

*3. Phản ứng màu:*
- Biuret: Protein + Cu(OH)₂ → màu tím
- Xanthoproteic: Protein + HNO₃ đặc → màu vàng

**Enzyme:**
- Protein có chức năng xúc tác sinh học
- Hoạt động chọn lọc, hiệu quả cao
- Ví dụ: Amylase (thủy phân tinh bột), Lipase (thủy phân lipid)`,
                keyPoints: [
                    "Protein = polypeptide có M lớn",
                    "Có 4 bậc cấu trúc",
                    "Phản ứng biuret: màu tím (nhận biết)",
                    "Enzyme: protein xúc tác sinh học",
                ],
            },
        ],
    },
    {
        id: "12-4",
        title: "Polymer",
        description: "Khái niệm, phân loại và ứng dụng",
        lessons: [
            {
                id: "12-4-1",
                title: "Đại cương về Polymer",
                content: `**Polymer:** Hợp chất có phân tử khối rất lớn, do nhiều mắt xích liên kết.

**Thuật ngữ:**
- Monomer: Phân tử nhỏ ban đầu
- Mắt xích: Đơn vị lặp lại trong polymer
- Hệ số trùng hợp (n): Số mắt xích

**Phân loại theo nguồn gốc:**
1. Polymer thiên nhiên: Tinh bột, cellulose, cao su thiên nhiên, protein
2. Polymer tổng hợp: PE, PP, PVC, PS...
3. Polymer bán tổng hợp: Tơ visco, cellulose acetate

**Phương pháp tổng hợp:**

*1. Trùng hợp:*
nCH₂=CH₂ → (-CH₂-CH₂-)ₙ (PE)
nCH₂=CHCl → (-CH₂-CHCl-)ₙ (PVC)

*2. Trùng ngưng:*
nH₂N-R-COOH → (-NH-R-CO-)ₙ + nH₂O

**Tính chất chung:**
- Không bay hơi, khó tan
- Có tính đàn hồi hoặc dẻo
- Không có nhiệt độ nóng chảy xác định`,
                keyPoints: [
                    "Polymer = nhiều monomer liên kết",
                    "Trùng hợp: từ monomer có liên kết đôi",
                    "Trùng ngưng: loại nước khi tạo polymer",
                    "Không có nhiệt độ nóng chảy xác định",
                ],
            },
            {
                id: "12-4-2",
                title: "Chất dẻo, Tơ, Cao su",
                content: `**Chất dẻo (Plastic):**
| Tên | Monomer | Ứng dụng |
|-----|---------|----------|
| PE | CH₂=CH₂ | Túi, màng bọc |
| PP | CH₂=CHCH₃ | Hộp đựng, sợi |
| PVC | CH₂=CHCl | Ống nước, da giả |
| PS | C₆H₅CH=CH₂ | Hộp xốp, đồ chơi |
| PMMA | Methyl methacrylate | Kính hữu cơ |

**Tơ:**
- Tơ thiên nhiên: Bông, len, tơ tằm
- Tơ nhân tạo: Visco, acetate
- Tơ tổng hợp: Nylon, polyester

Nylon-6,6: (-NH-(CH₂)₆-NH-CO-(CH₂)₄-CO-)ₙ

**Cao su:**
- Cao su thiên nhiên: (C₅H₈)ₙ từ cây cao su
- Cao su buna: (-CH₂-CH=CH-CH₂-)ₙ từ butadiene
- Lưu hóa: thêm S tạo liên kết ngang, tăng đàn hồi`,
                keyPoints: [
                    "PE, PP, PVC, PS: chất dẻo phổ biến",
                    "Nylon, polyester: tơ tổng hợp",
                    "Cao su thiên nhiên từ cây cao su",
                    "Lưu hóa cao su: thêm sulfur",
                ],
            },
        ],
    },
    {
        id: "12-5",
        title: "Pin điện và Điện phân",
        description: "Thế điện cực, pin điện hóa và điện phân",
        lessons: [
            {
                id: "12-5-1",
                title: "Thế điện cực và Pin điện hóa",
                content: `**Thế điện cực chuẩn (E°):**
- Đo khả năng nhận/nhường electron
- So với điện cực hydrogen chuẩn (E° = 0)

**Dãy thế điện cực:**
Li⁺/Li < K⁺/K < Na⁺/Na < Mg²⁺/Mg < Al³⁺/Al < Zn²⁺/Zn < Fe²⁺/Fe < H⁺/H₂ < Cu²⁺/Cu < Ag⁺/Ag < Au³⁺/Au

**Pin điện hóa (Pin Galvanic):**
- Chuyển hóa năng hóa học → điện năng
- Gồm 2 điện cực nhúng trong dung dịch điện li

**Ví dụ pin Zn-Cu:**
- Cực âm (anode): Zn → Zn²⁺ + 2e⁻ (oxi hóa)
- Cực dương (cathode): Cu²⁺ + 2e⁻ → Cu (khử)

**Sức điện động:**
E°(pin) = E°(cathode) - E°(anode)
E°(Zn-Cu) = 0.34 - (-0.76) = 1.10V`,
                keyPoints: [
                    "E° đo so với điện cực H chuẩn",
                    "E° càng âm → kim loại càng mạnh",
                    "Pin: anode (-) oxi hóa, cathode (+) khử",
                    "E°(pin) = E°(+) - E°(-)",
                ],
            },
            {
                id: "12-5-2",
                title: "Điện phân",
                content: `**Điện phân:**
- Dùng dòng điện để thực hiện phản ứng oxi hóa-khử
- Chuyển hóa điện năng → hóa năng

**Điện phân dung dịch:**
- Cathode (-): Cation bị khử (nhận e)
- Anode (+): Anion bị oxi hóa (nhường e)

**Thứ tự điện phân:**
Cathode: Ag⁺ > Cu²⁺ > H⁺ > Mn²⁺... (E° giảm dần)
Anode: Cl⁻ > Br⁻ > I⁻ > OH⁻ > SO₄²⁻

**Ví dụ điện phân CuSO₄:**
- Cathode: Cu²⁺ + 2e⁻ → Cu
- Anode: 2H₂O → O₂ + 4H⁺ + 4e⁻

**Định luật Faraday:**
m = (A × I × t) / (n × F)

Trong đó:
- m: khối lượng chất (g)
- A: khối lượng mol (g/mol)
- I: cường độ dòng điện (A)
- t: thời gian (s)
- n: số electron trao đổi
- F: hằng số Faraday = 96500 C/mol`,
                keyPoints: [
                    "Điện phân: điện năng → hóa năng",
                    "Cathode: cation bị khử",
                    "Anode: anion bị oxi hóa",
                    "Định luật Faraday: m = AIt/(nF)",
                ],
            },
        ],
    },
    {
        id: "12-6",
        title: "Đại cương về Kim loại",
        description: "Tính chất, điều chế và ăn mòn kim loại",
        lessons: [
            {
                id: "12-6-1",
                title: "Tính chất và điều chế Kim loại",
                content: `**Tính chất hóa học chung:**
Kim loại có tính khử: M → Mⁿ⁺ + ne⁻

*1. Với phi kim:*
4Al + 3O₂ → 2Al₂O₃
2Fe + 3Cl₂ → 2FeCl₃

*2. Với acid:*
- HCl, H₂SO₄ loãng: Zn + 2HCl → ZnCl₂ + H₂
- H₂SO₄ đặc, HNO₃: Cu + 2H₂SO₄(đ) → CuSO₄ + SO₂ + 2H₂O

*3. Với nước:* (Kim loại mạnh)
2Na + 2H₂O → 2NaOH + H₂

**Phương pháp điều chế:**

*1. Nhiệt luyện:* (kim loại trung bình)
Fe₂O₃ + 3CO → 2Fe + 3CO₂

*2. Thủy luyện:* (kim loại kém hoạt động)
CuSO₄ + Fe → FeSO₄ + Cu

*3. Điện phân:* (mọi kim loại)
- Điện phân nóng chảy: Al, Na, Mg, Ca
- Điện phân dung dịch: Cu, Ag, Zn

2NaCl (nc) --đp--> 2Na + Cl₂`,
                keyPoints: [
                    "Kim loại: chất khử, M → Mⁿ⁺ + ne⁻",
                    "Nhiệt luyện: dùng C, CO, H₂ khử oxide",
                    "Thủy luyện: kim loại mạnh đẩy kim loại yếu",
                    "Điện phân: điều chế kim loại hoạt động (Al, Na)",
                ],
            },
            {
                id: "12-6-2",
                title: "Ăn mòn Kim loại",
                content: `**Ăn mòn kim loại:** Sự phá hủy kim loại do tác dụng hóa học của môi trường.

**Phân loại:**

*1. Ăn mòn hóa học:*
- Do phản ứng hóa học trực tiếp
- Không phát sinh dòng điện
- Ví dụ: Fe + O₂ → Fe₂O₃ (ở nhiệt độ cao)

*2. Ăn mòn điện hóa:*
- Xảy ra khi có cặp điện cực và dung dịch điện li
- Phát sinh dòng điện

**Điều kiện ăn mòn điện hóa:**
1. Hai điện cực khác bản chất
2. Tiếp xúc với nhau
3. Nhúng trong dung dịch điện li

Ví dụ: Fe + Cu trong nước muối
- Fe là anode: Fe → Fe²⁺ + 2e⁻
- Cu là cathode: O₂ + 2H₂O + 4e⁻ → 4OH⁻

**Chống ăn mòn:**
1. Phủ bề mặt: sơn, mạ, tráng men
2. Dùng hợp kim chống gỉ (inox)
3. Phương pháp điện hóa: gắn Zn vào Fe`,
                keyPoints: [
                    "Ăn mòn hóa học: phản ứng trực tiếp",
                    "Ăn mòn điện hóa: có cặp điện cực + điện li",
                    "Chống ăn mòn: sơn, mạ, hợp kim",
                    "Bảo vệ điện hóa: gắn Zn vào Fe",
                ],
            },
        ],
    },
    {
        id: "12-7",
        title: "Kim loại nhóm IA và IIA",
        description: "Kim loại kiềm và kiềm thổ",
        lessons: [
            {
                id: "12-7-1",
                title: "Kim loại kiềm (Nhóm IA)",
                content: `**Kim loại kiềm:** Li, Na, K, Rb, Cs, Fr

**Cấu hình:** ns¹ (1 electron lớp ngoài cùng)

**Tính chất vật lý:**
- Mềm, nhẹ, nhiệt độ nóng chảy thấp
- Dẫn điện, dẫn nhiệt tốt
- Màu trắng bạc

**Tính chất hóa học (tính khử mạnh):**

*1. Với phi kim:*
4Na + O₂ → 2Na₂O
2Na + Cl₂ → 2NaCl

*2. Với nước:*
2Na + 2H₂O → 2NaOH + H₂↑
(K, Rb, Cs phản ứng mãnh liệt có thể nổ)

*3. Với acid:* Rất mạnh, nguy hiểm

**Điều chế:**
Điện phân nóng chảy muối halide hoặc hydroxide:
2NaCl (nc) --đp--> 2Na + Cl₂

**Ứng dụng:**
- Na: làm chất trao đổi nhiệt trong lò phản ứng hạt nhân
- K: phân kali (KCl)`,
                keyPoints: [
                    "Kim loại kiềm: ns¹, rất hoạt động",
                    "Mềm, nhẹ, phản ứng mạnh với nước",
                    "Tính khử tăng: Li < Na < K < Rb < Cs",
                    "Điều chế: điện phân nóng chảy",
                ],
            },
            {
                id: "12-7-2",
                title: "Kim loại kiềm thổ (Nhóm IIA)",
                content: `**Kim loại kiềm thổ:** Be, Mg, Ca, Sr, Ba, Ra

**Cấu hình:** ns² (2 electron lớp ngoài cùng)

**Tính chất hóa học:**

*1. Với phi kim:*
2Mg + O₂ → 2MgO (cháy sáng chói)
Ca + Cl₂ → CaCl₂

*2. Với nước:*
- Ca, Sr, Ba: phản ứng ở nhiệt độ thường
Ca + 2H₂O → Ca(OH)₂ + H₂↑

- Mg: phản ứng chậm với nước nóng
Mg + 2H₂O --t°--> Mg(OH)₂ + H₂

*3. Với acid:*
Mg + 2HCl → MgCl₂ + H₂

**Hợp chất quan trọng:**

*CaO (vôi sống):*
- Chất rắn trắng, hút ẩm mạnh
- CaO + H₂O → Ca(OH)₂ (tỏa nhiệt)

*Ca(OH)₂ (vôi tôi):*
- Base mạnh, rẻ tiền
- Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O

*CaCO₃:*
- Đá vôi, đá cẩm thạch
- CaCO₃ --t°--> CaO + CO₂`,
                keyPoints: [
                    "Kim loại kiềm thổ: ns², hoạt động mạnh",
                    "Mg cháy sáng chói trong không khí",
                    "Ca, Ba phản ứng với nước ở t° thường",
                    "CaO hút ẩm, Ca(OH)₂ là base mạnh",
                ],
            },
        ],
    },
    {
        id: "12-8",
        title: "Kim loại chuyển tiếp và Phức chất",
        description: "Đại cương về kim loại chuyển tiếp dãy thứ nhất",
        lessons: [
            {
                id: "12-8-1",
                title: "Kim loại chuyển tiếp dãy thứ nhất",
                content: `**Kim loại chuyển tiếp dãy thứ nhất:**
Sc, Ti, V, Cr, Mn, Fe, Co, Ni, Cu, Zn

**Cấu hình:** [Ar] 3d¹⁻¹⁰ 4s¹⁻²

**Đặc điểm chung:**
- Có nhiều số oxi hóa
- Tạo hợp chất có màu
- Có khả năng tạo phức chất
- Nhiều tính chất xúc tác

**Sắt (Fe):**
Cấu hình: [Ar] 3d⁶ 4s²
Số oxi hóa: +2, +3

*Hợp chất Fe(II):*
- FeO: màu đen
- Fe(OH)₂: trắng xanh, không bền
- FeCl₂, FeSO₄: có tính khử

*Hợp chất Fe(III):*
- Fe₂O₃: màu nâu đỏ
- Fe(OH)₃: màu nâu đỏ
- FeCl₃: có tính oxi hóa

**Nhận biết ion Fe:**
- Fe²⁺ + NaOH → Fe(OH)₂↓ (trắng xanh)
- Fe³⁺ + NaOH → Fe(OH)₃↓ (nâu đỏ)
- Fe³⁺ + SCN⁻ → Fe(SCN)₃ (đỏ máu)`,
                keyPoints: [
                    "Kim loại chuyển tiếp có nhiều số oxi hóa",
                    "Fe: +2, +3; Cu: +1, +2; Cr: +2, +3, +6",
                    "Fe(OH)₂ trắng xanh, Fe(OH)₃ nâu đỏ",
                    "SCN⁻ nhận biết Fe³⁺ (đỏ máu)",
                ],
            },
            {
                id: "12-8-2",
                title: "Sơ lược về Phức chất",
                content: `**Phức chất:** Hợp chất gồm ion trung tâm và các phối tử.

**Cấu tạo:**
- Ion trung tâm: thường là kim loại chuyển tiếp
- Phối tử: ion hoặc phân tử cho cặp electron (ligand)
- Số phối trí: số liên kết ion trung tâm - phối tử

**Ví dụ:**
[Cu(NH₃)₄]²⁺:
- Ion trung tâm: Cu²⁺
- Phối tử: NH₃ (4 phân tử)
- Số phối trí: 4

[Fe(CN)₆]⁴⁻:
- Ion trung tâm: Fe²⁺
- Phối tử: CN⁻ (6 ion)
- Số phối trí: 6

**Phối tử thường gặp:**
- Phối tử 1 răng: NH₃, H₂O, Cl⁻, CN⁻, OH⁻
- Phối tử 2 răng: ethylenediamine (en)

**Màu sắc:**
- [Cu(H₂O)₄]²⁺: xanh lam
- [Cu(NH₃)₄]²⁺: xanh đậm
- [Fe(SCN)]²⁺: đỏ máu`,
                keyPoints: [
                    "Phức chất = Ion trung tâm + Phối tử",
                    "Phối tử cho cặp electron với ion trung tâm",
                    "Số phối trí phổ biến: 4, 6",
                    "Phức chất thường có màu đặc trưng",
                ],
            },
        ],
    },
];
