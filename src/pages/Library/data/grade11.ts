// Curriculum data for Grade 11 - Hóa học
// Chân Trời Sáng Tạo 2024-2025

import type { Topic } from "./grade6";

export const grade11Topics: Topic[] = [
    {
        id: "11-1",
        title: "Cân bằng hóa học",
        description: "Khái niệm cân bằng và các yếu tố ảnh hưởng",
        lessons: [
            {
                id: "11-1-1",
                title: "Khái niệm cân bằng hóa học",
                content: `**Phản ứng thuận nghịch** là phản ứng xảy ra theo cả hai chiều ngược nhau.

**Ký hiệu:** ⇌

**Cân bằng hóa học:**
- Trạng thái khi v(thuận) = v(nghịch)
- Nồng độ các chất không đổi
- Là cân bằng động

**Hằng số cân bằng Kc:**
aA + bB ⇌ cC + dD

Kc = [C]^c × [D]^d / [A]^a × [B]^b

**Đặc điểm:**
- Kc chỉ phụ thuộc nhiệt độ
- Kc lớn: cân bằng lệch phải (tạo nhiều sp)
- Kc nhỏ: cân bằng lệch trái

**Ví dụ:**
N₂ + 3H₂ ⇌ 2NH₃
Kc = [NH₃]² / [N₂][H₂]³`,
                keyPoints: [
                    "Phản ứng thuận nghịch: xảy ra 2 chiều",
                    "Cân bằng: v(thuận) = v(nghịch)",
                    "Kc = [sp]^hệ số / [tg]^hệ số",
                    "Kc chỉ phụ thuộc nhiệt độ",
                ],
            },
            {
                id: "11-1-2",
                title: "Nguyên lý Le Chatelier",
                content: `**Nguyên lý Le Chatelier:**
Khi tác động lên hệ cân bằng, hệ sẽ dịch chuyển theo chiều chống lại tác động đó.

**Các yếu tố ảnh hưởng:**

**1. Nồng độ:**
- Tăng [chất tham gia] → CB dịch chuyển theo chiều thuận
- Tăng [sản phẩm] → CB dịch chuyển theo chiều nghịch

**2. Áp suất (với khí):**
- Tăng P → CB dịch chuyển về phía ít phân tử khí hơn
- N₂ + 3H₂ ⇌ 2NH₃: Tăng P → CB dịch phải (4 mol → 2 mol)

**3. Nhiệt độ:**
- Tăng t° → CB dịch chuyển theo chiều thu nhiệt (ΔH > 0)
- Giảm t° → CB dịch chuyển theo chiều tỏa nhiệt (ΔH < 0)

**4. Chất xúc tác:**
- Không ảnh hưởng đến vị trí cân bằng
- Chỉ làm nhanh đạt cân bằng`,
                keyPoints: [
                    "Hệ dịch chuyển chống lại tác động",
                    "Tăng nồng độ → CB dịch về phía giảm nồng độ đó",
                    "Tăng P → CB về phía ít mol khí hơn",
                    "Tăng t° → CB theo chiều thu nhiệt",
                ],
            },
            {
                id: "11-1-3",
                title: "Cân bằng trong dung dịch nước",
                content: `**Cân bằng điện li của nước:**
H₂O ⇌ H⁺ + OH⁻

**Tích số ion của nước:**
Kw = [H⁺][OH⁻] = 10⁻¹⁴ (ở 25°C)

**Mối quan hệ pH và pOH:**
pH + pOH = 14

**Môi trường:**
| [H⁺] | pH | Môi trường |
|------|-----|------------|
| > 10⁻⁷ | < 7 | Acid |
| = 10⁻⁷ | = 7 | Trung tính |
| < 10⁻⁷ | > 7 | Base |

**Chất điện li:**
- Điện li mạnh: phân li hoàn toàn (HCl, NaOH, NaCl)
- Điện li yếu: phân li một phần (CH₃COOH, NH₃, H₂CO₃)

**Hằng số acid Ka:**
CH₃COOH ⇌ CH₃COO⁻ + H⁺
Ka = [CH₃COO⁻][H⁺] / [CH₃COOH]`,
                keyPoints: [
                    "Kw = [H⁺][OH⁻] = 10⁻¹⁴ ở 25°C",
                    "pH + pOH = 14",
                    "pH < 7: acid, pH = 7: trung tính, pH > 7: base",
                    "Ka: hằng số phân li acid",
                ],
            },
        ],
    },
    {
        id: "11-2",
        title: "Nitrogen và Sulfur",
        description: "Đơn chất và các hợp chất của N và S",
        lessons: [
            {
                id: "11-2-1",
                title: "Đơn chất Nitrogen",
                content: `**Nitrogen (N₂):**
- Chiếm 78% thể tích không khí
- Liên kết ba N≡N rất bền

**Tính chất vật lý:**
- Khí không màu, không mùi, không vị
- Ít tan trong nước
- Nhẹ hơn không khí

**Tính chất hóa học:**
N₂ khá trơ ở điều kiện thường do N≡N bền.

*1. Với oxygen (ở nhiệt độ cao hoặc tia lửa điện):*
N₂ + O₂ ⇌ 2NO (khí không màu)
2NO + O₂ → 2NO₂ (khí nâu đỏ)

*2. Với hydrogen (ở điều kiện đặc biệt):*
N₂ + 3H₂ ⇌ 2NH₃ (t°cao, P cao, xúc tác)

*3. Với kim loại hoạt động (ở t° cao):*
N₂ + 3Mg → Mg₃N₂ (magnesium nitride)

**Ứng dụng:**
- Bảo quản thực phẩm
- Sản xuất NH₃, HNO₃
- Làm môi trường trơ`,
                keyPoints: [
                    "N₂ chiếm 78% không khí",
                    "Liên kết N≡N rất bền → N₂ khá trơ",
                    "N₂ + 3H₂ ⇌ 2NH₃ (quy trình Haber)",
                    "Ứng dụng: bảo quản, sản xuất phân đạm",
                ],
            },
            {
                id: "11-2-2",
                title: "Ammonia và hợp chất Ammonium",
                content: `**Ammonia (NH₃):**

**Tính chất vật lý:**
- Khí không màu, mùi khai
- Tan rất nhiều trong nước (700 lít/1 lít H₂O)
- Nhẹ hơn không khí

**Tính chất hóa học:**

*1. Tính base yếu:*
NH₃ + H₂O ⇌ NH₄⁺ + OH⁻
- Làm quỳ tím hóa xanh
- Phenolphthalein hóa hồng

*2. Tác dụng với acid:*
NH₃ + HCl → NH₄Cl (khói trắng)
2NH₃ + H₂SO₄ → (NH₄)₂SO₄

*3. Tác dụng với oxide acid:*
2NH₃ + CO₂ + H₂O → (NH₄)₂CO₃

*4. Tính khử:*
4NH₃ + 3O₂ --t°--> 2N₂ + 6H₂O
4NH₃ + 5O₂ --Pt,t°--> 4NO + 6H₂O

**Muối ammonium (NH₄⁺):**
- Dễ tan trong nước
- Bị phân hủy bởi kiềm: NH₄Cl + NaOH → NaCl + NH₃↑ + H₂O`,
                keyPoints: [
                    "NH₃: mùi khai, tan rất nhiều trong nước",
                    "NH₃ có tính base yếu và tính khử",
                    "NH₃ + HCl → NH₄Cl (khói trắng)",
                    "Muối ammonium + NaOH → NH₃↑ (nhận biết)",
                ],
            },
            {
                id: "11-2-3",
                title: "Sulfur và Sulfur dioxide",
                content: `**Sulfur (S):**

**Tính chất vật lý:**
- Chất rắn màu vàng
- Không tan trong nước
- Nóng chảy ở 113°C

**Tính chất hóa học:**

*1. Với kim loại (tính oxi hóa):*
Fe + S --t°--> FeS
2Al + 3S --t°--> Al₂S₃

*2. Với phi kim (tính khử):*
S + O₂ --t°--> SO₂
S + 3F₂ → SF₆

**Sulfur dioxide (SO₂):**

- Khí không màu, mùi hắc
- Tan nhiều trong nước

*Tính chất hóa học:*

1. Oxide acid:
SO₂ + H₂O ⇌ H₂SO₃
SO₂ + 2NaOH → Na₂SO₃ + H₂O

2. Tính khử:
SO₂ + Br₂ + 2H₂O → H₂SO₄ + 2HBr
(làm mất màu Br₂)

3. Tính oxi hóa:
SO₂ + 2H₂S → 3S + 2H₂O`,
                keyPoints: [
                    "S: chất rắn vàng, có tính oxi hóa và khử",
                    "SO₂: oxide acid, mùi hắc, gây ô nhiễm",
                    "SO₂ làm mất màu dung dịch Br₂",
                    "SO₂ vừa oxi hóa vừa khử",
                ],
            },
            {
                id: "11-2-4",
                title: "Sulfuric acid và muối Sulfate",
                content: `**Sulfuric acid (H₂SO₄):**

**H₂SO₄ loãng - acid mạnh:**
- Đổi màu quỳ tím thành đỏ
- Tác dụng với kim loại (trước H), base, oxide base, muối

**H₂SO₄ đặc - tính chất đặc biệt:**

*1. Tính oxi hóa mạnh:*
Cu + 2H₂SO₄(đặc) --t°--> CuSO₄ + SO₂↑ + 2H₂O
(Kim loại kém hoạt động cũng phản ứng)

C + 2H₂SO₄(đặc) --t°--> CO₂ + 2SO₂ + 2H₂O

*2. Tính háo nước:*
C₁₂H₂₂O₁₁ --H₂SO₄ đặc--> 12C + 11H₂O
(Đường hóa than)

**Nhận biết ion SO₄²⁻:**
SO₄²⁻ + Ba²⁺ → BaSO₄↓ (trắng, không tan trong acid)

**Muối sulfate:**
- Đa số tan (trừ BaSO₄, PbSO₄)
- CaSO₄ ít tan (thạch cao)`,
                keyPoints: [
                    "H₂SO₄ loãng: acid mạnh điển hình",
                    "H₂SO₄ đặc: oxi hóa mạnh + háo nước",
                    "Cu + H₂SO₄ đặc → SO₂ (không phải H₂)",
                    "Nhận biết SO₄²⁻: BaSO₄ trắng, không tan trong acid",
                ],
            },
        ],
    },
    {
        id: "11-3",
        title: "Đại cương hóa học hữu cơ",
        description: "Cấu tạo và phân loại hợp chất hữu cơ",
        lessons: [
            {
                id: "11-3-1",
                title: "Hợp chất hữu cơ và phân loại",
                content: `**Hợp chất hữu cơ:**
- Hợp chất của Carbon (trừ CO, CO₂, muối carbonate...)
- Liên kết chủ yếu: C-C, C-H, C-O, C-N...

**Phân loại:**

**1. Hydrocarbon:** Chỉ có C và H
- Alkane: CₙH₂ₙ₊₂ (no)
- Alkene: CₙH₂ₙ (1 liên kết đôi)
- Alkyne: CₙH₂ₙ₋₂ (1 liên kết ba)
- Arene: vòng benzene

**2. Dẫn xuất hydrocarbon:**
- Dẫn xuất halogen: CH₃Cl, C₂H₅Br
- Alcohol: CH₃OH, C₂H₅OH
- Aldehyde: HCHO, CH₃CHO
- Ketone: CH₃COCH₃
- Carboxylic acid: HCOOH, CH₃COOH
- Ester: CH₃COOCH₃
- Amine: CH₃NH₂

**Nhóm chức:**
- -OH: alcohol/phenol
- -CHO: aldehyde
- -CO-: ketone
- -COOH: carboxylic acid
- -COO-: ester
- -NH₂: amine`,
                keyPoints: [
                    "Hữu cơ = hợp chất của C (trừ ngoại lệ)",
                    "Hydrocarbon: chỉ có C, H",
                    "Dẫn xuất: có thêm O, N, halogen...",
                    "Nhóm chức quyết định tính chất hóa học",
                ],
            },
            {
                id: "11-3-2",
                title: "Đồng đẳng, đồng phân, danh pháp",
                content: `**Đồng đẳng:**
- Các chất có CTTQ giống nhau
- Phân tử hơn kém nhau nhóm -CH₂-
- Tính chất hóa học tương tự

Ví dụ: CH₄, C₂H₆, C₃H₈ (dãy alkane)

**Đồng phân:**
- Các chất có cùng CTPT nhưng khác CTCT
- Tính chất khác nhau

*Các loại đồng phân:*
1. Đồng phân mạch carbon
2. Đồng phân vị trí nhóm chức
3. Đồng phân nhóm chức
4. Đồng phân hình học (cis-trans)

Ví dụ C₄H₁₀ có 2 đồng phân:
- CH₃-CH₂-CH₂-CH₃ (butane)
- (CH₃)₂CHCH₃ (isobutane)

**Danh pháp IUPAC:**
1. Chọn mạch chính (dài nhất, nhiều nhánh)
2. Đánh số từ đầu gần nhánh
3. Ghi vị trí + tên nhánh + tên mạch chính`,
                keyPoints: [
                    "Đồng đẳng: hơn kém nhau -CH₂-",
                    "Đồng phân: cùng CTPT, khác CTCT",
                    "Danh pháp IUPAC: vị trí + nhánh + mạch chính",
                    "Mạch chính: dài nhất, nhiều nhánh nhất",
                ],
            },
        ],
    },
    {
        id: "11-4",
        title: "Hydrocarbon",
        description: "Alkane, Alkene, Alkyne và Arene",
        lessons: [
            {
                id: "11-4-1",
                title: "Alkane",
                content: `**Alkane:** CₙH₂ₙ₊₂ (n ≥ 1), hydrocarbon no.

**Đồng đẳng:** CH₄, C₂H₆, C₃H₈...

**Cấu tạo:**
- Chỉ có liên kết đơn C-C và C-H
- Mạch carbon có thể thẳng hoặc nhánh

**Tính chất vật lý:**
- C₁-C₄: khí, C₅-C₁₇: lỏng, C₁₈+: rắn
- Không tan trong nước
- Nhiệt độ sôi tăng theo M

**Tính chất hóa học:**

*1. Phản ứng thế (đặc trưng):*
CH₄ + Cl₂ --as--> CH₃Cl + HCl
(tiếp tục: CH₂Cl₂, CHCl₃, CCl₄)

*2. Phản ứng cháy:*
CH₄ + 2O₂ → CO₂ + 2H₂O

CₙH₂ₙ₊₂ + (3n+1)/2 O₂ → nCO₂ + (n+1)H₂O

*3. Phản ứng cracking (bẻ gãy):*
C₄H₁₀ --t°--> C₂H₄ + C₂H₆`,
                keyPoints: [
                    "Alkane CₙH₂ₙ₊₂, chỉ có liên kết đơn",
                    "Phản ứng thế halogen (cần ánh sáng)",
                    "Cracking: bẻ gãy mạch carbon",
                    "Không làm mất màu Br₂, KMnO₄ loãng",
                ],
            },
            {
                id: "11-4-2",
                title: "Hydrocarbon không no (Alkene, Alkyne)",
                content: `**Alkene:** CₙH₂ₙ (n ≥ 2), có 1 liên kết đôi C=C

**Alkyne:** CₙH₂ₙ₋₂ (n ≥ 2), có 1 liên kết ba C≡C

**Phản ứng cộng (đặc trưng):**

*1. Cộng H₂ (hydrogenation):*
CH₂=CH₂ + H₂ --Ni,t°--> CH₃-CH₃
CH≡CH + 2H₂ --Ni,t°--> CH₃-CH₃

*2. Cộng halogen:*
CH₂=CH₂ + Br₂ → CH₂Br-CH₂Br
(làm mất màu Br₂ - nhận biết)

*3. Cộng HX (X = Cl, Br, OH...):*
CH₂=CH₂ + HBr → CH₃-CH₂Br

**Quy tắc Markovnikov:**
H cộng vào C có nhiều H hơn

CH₃-CH=CH₂ + HBr → CH₃-CHBr-CH₃

**Phản ứng trùng hợp:**
nCH₂=CH₂ → (-CH₂-CH₂-)ₙ (PE)`,
                keyPoints: [
                    "Alkene: C=C, Alkyne: C≡C",
                    "Phản ứng cộng: làm mất màu Br₂",
                    "Quy tắc Markovnikov: H vào C nhiều H hơn",
                    "Trùng hợp tạo polymer (PE, PP, PVC)",
                ],
            },
            {
                id: "11-4-3",
                title: "Arene (Hydrocarbon thơm)",
                content: `**Benzene (C₆H₆):**
- Vòng 6 cạnh phẳng
- 3 liên kết đôi liên hợp
- Hệ π electron bền

**Tính chất vật lý:**
- Lỏng không màu, mùi đặc trưng
- Không tan trong nước
- Độc, gây ung thư

**Tính chất hóa học:**

*1. Phản ứng thế (đặc trưng):*
- Halogen hóa (cần Fe hoặc AlX₃):
C₆H₆ + Br₂ --Fe--> C₆H₅Br + HBr

- Nitro hóa:
C₆H₆ + HNO₃ --H₂SO₄ đặc--> C₆H₅NO₂ + H₂O

*2. Phản ứng cộng:*
C₆H₆ + 3H₂ --Ni,t°--> C₆H₁₂ (cyclohexane)
C₆H₆ + 3Cl₂ --as--> C₆H₆Cl₆

*3. Phản ứng oxi hóa:*
- Cháy: 2C₆H₆ + 15O₂ → 12CO₂ + 6H₂O
- Không làm mất màu KMnO₄ loãng`,
                keyPoints: [
                    "Benzene C₆H₆: vòng thơm bền",
                    "Phản ứng thế là đặc trưng (Br₂/Fe, HNO₃/H₂SO₄)",
                    "Phản ứng cộng khó hơn alkene",
                    "Không làm mất màu Br₂ (không xúc tác), KMnO₄ loãng",
                ],
            },
        ],
    },
    {
        id: "11-5",
        title: "Dẫn xuất Halogen - Alcohol - Phenol",
        description: "Tính chất và ứng dụng",
        lessons: [
            {
                id: "11-5-1",
                title: "Alcohol",
                content: `**Alcohol:** R-OH (nhóm -OH gắn với C no)

**Phân loại:**
- Alcohol bậc I: R-CH₂-OH
- Alcohol bậc II: R-CHOH-R'
- Alcohol bậc III: R-C(OH)-R'R''

**Tính chất vật lý:**
- Alcohol đầu dãy tan trong nước do liên kết H
- Nhiệt độ sôi cao hơn hydrocarbon cùng M

**Tính chất hóa học:**

*1. Phản ứng với Na:*
2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑

*2. Phản ứng với acid (ester hóa):*
C₂H₅OH + CH₃COOH ⇌ CH₃COOC₂H₅ + H₂O

*3. Phản ứng tách nước:*
- Ở 170°C: C₂H₅OH --H₂SO₄ đặc--> C₂H₄ + H₂O
- Ở 140°C: 2C₂H₅OH → C₂H₅OC₂H₅ + H₂O (ether)

*4. Phản ứng oxi hóa:*
C₂H₅OH + CuO --t°--> CH₃CHO + Cu + H₂O
(Alcohol bậc I → Aldehyde)`,
                keyPoints: [
                    "Alcohol: R-OH (OH gắn với C no)",
                    "Phản ứng với Na → giải phóng H₂",
                    "Tách nước 170°C → alkene",
                    "Oxi hóa bậc I → aldehyde",
                ],
            },
            {
                id: "11-5-2",
                title: "Phenol",
                content: `**Phenol (C₆H₅OH):**
- Nhóm -OH gắn trực tiếp với vòng benzene

**Tính chất vật lý:**
- Tinh thể không màu, mùi đặc trưng
- Ít tan trong nước lạnh, tan nhiều trong nước nóng
- Gây bỏng da

**Tính chất hóa học:**

*1. Tính acid yếu:*
C₆H₅OH + NaOH → C₆H₅ONa + H₂O
(Phenol tan trong NaOH, alcohol không tan)

*2. Phản ứng thế ở vòng (dễ hơn benzene):*
C₆H₅OH + 3Br₂ → C₆H₂Br₃OH↓ (trắng) + 3HBr
(2,4,6-tribromophenol kết tủa trắng)

C₆H₅OH + 3HNO₃ --H₂SO₄--> C₆H₂(NO₂)₃OH + 3H₂O
(2,4,6-trinitrophenol - acid picric)

**Phân biệt Phenol và Alcohol:**
- Phenol + NaOH → tan (alcohol không)
- Phenol + Br₂/H₂O → kết tủa trắng`,
                keyPoints: [
                    "Phenol: -OH gắn trực tiếp với vòng benzene",
                    "Phenol có tính acid yếu (tan trong NaOH)",
                    "Phenol + Br₂ → kết tủa trắng (2,4,6-tribromophenol)",
                    "Phenol độc, dùng làm thuốc sát trùng",
                ],
            },
        ],
    },
    {
        id: "11-6",
        title: "Hợp chất Carbonyl và Carboxylic acid",
        description: "Aldehyde, Ketone và Carboxylic acid",
        lessons: [
            {
                id: "11-6-1",
                title: "Aldehyde và Ketone",
                content: `**Aldehyde:** R-CHO (nhóm -CHO ở đầu mạch)
**Ketone:** R-CO-R' (nhóm >C=O ở giữa mạch)

**Tính chất vật lý:**
- Aldehyde đầu dãy: mùi hắc
- Nhiệt độ sôi thấp hơn alcohol cùng M
- Formaldehyde (HCHO): khí

**Tính chất hóa học:**

*1. Phản ứng cộng H₂:*
R-CHO + H₂ --Ni,t°--> R-CH₂OH (alcohol bậc I)
R-CO-R' + H₂ --Ni,t°--> R-CHOH-R' (alcohol bậc II)

*2. Phản ứng oxi hóa (chỉ aldehyde):*
- Với AgNO₃/NH₃ (phản ứng tráng bạc):
R-CHO + 2[Ag(NH₃)₂]⁺ + 2OH⁻ → RCOONH₄ + 2Ag↓ + 3NH₃ + H₂O

- Với Cu(OH)₂/OH⁻:
R-CHO + 2Cu(OH)₂ → RCOOH + Cu₂O↓ (đỏ gạch) + 2H₂O

**Phân biệt aldehyde và ketone:**
Aldehyde cho phản ứng tráng bạc, ketone không.`,
                keyPoints: [
                    "Aldehyde: -CHO, Ketone: >C=O",
                    "Aldehyde khử được Ag⁺, Cu(OH)₂",
                    "Phản ứng tráng bạc: Ag kết tủa",
                    "Cu(OH)₂ → Cu₂O đỏ gạch",
                ],
            },
            {
                id: "11-6-2",
                title: "Carboxylic acid",
                content: `**Carboxylic acid:** R-COOH (nhóm -COOH)

**Tính chất vật lý:**
- Acid đầu dãy: lỏng, mùi hắc
- Nhiệt độ sôi cao (liên kết H)
- Tan trong nước

**Tính chất hóa học:**

*1. Tính acid yếu:*
- Làm quỳ tím hóa đỏ
- CH₃COOH + NaOH → CH₃COONa + H₂O
- 2CH₃COOH + Zn → (CH₃COO)₂Zn + H₂↑
- 2CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + H₂O + CO₂↑

*2. Phản ứng ester hóa:*
CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O
(H₂SO₄ đặc, t°)

**So sánh tính acid:**
CH₃COOH < HCOOH < acid vô cơ

**Dãy đồng đẳng:**
HCOOH, CH₃COOH, C₂H₅COOH...
CTTQ: CₙH₂ₙO₂ hoặcCₙH₂ₙ₊₁COOH`,
                keyPoints: [
                    "Carboxylic acid: -COOH, acid yếu",
                    "Đầy đủ tính chất acid: tác dụng base, KL, muối",
                    "Ester hóa: acid + alcohol → ester + H₂O",
                    "Formic acid (HCOOH) mạnh hơn acetic acid",
                ],
            },
        ],
    },
];
