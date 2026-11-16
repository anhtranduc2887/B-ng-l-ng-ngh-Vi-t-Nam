// DỮ LIỆU LÀNG NGHỀ (type: gom | det | tranh | dan | kim | go | non | food)
// Có thể thêm trường img:"URL" để ghi đè ảnh tự động lấy từ Wikipedia
const villagesData = [
  { id: 1, name: "Làng gốm Bát Tràng", region: "north", province: "Hà Nội", coords: [20.9782, 105.9186], type: "gom", desc: "Làng gốm sứ truyền thống có lịch sử hơn 500 năm, nổi tiếng với các sản phẩm gốm tinh xảo." },
  { id: 2, name: "Làng lụa Vạn Phúc", region: "north", province: "Hà Nội", coords: [20.9765, 105.7725], type: "det", desc: "Nơi sản xuất lụa tơ tằm thượng hạng, mềm mại nổi tiếng từ thời nhà Nguyễn." },
  { id: 3, name: "Làng đá mỹ nghệ Non Nước", region: "central", province: "Đà Nẵng", coords: [16.0028, 108.2625], type: "kim", desc: "Nằm dưới chân núi Ngũ Hành Sơn, nổi tiếng với các tác phẩm điêu khắc đá độc đáo." },
  { id: 4, name: "Làng đúc đồng Phước Kiều", region: "central", province: "Quảng Nam", coords: [15.8642, 108.2581], type: "kim", desc: "Nổi tiếng với nghề đúc chiêng, cồng, lư hương bằng đồng truyền thống." },
  { id: 5, name: "Làng chiếu Cẩm Bàn", region: "south", province: "Cần Thơ", coords: [10.0371, 105.7882], type: "dan", desc: "Làng nghề dệt chiếu thủ công đậm đà bản sắc vùng sông nước Miền Tây." },
  { id: 6, name: "Làng gốm Phù Lãng", region: "north", province: "Bắc Ninh", coords: [21.1560, 106.1230], type: "gom", desc: "Làng gốm lâu đời với men rạn, men nâu đặc trưng, nung bằng lò rơm củi truyền thống." },
  { id: 7, name: "Làng tranh Đông Hồ", region: "north", province: "Bắc Ninh", coords: [21.0985, 106.0930], type: "tranh", desc: "Cái nôi của dòng tranh khắc gỗ dân gian, in trên giấy điệp với màu sắc từ thiên nhiên." },
  { id: 8, name: "Làng nón Chuông", region: "north", province: "Hà Nội", coords: [20.7940, 105.7790], type: "non", desc: "Làng làm nón lá nổi tiếng xứ Bắc, nón mỏng, nhẹ và có đường khâu rất đều tay." },
  { id: 9, name: "Làng sơn mài Hạ Thái", region: "north", province: "Hà Nội", coords: [20.8300, 105.8800], type: "go", desc: "Làng nghề sơn mài lâu đời với các sản phẩm tranh, hộp, khay sơn ta bóng đẹp, bền màu." },
  { id: 10, name: "Làng mây tre đan Phú Vinh", region: "north", province: "Hà Nội", coords: [20.6880, 105.7660], type: "dan", desc: "Làng đan lát nổi tiếng với đèn, giỏ, khay mây tre được xuất khẩu đi nhiều nước." },
  { id: 11, name: "Làng đúc đồng Đại Bái", region: "north", province: "Bắc Ninh", coords: [21.0640, 106.1850], type: "kim", desc: "Làng nghề gò đồng hơn nghìn năm tuổi, nổi tiếng với lư hương, chuông và đồ thờ." },
  { id: 12, name: "Làng chạm bạc Đồng Xâm", region: "north", province: "Thái Bình", coords: [20.4170, 106.3680], type: "kim", desc: "Làng chạm bạc thủ công tinh xảo, sản phẩm là đồ trang sức, hộp và tượng bạc nhỏ." },
  { id: 13, name: "Làng gỗ mỹ nghệ Đồng Kỵ", region: "north", province: "Bắc Ninh", coords: [21.1160, 105.9640], type: "go", desc: "Làng nghề mộc nổi tiếng với đồ gỗ chạm khắc, tủ, sập và tượng gỗ cao cấp." },
  { id: 14, name: "Làng thêu Quất Động", region: "north", province: "Hà Nội", coords: [20.8350, 105.8700], type: "det", desc: "Làng thêu tay nổi tiếng hàng trăm năm với tranh thêu, khăn và áo dài thêu hoa văn." },
  { id: 15, name: "Làng cói Kim Sơn", region: "north", province: "Ninh Bình", coords: [20.0200, 106.0800], type: "dan", desc: "Vùng đất bãi bồi ven biển với nghề dệt chiếu, giỏ, thảm cói bền đẹp." },
  { id: 16, name: "Làng đá Ninh Vân", region: "north", province: "Ninh Bình", coords: [20.2330, 105.9330], type: "kim", desc: "Làng chế tác đá bên chân núi đá vôi, nổi tiếng với tượng đá, bia và đồ đá mỹ nghệ." },
  { id: 17, name: "Làng nón bài thơ Tây Hồ", region: "central", province: "Thừa Thiên Huế", coords: [16.4650, 107.6300], type: "non", desc: "Nơi làm nón bài thơ xứ Huế với những câu thơ ẩn hiện giữa hai lớp lá khi soi ánh sáng." },
  { id: 18, name: "Làng tranh Sình", region: "central", province: "Thừa Thiên Huế", coords: [16.4350, 107.6580], type: "tranh", desc: "Làng tranh khắc gỗ dân gian xứ Huế gắn với tín ngưỡng và phong tục cúng lễ." },
  { id: 19, name: "Làng gốm Thanh Hà", region: "central", province: "Quảng Nam", coords: [15.8820, 108.3040], type: "gom", desc: "Làng gốm bên sông Thu Bồn gần phố cổ Hội An, nổi tiếng với tượng, đồ trang trí gốm." },
  { id: 20, name: "Làng mộc Kim Bồng", region: "central", province: "Quảng Nam", coords: [15.8650, 108.3150], type: "go", desc: "Làng mộc lâu đời gắn với nhà cổ Hội An, nổi tiếng với chạm khắc gỗ tinh xảo." },
  { id: 21, name: "Làng gốm Bàu Trúc", region: "central", province: "Ninh Thuận", coords: [11.5300, 108.9650], type: "gom", desc: "Làng gốm của người Chăm, làm hoàn toàn bằng tay và nung lộ thiên, được xem là cổ nhất Đông Nam Á." },
  { id: 22, name: "Làng gốm Lái Thiêu", region: "south", province: "TP. Hồ Chí Minh", coords: [10.9080, 106.7000], type: "gom", desc: "Làng gốm Nam Bộ với lối trang trí hoa văn pha trộn phong cách Hoa - Việt." },
  { id: 23, name: "Làng thổ cẩm Châu Giang", region: "south", province: "An Giang", coords: [10.7640, 105.1900], type: "det", desc: "Làng dệt thổ cẩm của cộng đồng người Chăm miền Tây với hoa văn đặc sắc." },
  { id: 24, name: "Làng gốm đỏ Vĩnh Long", region: "south", province: "Vĩnh Long", coords: [10.1850, 105.9900], type: "gom", desc: "Cụm lò gốm đỏ ven sông Cổ Chiên, nổi tiếng với chum, vại, chậu bằng đất phù sa." },
  { id: 25, name: "Làng kẹo dừa Bến Tre", region: "south", province: "Bến Tre", coords: [10.2430, 106.3750], type: "food", desc: "Xứ dừa nổi tiếng với nghề nấu kẹo dừa thủ công, vị béo ngọt thơm đặc trưng." }
];

