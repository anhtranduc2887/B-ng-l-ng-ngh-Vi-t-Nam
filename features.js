/* =====================================================
   features.js — Các tính năng MỚI:
   1) Đăng nhập / Đăng ký (lưu tạm bằng localStorage)
   2) Thanh toán (Tiền mặt / Chuyển khoản ngân hàng giả lập)
   3) Chọn ngôn ngữ Tiếng Việt / English cho toàn bộ web

   File này được nạp SAU script.js và KHÔNG sửa script.js.
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

    /* --- dữ liệu làng nghề (tên, tỉnh, mô tả) --- */
    'Làng gốm Bát Tràng': 'Bat Trang Pottery Village',
    'Làng lụa Vạn Phúc': 'Van Phuc Silk Village',
    'Làng đá mỹ nghệ Non Nước': 'Non Nuoc Stone Carving Village',
    'Làng đúc đồng Phước Kiều': 'Phuoc Kieu Bronze Casting Village',
    'Làng chiếu Cẩm Bàn': 'Cam Ban Mat Weaving Village',
    'Hà Nội': 'Hanoi',
    'Đà Nẵng': 'Da Nang',
    'Quảng Nam': 'Quang Nam',
    'Cần Thơ': 'Can Tho',
    'Làng gốm sứ truyền thống có lịch sử hơn 500 năm, nổi tiếng với các sản phẩm gốm tinh xảo.': 'A traditional ceramics village with over 500 years of history, famous for exquisite pottery.',
    'Nơi sản xuất lụa tơ tằm thượng hạng, mềm mại nổi tiếng từ thời nhà Nguyễn.': 'A producer of premium silk, famed for its softness since the Nguyen dynasty.',
    'Nằm dưới chân núi Ngũ Hành Sơn, nổi tiếng với các tác phẩm điêu khắc đá độc đáo.': 'Located at the foot of the Marble Mountains, famous for unique stone sculptures.',
    'Nổi tiếng với nghề đúc chiêng, cồng, lư hương bằng đồng truyền thống.': 'Famous for the traditional casting of bronze gongs, cymbals and incense burners.',
    'Làng nghề dệt chiếu thủ công đậm đà bản sắc vùng sông nước Miền Tây.': 'A handwoven-mat village rich in the identity of the Mekong Delta river region.',

    /* --- mua sắm --- */
    'Gian Hàng Sản Phẩm Làng Nghề': 'Craft Village Products',
    'Ủng hộ nghệ nhân Việt Nam qua các sản phẩm thủ công tinh xảo': 'Support Vietnamese artisans through exquisite handmade products',
    'Tất cả': 'All',
    'Gốm sứ': 'Ceramics',
    'Lụa tơ tằm': 'Silk',
    'Mây tre đan': 'Bamboo & Rattan',
    'Tranh dân gian': 'Folk Paintings',
    'Thêm': 'Add',
    'Bộ Ấm Trà Gốm Bát Tràng Men Cổ': 'Bat Trang Antique-Glaze Ceramic Tea Set',
    'Khăn Thêu Lụa Vạn Phúc Họa Tiết Sen': 'Van Phuc Embroidered Silk Scarf with Lotus Motif',
    'Đèn Mây Tre Đan Thủ Công': 'Handwoven Bamboo & Rattan Lamp',
    'Tranh Dân Gian Đông Hồ Khung Gỗ': 'Dong Ho Folk Painting with Wooden Frame',
    'Gốm Bát Tràng': 'Bat Trang Pottery',
    'Lụa Vạn Phúc': 'Van Phuc Silk',
    'Mây Tre Phu Vinh': 'Phu Vinh Bamboo & Rattan',
    'Tranh Đông Hồ': 'Dong Ho Paintings',

    /* --- liên hệ --- */
    'Liên Hệ & Hợp Tác': 'Contact & Collaboration',
    'Bạn là nghệ nhân, đơn vị lữ hành hay du khách cần hỗ trợ? Hãy gửi thông điệp cho chúng tôi.': 'Are you an artisan, a travel agency or a traveler who needs help? Send us a message.',
    'Thông tin kết nối': 'Contact Information',
    'H1-405, Đại học Bách Khoa, ĐHQGHCM, Đông Hòa, TPHCM': 'H1-405, Ho Chi Minh City University of Technology, VNU-HCM, Dong Hoa, Ho Chi Minh City',
    'Giờ làm việc: 13:00 - 15:00 (Thứ 2)': 'Working hours: 1:00 PM - 3:00 PM (Monday)',
    'Họ và tên *': 'Full name *',
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

  /* Quy tắc dịch cho chuỗi có số: "450.000 đ" / "0 VNĐ" -> "450,000 VND" */
  function applyRules(t) {
    const m = t.match(/^([\d.,]+)\s*(?:đ|VNĐ)$/);
    if (m) return m[1].replace(/\./g, ',') + ' VND';
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