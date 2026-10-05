// DỮ LIỆU LÀNG NGHỀ
const villagesData = [
  {
    id: 1,
    name: "Làng gốm Bát Tràng",
    region: "north",
    province: "Hà Nội",
    coords: [20.9782, 105.9186],
    desc: "Làng gốm sứ truyền thống có lịch sử hơn 500 năm, nổi tiếng với các sản phẩm gốm tinh xảo.",
    products: ["Bình hoa gốm", "Bộ ấm trà tử sa"]
  },
  {
    id: 2,
    name: "Làng lụa Vạn Phúc",
    region: "north",
    province: "Hà Nội",
    coords: [20.9765, 105.7725],
    desc: "Nơi sản xuất lụa tơ tằm thượng hạng, mềm mại nổi tiếng từ thời nhà Nguyễn.",
    products: ["Khăn lụa tơ tằm"]
  },
  {
    id: 3,
    name: "Làng đá mỹ nghệ Non Nước",
    region: "central",
    province: "Đà Nẵng",
    coords: [16.0028, 108.2625],
    desc: "Nằm dưới chân núi Ngũ Hành Sơn, nổi tiếng với các tác phẩm điêu khắc đá độc đáo.",
    products: ["Tượng đá nghệ thuật"]
  },
  {
    id: 4,
    name: "Làng đúc đồng Phước Kiều",
    region: "central",
    province: "Quảng Nam",
    coords: [15.8642, 108.2581],
    desc: "Nổi tiếng với nghề đúc chiêng, cồng, lư hương bằng đồng truyền thống.",
    products: ["Chuông đồng nhỏ"]
  },
  {
    id: 5,
    name: "Làng chiếu Cẩm Bàn",
    region: "south",
    province: "Cần Thơ",
    coords: [10.0371, 105.7882],
    desc: "Làng nghề dệt chiếu thủ công đậm đà bản sắc vùng sông nước Miền Tây.",
    products: ["Chiếu dệt thủ công"]
  }
];

// DỮ LIỆU SẢN PHẨM MUA SẮM
const productsData = [
  { id: 101, name: "Bộ Ấm Trà Gốm Bát Tràng Men Cổ", category: "gom", price: 450000, image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80", village: "Gốm Bát Tràng" },
  { id: 102, name: "Khăn Thêu Lụa Vạn Phúc Họa Tiết Sen", category: "lua", price: 320000, image: "https://images.unsplash.com/photo-1606760227091-3dd850d97f1d?auto=format&fit=crop&w=400&q=80", village: "Lụa Vạn Phúc" },
  { id: 103, name: "Đèn Mây Tre Đan Thủ Công", category: "may", price: 210000, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80", village: "Mây Tre Phu Vinh" },
  { id: 104, name: "Tranh Dân Gian Đông Hồ Khung Gỗ", category: "tranh", price: 550000, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80", village: "Tranh Đông Hồ" }
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
        <div style="width:180px">
          <h4 style="margin-bottom:4px; color:#c2410c">${v.name}</h4>
          <p style="font-size:12px; margin-bottom:8px">${v.desc}</p>
          <button onclick="switchTab('shop')" style="background:#c2410c; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer">Mua sản phẩm</button>
        </div>
      `);
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
    card.innerHTML = `
      <img src="${p.image}" class="product-img" alt="${p.name}">
      <div class="product-info">
        <div class="product-title">${p.name}</div>
        <div class="product-village">${p.village}</div>
        <div class="product-footer">
          <span class="product-price">${p.price.toLocaleString('vi-VN')} đ</span>
          <button class="btn btn-primary" onclick="addToCart(${p.id})">
            <i data-lucide="plus"></i> Thêm
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
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
    div.style.cssText = 'display:flex; justify-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;';
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