// HOẠT ĐỘNG ĐỀ XUẤT THEO LOẠI NGHỀ
const activityByType = {
  gom: ["Tự tay nặn gốm trên bàn xoay", "Tô vẽ hoa văn lên sản phẩm", "Tham quan lò nung truyền thống"],
  det: ["Xem quy trình ươm tơ, dệt thêu thủ công", "Thử ngồi khung dệt cùng nghệ nhân", "Chọn mua vải, khăn làm quà"],
  tranh: ["Xem nghệ nhân khắc ván, in tranh", "Tự in một bức tranh mang về", "Nghe kể ý nghĩa các bức tranh"],
  dan: ["Học đan lát cơ bản", "Tham quan xưởng và vùng nguyên liệu", "Mua sản phẩm trực tiếp tại xưởng"],
  kim: ["Quan sát đúc, chạm khắc kim loại/đá", "Thử chạm một mẫu nhỏ", "Tham quan xưởng nghệ nhân"],
  go: ["Xem thợ chạm khắc, sơn mài", "Thử mài, đánh bóng một vật nhỏ", "Tham quan nhà cổ, xưởng nghề"],
  non: ["Học chằm, ép nón lá", "Chụp ảnh check-in với nón lá", "Mua nón làm quà"],
  food: ["Tham quan lò nấu kẹo, bánh", "Tự làm và nếm thử đặc sản", "Mua đặc sản làm quà"]
};

