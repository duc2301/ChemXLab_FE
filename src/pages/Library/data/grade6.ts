// Curriculum data for Grade 6 - Khoa học tự nhiên (Chemistry part)
// Chân Trời Sáng Tạo 2024-2025

export interface Lesson {
    id: string;
    title: string;
    content: string;
    keyPoints: string[];
}

export interface Topic {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
}

export const grade6Topics: Topic[] = [
    {
        id: "6-1",
        title: "Chất và sự biến đổi của chất",
        description: "Tìm hiểu về các thể của chất, tính chất và sự biến đổi",
        lessons: [
            {
                id: "6-1-1",
                title: "Các thể của chất",
                content: `Chất tồn tại ở ba thể cơ bản: rắn, lỏng và khí.

**1. Thể rắn:**
- Có hình dạng và thể tích xác định
- Các hạt sắp xếp chặt chẽ, dao động tại chỗ
- Ví dụ: đá, sắt, đường, muối

**2. Thể lỏng:**
- Có thể tích xác định nhưng không có hình dạng cố định
- Các hạt ở gần nhau, có thể di chuyển
- Ví dụ: nước, dầu ăn, xăng

**3. Thể khí:**
- Không có hình dạng và thể tích xác định
- Các hạt ở xa nhau, chuyển động tự do
- Ví dụ: không khí, oxygen, carbon dioxide`,
                keyPoints: [
                    "Ba thể cơ bản: rắn, lỏng, khí",
                    "Thể rắn có hình dạng và thể tích xác định",
                    "Thể lỏng có thể tích xác định, hình dạng thay đổi theo vật chứa",
                    "Thể khí không có hình dạng và thể tích xác định",
                ],
            },
            {
                id: "6-1-2",
                title: "Sự chuyển thể của chất",
                content: `Chất có thể chuyển từ thể này sang thể khác khi thay đổi nhiệt độ hoặc áp suất.

**1. Nóng chảy và Đông đặc:**
- Nóng chảy: Rắn → Lỏng (thu nhiệt)
- Đông đặc: Lỏng → Rắn (tỏa nhiệt)
- Ví dụ: Nước đá tan thành nước lỏng ở 0°C

**2. Bay hơi và Ngưng tụ:**
- Bay hơi: Lỏng → Khí (thu nhiệt)
- Ngưng tụ: Khí → Lỏng (tỏa nhiệt)
- Ví dụ: Nước sôi bốc hơi ở 100°C

**3. Thăng hoa và Ngưng kết:**
- Thăng hoa: Rắn → Khí (không qua lỏng)
- Ngưng kết: Khí → Rắn
- Ví dụ: Băng phiến thăng hoa`,
                keyPoints: [
                    "Sáu quá trình chuyển thể cơ bản",
                    "Nóng chảy và bay hơi thu nhiệt",
                    "Đông đặc và ngưng tụ tỏa nhiệt",
                    "Thăng hoa: rắn chuyển trực tiếp thành khí",
                ],
            },
            {
                id: "6-1-3",
                title: "Tính chất vật lý và hóa học của chất",
                content: `**Tính chất vật lý:**
Là những tính chất có thể quan sát hoặc đo được mà không làm thay đổi chất đó.

- Trạng thái (rắn, lỏng, khí)
- Màu sắc, mùi vị
- Khối lượng riêng
- Nhiệt độ nóng chảy, nhiệt độ sôi
- Tính tan trong nước
- Tính dẫn điện, dẫn nhiệt

**Tính chất hóa học:**
Là khả năng biến đổi thành chất khác.

- Tính cháy (khả năng phản ứng với oxygen)
- Tính ăn mòn kim loại
- Khả năng phản ứng với acid/base
- Ví dụ: Sắt bị gỉ, gỗ cháy`,
                keyPoints: [
                    "Tính chất vật lý không làm thay đổi bản chất của chất",
                    "Tính chất hóa học liên quan đến sự biến đổi thành chất mới",
                    "Mỗi chất có tính chất vật lý và hóa học đặc trưng",
                ],
            },
        ],
    },
    {
        id: "6-2",
        title: "Oxygen và Không khí",
        description: "Tìm hiểu về oxygen, thành phần không khí và sự cháy",
        lessons: [
            {
                id: "6-2-1",
                title: "Oxygen",
                content: `**Oxygen (O₂)** là chất khí quan trọng nhất trong không khí.

**Tính chất vật lý:**
- Chất khí không màu, không mùi, không vị
- Tan ít trong nước
- Nặng hơn không khí
- Hóa lỏng ở -183°C

**Tính chất hóa học:**
- Duy trì sự cháy
- Duy trì sự sống (hô hấp)
- Phản ứng với nhiều chất tạo oxide

**Vai trò:**
1. Hô hấp của sinh vật
2. Sự cháy của nhiên liệu
3. Sản xuất công nghiệp
4. Y tế (oxygen y tế)`,
                keyPoints: [
                    "Oxygen chiếm khoảng 21% thể tích không khí",
                    "Oxygen duy trì sự cháy và sự sống",
                    "Ký hiệu hóa học: O₂",
                    "Oxygen nặng hơn không khí",
                ],
            },
            {
                id: "6-2-2",
                title: "Thành phần không khí",
                content: `**Không khí** là hỗn hợp nhiều chất khí.

**Thành phần chính:**
- Nitrogen (N₂): 78%
- Oxygen (O₂): 21%
- Các khí khác: 1% (Argon, CO₂, hơi nước...)

**Tính chất của không khí:**
- Không màu, không mùi
- Có khối lượng
- Chiếm không gian
- Có thể nén được

**Không khí sạch là không khí:**
- Có đủ oxygen cho hô hấp
- Không chứa khí độc hại
- Không có bụi bẩn, vi khuẩn gây hại`,
                keyPoints: [
                    "Nitrogen chiếm 78%, Oxygen chiếm 21%",
                    "Không khí là hỗn hợp, không phải hợp chất",
                    "Không khí có khối lượng và chiếm không gian",
                    "1% còn lại gồm Argon, CO₂ và các khí khác",
                ],
            },
            {
                id: "6-2-3",
                title: "Sự cháy và điều kiện phát sinh",
                content: `**Sự cháy** là phản ứng hóa học giữa chất với oxygen, tỏa nhiệt và phát sáng.

**Ba điều kiện cần cho sự cháy:**
1. **Chất cháy:** Gỗ, giấy, xăng, dầu...
2. **Oxygen:** Đủ oxygen để duy trì
3. **Nhiệt độ cháy:** Đạt đến nhiệt độ bắt lửa

**Dập tắt đám cháy:**
- Loại bỏ chất cháy
- Ngăn cách oxygen (dùng cát, bọt, CO₂)
- Hạ nhiệt độ (phun nước)

**Phân biệt:**
- Sự cháy: tỏa nhiệt và phát sáng mạnh
- Sự oxi hóa chậm: tỏa nhiệt nhưng không phát sáng`,
                keyPoints: [
                    "Sự cháy cần: chất cháy + oxygen + nhiệt độ",
                    "Thiếu 1 trong 3 điều kiện thì không có sự cháy",
                    "Dập lửa bằng cách loại bỏ 1 trong 3 điều kiện",
                    "Oxi hóa chậm: gỉ sắt, thức ăn thiu",
                ],
            },
        ],
    },
    {
        id: "6-3",
        title: "Một số vật liệu thông dụng",
        description: "Tìm hiểu về các loại vật liệu trong đời sống",
        lessons: [
            {
                id: "6-3-1",
                title: "Kim loại và hợp kim",
                content: `**Kim loại** là những chất có ánh kim, dẫn điện, dẫn nhiệt tốt.

**Tính chất chung:**
- Ánh kim (bề mặt sáng bóng)
- Dẫn điện, dẫn nhiệt tốt
- Có tính dẻo (kéo thành sợi, dát mỏng)
- Có độ cứng và độ bền cao

**Một số kim loại thông dụng:**
- Sắt (Fe): làm dao, kéo, máy móc
- Đồng (Cu): dây điện, đồ trang trí
- Nhôm (Al): nồi, xoong, máy bay
- Vàng (Au), Bạc (Ag): trang sức

**Hợp kim:**
- Là hỗn hợp kim loại với kim loại/phi kim khác
- Thép = Sắt + Carbon
- Đồng thau = Đồng + Kẽm`,
                keyPoints: [
                    "Kim loại có ánh kim, dẫn điện và nhiệt tốt",
                    "Kim loại có tính dẻo, có thể dát mỏng",
                    "Hợp kim có tính chất ưu việt hơn kim loại nguyên chất",
                    "Thép là hợp kim quan trọng nhất của sắt",
                ],
            },
            {
                id: "6-3-2",
                title: "Nhựa và cao su",
                content: `**Nhựa (Plastic):**

**Tính chất:**
- Nhẹ, bền, không dẫn điện
- Không bị ăn mòn, không gỉ
- Dễ tạo hình, nhiều màu sắc
- Khó phân hủy trong tự nhiên

**Ứng dụng:**
- Đồ dùng gia đình: xô, chậu, chai lọ
- Bao bì, túi đựng
- Vật liệu xây dựng: ống nước, cửa

**Cao su:**

**Tính chất:**
- Đàn hồi tốt
- Không thấm nước, không dẫn điện
- Bền với nhiều hóa chất

**Phân loại:**
- Cao su tự nhiên: từ cây cao su
- Cao su tổng hợp: từ dầu mỏ`,
                keyPoints: [
                    "Nhựa nhẹ, bền, cách điện tốt",
                    "Nhựa khó phân hủy - gây ô nhiễm môi trường",
                    "Cao su có tính đàn hồi cao",
                    "Cần hạn chế sử dụng đồ nhựa dùng 1 lần",
                ],
            },
            {
                id: "6-3-3",
                title: "Gốm sứ và thủy tinh",
                content: `**Gốm sứ:**

**Nguyên liệu:** Đất sét, cao lanh

**Tính chất:**
- Cứng, giòn, không cháy
- Cách nhiệt, cách điện
- Chịu được nhiệt độ cao
- Không bị ăn mòn

**Ứng dụng:** Bát đĩa, gạch lát, sứ vệ sinh

**Thủy tinh:**

**Nguyên liệu:** Cát (SiO₂) + Na₂CO₃ + CaCO₃

**Tính chất:**
- Trong suốt, cứng, giòn
- Không cháy, chịu được hóa chất
- Không hút ẩm, dễ vệ sinh

**Phân loại:**
- Thủy tinh thường: chai lọ, cốc
- Thủy tinh chịu nhiệt: dụng cụ phòng thí nghiệm
- Thủy tinh cường lực: kính ô tô, cửa`,
                keyPoints: [
                    "Gốm sứ làm từ đất sét, nung ở nhiệt độ cao",
                    "Thủy tinh làm từ cát (SiO₂)",
                    "Cả hai đều cứng, giòn, dễ vỡ",
                    "Thủy tinh trong suốt, gốm sứ không trong suốt",
                ],
            },
        ],
    },
    {
        id: "6-4",
        title: "Nhiên liệu",
        description: "Tìm hiểu về các loại nhiên liệu và năng lượng",
        lessons: [
            {
                id: "6-4-1",
                title: "Nhiên liệu và phân loại",
                content: `**Nhiên liệu** là những chất cháy được, tỏa nhiệt lượng lớn.

**Phân loại theo nguồn gốc:**

**1. Nhiên liệu hóa thạch:**
- Than đá: hình thành từ thực vật cổ đại
- Dầu mỏ: hình thành từ sinh vật biển
- Khí thiên nhiên: Methane (CH₄)

**2. Nhiên liệu sinh học:**
- Củi, gỗ, rơm rạ
- Cồn (ethanol từ mía, ngô)
- Biogas (khí sinh học từ chất thải)

**Phân loại theo trạng thái:**
- Nhiên liệu rắn: than, gỗ
- Nhiên liệu lỏng: xăng, dầu diesel
- Nhiên liệu khí: gas, khí thiên nhiên`,
                keyPoints: [
                    "Nhiên liệu hóa thạch: than, dầu mỏ, khí thiên nhiên",
                    "Nhiên liệu sinh học: gỗ, cồn, biogas",
                    "Nhiên liệu hóa thạch không tái tạo được",
                    "Cần sử dụng nhiên liệu tiết kiệm, hiệu quả",
                ],
            },
            {
                id: "6-4-2",
                title: "Sử dụng nhiên liệu hiệu quả",
                content: `**Tầm quan trọng của việc tiết kiệm nhiên liệu:**
- Nhiên liệu hóa thạch có hạn
- Giảm ô nhiễm môi trường
- Tiết kiệm chi phí

**Cách sử dụng hiệu quả:**

**1. Trong gia đình:**
- Tắt bếp khi không sử dụng
- Sử dụng nồi cơm điện, bếp từ tiết kiệm
- Bảo trì thiết bị thường xuyên

**2. Trong giao thông:**
- Đi xe đạp, xe buýt, đi bộ
- Bảo dưỡng xe định kỳ
- Tắt máy khi dừng đỗ lâu

**3. Trong sản xuất:**
- Sử dụng công nghệ tiết kiệm năng lượng
- Tái chế, tái sử dụng`,
                keyPoints: [
                    "Nhiên liệu hóa thạch đang cạn kiệt dần",
                    "Đốt nhiên liệu gây ô nhiễm không khí",
                    "Tiết kiệm năng lượng bảo vệ môi trường",
                    "Nên sử dụng năng lượng tái tạo",
                ],
            },
        ],
    },
];
