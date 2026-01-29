export interface ElementData {
    number: number;
    name: string;
    symbol: string;
    category: string;
    summary: string;
    appearance: string;
    uses: string;
}

export const vietnameseElements: Record<number, ElementData> = {
    1: {
        number: 1,
        name: "Hydrogen",
        symbol: "H",
        category: "diatomic nonmetal",
        summary: "Hydrogen là nguyên tố nhẹ nhất, phổ biến nhất vũ trụ (75% khối lượng). Nó là nguồn nhiên liệu chính của các sao như Mặt Trời.",
        appearance: "Khí không màu, không mùi, cháy với ngọn lửa màu xanh nhạt gần như vô hình.",
        uses: "Sản xuất amoniac (phân bón), hydro hóa dầu thực vật, nhiên liệu tên lửa, pin nhiên liệu sạch."
    },
    2: {
        number: 2,
        name: "Helium",
        symbol: "He",
        category: "noble gas",
        summary: "Helium là nguyên tố nhẹ thứ hai, trơ về mặt hóa học và có điểm sôi thấp nhất trong tất cả các nguyên tố.",
        appearance: "Khí không màu, không mùi. Phát sáng màu hồng cam rực rỡ khi có dòng điện chạy qua.",
        uses: "Làm lạnh nam châm siêu dẫn (máy MRI), khí nâng cho bóng bay/khí cầu, khí lặn biển sâu."
    },
    3: {
        number: 3,
        name: "Lithium",
        symbol: "Li",
        category: "alkali metal",
        summary: "Kim loại nhẹ nhất, có thể nổi trên dầu. Nó phản ứng mạnh với nước và không bao giờ tìm thấy ở dạng tự do trong tự nhiên.",
        appearance: "Kim loại màu trắng bạc, mềm, nhưng xỉn màu nhanh chóng thành xám đen trong không khí.",
        uses: "Pin sạc Li-ion (điện thoại, xe điện), hợp kim hàng không, điều trị rối loạn tâm lý, gốm sứ chịu nhiệt."
    },
    4: {
        number: 4,
        name: "Beryllium",
        symbol: "Be",
        category: "alkaline earth metal",
        summary: "Kim loại nhẹ nhưng cực kỳ cứng và giòn, có khả năng cho tia X đi qua gần như hoàn toàn.",
        appearance: "Kim loại màu xám thép, cứng, nhẹ và bền.",
        uses: "Cửa sổ ống tia X, hợp kim đồng-beri (dụng cụ không đánh lửa), gương kính viễn vọng James Webb."
    },
    5: {
        number: 5,
        name: "Boron",
        symbol: "B",
        category: "metalloid",
        summary: "Một á kim cứng, hiếm trong vũ trụ nhưng tập trung ở vỏ Trái Đất trong các khoáng chất borat.",
        appearance: "Dạng vô định hình là bột màu nâu; dạng tinh thể có màu đen sẫm, cực kỳ cứng.",
        uses: "Thủy tinh borosilicate (Pyrex) chịu nhiệt, sợi thủy tinh cách nhiệt, chất tẩy rửa, áo giáp chống đạn."
    },
    6: {
        number: 6,
        name: "Carbon",
        symbol: "C",
        category: "polyatomic nonmetal",
        summary: "Nguyên tố của sự sống, có khả năng hình thành hàng triệu hợp chất hữu cơ khác nhau. Có nhiều dạng thù hình độc đáo.",
        appearance: "Đen (than chì, than đá) hoặc trong suốt lấp lánh (kim cương).",
        uses: "Nhiên liệu hóa thạch, thép, nhựa, sợi carbon siêu nhẹ, kim cương (trang sức, cắt gọt), lọc nước."
    },
    7: {
        number: 7,
        name: "Nitrogen",
        symbol: "N",
        category: "diatomic nonmetal",
        summary: "Khí chiếm 78% thể tích khí quyển Trái Đất, là thành phần thiết yếu của axit amin và DNA trong mọi sinh vật.",
        appearance: "Khí không màu, không mùi, không vị (hóa lỏng ở -196°C).",
        uses: "Sản xuất phân bón, thuốc nổ (TNT), bảo quản thực phẩm, làm lạnh sâu (nitơ lỏng), bơm lốp máy bay."
    },
    8: {
        number: 8,
        name: "Oxygen",
        symbol: "O",
        category: "diatomic nonmetal",
        summary: "Nguyên tố hoạt động mạnh, duy trì sự sống và sự cháy. Chiếm 21% khí quyển và là nguyên tố phổ biến nhất trong vỏ Trái Đất.",
        appearance: "Khí không màu, không mùi. Ở dạng lỏng hoặc rắn có màu xanh nhạt.",
        uses: "Hô hấp y tế, sản xuất thép, hàn cắt kim loại, xử lý nước, chất oxy hóa cho nhiên liệu tên lửa."
    },
    9: {
        number: 9,
        name: "Fluorine",
        symbol: "F",
        category: "diatomic nonmetal",
        summary: "Nguyên tố có độ âm điện lớn nhất, phản ứng dữ dội với hầu hết các chất, kể cả thủy tinh và một số khí hiếm.",
        appearance: "Khí màu vàng nhạt, cực độc và có tính ăn mòn cao.",
        uses: "Kem đánh răng (fluoride), làm giàu uranium, khí làm lạnh (freon), nhựa chống dính (Teflon)."
    },
    10: {
        number: 10,
        name: "Neon",
        symbol: "Ne",
        category: "noble gas",
        summary: "Khí hiếm phổ biến thứ tư trong vũ trụ nhưng hiếm trên Trái Đất. Nổi tiếng với khả năng phát sáng rực rỡ.",
        appearance: "Khí không màu. Phát ra ánh sáng màu đỏ cam đặc trưng trong ống phóng điện chân không.",
        uses: "Biển hiệu quảng cáo neon, đèn báo điện áp cao, laser helium-neon, chất làm lạnh đông lạnh."
    },
    11: {
        number: 11,
        name: "Sodium",
        symbol: "Na",
        category: "alkali metal",
        summary: "Kim loại kiềm mềm, phản ứng nổ với nước. Là thành phần chính của muối biển và cần thiết cho sự sống.",
        appearance: "Kim loại trắng bạc, mềm như sáp, xỉn màu ngay lập tức khi ra không khí.",
        uses: "Gia vị (muối ăn), đèn đường (ánh sáng vàng), xà phòng, chất tải nhiệt trong lò phản ứng hạt nhân."
    },
    12: {
        number: 12,
        name: "Magnesium",
        symbol: "Mg",
        category: "alkaline earth metal",
        summary: "Kim loại nhẹ, cháy với ngọn lửa trắng chói lòa. Là trung tâm của phân tử diệp lục giúp cây quang hợp.",
        appearance: "Kim loại màu trắng bạc, nhẹ.",
        uses: "Hợp kim siêu nhẹ cho ô tô/máy bay, pháo hoa, vỏ laptop, dược phẩm (thuốc nhuận tràng)."
    },
    13: {
        number: 13,
        name: "Aluminium",
        symbol: "Al",
        category: "post-transition metal",
        summary: "Kim loại phổ biến nhất trong vỏ Trái Đất. Nhẹ, bền, dẫn điện tốt và không bị gỉ nhờ lớp oxit bảo vệ.",
        appearance: "Kim loại màu trắng bạc, ánh kim mờ, dẻo và dễ dát mỏng.",
        uses: "Vỏ lon nước ngọt, máy bay, khung cửa, dây cáp điện cao thế, gương kính viễn vọng."
    },
    14: {
        number: 14,
        name: "Silicon",
        symbol: "Si",
        category: "metalloid",
        summary: "Nguyên tố phổ biến thứ hai trong vỏ Trái Đất (sau Oxy). Là nền tảng vật chất của kỷ nguyên công nghệ thông tin.",
        appearance: "Tinh thể rắn màu xám sẫm, có ánh kim loại.",
        uses: "Chip máy tính, pin mặt trời, thủy tinh, gốm sứ, silicon (chất trám, khuôn đúc)."
    },
    15: {
        number: 15,
        name: "Phosphorus",
        symbol: "P",
        category: "polyatomic nonmetal",
        summary: "Thành phần thiết yếu của DNA và xương. Tồn tại ở dạng trắng (cực độc, tự cháy) và đỏ (ổn định).",
        appearance: "Sáp trắng (phát quang trong bóng tối), bột đỏ hoặc đen.",
        uses: "Phân bón (quan trọng nhất), diêm an toàn, pháo hoa, bom khói, thép đặc biệt."
    },
    16: {
        number: 16,
        name: "Sulfur",
        symbol: "S",
        category: "polyatomic nonmetal",
        summary: "Phi kim phổ biến, thường thấy ở các vùng núi lửa. Có mùi đặc trưng khi cháy (mùi trứng thối là do H2S).",
        appearance: "Tinh thể hoặc bột màu vàng chanh tươi, giòn.",
        uses: "Sản xuất axit sunfuric, lưu hóa cao su, thuốc súng đen, thuốc diệt nấm, pháo hoa."
    },
    17: {
        number: 17,
        name: "Chlorine",
        symbol: "Cl",
        category: "diatomic nonmetal",
        summary: "Khí halogen độc hại nhưng là chất khử trùng mạnh mẽ. Cần thiết cho sự sống dưới dạng ion muối.",
        appearance: "Khí màu vàng lục nhạt, mùi hắc khó chịu, nặng hơn không khí.",
        uses: "Khử trùng nước sinh hoạt/hồ bơi, sản xuất nhựa PVC, tẩy trắng giấy, dược phẩm."
    },
    18: {
        number: 18,
        name: "Argon",
        symbol: "Ar",
        category: "noble gas",
        summary: "Khí hiếm phổ biến nhất Trái Đất (khoảng 1% khí quyển). Hoàn toàn trơ, dùng tạo môi trường bảo vệ.",
        appearance: "Khí không màu, không mùi. Phát sáng tím xanh trong điện trường.",
        uses: "Khí bảo vệ khi hàn kim loại, bơm bóng đèn sợi đốt, cách nhiệt cửa sổ, bảo quản tài liệu."
    },
    19: {
        number: 19,
        name: "Potassium",
        symbol: "K",
        category: "alkali metal",
        summary: "Kim loại kiềm hoạt động mạnh, cháy với ngọn lửa màu tím hoa cà. Cực kỳ quan trọng cho thần kinh và tim mạch.",
        appearance: "Kim loại mềm màu trắng bạc, oxy hóa rất nhanh trong không khí.",
        uses: "Phân bón (kali), xà phòng lỏng, thủy tinh quang học, chất thay thế muối ăn."
    },
    20: {
        number: 20,
        name: "Calcium",
        symbol: "Ca",
        category: "alkaline earth metal",
        summary: "Kim loại kiềm thổ phổ biến nhất, là thành phần cấu tạo chính của xương, răng, vỏ sò và đá vôi.",
        appearance: "Kim loại màu trắng bạc, hơi cứng hơn chì.",
        uses: "Xây dựng (xi măng, bê tông), sản xuất thép, chế biến thực phẩm (phô mai), bổ sung dinh dưỡng."
    },
    21: {
        number: 21,
        name: "Scandium",
        symbol: "Sc",
        category: "transition metal",
        summary: "Kim loại chuyển tiếp nhẹ, thường được phân loại là đất hiếm. Có tính chất trung gian giữa nhôm và yttri.",
        appearance: "Kim loại trắng bạc, hơi ngả vàng hoặc hồng khi để lâu trong không khí.",
        uses: "Hợp kim nhôm-scandium cho máy bay chiến đấu, gậy bóng chày, đèn sân vận động cường độ cao."
    },
    22: {
        number: 22,
        name: "Titanium",
        symbol: "Ti",
        category: "transition metal",
        summary: "Nổi tiếng với tỷ lệ độ bền trên trọng lượng cao nhất. Chống ăn mòn tuyệt vời, kể cả trong nước biển.",
        appearance: "Kim loại trắng bạc, bóng, cứng và nhẹ.",
        uses: "Động cơ máy bay, khung xe đạp, khớp háng nhân tạo, trang sức, sơn trắng (TiO2)."
    },
    23: {
        number: 23,
        name: "Vanadium",
        symbol: "V",
        category: "transition metal",
        summary: "Kim loại cứng, chủ yếu dùng làm phụ gia để tăng cường độ bền và độ dẻo dai cho thép.",
        appearance: "Kim loại màu xanh xám bạc, cứng.",
        uses: "Thép dụng cụ (cờ lê, tuốc nơ vít), lò xo xe hơi, pin lưu trữ năng lượng quy mô lớn."
    },
    24: {
        number: 24,
        name: "Chromium",
        symbol: "Cr",
        category: "transition metal",
        summary: "Kim loại cứng nhất, chống gỉ và có độ bóng cao. Tạo màu sắc rực rỡ cho đá quý (như hồng ngọc).",
        appearance: "Kim loại màu xám thép, bóng loáng như gương.",
        uses: "Mạ crom trang trí/bảo vệ, thành phần chính của thép không gỉ, thuộc da, nhuộm màu."
    },
    25: {
        number: 25,
        name: "Manganese",
        symbol: "Mn",
        category: "transition metal",
        summary: "Kim loại giòn, không thể thiếu trong luyện kim hiện đại. Cần thiết cho sự quang hợp của cây.",
        appearance: "Kim loại màu xám trắng, cứng nhưng rất giòn.",
        uses: "Hợp kim thép chịu mài mòn (đường ray), pin alkaline, gốm sứ, khử màu thủy tinh."
    },
    26: {
        number: 26,
        name: "Iron",
        symbol: "Fe",
        category: "transition metal",
        summary: "Kim loại quan trọng nhất của nền văn minh, chiếm 90% lượng kim loại tinh chế. Là lõi của Trái Đất.",
        appearance: "Kim loại dẻo màu xám bạc, dễ bị gỉ sét (nâu đỏ) trong không khí ẩm.",
        uses: "Vật liệu xây dựng, khung xe, máy móc, vận chuyển oxy trong máu (hemoglobin)."
    },
    27: {
        number: 27,
        name: "Cobalt",
        symbol: "Co",
        category: "transition metal",
        summary: "Kim loại từ tính cứng, giữ từ tính ở nhiệt độ cao nhất. Tạo màu xanh lam đặc trưng cho thủy tinh/gốm.",
        appearance: "Kim loại cứng màu xám bạc, bóng.",
        uses: "Pin xe điện, nam châm siêu mạnh, hợp kim động cơ phản lực, xạ trị ung thư (Co-60)."
    },
    28: {
        number: 28,
        name: "Nickel",
        symbol: "Ni",
        category: "transition metal",
        summary: "Kim loại đa dụng, chống ăn mòn và oxy hóa tốt. Là thành phần của lõi Trái Đất cùng với sắt.",
        appearance: "Kim loại màu trắng bạc hơi ngả vàng, bóng láng.",
        uses: "Tiền xu, thép không gỉ, pin sạc, dây đàn guitar, xúc tác hóa học."
    },
    29: {
        number: 29,
        name: "Copper",
        symbol: "Cu",
        category: "transition metal",
        summary: "Kim loại đầu tiên con người sử dụng. Dẫn điện và nhiệt cực tốt, chỉ xếp sau bạc.",
        appearance: "Kim loại màu đỏ cam đặc trưng, có ánh kim.",
        uses: "Dây dẫn điện, ống nước, tiền xu, tượng đúc, hợp kim đồng thau và đồng thiếc."
    },
    30: {
        number: 30,
        name: "Zinc",
        symbol: "Zn",
        category: "transition metal",
        summary: "Kim loại chống ăn mòn, thiết yếu cho sức khỏe miễn dịch. Dễ đúc và gia công.",
        appearance: "Kim loại màu xanh xám nhạt.",
        uses: "Mạ kẽm (chống gỉ cho thép), hợp kim đúc, pin vỏ kẽm, kem chống nắng (ZnO)."
    },
    31: {
        number: 31,
        name: "Gallium",
        symbol: "Ga",
        category: "post-transition metal",
        summary: "Kim loại kỳ lạ tan chảy ngay trong lòng bàn tay. Không độc nhưng ăn mòn nhôm kim loại.",
        appearance: "Chất rắn màu trắng bạc, hóa lỏng ở 29.76°C.",
        uses: "Chất bán dẫn (đèn LED xanh/tím), nhiệt kế y tế không thủy ngân, tấm pin mặt trời."
    },
    32: {
        number: 32,
        name: "Germanium",
        symbol: "Ge",
        category: "metalloid",
        summary: "Chất bán dẫn đầu tiên được sử dụng trong transitor. Trong suốt với tia hồng ngoại.",
        appearance: "Chất rắn màu trắng xám, giòn, ánh kim.",
        uses: "Cáp quang, ống kính camera ban đêm/hồng ngoại, xúc tác nhựa PET (chai nước)."
    },
    33: {
        number: 33,
        name: "Arsenic",
        symbol: "As",
        category: "metalloid",
        summary: "Nổi tiếng với độc tính cao, nhưng cũng là chất bán dẫn quan trọng. Từng dùng làm thuốc và mỹ phẩm xưa.",
        appearance: "Dạng kim loại màu xám thiếc, giòn; dạng vàng mềm và kém bền.",
        uses: "Thuốc trừ sâu/cỏ (hạn chế), chất bán dẫn điện thoại, pháo hoa, đạn chì cứng."
    },
    34: {
        number: 34,
        name: "Selenium",
        symbol: "Se",
        category: "polyatomic nonmetal",
        summary: "Có tính chất quang điện (dẫn điện khi có ánh sáng). Cần thiết cho cơ thể với lượng rất nhỏ.",
        appearance: "Dạng kim loại xám hoặc bột màu đỏ gạch.",
        uses: "Máy photocopy, cảm biến ánh sáng, khử màu thủy tinh, dầu gội trị gàu."
    },
    35: {
        number: 35,
        name: "Bromine",
        symbol: "Br",
        category: "diatomic nonmetal",
        summary: "Một trong hai nguyên tố duy nhất ở dạng lỏng ở nhiệt độ phòng. Bay hơi tạo khói đỏ độc hại.",
        appearance: "Chất lỏng màu đỏ nâu đậm, linh động.",
        uses: "Chất chống cháy cho nhựa/vải, khoan dầu khí, phim ảnh, dược phẩm."
    },
    36: {
        number: 36,
        name: "Krypton",
        symbol: "Kr",
        category: "noble gas",
        summary: "Khí hiếm nặng hơn không khí gần 3 lần. Từng được dùng để định nghĩa mét chuẩn.",
        appearance: "Khí không màu. Phát sáng màu trắng sáng chói trong điện trường.",
        uses: "Đèn flash nhiếp ảnh tốc độ cao, đèn sân bay sương mù, laser chữa mắt, cửa sổ cách nhiệt."
    },
    37: {
        number: 37,
        name: "Rubidium",
        symbol: "Rb",
        category: "alkali metal",
        summary: "Kim loại rất mềm và hoạt động mạnh, có thể tự cháy trong không khí.",
        appearance: "Kim loại màu trắng bạc.",
        uses: "Đồng hồ nguyên tử chính xác cao, pháo hoa màu tím, tế bào quang điện, nghiên cứu tim mạch."
    },
    38: {
        number: 38,
        name: "Strontium",
        symbol: "Sr",
        category: "alkaline earth metal",
        summary: "Nổi tiếng với khả năng tạo màu đỏ rực rỡ nhất cho ngọn lửa. Đồng vị Sr-90 là chất phóng xạ.",
        appearance: "Kim loại mềm màu vàng nhạt.",
        uses: "Pháo hoa màu đỏ, nam châm gốm, sơn phát quang, máy phát điện nhiệt điện hạt nhân."
    },
    39: {
        number: 39,
        name: "Yttrium",
        symbol: "Y",
        category: "transition metal",
        summary: "Kim loại chuyển tiếp thường đi cùng nhóm đất hiếm. Mặt trăng chứa nhiều đá yttrium.",
        appearance: "Kim loại màu trắng bạc.",
        uses: "Đèn LED trắng, chất siêu dẫn nhiệt độ cao, laser cắt kim loại, ống kính camera."
    },
    40: {
        number: 40,
        name: "Zirconium",
        symbol: "Zr",
        category: "transition metal",
        summary: "Kim loại chống ăn mòn xuất sắc, không hấp thụ neutron nên lý tưởng cho điện hạt nhân.",
        appearance: "Kim loại màu trắng xám, bóng.",
        uses: "Vỏ thanh nhiên liệu hạt nhân, gốm sứ (dao gốm), đá quý giả kim cương (Cubic Zirconia)."
    },
    41: {
        number: 41,
        name: "Niobium",
        symbol: "Nb",
        category: "transition metal",
        summary: "Kim loại siêu dẫn quan trọng. Nó thường được tìm thấy cùng với Tantalum.",
        appearance: "Kim loại màu xám, chuyển sang xanh lơ khi oxy hóa.",
        uses: "Nam châm máy quét MRI, động cơ tên lửa, thép đường ống dẫn dầu, trang sức chống dị ứng."
    },
    42: {
        number: 42,
        name: "Molybdenum",
        symbol: "Mo",
        category: "transition metal",
        summary: "Có điểm nóng chảy cực cao. Cần thiết cho sự cố định nitơ ở thực vật.",
        appearance: "Kim loại màu trắng bạc, rất cứng.",
        uses: "Hợp kim chịu nhiệt, chất bôi trơn động cơ, điện cực lò nấu thủy tinh, tên lửa."
    },
    43: {
        number: 43,
        name: "Technetium",
        symbol: "Tc",
        category: "transition metal",
        summary: "Nguyên tố nhân tạo đầu tiên (1937), mọi đồng vị đều phóng xạ. Hiếm nhất trong các nguyên tố nhẹ.",
        appearance: "Kim loại màu xám bạc.",
        uses: "Chẩn đoán y học hạt nhân (xạ hình xương, tim, phổi) - đồng vị Tc-99m."
    },
    44: {
        number: 44,
        name: "Ruthenium",
        symbol: "Ru",
        category: "transition metal",
        summary: "Kim loại quý nhóm bạch kim, rất cứng và trơ. Làm cứng bạch kim và palladium.",
        appearance: "Kim loại màu trắng bạc, cứng.",
        uses: "Tiếp điểm điện điện thế cao, điện cực sản xuất clo, ngòi bút máy, pin mặt trời."
    },
    45: {
        number: 45,
        name: "Rhodium",
        symbol: "Rh",
        category: "transition metal",
        summary: "Kim loại quý hiếm nhất và đắt nhất thế giới. Phản xạ ánh sáng cực tốt và không bao giờ xỉn màu.",
        appearance: "Kim loại màu trắng bạc, lấp lánh.",
        uses: "Bộ chuyển đổi xúc tác ô tô, mạ đồ trang sức (vàng trắng), đèn pha, gương phản xạ."
    },
    46: {
        number: 46,
        name: "Palladium",
        symbol: "Pd",
        category: "transition metal",
        summary: "Có khả năng hấp thụ hydro gấp 900 lần thể tích của chính nó.",
        appearance: "Kim loại màu trắng bạc, mềm.",
        uses: "Bộ lọc khí thải xe hơi, pin nhiên liệu, trang sức, tụ điện gốm trong điện thoại."
    },
    47: {
        number: 47,
        name: "Silver",
        symbol: "Ag",
        category: "transition metal",
        summary: "Dẫn điện và dẫn nhiệt tốt nhất trong tất cả các nguyên tố. Có tính kháng khuẩn tự nhiên.",
        appearance: "Kim loại quý màu trắng sáng bóng, dễ bị xỉn màu bởi lưu huỳnh.",
        uses: "Trang sức, thiết bị điện tử, pin mặt trời, gương soi, dụng cụ y tế, lọc nước."
    },
    48: {
        number: 48,
        name: "Cadmium",
        symbol: "Cd",
        category: "transition metal",
        summary: "Kim loại độc hại tích tụ trong cơ thể. Thường đi kèm với kẽm trong tự nhiên.",
        appearance: "Kim loại màu trắng hơi xanh, mềm như thiếc.",
        uses: "Pin sạc Ni-Cd (cũ), thanh kiểm soát lò phản ứng hạt nhân, mạ điện chống ăn mòn."
    },
    49: {
        number: 49,
        name: "Indium",
        symbol: "In",
        category: "post-transition metal",
        summary: "Kim loại mềm có thể cắt bằng dao. Oxit của nó vừa dẫn điện vừa trong suốt.",
        appearance: "Kim loại màu trắng bạc, rất bóng và mềm.",
        uses: "Màn hình cảm ứng (ITO), TV LCD, vi mạch, hợp kim nóng chảy thấp cho hệ thống phun nước."
    },
    50: {
        number: 50,
        name: "Tin",
        symbol: "Sn",
        category: "post-transition metal",
        summary: "Được dùng từ thời cổ đại (Đồ Đồng). Có hiện tượng 'tiếng khóc của thiếc' khi bị uốn cong.",
        appearance: "Kim loại màu trắng bạc, mềm, dễ uốn.",
        uses: "Hàn điện tử, tráng bề mặt thực phẩm (đồ hộp), hợp kim đồng thiếc, kính phẳng."
    },
    51: {
        number: 51,
        name: "Antimony",
        symbol: "Sb",
        category: "metalloid",
        summary: "Đã được biết đến từ thời cổ đại dùng làm mỹ phẩm mắt. Mở rộng khi đông đặc (giống nước).",
        appearance: "Chất rắn màu xám bạc, giòn, có ánh kim.",
        uses: "Chất chống cháy, pin chì-axit, đạn, vi điện tử, sơn vàng pha lê."
    },
    52: {
        number: 52,
        name: "Tellurium",
        symbol: "Te",
        category: "metalloid",
        summary: "Một trong những nguyên tố hiếm nhất vỏ Trái Đất. Hơi của nó có mùi tỏi nồng nặc.",
        appearance: "Chất rắn màu trắng bạc, giòn, ánh kim.",
        uses: "Pin mặt trời Cadmium-Telluride, đĩa quang, hợp kim dễ gia công, nhiệt điện."
    },
    53: {
        number: 53,
        name: "Iodine",
        symbol: "I",
        category: "diatomic nonmetal",
        summary: "Halogen ít hoạt động nhất. Thăng hoa trực tiếp từ rắn sang khí tím. Thiết yếu cho tuyến giáp.",
        appearance: "Tinh thể rắn màu tím đen lấp lánh.",
        uses: "Thuốc sát trùng, dược phẩm, muối I-ốt ngừa bướu cổ, thuốc cản quang y tế."
    },
    54: {
        number: 54,
        name: "Xenon",
        symbol: "Xe",
        category: "noble gas",
        summary: "Khí hiếm nặng và đắt tiền. Là khí hiếm đầu tiên tạo thành hợp chất hóa học.",
        appearance: "Khí không màu, nặng. Phát sáng màu xanh dương trong điện trường.",
        uses: "Đèn pha máy chiếu phim IMAX, đèn pha ô tô, động cơ đẩy tàu vũ trụ, thuốc gây mê."
    },
    55: {
        number: 55,
        name: "Cesium",
        symbol: "Cs",
        category: "alkali metal",
        summary: "Kim loại hoạt động mạnh nhất, nổ tung ngay khi gặp nước đá. Định nghĩa đơn vị giây chuẩn.",
        appearance: "Kim loại màu vàng nhạt, lỏng ở nhiệt độ chỉ trên nhiệt độ phòng (28°C).",
        uses: "Đồng hồ nguyên tử (chuẩn GPS/Internet), dung dịch khoan dầu khí, thiết bị nhìn đêm."
    },
    56: {
        number: 56,
        name: "Barium",
        symbol: "Ba",
        category: "alkaline earth metal",
        summary: "Nặng và phản ứng mạnh. Hợp chất của nó hấp thụ tia X cực tốt.",
        appearance: "Kim loại màu trắng bạc, mềm.",
        uses: "Chất cản quang chụp X-quang dạ dày, pháo hoa màu xanh lá cây, dung dịch khoan, thủy tinh."
    },
    57: {
        number: 57,
        name: "Lanthanum",
        symbol: "La",
        category: "lanthanide",
        summary: "Nguyên tố mở đầu nhóm đất hiếm Lantan. Hoạt động hóa học khá mạnh.",
        appearance: "Kim loại màu trắng bạc, mềm, có thể cắt bằng dao.",
        uses: "Pin xe lai (Hybrid), thấu kính máy ảnh cao cấp, đá lửa bật lửa, điều trị suy thận."
    },
    58: {
        number: 58,
        name: "Cerium",
        symbol: "Ce",
        category: "lanthanide",
        summary: "Nguyên tố đất hiếm phổ biến nhất, nhiều như đồng. Dễ dàng tự cháy khi ma sát.",
        appearance: "Kim loại màu xám thép, dễ uốn.",
        uses: "Đá lửa, bột đánh bóng kính, phụ gia nhiên liệu diesel, xúc tác khí thải, đèn LED."
    },
    59: {
        number: 59,
        name: "Praseodymium",
        symbol: "Pr",
        category: "lanthanide",
        summary: "Tên có nghĩa là 'cặp song sinh xanh lá'. Luôn đi cùng với Neodymium.",
        appearance: "Kim loại màu trắng bạc, mềm, có ánh vàng.",
        uses: "Nam châm vĩnh cửu, kính bảo hộ hàn (lọc tia UV), tạo màu vàng cho thủy tinh/gốm."
    },
    60: {
        number: 60,
        name: "Neodymium",
        symbol: "Nd",
        category: "lanthanide",
        summary: "Tạo ra nam châm vĩnh cửu mạnh nhất thế giới. Cốt lõi của công nghệ xe điện và năng lượng gió.",
        appearance: "Kim loại màu trắng bạc, nhanh chóng chuyển vàng/hồng khi oxi hóa.",
        uses: "Nam châm siêu mạnh (loa, ổ cứng, mô tơ xe điện), laser y tế, kính râm."
    },
    61: {
        number: 61,
        name: "Promethium",
        symbol: "Pm",
        category: "lanthanide",
        summary: "Nguyên tố đất hiếm duy nhất bị phóng xạ và không tồn tại tự nhiên trên Trái Đất (trừ vết nhỏ).",
        appearance: "Kim loại nhân tạo, phát sáng xanh dương hoặc xanh lục trong bóng tối do phóng xạ.",
        uses: "Pin hạt nhân (pace-maker cũ), sơn phát quang cho đồng hồ lặn, nguồn tia X di động."
    },
    62: {
        number: 62,
        name: "Samarium",
        symbol: "Sm",
        category: "lanthanide",
        summary: "Kim loại cứng nhất trong nhóm đất hiếm. Có khả năng chịu nhiệt độ cao tuyệt vời.",
        appearance: "Kim loại màu trắng bạc, tương đối ổn định trong không khí khô.",
        uses: "Nam châm chịu nhiệt độ cao (động cơ), thanh điều khiển lò phản ứng, thuốc điều trị ung thư xương."
    },
    63: {
        number: 63,
        name: "Europium",
        symbol: "Eu",
        category: "lanthanide",
        summary: "Hoạt động mạnh nhất trong nhóm đất hiếm. Nổi tiếng với khả năng phát quang màu đỏ rực rỡ.",
        appearance: "Kim loại màu trắng bạc, nhưng oxy hóa cực nhanh thành bột màu trắng.",
        uses: "Màn hình TV/điện thoại (màu đỏ), đèn huỳnh quang tiết kiệm điện, mực chống tiền giả."
    },
    64: {
        number: 64,
        name: "Gadolinium",
        symbol: "Gd",
        category: "lanthanide",
        summary: "Có tính chất từ tính độc đáo, nóng lên khi vào từ trường và lạnh đi khi rời khỏi nó.",
        appearance: "Kim loại màu trắng bạc, dễ uốn.",
        uses: "Thuốc cản quang cho chụp cộng hưởng từ (MRI), đĩa dữ liệu từ-quang, làm lạnh từ tính."
    },
    65: {
        number: 65,
        name: "Terbium",
        symbol: "Tb",
        category: "lanthanide",
        summary: "Khá hiếm và đắt đỏ. Nó thay đổi hình dạng khi đặt trong từ trường (từ giảo).",
        appearance: "Kim loại màu trắng bạc, mềm.",
        uses: "Màn hình phẳng (màu xanh lá), đèn huỳnh quang, loa Sonar cho hải quân, cảm biến."
    },
    66: {
        number: 66,
        name: "Dysprosium",
        symbol: "Dy",
        category: "lanthanide",
        summary: "Có từ tính mạnh nhất trong các nguyên tố ở nhiệt độ thấp. Tên có nghĩa là 'khó tiếp cận'.",
        appearance: "Kim loại màu trắng bạc, có độ sáng kim loại cao.",
        uses: "Nam châm cho tua bin gió và xe điện (chịu nhiệt), ổ cứng máy tính, thanh hấp thụ neutron."
    },
    67: {
        number: 67,
        name: "Holmium",
        symbol: "Ho",
        category: "lanthanide",
        summary: "Có mô men từ cao nhất trong tất cả các nguyên tố, cho phép tạo ra từ trường cực mạnh.",
        appearance: "Kim loại màu trắng bạc, khá mềm và dễ uốn.",
        uses: "Nam châm từ trường siêu cao (máy MRI), laser y tế phẫu thuật thận/mắt, nhuộm màu kính."
    },
    68: {
        number: 68,
        name: "Erbium",
        symbol: "Er",
        category: "lanthanide",
        summary: "Đóng vai trò quan trọng trong việc truyền dữ liệu internet qua cáp quang.",
        appearance: "Kim loại màu trắng bạc. Muối của nó có màu hồng phấn rất đẹp.",
        uses: "Bộ khuếch đại tín hiệu cáp quang, laser da liễu, kính râm, đồ trang sức gốm sứ màu hồng."
    },
    69: {
        number: 69,
        name: "Thulium",
        symbol: "Tm",
        category: "lanthanide",
        summary: "Nguyên tố đất hiếm ít phổ biến nhất và đắt tiền nhất. Tên đặt theo vùng đất cực Bắc Thule.",
        appearance: "Kim loại màu xám bạc, mềm, dễ cắt bằng dao.",
        uses: "Máy X-quang di động (nha khoa), laser phẫu thuật chính xác cao, tiền giấy chống giả (Euro)."
    },
    70: {
        number: 70,
        name: "Ytterbium",
        symbol: "Yb",
        category: "lanthanide",
        summary: "Được đặt tên theo ngôi làng Ytterby ở Thụy Điển, nơi phát hiện nhiều nguyên tố đất hiếm.",
        appearance: "Kim loại màu trắng bạc, dẻo.",
        uses: "Đồng hồ nguyên tử quang học (chính xác nhất), thép không gỉ chất lượng cao, laser công nghiệp."
    },
    71: {
        number: 71,
        name: "Lutetium",
        symbol: "Lu",
        category: "lanthanide",
        summary: "Kim loại đất hiếm nặng nhất và cứng nhất. Rất đắt do quy trình tách chiết khó khăn.",
        appearance: "Kim loại màu trắng bạc, cứng như thép.",
        uses: "Máy quét PET chữa ung thư, xác định tuổi mẫu vật cổ (địa chất), xúc tác dầu mỏ."
    },
    72: {
        number: 72,
        name: "Hafnium",
        symbol: "Hf",
        category: "transition metal",
        summary: "Luôn đi kèm với Zirconium và rất khó tách ra. Chịu nhiệt độ cực cao mà không bị ăn mòn.",
        appearance: "Kim loại màu xám thép, bóng loáng.",
        uses: "Thanh kiểm soát hạt nhân (tàu ngầm), chip vi xử lý Intel (cách điện), đầu cắt plasma."
    },
    73: {
        number: 73,
        name: "Tantalum",
        symbol: "Ta",
        category: "transition metal",
        summary: "Hoàn toàn trơ với các dịch cơ thể, làm cho nó lý tưởng cho y học. Rất hiếm và đắt.",
        appearance: "Kim loại màu xám xanh, rất cứng và nặng.",
        uses: "Tụ điện điện thoại/laptop (nhỏ gọn), cấy ghép xương/khớp nhân tạo, thiết bị hóa học."
    },
    74: {
        number: 74,
        name: "Tungsten",
        symbol: "W",
        category: "transition metal",
        summary: "Kim loại có điểm nóng chảy cao nhất (3422°C). Cứng như kim cương khi kết hợp với carbon.",
        appearance: "Kim loại màu xám trắng, rất nặng và cứng.",
        uses: "Dây tóc bóng đèn sợi đốt, mũi khoan/cắt kim loại, vỏ tên lửa, trọng lượng cân bằng tàu/máy bay."
    },
    75: {
        number: 75,
        name: "Rhenium",
        symbol: "Re",
        category: "transition metal",
        summary: "Một trong những kim loại hiếm nhất vỏ Trái Đất. Chịu nhiệt cực tốt, chỉ sau Tungsten.",
        appearance: "Kim loại màu trắng bạc, nặng.",
        uses: "Cánh quạt tuabin động cơ máy bay phản lực (chịu nhiệt), cặp nhiệt điện đo nhiệt độ cao."
    },
    76: {
        number: 76,
        name: "Osmium",
        symbol: "Os",
        category: "transition metal",
        summary: "Nguyên tố tự nhiên đặc (nặng) nhất, nặng gấp đôi chì. Rất cứng nhưng giòn và khó gia công.",
        appearance: "Kim loại màu xám xanh lam, bóng.",
        uses: "Ngòi bút máy cao cấp, kim máy hát đĩa than, tiếp điểm điện, kính hiển vi điện tử."
    },
    77: {
        number: 77,
        name: "Iridium",
        symbol: "Ir",
        category: "transition metal",
        summary: "Kim loại chống ăn mòn tốt nhất, ngay cả axit cường toan cũng không thể hòa tan. Rất cứng.",
        appearance: "Kim loại màu trắng bạc hơi ngả vàng.",
        uses: "Bugi động cơ máy bay, nồi nấu kim loại nhiệt độ cao, chuẩn đo lường quốc tế, đầu bút bi."
    },
    78: {
        number: 78,
        name: "Platinum",
        symbol: "Pt",
        category: "transition metal",
        summary: "Biểu tượng của sự sang trọng, quý hơn vàng. Trơ về mặt hóa học và xúc tác phản ứng tuyệt vời.",
        appearance: "Kim loại màu trắng xám, dẻo, dễ uốn.",
        uses: "Trang sức cao cấp, bộ lọc khí thải ô tô, thuốc chống ung thư, dụng cụ thí nghiệm, máy tạo nhịp tim."
    },
    79: {
        number: 79,
        name: "Gold",
        symbol: "Au",
        category: "transition metal",
        summary: "Kim loại quý được khao khát nhất lịch sử. Không bị ăn mòn và là kim loại dễ dát mỏng nhất.",
        appearance: "Kim loại màu vàng đậm đặc trưng, mềm, sáng bóng.",
        uses: "Trang sức, dự trữ tiền tệ, lớp phủ vệ tinh (phản xạ nhiệt), đầu nối điện tử tin cậy."
    },
    80: {
        number: 80,
        name: "Mercury",
        symbol: "Hg",
        category: "transition metal",
        summary: "Kim loại duy nhất ở dạng lỏng ở nhiệt độ thường. Hơi của nó cực độc đối với hệ thần kinh.",
        appearance: "Chất lỏng màu trắng bạc, linh động, nặng.",
        uses: "Nhiệt kế (đã hạn chế), đèn huỳnh quang, khai thác vàng thủ công, vắc-xin (chất bảo quản - tranh cãi)."
    },
    81: {
        number: 81,
        name: "Thallium",
        symbol: "Tl",
        category: "post-transition metal",
        summary: "Được mệnh danh là 'chất độc của kẻ đầu độc' vì không màu, không mùi vị. Từng dùng diệt chuột.",
        appearance: "Kim loại trắng bạc mềm như chì, cắt ra xỉn màu xám ngay lập tức.",
        uses: "Máy quét tim mạch (xạ hình), gốm siêu dẫn nhiệt độ cao, thấu kính quang học hồng ngoại."
    },
    82: {
        number: 82,
        name: "Lead",
        symbol: "Pb",
        category: "post-transition metal",
        summary: "Kim loại nặng, mềm, dễ gia công nhưng độc hại. Đã được sử dụng từ thời La Mã làm ống nước.",
        appearance: "Kim loại màu xám xanh, xỉn màu, nặng và mềm.",
        uses: "Ắc quy xe hơi, tấm chắn bức xạ tia X, đạn, lớp bảo vệ cáp ngầm dưới biển."
    },
    83: {
        number: 83,
        name: "Bismuth",
        symbol: "Bi",
        category: "post-transition metal",
        summary: "Kim loại nặng duy nhất không độc hại. Nổi tiếng với tinh thể hình cầu thang bảy sắc cầu vồng.",
        appearance: "Kim loại giòn màu trắng ánh hồng. Tinh thể nhân tạo có màu ngũ sắc rực rỡ.",
        uses: "Thuốc dạ dày (Pepto-Bismol), mỹ phẩm, đạn dược không chì, hệ thống chữa cháy phun nước."
    },
    84: {
        number: 84,
        name: "Polonium",
        symbol: "Po",
        category: "metalloid",
        summary: "Nguyên tố phóng xạ nguy hiểm được Marie Curie phát hiện. Rất nóng do phân rã alpha mạnh.",
        appearance: "Kim loại màu trắng bạc, phát sáng màu xanh dương yếu trong bóng tối.",
        uses: "Nguồn nhiệt cho vệ tinh không gian, chổi quét bụi chống tĩnh điện (công nghiệp), chất độc ám sát."
    },
    85: {
        number: 85,
        name: "Astatine",
        symbol: "At",
        category: "metalloid",
        summary: "Nguyên tố tự nhiên hiếm nhất trên Trái Đất (chưa đến 30g toàn cầu). Phóng xạ cao và bay hơi nhanh.",
        appearance: "Chưa ai thấy đủ lượng lớn, dự đoán là chất rắn màu đen hoặc kim loại.",
        uses: "Đang nghiên cứu để điều trị ung thư bằng liệu pháp xạ trị alpha nhắm đích."
    },
    86: {
        number: 86,
        name: "Radon",
        symbol: "Rn",
        category: "noble gas",
        summary: "Khí phóng xạ nặng, không màu, tích tụ trong tầng hầm nhà cửa gây nguy cơ ung thư phổi.",
        appearance: "Khí không màu. Dưới điểm đóng băng phát sáng màu vàng cam rực rỡ.",
        uses: "Điều trị ung thư (cũ), dự báo động đất (nồng độ thay đổi trong nước ngầm)."
    },
    87: {
        number: 87,
        name: "Francium",
        symbol: "Fr",
        category: "alkali metal",
        summary: "Kim loại kiềm hiếm và không ổn định nhất. Phân rã nhanh chóng thành các nguyên tố khác.",
        appearance: "Chưa ai quan sát được lượng lớn, dự đoán là kim loại lỏng phóng xạ.",
        uses: "Chỉ phục vụ nghiên cứu khoa học cơ bản về cấu trúc nguyên tử."
    },
    88: {
        number: 88,
        name: "Radium",
        symbol: "Ra",
        category: "alkaline earth metal",
        summary: "Từng được dùng trong đồng hồ phát sáng dẫn đến thảm kịch 'Radium Girls'. Phóng xạ mạnh.",
        appearance: "Kim loại màu trắng bạc tinh khiết, nhưng phát sáng màu xanh lục nhạt trong bóng tối.",
        uses: "Điều trị ung thư xương di căn, nguồn neutron cho nghiên cứu, sơn phát quang (đã cấm)."
    },
    89: {
        number: 89,
        name: "Actinium",
        symbol: "Ac",
        category: "actinide",
        summary: "Nguyên tố đầu tiên của họ Actini. Tên gọi bắt nguồn từ tiếng Hy Lạp nghĩa là 'tia sáng' do sự phát quang.",
        appearance: "Kim loại màu trắng bạc, phát sáng màu xanh dương mạnh trong bóng tối.",
        uses: "Liệu pháp miễn dịch phóng xạ điều trị ung thư, nguồn neutron."
    },
    90: {
        number: 90,
        name: "Thorium",
        symbol: "Th",
        category: "actinide",
        summary: "Nhiên liệu hạt nhân xanh tiềm năng của tương lai, an toàn hơn Uranium và trữ lượng lớn hơn.",
        appearance: "Kim loại màu trắng bạc, dần xỉn màu đen.",
        uses: "Lò phản ứng hạt nhân thế hệ mới, kính máy ảnh khúc xạ cao, măng sông đèn khí (đèn cắm trại)."
    },
    91: {
        number: 91,
        name: "Protactinium",
        symbol: "Pa",
        category: "actinide",
        summary: "Nằm giữa Thorium và Uranium. Rất hiếm, độc hại và đắt đỏ.",
        appearance: "Kim loại màu trắng bạc sáng bóng, siêu dẫn ở nhiệt độ thấp.",
        uses: "Chủ yếu dùng cho nghiên cứu khoa học, định tuổi trầm tích biển."
    },
    92: {
        number: 92,
        name: "Uranium",
        symbol: "U",
        category: "actinide",
        summary: "Nhiên liệu chính của năng lượng hạt nhân. Rất nặng, một khối lập phương 10cm nặng tới 19kg.",
        appearance: "Kim loại màu trắng bạc, nặng.",
        uses: "Nhiên liệu nhà máy điện hạt nhân, vũ khí hạt nhân, kính màu vàng lục phát quang, đạn xuyên giáp."
    },
    93: {
        number: 93,
        name: "Neptunium",
        symbol: "Np",
        category: "actinide",
        summary: "Nguyên tố siêu uran đầu tiên được tổng hợp. Là sản phẩm phụ của lò phản ứng hạt nhân.",
        appearance: "Kim loại màu trắng bạc.",
        uses: "Nguyên liệu sản xuất Plutonium-238 (nguồn điện cho tàu vũ trụ), máy dò neutron."
    },
    94: {
        number: 94,
        name: "Plutonium",
        symbol: "Pu",
        category: "actinide",
        summary: "Nguyên tố nhân tạo nổi tiếng nhất. Pu-239 là nhiên liệu phân hạch, Pu-238 cung cấp nhiệt điện.",
        appearance: "Kim loại trắng bạc, xỉn màu vàng rồi đen. Sờ vào thấy ấm do phóng xạ.",
        uses: "Vũ khí hạt nhân, năng lượng cho tàu vũ trụ (Voyager, Mars Rover), lò phản ứng."
    },
    95: {
        number: 95,
        name: "Americium",
        symbol: "Am",
        category: "actinide",
        summary: "Nguyên tố nhân tạo duy nhất có thể tìm thấy trong nhà bạn (máy báo khói).",
        appearance: "Kim loại màu trắng bạc, dễ uốn.",
        uses: "Máy cảm biến báo khói (lượng rất nhỏ an toàn), thước đo độ dày công nghiệp, nguồn tia gamma."
    },
    96: {
        number: 96,
        name: "Curium",
        symbol: "Cm",
        category: "actinide",
        summary: "Đặt tên theo Marie và Pierre Curie. Phóng xạ mạnh đến mức tự phát sáng màu tím.",
        appearance: "Kim loại màu trắng bạc cứng, rực sáng trong bóng tối.",
        uses: "Nguồn năng lượng cho thiết bị không gian, máy quang phổ tia X phân tích đá sao Hỏa."
    },
    97: {
        number: 97,
        name: "Berkelium",
        symbol: "Bk",
        category: "actinide",
        summary: "Được tổng hợp tại Berkeley, California. Rất khó sản xuất với lượng đủ dùng.",
        appearance: "Kim loại màu trắng bạc.",
        uses: "Chủ yếu dùng làm mục tiêu để tổng hợp các nguyên tố nặng hơn (như Tennessine)."
    },
    98: {
        number: 98,
        name: "Californium",
        symbol: "Cf",
        category: "actinide",
        summary: "Nguyên tố đắt nhất thế giới có ứng dụng thương mại. Một microgram phát ra 170 triệu neutron/phút.",
        appearance: "Kim loại màu trắng bạc, dễ bay hơi.",
        uses: "Khởi động lò phản ứng hạt nhân, máy quét an ninh than/xi măng, điều trị ung thư cổ tử cung."
    },
    99: {
        number: 99,
        name: "Einsteinium",
        symbol: "Es",
        category: "actinide",
        summary: "Được phát hiện lần đầu tiên từ tro bụi của vụ thử bom hydro 'Ivy Mike'.",
        appearance: "Kim loại rắn màu trắng bạc, phóng xạ cực mạnh.",
        uses: "Nghiên cứu khoa học cơ bản, dùng để tạo ra Mendelevium."
    },
    100: {
        number: 100,
        name: "Fermium",
        symbol: "Fm",
        category: "actinide",
        summary: "Nguyên tố nặng nhất có thể tạo ra bằng cách bắn phá neutron. Đặt tên theo Enrico Fermi.",
        appearance: "Chưa quan sát được dạng kim loại, chỉ tồn tại dạng ion/hợp chất.",
        uses: "Nghiên cứu khoa học."
    },
    101: {
        number: 101,
        name: "Mendelevium",
        symbol: "Md",
        category: "actinide",
        summary: "Đặt tên theo Dmitri Mendeleev, cha đẻ bảng tuần hoàn. Được tạo ra từng nguyên tử một.",
        appearance: "Kim loại phóng xạ.",
        uses: "Nghiên cứu khoa học."
    },
    102: {
        number: 102,
        name: "Nobelium",
        symbol: "No",
        category: "actinide",
        summary: "Đặt tên theo Alfred Nobel. Là một chủ đề tranh cãi gay gắt về quyền ưu tiên phát hiện.",
        appearance: "Kim loại phóng xạ.",
        uses: "Nghiên cứu khoa học."
    },
    103: {
        number: 103,
        name: "Lawrencium",
        symbol: "Lr",
        category: "actinide",
        summary: "Kết thúc dãy Actini. Đặt tên theo Ernest Lawrence, người phát minh ra máy gia tốc hạt.",
        appearance: "Kim loại phóng xạ.",
        uses: "Nghiên cứu khoa học về cấu trúc hạt nhân."
    },
    104: {
        number: 104,
        name: "Rutherfordium",
        symbol: "Rf",
        category: "transition metal",
        summary: "Nguyên tố siêu nặng đầu tiên của dãy chuyển tiếp. Đặt tên theo nhà vật lý vĩ đại Ernest Rutherford.",
        appearance: "Kim loại phóng xạ phân rã nhanh.",
        uses: "Chỉ dùng trong nghiên cứu."
    },
    105: {
        number: 105,
        name: "Dubnium",
        symbol: "Db",
        category: "transition metal",
        summary: "Tên đặt theo thành phố Dubna (Nga), nơi có viện nghiên cứu hạt nhân nổi tiếng.",
        appearance: "Kim loại phóng xạ.",
        uses: "Chỉ dùng trong nghiên cứu."
    },
    106: {
        number: 106,
        name: "Seaborgium",
        symbol: "Sg",
        category: "transition metal",
        summary: "Nguyên tố đầu tiên được đặt tên theo một người đang sống vào thời điểm đó (Glenn Seaborg).",
        appearance: "Kim loại phóng xạ.",
        uses: "Chỉ dùng trong nghiên cứu."
    },
    107: {
        number: 107,
        name: "Bohrium",
        symbol: "Bh",
        category: "transition metal",
        summary: "Đặt tên theo Niels Bohr để vinh danh những đóng góp của ông về cấu trúc nguyên tử.",
        appearance: "Kim loại phóng xạ nhân tạo.",
        uses: "Chỉ dùng trong nghiên cứu."
    },
    108: {
        number: 108,
        name: "Hassium",
        symbol: "Hs",
        category: "transition metal",
        summary: "Tên Latinh của bang Hesse (Đức). Hóa học của nó tương tự như Osmium nhưng dễ bay hơi hơn.",
        appearance: "Kim loại phóng xạ.",
        uses: "Chỉ dùng trong nghiên cứu."
    },
    109: {
        number: 109,
        name: "Meitnerium",
        symbol: "Mt",
        category: "transition metal",
        summary: "Đặt tên theo Lise Meitner, nhà vật lý tiên phong về phân hạch hạt nhân nhưng bị bỏ qua giải Nobel.",
        appearance: "Kim loại phóng xạ nhân tạo cực kém bền.",
        uses: "Chỉ dùng trong nghiên cứu."
    },
    110: {
        number: 110,
        name: "Darmstadtium",
        symbol: "Ds",
        category: "transition metal",
        summary: "Được phát hiện tại Darmstadt, Đức. Nguyên tử của nó phân rã trong tích tắc.",
        appearance: "Kim loại phóng xạ.",
        uses: "Chỉ dùng trong nghiên cứu."
    },
    111: {
        number: 111,
        name: "Roentgenium",
        symbol: "Rg",
        category: "transition metal",
        summary: "Vinh danh Wilhelm Röntgen, người tìm ra tia X. Nó thuộc nhóm đồng, bạc, vàng.",
        appearance: "Kim loại phóng xạ, dự đoán có màu bạc hoặc vàng.",
        uses: "Chỉ dùng trong nghiên cứu."
    },
    112: {
        number: 112,
        name: "Copernicium",
        symbol: "Cn",
        category: "transition metal",
        summary: "Đặt tên theo Copernicus. Có thể là kim loại lỏng dễ bay hơi giống thủy ngân.",
        appearance: "Kim loại lỏng phóng xạ (dự đoán).",
        uses: "Chỉ dùng trong nghiên cứu."
    },
    113: {
        number: 113,
        name: "Nihonium",
        symbol: "Nh",
        category: "post-transition metal",
        summary: "Nguyên tố đầu tiên được phát hiện tại Châu Á (Nhật Bản - Nihon).",
        appearance: "Kim loại phóng xạ.",
        uses: "Chỉ dùng trong nghiên cứu."
    },
    114: {
        number: 114,
        name: "Flerovium",
        symbol: "Fl",
        category: "post-transition metal",
        summary: " Nguyên tố siêu nặng cực kỳ thú vị, được dự đoán có tính chất giống khí trơ hơn là kim loại.",
        appearance: "Kim loại phóng xạ, có thể là chất khí.",
        uses: "Chỉ dùng trong nghiên cứu đảo ổn định."
    },
    115: {
        number: 115,
        name: "Moscovium",
        symbol: "Mc",
        category: "post-transition metal",
        summary: "Đặt tên theo vùng Moscow, Nga. Được tổng hợp bằng cách bắn canxi vào americium.",
        appearance: "Kim loại phóng xạ.",
        uses: "Chỉ dùng trong nghiên cứu."
    },
    116: {
        number: 116,
        name: "Livermorium",
        symbol: "Lv",
        category: "post-transition metal",
        summary: "Vinh danh Phòng thí nghiệm Quốc gia Lawrence Livermore (Mỹ).",
        appearance: "Kim loại phóng xạ.",
        uses: "Chỉ dùng trong nghiên cứu."
    },
    117: {
        number: 117,
        name: "Tennessine",
        symbol: "Ts",
        category: "metalloid",
        summary: "Nguyên tố mới nhất được đặt tên (2016), theo bang Tennessee (Mỹ). Thuộc nhóm halogen.",
        appearance: "Chất rắn phóng xạ đen (dự đoán).",
        uses: "Chỉ dùng trong nghiên cứu tổng hợp hạt nhân."
    },
    118: {
        number: 118,
        name: "Oganesson",
        symbol: "Og",
        category: "noble gas",
        summary: "Nguyên tố nặng nhất trong bảng tuần hoàn hiện tại. Đặt tên theo nhà vật lý Yuri Oganessian.",
        appearance: "Chất khí hoặc rắn phóng xạ cực kém bền.",
        uses: "Chỉ dùng trong nghiên cứu vật lý hạt nhân."
    }
};