// DỮ LIỆU SẢN PHẨM MUA SẮM (vid = id làng nghề; story = câu chuyện sản phẩm)
const productsData = [
  { id: 101, name: "Bộ Ấm Trà Gốm Bát Tràng Men Cổ", category: "gom", price: 450000, image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80", village: "Gốm Bát Tràng", vid: 1, story: "Men cổ Bát Tràng được pha từ tro trấu và đất sét trắng; mỗi bộ ấm là kết tinh của nhiều thế hệ thợ gốm giữ lửa nghề." },
  { id: 102, name: "Khăn Thêu Lụa Vạn Phúc Họa Tiết Sen", category: "lua", price: 320000, image: "https://images.unsplash.com/photo-1606760227091-3dd850d97f1d?auto=format&fit=crop&w=400&q=80", village: "Lụa Vạn Phúc", vid: 2, story: "Hoa sen tượng trưng cho sự thanh cao; mỗi chiếc khăn lụa mang vẻ mềm mại của tơ tằm Vạn Phúc và nét dịu dàng của làng quê Bắc Bộ." },
  { id: 103, name: "Đèn Mây Tre Đan Thủ Công", category: "may", price: 210000, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80", village: "Mây Tre Phú Vinh", vid: 10, story: "Mây tre được ngâm, phơi khô nhiều ngày rồi đan tay từng nan; ánh sáng xuyên qua tạo nên những bóng hoa văn lung linh." },
  { id: 104, name: "Tranh Dân Gian Đông Hồ Khung Gỗ", category: "tranh", price: 550000, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80", village: "Tranh Đông Hồ", vid: 7, story: "Tranh Đông Hồ in từ ván khắc gỗ, màu lấy từ lá, than, hoa hòe và vỏ sò, gửi gắm ước mong may mắn dịp Tết." },
  { id: 105, name: "Bình Gốm Men Rạn Phù Lãng", category: "gom", price: 380000, village: "Gốm Phù Lãng", vid: 6, story: "Vết rạn trên men từng bị xem là lỗi lò nung, nhưng thợ Phù Lãng biến nó thành vẻ đẹp riêng: mỗi chiếc bình có một đường rạn không lặp lại." },
  { id: 106, name: "Nón Lá Làng Chuông", category: "khac", price: 120000, village: "Nón Chuông", vid: 8, story: "Từng chiếc lá được ủi phẳng, chằm kín tay; chiếc nón nhẹ như không là thành quả của nhiều công đoạn tỉ mỉ." },
  { id: 107, name: "Hộp Sơn Mài Hạ Thái", category: "go", price: 650000, village: "Sơn mài Hạ Thái", vid: 9, story: "Một lớp sơn phải qua nhiều lần phơi, mài và đánh bóng; người thợ kiên nhẫn chờ đợi để màu sơn sâu và bền theo năm tháng." },
  { id: 108, name: "Lư Hương Đồng Đại Bái", category: "kim", price: 890000, village: "Đúc đồng Đại Bái", vid: 11, story: "Đồng nóng chảy được rót vào khuôn một lần duy nhất; hỏng là làm lại từ đầu, nên mỗi chiếc lư mang sự cẩn trọng của người thợ." },
  { id: 109, name: "Hộp Trang Sức Bạc Chạm Đồng Xâm", category: "kim", price: 720000, village: "Chạm bạc Đồng Xâm", vid: 12, story: "Nghệ nhân chạm từng nét nhỏ như sợi tóc trên bạc; nghề được truyền từ đời này sang đời khác trong các gia đình trong làng." },
  { id: 110, name: "Hộp Gỗ Chạm Khắc Đồng Kỵ", category: "go", price: 540000, village: "Gỗ Đồng Kỵ", vid: 13, story: "Mỗi nét chạm trên gỗ là sự kiên nhẫn của người thợ ngồi hàng giờ bên khối gỗ, làm nên vẻ đẹp tinh xảo của đồ mộc Đồng Kỵ." },
  { id: 111, name: "Khăn Thêu Tay Quất Động", category: "lua", price: 280000, village: "Thêu Quất Động", vid: 14, story: "Đường kim mũi chỉ mịn đến mức tranh thêu trông như tranh vẽ; nhiều thế hệ phụ nữ trong làng gìn giữ nghề thêu như báu vật." },
  { id: 112, name: "Giỏ Cói Kim Sơn", category: "may", price: 190000, village: "Cói Kim Sơn", vid: 15, story: "Cói mọc trên đất bãi bồi ven biển, dai và mịn; người dân dệt cói thành những chiếc giỏ mộc mạc, gần gũi." },
  { id: 113, name: "Tượng Đá Ninh Vân", category: "kim", price: 480000, village: "Đá Ninh Vân", vid: 16, story: "Gần núi đá vôi, người làng Ninh Vân nối nghề tạc đá qua nhiều đời, biến những khối đá thô thành tượng và đồ mỹ nghệ." },
  { id: 114, name: "Nón Bài Thơ Huế", category: "khac", price: 180000, village: "Nón Tây Hồ", vid: 17, story: "Nón bài thơ có hình ảnh và câu thơ lồng giữa hai lớp lá, chỉ hiện rõ khi soi lên ánh sáng, đậm chất thơ xứ Huế." },
  { id: 115, name: "Tranh Dân Gian Làng Sình", category: "tranh", price: 260000, village: "Tranh Sình", vid: 18, story: "Tranh Sình in ván khắc, màu sắc rực rỡ, gắn với phong tục cúng lễ của người dân xứ Huế." },
  { id: 116, name: "Gốm Trang Trí Thanh Hà", category: "gom", price: 230000, village: "Gốm Thanh Hà", vid: 19, story: "Đất sét sông Thu Bồn và lò nung truyền thống làm nên những món gốm mang hơi thở phố cổ Hội An." },
  { id: 117, name: "Tượng Gỗ Mộc Kim Bồng", category: "go", price: 420000, village: "Mộc Kim Bồng", vid: 20, story: "Thợ mộc Kim Bồng gắn với việc chạm khắc, xây dựng nhà cổ Hội An; tay nghề được truyền qua nhiều thế hệ." },
  { id: 118, name: "Bình Gốm Chăm Bàu Trúc", category: "gom", price: 310000, village: "Gốm Bàu Trúc", vid: 21, story: "Người phụ nữ Chăm nặn gốm hoàn toàn bằng tay, vừa xoay vừa tạo hình, rồi nung lộ thiên bằng rơm và củi." },
  { id: 119, name: "Gốm Lái Thiêu Hoa Văn Hoa - Việt", category: "gom", price: 250000, village: "Gốm Lái Thiêu", vid: 22, story: "Gốm Lái Thiêu mang dấu ấn giao thoa của nhiều cộng đồng ở Nam Bộ, thể hiện qua kiểu dáng và hoa văn." },
  { id: 120, name: "Khăn Thổ Cẩm Châu Giang", category: "lua", price: 270000, village: "Thổ cẩm Châu Giang", vid: 23, story: "Thổ cẩm Châu Giang do cộng đồng người Chăm dệt thủ công, hoa văn gắn với đời sống sông nước miền Tây." },
  { id: 121, name: "Chậu Gốm Đỏ Vĩnh Long", category: "gom", price: 220000, village: "Gốm đỏ Vĩnh Long", vid: 24, story: "Đất phù sa ven sông được nung thành sắc đỏ nâu ấm áp, đặc trưng của gốm đỏ Vĩnh Long." },
  { id: 122, name: "Kẹo Dừa Bến Tre Hộp Quà", category: "khac", price: 90000, village: "Kẹo dừa Bến Tre", vid: 25, story: "Nước cốt dừa được nấu liu riu với mạch nha, đổ khuôn và cắt thủ công, mang vị ngọt béo của xứ dừa." }
];

let map;
let markers = [];
let cart = [];

// KHỞI TẠO TRANG
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initMap();
  renderVillageList('all');
  renderProducts('all');
  generateCustomItinerary();
  initBuilder();
  updateStats();
});

// CHUYỂN TRANG (TAB SWITCHING)
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
  
  document.getElementById(tabId).classList.add('active');
  const activeNav = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
  if (activeNav) activeNav.classList.add('active');

  if (tabId === 'map' && map) {
    setTimeout(() => map.invalidateSize(), 100);
  }
}

