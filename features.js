/* =====================================================
   features.js — Các tính năng MỚI:
   1) Đăng nhập / Đăng ký (lưu tạm bằng localStorage)
   2) Thanh toán (Tiền mặt / Chuyển khoản ngân hàng giả lập)
   3) Chọn ngôn ngữ Tiếng Việt / English cho toàn bộ web

   File này được nạp SAU script.js. Phần dịch EN phủ toàn bộ nội dung của
   script.js (25 làng nghề, 22 sản phẩm, lịch trình, trình xây dựng lộ trình...).
   Nó chỉ dùng lại các biến/hàm cũ: cart, updateCartCount(), checkout().
   Lưu ý: đây là bản DEMO — dữ liệu lưu ở localStorage, không an toàn
   như backend thật.
   ===================================================== */
(function () {
  'use strict';

  /* ======================================================
     0. TIỆN ÍCH
     ====================================================== */
  const $ = (id) => document.getElementById(id);

  const KEYS = {
    users: 'lnvn_users',     // { "email": {name, phone, address, email, hash} }
    session: 'lnvn_session', // email đang đăng nhập
    orders: 'lnvn_orders',   // danh sách đơn hàng demo
    lang: 'lnvn_lang'        // 'vi' | 'en'
  };

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch (e) { return false; }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch (e) { /* bỏ qua */ }
    }
  };

  /* ======================================================
     1. TỪ ĐIỂN DỊCH  Tiếng Việt -> English
     Cách hoạt động: văn bản gốc trên web luôn là tiếng Việt.
     Khi chọn EN, mã bên dưới duyệt các text node và thay bằng
     bản dịch; chọn VI sẽ khôi phục nguyên văn gốc.
     Nhờ vậy KHÔNG phải sửa HTML/JS cũ.
     ====================================================== */
  const DICT = {
    /* --- tiêu đề trang & thương hiệu --- */
    'Bản Đồ Làng Nghề Truyền Thống Việt Nam': 'Traditional Craft Villages Map of Vietnam',
    'LàngNghề': 'CraftVillage',

    /* --- thanh menu --- */
    'Trang chủ': 'Home',
    'Bản đồ Làng nghề': 'Craft Village Map',
    'Lịch trình Du lịch': 'Travel Itinerary',
    'Mua sắm': 'Shop',
    'Liên hệ': 'Contact',

    /* --- trang chủ --- */
    'Di sản Văn hóa Việt': 'Vietnamese Cultural Heritage',
    'Khám Phá Hồn Việt Qua Các Làng Nghề Truyền Thống': 'Discover the Soul of Vietnam Through Its Traditional Craft Villages',
    'Hành trình kết nối du khách quốc tế với hàng trăm làng nghề thủ công mỹ nghệ hàng ngàn năm tuổi dọc miền đất nước.': 'A journey connecting international travelers with hundreds of handicraft villages, thousands of years old, across the country.',
    'Khám phá Bản đồ': 'Explore the Map',
    'Lên lịch trình ngay': 'Plan Your Itinerary',
    'Bản Đồ Tương Tác': 'Interactive Map',
    'Tra cứu vị trí, lịch sử và đặc sản làng nghề theo từng tỉnh thành Bắc - Trung - Nam.': 'Look up the locations, history and specialties of craft villages by province across the North, Central and South.',
    'Lịch Trình Thiết Kế Riêng': 'Tailor-Made Itineraries',
    'Gợi ý tour du lịch trải nghiệm làm thợ thủ công cho du khách nước ngoài.': 'Suggested tours where foreign visitors try their hand at traditional crafts.',
    'Sản Phẩm Chính Gốc': 'Authentic Products',
    'Đặt mua các mặt hàng gốm sứ, lụa tơ tằm, mây tre đan trực tiếp từ nghệ nhân.': 'Order ceramics, silk and woven bamboo & rattan directly from artisans.',

    /* --- sứ mệnh & tầm nhìn, số liệu (MỚI) --- */
    'Sứ Mệnh & Tầm Nhìn': 'Mission & Vision',
    'Vì sao LàngNghềViệt ra đời': 'Why CraftVillageVN was created',
    'Sứ mệnh': 'Mission',
    'Hỗ trợ du khách trong và ngoài nước dễ dàng tìm hiểu, lên lịch trình và mua sắm sản phẩm làng nghề; đồng thời kích thích cung - cầu để các làng nghề, nghệ nhân có thêm thu nhập và tiếp tục giữ nghề.': 'To help domestic and international visitors easily learn about, plan trips to and shop for craft village products, while stimulating supply and demand so that craft villages and artisans earn more income and keep their trades alive.',
    'Tầm nhìn': 'Vision',
    'Trở thành nền tảng số hàng đầu về du lịch làng nghề Việt Nam: mỗi làng nghề đều được giới thiệu, mỗi sản phẩm đều có câu chuyện và mỗi du khách đều có thể tự tin lên kế hoạch trải nghiệm.': 'To become the leading digital platform for craft village tourism in Vietnam: every craft village is showcased, every product has a story, and every traveler can plan their experience with confidence.',
    'Làng nghề': 'Craft villages',
    'Tỉnh/Thành': 'Provinces/Cities',
    'Sản phẩm': 'Products',

    /* --- bản đồ --- */
    'Bản Đồ Làng Nghề Việt Nam': 'Vietnam Craft Village Map',
    'Chọn khu vực hoặc nhấp vào ghim trên bản đồ để xem chi tiết làng nghề': 'Choose a region or click a pin on the map to see village details',
    'Lọc theo Khu vực:': 'Filter by Region:',
    'Tất cả các miền': 'All regions',
    'Miền Bắc': 'North',
    'Miền Trung': 'Central',
    'Miền Nam': 'South',
    'Mua sản phẩm': 'Buy products',

    /* --- lịch trình --- */
    'Lập Lịch Trình Du Lịch Làng Nghề': 'Plan Your Craft Village Trip',
    'Gợi ý tour trải nghiệm văn hóa độc đáo dành riêng cho du khách quốc tế': 'Unique cultural experience tours designed for international visitors',
    'Tùy chỉnh chuyến đi': 'Customize Your Trip',
    'Điểm xuất phát / Vùng miền:': 'Starting Point / Region:',
    'Hà Nội & Miền Bắc (3 Ngày)': 'Hanoi & the North (3 Days)',
    'Đà Nẵng - Hội An & Miền Trung (2 Ngày)': 'Da Nang - Hoi An & the Central Region (2 Days)',
    'TP.HCM & Đồng bằng Sông Cửu Long (2 Ngày)': 'Ho Chi Minh City & the Mekong Delta (2 Days)',
    'Sở thích trải nghiệm:': 'Experience Preferences:',
    'Tự tay làm sản phẩm': 'Make products by hand',
    'Thưởng thức ẩm thực địa phương': 'Enjoy local cuisine',
    'Chụp ảnh check-in': 'Take check-in photos',
    'Tạo lịch trình tối ưu': 'Create Optimized Itinerary',

    'Lịch Trình Khám Phá Làng Nghề Đồng Bằng Sông Hồng (3 Ngày)': 'Red River Delta Craft Village Itinerary (3 Days)',
    'Ngày 1: Hà Nội - Gốm Bát Tràng': 'Day 1: Hanoi - Bat Trang Pottery',
    'Sáng: Xe đón khách tại Phố Cổ Hà Nội đi Bát Tràng. Trải nghiệm tự tay nặn gốm trên bàn xoay cùng nghệ nhân.': "Morning: Pick-up at Hanoi's Old Quarter and drive to Bat Trang. Shape pottery by hand on the wheel with an artisan.",
    'Chiều: Thưởng thức bữa trưa ẩm thực làng cổ, tham quan Bảo tàng Gốm Bát Tràng.': 'Afternoon: Enjoy a lunch of ancient-village cuisine and visit the Bat Trang Ceramics Museum.',
    'Ngày 2: Lụa Vạn Phúc - Tranh Đông Hồ': 'Day 2: Van Phuc Silk - Dong Ho Paintings',
    'Sáng: Ghé thăm Làng lụa Vạn Phúc, tìm hiểu quy trình ươm tơ dệt lụa.': 'Morning: Visit Van Phuc Silk Village and learn how silk is reeled and woven.',
    'Chiều: Di chuyển sang Bắc Ninh trải nghiệm in tranh dân gian Đông Hồ trên giấy điệp.': 'Afternoon: Travel to Bac Ninh to try printing Dong Ho folk paintings on diep paper.',
    'Ngày 3: Làng Nón Lá Chuông & Mua Sắm': 'Day 3: Chuong Conical Hat Village & Shopping',
    'Sáng: Tham quan làng làm nón lá Chuông nổi tiếng.': 'Morning: Visit the famous Chuong conical hat village.',
    'Chiều: Trở về Hà Nội, mua sắm đồ thủ công làm quà kỷ niệm.': 'Afternoon: Return to Hanoi and shop for handicraft souvenirs.',

    'Lịch Trình Trải Nghiệm Làng Nghề Miền Trung (2 Ngày)': 'Central Vietnam Craft Village Experience (2 Days)',
    'Ngày 1: Đà Nẵng - Đá Non Nước & Lồng Đèn Hội An': 'Day 1: Da Nang - Non Nuoc Stone & Hoi An Lanterns',
    'Sáng: Khám phá Làng đá mỹ nghệ Non Nước dưới chân Ngũ Hành Sơn.': 'Morning: Explore the Non Nuoc stone sculpture village at the foot of the Marble Mountains.',
    'Chiều: Di chuyển vào Phố cổ Hội An, học làm lồng đèn may mắn.': 'Afternoon: Head to Hoi An Ancient Town and learn to make good-luck lanterns.',
    'Ngày 2: Làng Đúc Đồng Phước Kiều': 'Day 2: Phuoc Kieu Bronze Casting Village',
    'Sáng: Thăm làng đúc đồng Phước Kiều, thưởng thức âm thanh cồng chiêng độc đáo.': 'Morning: Visit Phuoc Kieu bronze casting village and enjoy the distinctive sound of gongs.',

    /* --- lịch trình miền Nam (MỚI) --- */
    'Lịch Trình Trải Nghiệm Làng Nghề Miền Nam (2 Ngày)': 'Southern Vietnam Craft Village Experience (2 Days)',
    'Ngày 1: TP.HCM - Gốm Lái Thiêu': 'Day 1: Ho Chi Minh City - Lai Thieu Pottery',
    'Sáng: Từ TP.HCM đi Lái Thiêu, tham quan lò gốm và thử vẽ hoa văn lên sản phẩm.': 'Morning: Travel from Ho Chi Minh City to Lai Thieu, tour the pottery kilns and try painting patterns onto the ware.',
    'Chiều: Thưởng thức trái cây và ẩm thực vùng Lái Thiêu.': 'Afternoon: Enjoy the fruit and local cuisine of the Lai Thieu area.',
    'Ngày 2: Cần Thơ - Làng chiếu Cẩm Bàn': 'Day 2: Can Tho - Cam Ban Mat Weaving Village',
    'Sáng: Di chuyển xuống Cần Thơ, tìm hiểu nghề dệt chiếu thủ công.': 'Morning: Head down to Can Tho and learn about the craft of handwoven mats.',
    'Chiều: Đi thuyền chợ nổi, mua đặc sản làm quà.': 'Afternoon: Take a boat to the floating market and buy local specialties as gifts.',

    /* --- tự xây dựng lộ trình (MỚI) --- */
    'Tự xây dựng lộ trình theo nhu cầu': 'Build Your Own Route',
    'Chọn một tỉnh/thành hoặc tick trực tiếp các làng nghề bạn muốn đến. Hệ thống sẽ sắp xếp lộ trình, tính số km, đề xuất phương tiện và hoạt động.': 'Pick a province/city or tick the craft villages you want to visit. The system will arrange the route, calculate the distance, and suggest transport and activities.',
    'Tỉnh / Thành phố:': 'Province / City:',
    'Xuất phát từ:': 'Departing from:',
    'Làng nghề muốn tham quan:': 'Craft villages to visit:',
    'Xây dựng lộ trình': 'Build Route',
    '-- Chọn theo từng làng nghề --': '-- Choose individual craft villages --',
    'Tự động (thành phố gần nhất)': 'Automatic (nearest city)',
    'Vui lòng chọn một tỉnh/thành hoặc ít nhất một làng nghề.': 'Please select a province/city or at least one craft village.',
    'làng nghề': 'village(s)',
    'ngày': 'day(s)',
    'km (cả đi và về)': 'km (round trip)',
    'di chuyển': 'of travel',
    '* Số km là ước tính đường bộ từ khoảng cách đường chim bay (x1,3); thời gian chưa gồm giờ nghỉ và kẹt xe.': '* Distances are road estimates based on straight-line distance (x1.3); travel times do not include rest stops or traffic.',
    'Đi bộ hoặc xe đạp': 'Walk or cycle',
    'Taxi / Grab hoặc thuê xe máy': 'Taxi / Grab or rent a motorbike',
    'Ô tô riêng, xe limousine hoặc xe khách': 'Private car, limousine van or coach',
    'Máy bay hoặc tàu hỏa (có thể kết hợp taxi từ ga/sân bay)': 'Plane or train (plus a taxi from the station/airport if needed)',

    /* --- hoạt động đề xuất theo loại nghề (MỚI) --- */
    'Tự tay nặn gốm trên bàn xoay': 'Shape pottery by hand on the wheel',
    'Tô vẽ hoa văn lên sản phẩm': 'Paint patterns onto your piece',
    'Tham quan lò nung truyền thống': 'Visit a traditional kiln',
    'Xem quy trình ươm tơ, dệt thêu thủ công': 'Watch silk reeling, weaving and hand embroidery',
    'Thử ngồi khung dệt cùng nghệ nhân': 'Try the loom alongside an artisan',
    'Chọn mua vải, khăn làm quà': 'Choose fabrics and scarves as gifts',
    'Xem nghệ nhân khắc ván, in tranh': 'Watch artisans carve blocks and print paintings',
    'Tự in một bức tranh mang về': 'Print a painting to take home',
    'Nghe kể ý nghĩa các bức tranh': 'Hear the meanings behind the paintings',
    'Học đan lát cơ bản': 'Learn basic weaving',
    'Tham quan xưởng và vùng nguyên liệu': 'Visit the workshop and raw-material area',
    'Mua sản phẩm trực tiếp tại xưởng': 'Buy products directly at the workshop',
    'Quan sát đúc, chạm khắc kim loại/đá': 'Observe metal and stone casting and carving',
    'Thử chạm một mẫu nhỏ': 'Try carving a small piece',
    'Tham quan xưởng nghệ nhân': "Visit an artisan's workshop",
    'Xem thợ chạm khắc, sơn mài': 'Watch craftsmen carve and lacquer',
    'Thử mài, đánh bóng một vật nhỏ': 'Try sanding and polishing a small item',
    'Tham quan nhà cổ, xưởng nghề': 'Visit old houses and craft workshops',
    'Học chằm, ép nón lá': 'Learn to stitch and press conical hats',
    'Chụp ảnh check-in với nón lá': 'Take check-in photos with a conical hat',
    'Mua nón làm quà': 'Buy a hat as a gift',
    'Tham quan lò nấu kẹo, bánh': 'Visit a candy and cake-making workshop',
    'Tự làm và nếm thử đặc sản': 'Make and taste local specialties',
    'Mua đặc sản làm quà': 'Buy specialties as gifts',

    /* --- dữ liệu làng nghề: tên, tỉnh/thành, mô tả (đủ 25 làng) --- */
    'Làng gốm Bát Tràng': 'Bat Trang Pottery Village',
    'Làng lụa Vạn Phúc': 'Van Phuc Silk Village',
    'Làng đá mỹ nghệ Non Nước': 'Non Nuoc Stone Carving Village',
    'Làng đúc đồng Phước Kiều': 'Phuoc Kieu Bronze Casting Village',
    'Làng chiếu Cẩm Bàn': 'Cam Ban Mat Weaving Village',
    'Làng gốm Phù Lãng': 'Phu Lang Pottery Village',
    'Làng tranh Đông Hồ': 'Dong Ho Painting Village',
    'Làng nón Chuông': 'Chuong Conical Hat Village',
    'Làng sơn mài Hạ Thái': 'Ha Thai Lacquerware Village',
    'Làng mây tre đan Phú Vinh': 'Phu Vinh Bamboo & Rattan Weaving Village',
    'Làng đúc đồng Đại Bái': 'Dai Bai Bronze Casting Village',
    'Làng chạm bạc Đồng Xâm': 'Dong Xam Silver Engraving Village',
    'Làng gỗ mỹ nghệ Đồng Kỵ': 'Dong Ky Woodcarving Village',
    'Làng thêu Quất Động': 'Quat Dong Embroidery Village',
    'Làng cói Kim Sơn': 'Kim Son Sedge Weaving Village',
    'Làng đá Ninh Vân': 'Ninh Van Stone Village',
    'Làng nón bài thơ Tây Hồ': 'Tay Ho Poem Hat Village',
    'Làng tranh Sình': 'Sinh Painting Village',
    'Làng gốm Thanh Hà': 'Thanh Ha Pottery Village',
    'Làng mộc Kim Bồng': 'Kim Bong Carpentry Village',
    'Làng gốm Bàu Trúc': 'Bau Truc Pottery Village',
    'Làng gốm Lái Thiêu': 'Lai Thieu Pottery Village',
    'Làng thổ cẩm Châu Giang': 'Chau Giang Brocade Village',
    'Làng gốm đỏ Vĩnh Long': 'Vinh Long Red Pottery Village',
    'Làng kẹo dừa Bến Tre': 'Ben Tre Coconut Candy Village',

    'Hà Nội': 'Hanoi',
    'Đà Nẵng': 'Da Nang',
    'Quảng Nam': 'Quang Nam',
    'Cần Thơ': 'Can Tho',
    'Bắc Ninh': 'Bac Ninh',
    'Thái Bình': 'Thai Binh',
    'Ninh Bình': 'Ninh Binh',
    'Thừa Thiên Huế': 'Thua Thien Hue',
    'Huế': 'Hue',
    'Ninh Thuận': 'Ninh Thuan',
    'TP. Hồ Chí Minh': 'Ho Chi Minh City',
    'An Giang': 'An Giang',
    'Vĩnh Long': 'Vinh Long',
    'Bến Tre': 'Ben Tre',

    'Làng gốm sứ truyền thống có lịch sử hơn 500 năm, nổi tiếng với các sản phẩm gốm tinh xảo.': 'A traditional ceramics village with over 500 years of history, famous for exquisite pottery.',
    'Nơi sản xuất lụa tơ tằm thượng hạng, mềm mại nổi tiếng từ thời nhà Nguyễn.': 'A producer of premium silk, famed for its softness since the Nguyen dynasty.',
    'Nằm dưới chân núi Ngũ Hành Sơn, nổi tiếng với các tác phẩm điêu khắc đá độc đáo.': 'Located at the foot of the Marble Mountains, famous for unique stone sculptures.',
    'Nổi tiếng với nghề đúc chiêng, cồng, lư hương bằng đồng truyền thống.': 'Famous for the traditional casting of bronze gongs, cymbals and incense burners.',
    'Làng nghề dệt chiếu thủ công đậm đà bản sắc vùng sông nước Miền Tây.': 'A handwoven-mat village rich in the identity of the Mekong Delta river region.',
    'Làng gốm lâu đời với men rạn, men nâu đặc trưng, nung bằng lò rơm củi truyền thống.': 'An old pottery village known for its distinctive crackle and brown glazes, fired in traditional straw-and-wood kilns.',
    'Cái nôi của dòng tranh khắc gỗ dân gian, in trên giấy điệp với màu sắc từ thiên nhiên.': 'The cradle of woodblock folk painting, printed on diep paper with colors drawn from nature.',
    'Làng làm nón lá nổi tiếng xứ Bắc, nón mỏng, nhẹ và có đường khâu rất đều tay.': 'A famous conical-hat village of the North, producing thin, light hats with remarkably even stitching.',
    'Làng nghề sơn mài lâu đời với các sản phẩm tranh, hộp, khay sơn ta bóng đẹp, bền màu.': 'A long-established lacquer village making glossy, colorfast paintings, boxes and trays in traditional natural lacquer.',
    'Làng đan lát nổi tiếng với đèn, giỏ, khay mây tre được xuất khẩu đi nhiều nước.': 'A weaving village famous for bamboo and rattan lamps, baskets and trays exported to many countries.',
    'Làng nghề gò đồng hơn nghìn năm tuổi, nổi tiếng với lư hương, chuông và đồ thờ.': 'A copper-beating village over a thousand years old, famous for incense burners, bells and ritual objects.',
    'Làng chạm bạc thủ công tinh xảo, sản phẩm là đồ trang sức, hộp và tượng bạc nhỏ.': 'A village of exquisite handcrafted silver engraving, producing jewelry, boxes and small silver statues.',
    'Làng nghề mộc nổi tiếng với đồ gỗ chạm khắc, tủ, sập và tượng gỗ cao cấp.': 'A carpentry village famous for carved furniture, cabinets, wooden divans and high-end wooden statues.',
    'Làng thêu tay nổi tiếng hàng trăm năm với tranh thêu, khăn và áo dài thêu hoa văn.': 'A hand-embroidery village renowned for centuries, making embroidered paintings, scarves and patterned ao dai.',
    'Vùng đất bãi bồi ven biển với nghề dệt chiếu, giỏ, thảm cói bền đẹp.': 'A coastal alluvial area known for durable, attractive sedge mats, baskets and rugs.',
    'Làng chế tác đá bên chân núi đá vôi, nổi tiếng với tượng đá, bia và đồ đá mỹ nghệ.': 'A stone-working village at the foot of limestone mountains, famous for stone statues, steles and decorative stonework.',
    'Nơi làm nón bài thơ xứ Huế với những câu thơ ẩn hiện giữa hai lớp lá khi soi ánh sáng.': 'Home of the Hue "poem hat", with verses that appear between two layers of leaves when held up to the light.',
    'Làng tranh khắc gỗ dân gian xứ Huế gắn với tín ngưỡng và phong tục cúng lễ.': 'A Hue woodblock folk-painting village tied to local beliefs and offering customs.',
    'Làng gốm bên sông Thu Bồn gần phố cổ Hội An, nổi tiếng với tượng, đồ trang trí gốm.': 'A pottery village on the Thu Bon River near Hoi An Ancient Town, famous for ceramic figurines and decorations.',
    'Làng mộc lâu đời gắn với nhà cổ Hội An, nổi tiếng với chạm khắc gỗ tinh xảo.': "A long-established carpentry village linked to Hoi An's old houses, famous for fine woodcarving.",
    'Làng gốm của người Chăm, làm hoàn toàn bằng tay và nung lộ thiên, được xem là cổ nhất Đông Nam Á.': 'A Cham pottery village where ware is made entirely by hand and fired in the open air, considered the oldest in Southeast Asia.',
    'Làng gốm Nam Bộ với lối trang trí hoa văn pha trộn phong cách Hoa - Việt.': 'A Southern pottery village with decorative patterns blending Chinese and Vietnamese styles.',
    'Làng dệt thổ cẩm của cộng đồng người Chăm miền Tây với hoa văn đặc sắc.': 'A brocade-weaving village of the Cham community in the Mekong Delta, with distinctive patterns.',
    'Cụm lò gốm đỏ ven sông Cổ Chiên, nổi tiếng với chum, vại, chậu bằng đất phù sa.': 'A cluster of red-pottery kilns along the Co Chien River, famous for jars, urns and pots made from alluvial clay.',
    'Xứ dừa nổi tiếng với nghề nấu kẹo dừa thủ công, vị béo ngọt thơm đặc trưng.': 'The "land of coconuts", famous for handmade coconut candy with its distinctive rich, sweet aroma.',

    /* --- bản đồ: popup (MỚI) --- */
    'Đang tải ảnh...': 'Loading image...',
    'Chưa có ảnh': 'No image available',
    'Ảnh: Wikipedia': 'Photo: Wikipedia',
    '+ Lịch trình': '+ Itinerary',

    /* --- mua sắm: danh mục, tên sản phẩm, làng, câu chuyện (đủ 22 sản phẩm) --- */
    'Gian Hàng Sản Phẩm Làng Nghề': 'Craft Village Products',
    'Ủng hộ nghệ nhân Việt Nam qua các sản phẩm thủ công tinh xảo': 'Support Vietnamese artisans through exquisite handmade products',
    'Tất cả': 'All',
    'Gốm sứ': 'Ceramics',
    'Lụa tơ tằm': 'Silk',
    'Mây tre đan': 'Bamboo & Rattan',
    'Tranh dân gian': 'Folk Paintings',
    'Đồng - Bạc - Đá': 'Bronze - Silver - Stone',
    'Gỗ - Sơn mài': 'Wood - Lacquerware',
    'Nón & Đặc sản': 'Hats & Specialties',
    'Thêm': 'Add',
    'Nhấn để xem câu chuyện': 'Click to read the story',
    'Thêm vào giỏ': 'Add to cart',

    'Bộ Ấm Trà Gốm Bát Tràng Men Cổ': 'Bat Trang Antique-Glaze Ceramic Tea Set',
    'Khăn Thêu Lụa Vạn Phúc Họa Tiết Sen': 'Van Phuc Embroidered Silk Scarf with Lotus Motif',
    'Đèn Mây Tre Đan Thủ Công': 'Handwoven Bamboo & Rattan Lamp',
    'Tranh Dân Gian Đông Hồ Khung Gỗ': 'Dong Ho Folk Painting with Wooden Frame',
    'Bình Gốm Men Rạn Phù Lãng': 'Phu Lang Crackle-Glaze Ceramic Vase',
    'Nón Lá Làng Chuông': 'Chuong Village Conical Hat',
    'Hộp Sơn Mài Hạ Thái': 'Ha Thai Lacquer Box',
    'Lư Hương Đồng Đại Bái': 'Dai Bai Bronze Incense Burner',
    'Hộp Trang Sức Bạc Chạm Đồng Xâm': 'Dong Xam Engraved Silver Jewelry Box',
    'Hộp Gỗ Chạm Khắc Đồng Kỵ': 'Dong Ky Carved Wooden Box',
    'Khăn Thêu Tay Quất Động': 'Quat Dong Hand-Embroidered Scarf',
    'Giỏ Cói Kim Sơn': 'Kim Son Sedge Basket',
    'Tượng Đá Ninh Vân': 'Ninh Van Stone Statue',
    'Nón Bài Thơ Huế': 'Hue Poem Hat',
    'Tranh Dân Gian Làng Sình': 'Sinh Village Folk Painting',
    'Gốm Trang Trí Thanh Hà': 'Thanh Ha Decorative Pottery',
    'Tượng Gỗ Mộc Kim Bồng': 'Kim Bong Carved Wooden Statue',
    'Bình Gốm Chăm Bàu Trúc': 'Bau Truc Cham Ceramic Vase',
    'Gốm Lái Thiêu Hoa Văn Hoa - Việt': 'Lai Thieu Pottery with Chinese-Vietnamese Patterns',
    'Khăn Thổ Cẩm Châu Giang': 'Chau Giang Brocade Scarf',
    'Chậu Gốm Đỏ Vĩnh Long': 'Vinh Long Red Clay Pot',
    'Kẹo Dừa Bến Tre Hộp Quà': 'Ben Tre Coconut Candy Gift Box',

    'Gốm Bát Tràng': 'Bat Trang Pottery',
    'Lụa Vạn Phúc': 'Van Phuc Silk',
    'Mây Tre Phú Vinh': 'Phu Vinh Bamboo & Rattan',
    'Tranh Đông Hồ': 'Dong Ho Paintings',
    'Gốm Phù Lãng': 'Phu Lang Pottery',
    'Nón Chuông': 'Chuong Hats',
    'Sơn mài Hạ Thái': 'Ha Thai Lacquerware',
    'Đúc đồng Đại Bái': 'Dai Bai Bronze Casting',
    'Chạm bạc Đồng Xâm': 'Dong Xam Silver Engraving',
    'Gỗ Đồng Kỵ': 'Dong Ky Woodwork',
    'Thêu Quất Động': 'Quat Dong Embroidery',
    'Cói Kim Sơn': 'Kim Son Sedge',
    'Đá Ninh Vân': 'Ninh Van Stone',
    'Nón Tây Hồ': 'Tay Ho Hats',
    'Tranh Sình': 'Sinh Paintings',
    'Gốm Thanh Hà': 'Thanh Ha Pottery',
    'Mộc Kim Bồng': 'Kim Bong Carpentry',
    'Gốm Bàu Trúc': 'Bau Truc Pottery',
    'Gốm Lái Thiêu': 'Lai Thieu Pottery',
    'Thổ cẩm Châu Giang': 'Chau Giang Brocade',
    'Gốm đỏ Vĩnh Long': 'Vinh Long Red Pottery',
    'Kẹo dừa Bến Tre': 'Ben Tre Coconut Candy',

    'Men cổ Bát Tràng được pha từ tro trấu và đất sét trắng; mỗi bộ ấm là kết tinh của nhiều thế hệ thợ gốm giữ lửa nghề.': 'Bat Trang antique glaze is blended from rice-husk ash and white clay; each tea set is the crystallization of many generations of potters keeping the kiln fire alive.',
    'Hoa sen tượng trưng cho sự thanh cao; mỗi chiếc khăn lụa mang vẻ mềm mại của tơ tằm Vạn Phúc và nét dịu dàng của làng quê Bắc Bộ.': 'The lotus symbolizes purity; each silk scarf carries the softness of Van Phuc silk and the gentle charm of the northern Vietnamese countryside.',
    'Mây tre được ngâm, phơi khô nhiều ngày rồi đan tay từng nan; ánh sáng xuyên qua tạo nên những bóng hoa văn lung linh.': 'Bamboo and rattan are soaked and dried for several days, then woven by hand strip by strip; light passing through casts shimmering patterned shadows.',
    'Tranh Đông Hồ in từ ván khắc gỗ, màu lấy từ lá, than, hoa hòe và vỏ sò, gửi gắm ước mong may mắn dịp Tết.': 'Dong Ho paintings are printed from carved woodblocks with colors made from leaves, charcoal, pagoda-tree flowers and seashells, carrying wishes for good luck at Tet.',
    'Vết rạn trên men từng bị xem là lỗi lò nung, nhưng thợ Phù Lãng biến nó thành vẻ đẹp riêng: mỗi chiếc bình có một đường rạn không lặp lại.': 'Cracks in the glaze were once seen as kiln flaws, but Phu Lang potters turned them into a signature beauty: every vase has a crackle pattern that never repeats.',
    'Từng chiếc lá được ủi phẳng, chằm kín tay; chiếc nón nhẹ như không là thành quả của nhiều công đoạn tỉ mỉ.': 'Each leaf is pressed flat and stitched by hand; a hat that feels almost weightless is the result of many meticulous steps.',
    'Một lớp sơn phải qua nhiều lần phơi, mài và đánh bóng; người thợ kiên nhẫn chờ đợi để màu sơn sâu và bền theo năm tháng.': 'Each lacquer layer goes through repeated drying, sanding and polishing; the artisan waits patiently so the color grows deep and lasting over the years.',
    'Đồng nóng chảy được rót vào khuôn một lần duy nhất; hỏng là làm lại từ đầu, nên mỗi chiếc lư mang sự cẩn trọng của người thợ.': 'Molten bronze is poured into the mold only once; a failure means starting over, so every burner carries the care of its maker.',
    'Nghệ nhân chạm từng nét nhỏ như sợi tóc trên bạc; nghề được truyền từ đời này sang đời khác trong các gia đình trong làng.': "Artisans engrave lines as fine as a hair onto silver; the craft is passed from generation to generation within the village's families.",
    'Mỗi nét chạm trên gỗ là sự kiên nhẫn của người thợ ngồi hàng giờ bên khối gỗ, làm nên vẻ đẹp tinh xảo của đồ mộc Đồng Kỵ.': 'Every carved line reflects the patience of a craftsman sitting for hours over a block of wood, creating the refined beauty of Dong Ky woodwork.',
    'Đường kim mũi chỉ mịn đến mức tranh thêu trông như tranh vẽ; nhiều thế hệ phụ nữ trong làng gìn giữ nghề thêu như báu vật.': 'The stitches are so fine that embroidered pictures look painted; generations of village women have treasured the craft of embroidery.',
    'Cói mọc trên đất bãi bồi ven biển, dai và mịn; người dân dệt cói thành những chiếc giỏ mộc mạc, gần gũi.': 'Sedge grows on coastal alluvial land, tough and smooth; villagers weave it into simple, homely baskets.',
    'Gần núi đá vôi, người làng Ninh Vân nối nghề tạc đá qua nhiều đời, biến những khối đá thô thành tượng và đồ mỹ nghệ.': 'Living near limestone mountains, the people of Ninh Van have carried on stone carving for generations, turning rough blocks into statues and decorative art.',
    'Nón bài thơ có hình ảnh và câu thơ lồng giữa hai lớp lá, chỉ hiện rõ khi soi lên ánh sáng, đậm chất thơ xứ Huế.': 'The poem hat has images and verses set between two layers of leaves, visible only when held up to the light, full of the poetry of Hue.',
    'Tranh Sình in ván khắc, màu sắc rực rỡ, gắn với phong tục cúng lễ của người dân xứ Huế.': 'Sinh paintings are printed from carved blocks in vivid colors, tied to the offering customs of the people of Hue.',
    'Đất sét sông Thu Bồn và lò nung truyền thống làm nên những món gốm mang hơi thở phố cổ Hội An.': 'Clay from the Thu Bon River and traditional kilns create pottery that carries the spirit of Hoi An Ancient Town.',
    'Thợ mộc Kim Bồng gắn với việc chạm khắc, xây dựng nhà cổ Hội An; tay nghề được truyền qua nhiều thế hệ.': "Kim Bong carpenters are tied to carving and building Hoi An's old houses; their skills have been passed down through many generations.",
    'Người phụ nữ Chăm nặn gốm hoàn toàn bằng tay, vừa xoay vừa tạo hình, rồi nung lộ thiên bằng rơm và củi.': 'Cham women shape pottery entirely by hand, turning and molding as they go, then fire it in the open with straw and firewood.',
    'Gốm Lái Thiêu mang dấu ấn giao thoa của nhiều cộng đồng ở Nam Bộ, thể hiện qua kiểu dáng và hoa văn.': 'Lai Thieu pottery bears the mark of many communities in the South, reflected in its shapes and patterns.',
    'Thổ cẩm Châu Giang do cộng đồng người Chăm dệt thủ công, hoa văn gắn với đời sống sông nước miền Tây.': 'Chau Giang brocade is handwoven by the Cham community, with patterns tied to the river life of the Mekong Delta.',
    'Đất phù sa ven sông được nung thành sắc đỏ nâu ấm áp, đặc trưng của gốm đỏ Vĩnh Long.': 'Riverside alluvial clay is fired to a warm reddish-brown, the hallmark of Vinh Long red pottery.',
    'Nước cốt dừa được nấu liu riu với mạch nha, đổ khuôn và cắt thủ công, mang vị ngọt béo của xứ dừa.': 'Coconut cream is slowly simmered with malt syrup, poured into molds and cut by hand, delivering the rich sweetness of the land of coconuts.',

    /* --- liên hệ --- */
    'Liên Hệ & Hợp Tác': 'Contact & Collaboration',
    'Bạn là nghệ nhân, đơn vị lữ hành hay du khách cần hỗ trợ? Hãy gửi thông điệp cho chúng tôi.': 'Are you an artisan, a travel agency or a traveler who needs help? Send us a message.',
    'Thông tin kết nối': 'Contact Information',
    'H1-405, Đại học Bách Khoa, ĐHQGHCM, Đông Hòa, TPHCM': 'H1-405, Ho Chi Minh City University of Technology, VNU-HCM, Dong Hoa, Ho Chi Minh City',
    'Giờ làm việc: 13:00 - 15:00 (Thứ 2)': 'Working hours: 1:00 PM - 3:00 PM (Monday)',
    'Họ và tên *': 'Full name *',
    'John Doe / Nguyễn Văn A': 'John Doe / Nguyen Van A',
    'Nội dung *': 'Message *',
    'Nhập câu hỏi hoặc yêu cầu hỗ trợ du lịch...': 'Enter your question or travel support request...',
    'Gửi tin nhắn': 'Send message',

    /* --- giỏ hàng & chân trang --- */
    'Giỏ hàng của bạn': 'Your Cart',
    'Giỏ hàng đang trống.': 'Your cart is empty.',
    'Tổng tiền:': 'Total:',
    'Thanh toán ngay': 'Checkout now',
    '© 2026 Bản Đồ Làng Nghề Truyền Thống Việt Nam. Bảo tồn và phát triển giá trị văn hóa dân tộc.': "© 2026 Traditional Craft Villages Map of Vietnam. Preserving and developing the nation's cultural values.",

    /* --- đăng nhập / đăng ký (MỚI) --- */
    'Đăng nhập': 'Log in',
    'Đăng ký': 'Sign up',
    'Tạo tài khoản': 'Create account',
    'Tài khoản của tôi': 'My account',
    'Đăng xuất': 'Log out',
    'Vui lòng đăng nhập hoặc tạo tài khoản để tiếp tục thanh toán.': 'Please log in or create an account to continue to checkout.',
    'Mật khẩu': 'Password',
    'Họ và tên': 'Full name',
    'Số điện thoại': 'Phone number',
    'Địa chỉ giao hàng': 'Delivery address',
    'Tối thiểu 6 ký tự': 'At least 6 characters',
    'Nguyễn Văn A / John Doe': 'John Doe / Nguyen Van A',
    'VD: 0901234567 / +84901234567': 'e.g. 0901234567 / +84901234567',
    'Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố': 'House number, street, ward, district, city/province',
    'Vui lòng điền đầy đủ thông tin.': 'Please fill in all fields.',
    'Email không hợp lệ.': 'Invalid email address.',
    'Số điện thoại không hợp lệ.': 'Invalid phone number.',
    'Mật khẩu phải có ít nhất 6 ký tự.': 'Password must be at least 6 characters.',
    'Email này đã được đăng ký.': 'This email is already registered.',
    'Email hoặc mật khẩu không đúng.': 'Incorrect email or password.',
    'Không thể lưu dữ liệu trên trình duyệt này.': 'Unable to save data in this browser.',

    /* --- thanh toán (MỚI) --- */
    'Thanh toán': 'Payment',
    'Tóm tắt đơn hàng': 'Order summary',
    'Thông tin giao hàng': 'Delivery information',
    'Người nhận:': 'Recipient:',
    'Số điện thoại:': 'Phone:',
    'Địa chỉ:': 'Address:',
    'Phương thức thanh toán': 'Payment method',
    'Tiền mặt': 'Cash',
    'Thanh toán khi nhận hàng (COD)': 'Pay on delivery (COD)',
    'Chuyển khoản ngân hàng': 'Bank transfer',
    'Qua ứng dụng mobile banking': 'Via mobile banking app',
    'Chọn ngân hàng của bạn': 'Choose your bank',
    'Thông tin chuyển khoản (giả lập)': 'Transfer details (simulated)',
    'Ngân hàng:': 'Bank:',
    'Số tài khoản:': 'Account number:',
    'Chủ tài khoản:': 'Account holder:',
    'Nội dung:': 'Transfer note:',
    'Số tiền:': 'Amount:',
    'Đây là bản demo, không có giao dịch thực.': 'This is a demo; no real transaction takes place.',
    'Xác nhận đặt hàng': 'Confirm order',
    'Vui lòng chọn ngân hàng.': 'Please select a bank.',
    'Đặt hàng thành công!': 'Order placed successfully!',
    'Cảm ơn bạn đã ủng hộ nghệ nhân Việt Nam. Chúng tôi sẽ liên hệ để xác nhận đơn hàng.': 'Thank you for supporting Vietnamese artisans. We will contact you to confirm your order.',
    'Mã đơn hàng:': 'Order code:',
    'Phương thức:': 'Method:',
    'Tổng tiền': 'Total',
    'Đóng': 'Close',

    /* --- thông báo alert --- */
    'Giỏ hàng của bạn đang trống!': 'Your cart is empty!',
    'Tin nhắn của bạn đã được gửi thành công. Cảm ơn bạn đã liên hệ!': 'Your message was sent successfully. Thank you for contacting us!'
  };

  /* Quy tắc dịch cho chuỗi có số / ghép động (script.js tạo ra lúc chạy):
       "450.000 đ" / "0 VNĐ"            -> "450,000 VND"
       "Ngày 2"                          -> "Day 2"
       "(Hà Nội)"                        -> "(Hanoi)"
       "Lộ trình đề xuất từ Hà Nội"      -> "Suggested route from Hanoi"
       "Hà Nội → Làng gốm Bát Tràng:"    -> "Hanoi → Bat Trang Pottery Village:"
       "~12 km · Taxi ... · ~25 phút"    -> "~12 km · Taxi ... · ~25 min"
       "~2,5 giờ"                        -> "~2.5 hours"                       */
  function timeEn(s, prefix) {
    const m = s.match(/^([\d,]+) (giờ|phút)$/);
    if (!m) return undefined;
    return prefix + (m[2] === 'giờ' ? m[1].replace(',', '.') + ' hours' : m[1] + ' min');
  }

  function applyRules(t) {
    let m;
    if ((m = t.match(/^([\d.,]+)\s*(?:đ|VNĐ)$/))) return m[1].replace(/\./g, ',') + ' VND';
    if ((m = t.match(/^Ngày (\d+)$/))) return 'Day ' + m[1];
    if ((m = t.match(/^\((.+)\)$/))) {
      const inner = translateString(m[1]);
      return inner !== m[1] ? '(' + inner + ')' : undefined;
    }
    if ((m = t.match(/^Lộ trình đề xuất từ (.+)$/))) return 'Suggested route from ' + translateString(m[1]);
    if ((m = t.match(/^(.+) → (.+):$/))) return translateString(m[1]) + ' → ' + translateString(m[2]) + ':';
    if ((m = t.match(/^~(\d+) km · (.+) · ~(.+)$/))) {
      const tm = timeEn(m[3], '~');
      return '~' + m[1] + ' km · ' + translateString(m[2]) + ' · ' + (tm !== undefined ? tm : '~' + m[3]);
    }
    if ((m = t.match(/^(~?)([\d,]+ (?:giờ|phút))$/))) return timeEn(m[2], m[1]);
    return undefined;
  }

  function translateString(s) {
    const t = s.trim();
    if (!t) return s;
    const out = Object.prototype.hasOwnProperty.call(DICT, t) ? DICT[t] : applyRules(t);
    if (out === undefined || out === t) return s;
    const start = s.indexOf(t);
    return s.slice(0, start) + out + s.slice(start + t.length);
  }

  /* ======================================================
     2. CHỌN NGÔN NGỮ (VI / EN)
     ====================================================== */
  let lang = 'vi';
  const textOrig = new Map(); // text node -> {orig, tr}
  const attrOrig = new Map(); // element   -> {attr: {orig, tr}}
  const SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1 };
  const ATTRS = ['placeholder', 'title', 'alt', 'aria-label'];
  const titleVi = document.title;

  function translateTextNode(node) {
    if (!node.parentNode || SKIP_TAGS[node.parentNode.nodeName]) return;
    const rec = textOrig.get(node);
    if (rec && node.nodeValue === rec.tr) return; // đã dịch rồi
    const orig = node.nodeValue;
    const tr = translateString(orig);
    if (tr !== orig) {
      textOrig.set(node, { orig: orig, tr: tr });
      node.nodeValue = tr;
    }
  }

  function translateAttrs(root) {
    if (root.nodeType !== 1) return;
    const els = [root].concat(Array.from(root.querySelectorAll('[placeholder],[title],[alt],[aria-label]')));
    els.forEach((el) => {
      ATTRS.forEach((a) => {
        if (!el.hasAttribute(a)) return;
        const cur = el.getAttribute(a);
        let rec = attrOrig.get(el);
        if (rec && rec[a] && rec[a].tr === cur) return;
        const tr = translateString(cur);
        if (tr !== cur) {
          if (!rec) { rec = {}; attrOrig.set(el, rec); }
          rec[a] = { orig: cur, tr: tr };
          el.setAttribute(a, tr);
        }
      });
    });
  }

  function translateSubtree(root) {
    if (root.nodeType === 3) { translateTextNode(root); return; }
    if (root.nodeType !== 1) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        return SKIP_TAGS[n.parentNode.nodeName] ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(translateTextNode);
    translateAttrs(root);
  }

  function revertAll() {
    textOrig.forEach((rec, node) => {
      if (node.isConnected && node.nodeValue === rec.tr) node.nodeValue = rec.orig;
    });
    attrOrig.forEach((rec, el) => {
      Object.keys(rec).forEach((a) => {
        if (el.isConnected && el.getAttribute(a) === rec[a].tr) el.setAttribute(a, rec[a].orig);
      });
    });
    textOrig.clear();
    attrOrig.clear();
  }

  /* Theo dõi nội dung mới do script.js tạo ra (danh sách làng, sản phẩm,
     lịch trình, popup bản đồ, giỏ hàng...) để dịch ngay khi đang ở EN */
  const observer = new MutationObserver((mutations) => {
    if (lang !== 'en') return;
    observer.disconnect();
    mutations.forEach((m) => {
      if (m.type === 'childList') m.addedNodes.forEach(translateSubtree);
      else if (m.type === 'characterData') translateTextNode(m.target);
    });
    startObserving();
  });

  function startObserving() {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function setLanguage(next) {
    if (next !== 'vi' && next !== 'en') next = 'vi';
    const changed = next !== lang;
    lang = next;
    store.set(KEYS.lang, lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('#langSwitch button').forEach((b) => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });

    if (lang === 'en') {
      observer.disconnect();
      translateSubtree(document.body);
      document.title = translateString(titleVi);
      startObserving();
    } else if (changed) {
      observer.disconnect();
      revertAll();
      document.title = titleVi;
    }
  }

  /* Dịch các alert() do script.js gọi (ví dụ "Đã thêm ... vào giỏ hàng!") */
  const nativeAlert = window.alert.bind(window);
  window.alert = function (msg) {
    let text = String(msg);
    if (lang === 'en') {
      const m = text.match(/^Đã thêm "(.+)" vào giỏ hàng!$/);
      text = m ? 'Added "' + translateString(m[1]) + '" to your cart!' : translateString(text);
    }
    nativeAlert(text);
  };

  /* ======================================================
     3. ĐĂNG NHẬP / ĐĂNG KÝ
     ====================================================== */
  let currentUser = null;
  let pendingCheckout = false; // true nếu đăng nhập xuất phát từ bấm "Thanh toán ngay"
  let authNotice = false;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^\+?\d{8,15}$/;

  async function hashPassword(pw) {
    const out = [];
    try {
      if (window.crypto && window.crypto.subtle) {
        const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode('lnvn:' + pw));
        out.push('s:' + Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join(''));
      }
    } catch (e) { /* dùng phương án dự phòng */ }
    out.push('b:' + btoa(unescape(encodeURIComponent(pw))));
    return out; // phần tử đầu tiên là bản ưu tiên
  }

  function loadSession() {
    const email = store.get(KEYS.session, null);
    const users = store.get(KEYS.users, {});
    currentUser = email && users[email] ? users[email] : null;
  }

  function updateAccountButton() {
    const btn = $('accountBtn');
    $('accountLabel').textContent = currentUser ? currentUser.name : 'Đăng nhập';
    btn.classList.toggle('logged-in', !!currentUser);
  }

  function openModal(id) { $(id).style.display = 'flex'; }

  function closeModal(id) {
    $(id).style.display = 'none';
    if (id === 'authModal') pendingCheckout = false;
  }

  function setAuthView(view) {
    document.querySelectorAll('[data-fx-title]').forEach((el) => {
      el.hidden = el.dataset.fxTitle !== view;
    });
    $('loginForm').hidden = view !== 'login';
    $('registerForm').hidden = view !== 'register';
    $('accountView').hidden = view !== 'account';
    $('authTabs').hidden = view === 'account';
    $('authNotice').hidden = !(authNotice && view !== 'account');
    document.querySelectorAll('#authTabs .fx-tab').forEach((t) => {
      t.classList.toggle('active', t.dataset.fxView === view);
    });
    $('fxLoginError').textContent = '';
    $('fxRegError').textContent = '';

    if (view === 'account' && currentUser) {
      $('accName').textContent = currentUser.name;
      $('accEmail').textContent = currentUser.email;
      $('accPhone').textContent = currentUser.phone;
      $('accAddress').textContent = currentUser.address;
    }
    const first = view === 'login' ? $('fxLoginEmail') : view === 'register' ? $('fxRegName') : null;
    if (first) setTimeout(() => first.focus(), 50);
  }

  function openAuth(view, fromCheckout) {
    authNotice = !!fromCheckout;
    setAuthView(view);
    openModal('authModal');
  }

  async function onRegister(e) {
    e.preventDefault();
    const name = $('fxRegName').value.trim();
    const phone = $('fxRegPhone').value.trim();
    const address = $('fxRegAddress').value.trim();
    const email = $('fxRegEmail').value.trim().toLowerCase();
    const password = $('fxRegPassword').value;
    const err = $('fxRegError');

    if (!name || !phone || !address || !email || !password) { err.textContent = 'Vui lòng điền đầy đủ thông tin.'; return; }
    if (!EMAIL_RE.test(email)) { err.textContent = 'Email không hợp lệ.'; return; }
    if (!PHONE_RE.test(phone.replace(/[\s.\-()]/g, ''))) { err.textContent = 'Số điện thoại không hợp lệ.'; return; }
    if (password.length < 6) { err.textContent = 'Mật khẩu phải có ít nhất 6 ký tự.'; return; }

    const users = store.get(KEYS.users, {});
    if (users[email]) { err.textContent = 'Email này đã được đăng ký.'; return; }

    const hashes = await hashPassword(password);
    users[email] = { name: name, phone: phone, address: address, email: email, hash: hashes[0] };
    if (!store.set(KEYS.users, users) || !store.set(KEYS.session, email)) {
      err.textContent = 'Không thể lưu dữ liệu trên trình duyệt này.';
      return;
    }
    $('registerForm').reset();
    afterAuthSuccess();
  }

  async function onLogin(e) {
    e.preventDefault();
    const email = $('fxLoginEmail').value.trim().toLowerCase();
    const password = $('fxLoginPassword').value;
    const err = $('fxLoginError');

    if (!email || !password) { err.textContent = 'Vui lòng điền đầy đủ thông tin.'; return; }

    const users = store.get(KEYS.users, {});
    const user = users[email];
    const hashes = await hashPassword(password);
    if (!user || hashes.indexOf(user.hash) === -1) { err.textContent = 'Email hoặc mật khẩu không đúng.'; return; }

    store.set(KEYS.session, email);
    $('loginForm').reset();
    afterAuthSuccess();
  }

  function afterAuthSuccess() {
    loadSession();
    updateAccountButton();
    const goPay = pendingCheckout;
    closeModal('authModal');
    if (goPay) openPayment();
  }

  function logout() {
    store.remove(KEYS.session);
    currentUser = null;
    updateAccountButton();
    closeModal('authModal');
  }

  /* ======================================================
     4. THANH TOÁN
     ====================================================== */
  const BANKS = ['Vietcombank', 'VietinBank', 'BIDV', 'Techcombank', 'MB Bank', 'ACB', 'VPBank', 'Agribank', 'Sacombank', 'TPBank'];
  const pay = { method: 'cash', bank: null, code: '', total: 0 };

  const fmtPrice = (n) => n.toLocaleString('vi-VN') + ' đ';

  /* Giỏ hàng cũ lưu mỗi sản phẩm 1 phần tử lặp lại -> gộp theo id để hiện số lượng */
  function groupCart() {
    const map = new Map();
    cart.forEach((p) => {
      const e = map.get(p.id);
      if (e) e.qty += 1; else map.set(p.id, { item: p, qty: 1 });
    });
    return Array.from(map.values());
  }

  function renderBankGrid() {
    const grid = $('bankGrid');
    grid.innerHTML = '';
    BANKS.forEach((b) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fx-bank';
      btn.textContent = b;
      btn.addEventListener('click', () => selectBank(b));
      grid.appendChild(btn);
    });
  }

  function selectBank(bank) {
    pay.bank = bank;
    document.querySelectorAll('#bankGrid .fx-bank').forEach((b) => {
      b.classList.toggle('selected', b.textContent === bank);
    });
    $('tfBank').textContent = bank;
    $('tfNote').textContent = pay.code;
    $('tfAmount').textContent = fmtPrice(pay.total);
    $('transferBox').hidden = false;
    $('payError').textContent = '';
  }

  function setMethod(method) {
    pay.method = method;
    document.querySelectorAll('.fx-method').forEach((el) => {
      const on = el.dataset.fxMethod === method;
      el.classList.toggle('selected', on);
      el.querySelector('input').checked = on;
    });
    $('bankPanel').hidden = method !== 'bank';
    $('payError').textContent = '';
  }

  function openPayment() {
    const groups = groupCart();
    pay.total = groups.reduce((sum, g) => sum + g.item.price * g.qty, 0);
    pay.code = 'LNVN' + String(Date.now()).slice(-6);
    pay.bank = null;

    // Tóm tắt đơn hàng
    const list = $('payItems');
    list.innerHTML = '';
    groups.forEach((g) => {
      const row = document.createElement('div');
      row.className = 'fx-line';
      const name = document.createElement('span');
      name.className = 'fx-line-name';
      name.textContent = g.item.name;
      const qty = document.createElement('span');
      qty.className = 'fx-line-qty';
      qty.textContent = '×' + g.qty;
      const price = document.createElement('span');
      price.textContent = fmtPrice(g.item.price * g.qty);
      row.appendChild(name); row.appendChild(qty); row.appendChild(price);
      list.appendChild(row);
    });
    $('payTotal').textContent = fmtPrice(pay.total);

    // Thông tin giao hàng lấy từ tài khoản
    $('payName').textContent = currentUser.name;
    $('payPhone').textContent = currentUser.phone;
    $('payAddress').textContent = currentUser.address;

    // Đặt lại phương thức & ngân hàng
    renderBankGrid();
    $('transferBox').hidden = true;
    $('payError').textContent = '';
    setMethod('cash');

    $('payForm').hidden = false;
    $('paySuccess').hidden = true;
    openModal('paymentModal');
  }

  function confirmOrder() {
    if (pay.method === 'bank' && !pay.bank) {
      $('payError').textContent = 'Vui lòng chọn ngân hàng.';
      return;
    }
    const groups = groupCart();
    const order = {
      code: pay.code,
      email: currentUser.email,
      name: currentUser.name,
      phone: currentUser.phone,
      address: currentUser.address,
      method: pay.method,
      bank: pay.method === 'bank' ? pay.bank : null,
      total: pay.total,
      items: groups.map((g) => ({ id: g.item.id, name: g.item.name, price: g.item.price, qty: g.qty })),
      createdAt: new Date().toISOString()
    };
    const orders = store.get(KEYS.orders, []);
    orders.push(order);
    store.set(KEYS.orders, orders);

    // Màn hình thành công
    $('okCode').textContent = order.code;
    $('okMethod').textContent = order.method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản ngân hàng';
    $('okBankRow').hidden = order.method !== 'bank';
    $('okBank').textContent = order.bank || '';
    $('okTotal').textContent = fmtPrice(order.total);
    $('payForm').hidden = true;
    $('paySuccess').hidden = false;

    // Làm trống giỏ hàng cũ bằng các hàm/biến sẵn có của script.js
    cart.splice(0, cart.length);
    updateCartCount();
  }

  /* Thay hành vi nút "Thanh toán ngay" của giỏ hàng (script.js không bị sửa):
     bắt buộc đăng nhập -> mở giao diện thanh toán */
  window.checkout = function () {
    if (typeof cart === 'undefined' || cart.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }
    $('cartModal').style.display = 'none';
    if (!currentUser) {
      pendingCheckout = true;
      openAuth('login', true);
      return;
    }
    openPayment();
  };

  /* ======================================================
     5. KHỞI TẠO
     ====================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    // Tài khoản
    loadSession();
    updateAccountButton();
    $('accountBtn').addEventListener('click', () => openAuth(currentUser ? 'account' : 'login', false));
    $('loginForm').addEventListener('submit', onLogin);
    $('registerForm').addEventListener('submit', onRegister);
    $('logoutBtn').addEventListener('click', logout);
    document.querySelectorAll('[data-fx-view]').forEach((t) => {
      t.addEventListener('click', () => setAuthView(t.dataset.fxView));
    });

    // Thanh toán
    document.querySelectorAll('.fx-method').forEach((el) => {
      el.addEventListener('click', (ev) => { ev.preventDefault(); setMethod(el.dataset.fxMethod); });
    });
    $('confirmPay').addEventListener('click', confirmOrder);

    // Đóng modal: nút ×, nút Đóng, bấm nền tối, phím Esc
    document.querySelectorAll('[data-fx-close]').forEach((b) => {
      b.addEventListener('click', () => closeModal(b.dataset.fxClose));
    });
    document.querySelectorAll('.fx-modal').forEach((m) => {
      m.addEventListener('click', (ev) => { if (ev.target === m) closeModal(m.id); });
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key !== 'Escape') return;
      document.querySelectorAll('.fx-modal').forEach((m) => {
        if (m.style.display === 'flex') closeModal(m.id);
      });
    });

    // Ngôn ngữ
    document.querySelectorAll('#langSwitch button').forEach((b) => {
      b.addEventListener('click', () => setLanguage(b.dataset.lang));
    });
    setLanguage(store.get(KEYS.lang, 'vi'));
  });
})();