// BẢN ĐỒ LEAFLET
function initMap() {
  map = L.map('interactiveMap').setView([16.047079, 108.206230], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  renderMapMarkers('all');
}

function renderMapMarkers(region) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const filtered = region === 'all' ? villagesData : villagesData.filter(v => v.region === region);

  filtered.forEach(v => {
    const marker = L.marker(v.coords).addTo(map)
      .bindPopup(`
        <div class="vp">
          <div class="vp-img" id="vpimg-${v.id}"><span>Đang tải ảnh...</span></div>
          <h4>${v.name}</h4>
          <small>${v.province}</small>
          <p class="vp-desc">${v.desc}</p>
          <div class="vp-btns">
            <button onclick="switchTab('shop')">Mua sản phẩm</button>
            <button class="alt" onclick="addToBuilder(${v.id})">+ Lịch trình</button>
          </div>
        </div>
      `, { minWidth: 240, maxWidth: 260 });
    marker.on('popupopen', () => loadVillageImage(v));
    markers.push(marker);
  });
}

function filterVillages() {
  const reg = document.getElementById('regionFilter').value;
  renderVillageList(reg);
  renderMapMarkers(reg);
}

function renderVillageList(region) {
  const container = document.getElementById('villageList');
  container.innerHTML = '';
  
  const filtered = region === 'all' ? villagesData : villagesData.filter(v => v.region === region);

  filtered.forEach(v => {
    const item = document.createElement('div');
    item.className = 'village-item';
    item.onclick = () => focusOnMap(v.coords, v.name);
    item.innerHTML = `
      <h4>${v.name}</h4>
      <p><i data-lucide="map-pin" style="width:12px; height:12px"></i> ${v.province}</p>
    `;
    container.appendChild(item);
  });
  lucide.createIcons();
}

function focusOnMap(coords, name) {
  map.setView(coords, 12);
  markers.forEach(m => {
    if (m.getLatLng().lat === coords[0] && m.getLatLng().lng === coords[1]) {
      m.openPopup();
    }
  });
}

// LỊCH TRÌNH DU LỊCH
function generateCustomItinerary(e) {
  if(e) e.preventDefault();
  const reg = document.getElementById('tourRegion').value;
  const resultBox = document.getElementById('itineraryResult');

  let itineraryHTML = '';

  if (reg === 'north') {
    itineraryHTML = `
      <h3><i data-lucide="map"></i> Lịch Trình Khám Phá Làng Nghề Đồng Bằng Sông Hồng (3 Ngày)</h3>
      <br>
      <div class="timeline-item">
        <h4>Ngày 1: Hà Nội - Gốm Bát Tràng</h4>
        <p>Sáng: Xe đón khách tại Phố Cổ Hà Nội đi Bát Tràng. Trải nghiệm tự tay nặn gốm trên bàn xoay cùng nghệ nhân.</p>
        <p>Chiều: Thưởng thức bữa trưa ẩm thực làng cổ, tham quan Bảo tàng Gốm Bát Tràng.</p>
      </div>
      <div class="timeline-item">
        <h4>Ngày 2: Lụa Vạn Phúc - Tranh Đông Hồ</h4>
        <p>Sáng: Ghé thăm Làng lụa Vạn Phúc, tìm hiểu quy trình ươm tơ dệt lụa.</p>
        <p>Chiều: Di chuyển sang Bắc Ninh trải nghiệm in tranh dân gian Đông Hồ trên giấy điệp.</p>
      </div>
      <div class="timeline-item">
        <h4>Ngày 3: Làng Nón Lá Chuông & Mua Sắm</h4>
        <p>Sáng: Tham quan làng làm nón lá Chuông nổi tiếng.</p>
        <p>Chiều: Trở về Hà Nội, mua sắm đồ thủ công làm quà kỷ niệm.</p>
      </div>
    `;
  } else if (reg === 'south') {
    itineraryHTML = `
      <h3><i data-lucide="map"></i> Lịch Trình Trải Nghiệm Làng Nghề Miền Nam (2 Ngày)</h3>
      <br>
      <div class="timeline-item">
        <h4>Ngày 1: TP.HCM - Gốm Lái Thiêu</h4>
        <p>Sáng: Từ TP.HCM đi Lái Thiêu, tham quan lò gốm và thử vẽ hoa văn lên sản phẩm.</p>
        <p>Chiều: Thưởng thức trái cây và ẩm thực vùng Lái Thiêu.</p>
      </div>
      <div class="timeline-item">
        <h4>Ngày 2: Cần Thơ - Làng chiếu Cẩm Bàn</h4>
        <p>Sáng: Di chuyển xuống Cần Thơ, tìm hiểu nghề dệt chiếu thủ công.</p>
        <p>Chiều: Đi thuyền chợ nổi, mua đặc sản làm quà.</p>
      </div>
    `;
  } else {
    itineraryHTML = `
      <h3><i data-lucide="map"></i> Lịch Trình Trải Nghiệm Làng Nghề Miền Trung (2 Ngày)</h3>
      <br>
      <div class="timeline-item">
        <h4>Ngày 1: Đà Nẵng - Đá Non Nước & Lồng Đèn Hội An</h4>
        <p>Sáng: Khám phá Làng đá mỹ nghệ Non Nước dưới chân Ngũ Hành Sơn.</p>
        <p>Chiều: Di chuyển vào Phố cổ Hội An, học làm lồng đèn may mắn.</p>
      </div>
      <div class="timeline-item">
        <h4>Ngày 2: Làng Đúc Đồng Phước Kiều</h4>
        <p>Sáng: Thăm làng đúc đồng Phước Kiều, thưởng thức âm thanh cồng chiêng độc đáo.</p>
      </div>
    `;
  }

  resultBox.innerHTML = itineraryHTML;
  lucide.createIcons();
}

// MUA SẮM SẢN PHẨM & GIỎ HÀNG
function renderProducts(category, btnElement) {
  if(btnElement) {
    document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
    btnElement.classList.add('active');
  }

  const container = document.getElementById('productsGrid');
  container.innerHTML = '';

  const filtered = category === 'all' ? productsData : productsData.filter(p => p.category === category);

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => openStory(p.id);
    card.innerHTML = `
      <img src="${p.image || PLACEHOLDER}" class="product-img" alt="${p.name}" id="pimg-${p.id}">
      <div class="product-info">
        <div class="product-title">${p.name}</div>
        <div class="product-village">${p.village}</div>
        <div class="product-hint"><i data-lucide="book-open"></i> Nhấn để xem câu chuyện</div>
        <div class="product-footer">
          <span class="product-price">${p.price.toLocaleString('vi-VN')} đ</span>
          <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${p.id})">
            <i data-lucide="plus"></i> Thêm
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
    if (!p.image) loadProductImage(p);
  });
  lucide.createIcons();
}

function addToCart(productId) {
  const item = productsData.find(p => p.id === productId);
  cart.push(item);
  updateCartCount();
  alert(`Đã thêm "${item.name}" vào giỏ hàng!`);
}

function updateCartCount() {
  document.getElementById('cartCount').innerText = cart.length;
}

function toggleCartModal() {
  const modal = document.getElementById('cartModal');
  modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  
  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#64748b">Giỏ hàng đang trống.</p>';
    totalEl.innerText = '0 VNĐ';
    return;
  }

  let total = 0;
  container.innerHTML = '';
  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement('div');
    div.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;';
    div.innerHTML = `
      <div>
        <div style="font-weight:600">${item.name}</div>
        <div style="color:#c2410c">${item.price.toLocaleString('vi-VN')} đ</div>
      </div>
      <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer">&times;</button>
    `;
    container.appendChild(div);
  });

  totalEl.innerText = `${total.toLocaleString('vi-VN')} VNĐ`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCartItems();
}

function checkout() {
  if(cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
    return;
  }
  alert("Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ sớm nhất để xác nhận đơn hàng.");
  cart = [];
  updateCartCount();
  toggleCartModal();
}
 
function handleContactSubmit(e) {
  e.preventDefault();
  alert("Tin nhắn của bạn đã được gửi thành công. Cảm ơn bạn đã liên hệ!");
  e.target.reset();
}

// ===== TÍNH NĂNG MỚI =====
const PLACEHOLDER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='180'><rect width='100%' height='100%' fill='%23fff7ed'/></svg>";

// Lấy ảnh làng nghề từ Wikipedia (tiếng Việt) theo tên, có cache
const imgCache = {};
function getImage(v) {
  if (v.img) return Promise.resolve(v.img);
  if (!imgCache[v.id]) {
    const url = 'https://vi.wikipedia.org/w/api.php?action=query&generator=search&gsrlimit=5&prop=pageimages&piprop=thumbnail&pithumbsize=500&format=json&origin=*&gsrsearch=' + encodeURIComponent(v.name);
    imgCache[v.id] = fetch(url).then(r => r.json()).then(d => {
      const pages = Object.values((d.query && d.query.pages) || {}).sort((a, b) => a.index - b.index);
      const hit = pages.find(p => p.thumbnail);
      return hit ? hit.thumbnail.source : null;
    }).catch(() => null);
  }
  return imgCache[v.id];
}

function loadVillageImage(v) {
  getImage(v).then(src => {
    const el = document.getElementById('vpimg-' + v.id);
    if (!el) return;
    el.innerHTML = src ? `<img src="${src}" alt="${v.name}"><em>Ảnh: Wikipedia</em>` : '<span>Chưa có ảnh</span>';
  });
}

function loadProductImage(p) {
  const v = villagesData.find(x => x.id === p.vid);
  if (!v) return;
  getImage(v).then(src => {
    const el = document.getElementById('pimg-' + p.id);
    if (src && el) el.src = src;
  });
}

function updateStats() {
  document.getElementById('statVillages').innerText = villagesData.length;
  document.getElementById('statProducts').innerText = productsData.length;
  document.getElementById('statProvinces').innerText = new Set(villagesData.map(v => v.province)).size;
}

// CỬA SỔ CÂU CHUYỆN SẢN PHẨM
function openStory(id) {
  const p = productsData.find(x => x.id === id);
  document.getElementById('storyImg').src = document.getElementById('pimg-' + id).src;
  document.getElementById('storyTitle').innerText = p.name;
  document.getElementById('storyVillage').innerText = p.village;
  document.getElementById('storyText').innerText = p.story;
  document.getElementById('storyPrice').innerText = p.price.toLocaleString('vi-VN') + ' đ';
  document.getElementById('storyAddBtn').onclick = () => { addToCart(p.id); };
  document.getElementById('storyModal').style.display = 'flex';
}
function closeStory() { document.getElementById('storyModal').style.display = 'none'; }
document.addEventListener('click', e => { if (e.target.id === 'storyModal') closeStory(); });

// XÂY DỰNG LỘ TRÌNH THEO NHU CẦU
const HUBS = {
  hn: ["Hà Nội", 21.0285, 105.8542], hue: ["Huế", 16.4637, 107.5909], dn: ["Đà Nẵng", 16.0544, 108.2022],
  hcm: ["TP. Hồ Chí Minh", 10.7769, 106.7009], ct: ["Cần Thơ", 10.0452, 105.7469]
};

function initBuilder() {
  const provinces = [...new Set(villagesData.map(v => v.province))];
  document.getElementById('builderProvince').innerHTML = '<option value="">-- Chọn theo từng làng nghề --</option>' +
    provinces.map(p => `<option value="${p}">${p}</option>`).join('');
  document.getElementById('builderStart').innerHTML = '<option value="auto">Tự động (thành phố gần nhất)</option>' +
    Object.entries(HUBS).map(([k, h]) => `<option value="${k}">${h[0]}</option>`).join('');
  document.getElementById('builderVillages').innerHTML = villagesData.map(v =>
    `<label><input type="checkbox" value="${v.id}" data-prov="${v.province}"> ${v.name} <small>(${v.province})</small></label>`).join('');
}

function onProvinceChange() {
  const p = document.getElementById('builderProvince').value;
  if (!p) return;
  document.querySelectorAll('#builderVillages input').forEach(c => c.checked = c.dataset.prov === p);
}

function addToBuilder(id) {
  const c = document.querySelector(`#builderVillages input[value="${id}"]`);
  if (c) c.checked = true;
  switchTab('itinerary');
  document.getElementById('routeBuilder').scrollIntoView({ behavior: 'smooth' });
}

function distKm(a, b) {
  const R = 6371, rad = x => x * Math.PI / 180;
  const dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h)) * 1.3; // hệ số 1.3: ước tính quãng đường đường bộ
}

function transportFor(km) {
  if (km < 3) return { text: 'Đi bộ hoặc xe đạp', speed: 5 };
  if (km <= 40) return { text: 'Taxi / Grab hoặc thuê xe máy', speed: 30 };
  if (km <= 250) return { text: 'Ô tô riêng, xe limousine hoặc xe khách', speed: 50 };
  return { text: 'Máy bay hoặc tàu hỏa (có thể kết hợp taxi từ ga/sân bay)', speed: 110 };
}

function buildRoute(e) {
  e.preventDefault();
  const sel = [...document.querySelectorAll('#builderVillages input:checked')].map(c => villagesData.find(v => v.id == c.value));
  const out = document.getElementById('routeResult');
  if (sel.length === 0) { out.innerHTML = '<p class="route-warn">Vui lòng chọn một tỉnh/thành hoặc ít nhất một làng nghề.</p>'; return; }

  let hubKey = document.getElementById('builderStart').value;
  if (hubKey === 'auto') {
    const cx = [sel.reduce((s, v) => s + v.coords[0], 0) / sel.length, sel.reduce((s, v) => s + v.coords[1], 0) / sel.length];
    hubKey = Object.keys(HUBS).sort((a, b) => distKm(cx, HUBS[a].slice(1)) - distKm(cx, HUBS[b].slice(1)))[0];
  }
  const hub = { name: HUBS[hubKey][0], coords: HUBS[hubKey].slice(1) };

  // sắp xếp theo điểm gần nhất tiếp theo
  let cur = hub, left = [...sel], order = [];
  while (left.length) {
    left.sort((a, b) => distKm(cur.coords, a.coords) - distKm(cur.coords, b.coords));
    cur = left.shift(); order.push(cur);
  }

  const stops = [hub, ...order, hub];
  const legs = [];
  for (let i = 0; i < stops.length - 1; i++) {
    const km = distKm(stops[i].coords, stops[i + 1].coords), t = transportFor(km);
    legs.push({ from: stops[i].name, to: stops[i + 1].name, km, t, hours: km / t.speed });
  }
  const totalKm = legs.reduce((s, l) => s + l.km, 0), totalH = legs.reduce((s, l) => s + l.hours, 0);
  const days = Math.ceil(order.length / 2);
  const fmtH = h => h < 1 ? Math.round(h * 60) + ' phút' : h.toFixed(1).replace('.', ',') + ' giờ';

  const legHTML = l => `<p class="leg"><i data-lucide="navigation"></i> <span><b>${l.from} → ${l.to}:</b> ~${Math.round(l.km)} km · ${l.t.text} · ~${fmtH(l.hours)}</span></p>`;
  let html = `<h3><i data-lucide="map"></i> Lộ trình đề xuất từ ${hub.name}</h3>
    <div class="route-summary">
      <span><b>${order.length}</b> làng nghề</span><span><b>${days}</b> ngày</span>
      <span><b>~${Math.round(totalKm)}</b> km (cả đi và về)</span><span><b>~${fmtH(totalH)}</b> di chuyển</span>
    </div>`;
  for (let d = 0; d < days; d++) {
    html += `<div class="timeline-item"><h4>Ngày ${d + 1}</h4>`;
    order.slice(d * 2, d * 2 + 2).forEach((v, k) => {
      html += legHTML(legs[d * 2 + k]);
      html += `<p><b>${v.name}</b> (${v.province})</p><ul class="act-list">${activityByType[v.type].map(a => `<li>${a}</li>`).join('')}</ul>`;
    });
    if (d === days - 1) html += legHTML(legs[legs.length - 1]);
    html += '</div>';
  }
  html += '<p class="route-note">* Số km là ước tính đường bộ từ khoảng cách đường chim bay (x1,3); thời gian chưa gồm giờ nghỉ và kẹt xe.</p>';
  out.innerHTML = html;
  lucide.createIcons();
}

// Bộ lọc sản phẩm (HTML gọi filterProducts)
function filterProducts(category, btn) { renderProducts(category, btn); }
