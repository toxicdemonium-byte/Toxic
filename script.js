/* ==========================================================================
   VERDE & OAK — Main Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------------
     Preloader
     ---------------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('done'), 600);
  });
  // fallback in case load already fired
  setTimeout(() => preloader.classList.add('done'), 1800);

  /* ----------------------------------------------------------------------
     Custom Cursor
     ---------------------------------------------------------------------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states
  const hoverTargets = 'a, button, .product-card, .gallery-item, .journal-card, .filter-btn';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursorRing.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursorRing.classList.remove('hover');
    }
  });

  // Text-label cursor for view/buy actions
  document.querySelectorAll('[data-cursor-text]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.classList.add('text-hover');
      cursorRing.setAttribute('data-cursor-text', el.getAttribute('data-cursor-text'));
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('text-hover');
    });
  });

  document.addEventListener('mousedown', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(0.6)');
  document.addEventListener('mouseup', () => cursorDot.style.transform = 'translate(-50%,-50%) scale(1)');

  /* ----------------------------------------------------------------------
     Header scroll state + active nav link
     ---------------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('show', window.scrollY > 600);

    let current = 'home';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom > 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ----------------------------------------------------------------------
     Mobile nav
     ---------------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('overlay');

  function closeAllPanels() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    document.getElementById('cartDrawer').classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) { closeAllPanels(); return; }
    hamburger.classList.add('active');
    mobileNav.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeAllPanels));
  overlay.addEventListener('click', closeAllPanels);

  /* ----------------------------------------------------------------------
     Search bar
     ---------------------------------------------------------------------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');

  searchToggle.addEventListener('click', () => {
    searchBar.classList.toggle('open');
    if (searchBar.classList.contains('open')) setTimeout(() => searchInput.focus(), 300);
  });
  searchClose.addEventListener('click', () => searchBar.classList.remove('open'));

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      const term = searchInput.value.trim().toLowerCase();
      const match = products.find(p => p.title.toLowerCase().includes(term) || p.category.includes(term));
      if (match) {
        searchBar.classList.remove('open');
        document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => openQuickView(match.id), 600);
      } else {
        showToast('No products found for "' + searchInput.value + '"');
      }
    }
    if (e.key === 'Escape') searchBar.classList.remove('open');
  });

  /* ----------------------------------------------------------------------
     Scroll reveal animations
     ---------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  function observeReveals(root = document) {
    root.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }
  observeReveals();

  /* ----------------------------------------------------------------------
     Hero counter animation
     ---------------------------------------------------------------------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }

  /* ----------------------------------------------------------------------
     Magnetic buttons
     ---------------------------------------------------------------------- */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  /* ======================================================================
     PRODUCT DATA
     ====================================================================== */
  const products = [
    {
      id: 'p1', title: 'Kobo Stoneware Vase', category: 'ceramics',
      price: 68, oldPrice: null, badge: 'New',
      rating: 4.9, reviews: 214,
      images: [
        'https://images.unsplash.com/photo-1612196808214-b7e239e5d5e1?w=700&q=80',
        'https://images.unsplash.com/photo-1578500351865-d6c3706f46bc?w=700&q=80',
        'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=700&q=80'
      ],
      desc: 'A hand-thrown stoneware vase with a reactive ash glaze — every piece develops unique pooling and texture during firing, so no two are exactly alike.',
      material: 'Stoneware, ash glaze', dims: '18 × 18 × 24 cm', care: 'Wipe with damp cloth'
    },
    {
      id: 'p2', title: 'Linden Linen Throw', category: 'textiles',
      price: 54, oldPrice: 72, badge: 'Sale',
      rating: 4.8, reviews: 312,
      images: [
        'https://images.unsplash.com/photo-1600166898405-da9535204843?w=700&q=80',
        'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=700&q=80',
        'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=700&q=80'
      ],
      desc: 'Stonewashed European linen throw, pre-washed forty times for an immediately soft hand-feel. Gets better with every wash.',
      material: '100% European linen', dims: '130 × 180 cm', care: 'Machine wash cold'
    },
    {
      id: 'p3', title: 'Hearth Ceramic Lamp', category: 'lighting',
      price: 142, oldPrice: null, badge: 'Bestseller',
      rating: 5.0, reviews: 187,
      images: [
        'https://images.unsplash.com/photo-1543198126-08bf78b3ee94?w=700&q=80',
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700&q=80',
        'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=700&q=80'
      ],
      desc: 'A sculptural table lamp with a hand-glazed ceramic base and a linen diffuser shade that casts warm, low light — ideal for reading corners.',
      material: 'Ceramic, linen shade', dims: '28 × 28 × 42 cm', care: 'Dust with dry cloth'
    },
    {
      id: 'p4', title: 'Aspen Oak Side Table', category: 'furniture',
      price: 248, oldPrice: null, badge: null,
      rating: 4.9, reviews: 96,
      images: [
        'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=700&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=700&q=80',
        'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=700&q=80'
      ],
      desc: 'Solid FSC-certified oak side table with hand-cut joinery and a natural oil finish that deepens in color over time.',
      material: 'FSC oak, natural oil', dims: '45 × 45 × 50 cm', care: 'Re-oil yearly'
    },
    {
      id: 'p5', title: 'Mira Speckled Bowl Set', category: 'ceramics',
      price: 46, oldPrice: null, badge: 'New',
      rating: 4.7, reviews: 158,
      images: [
        'https://images.unsplash.com/photo-1584990347449-39b8ee44e8c6?w=700&q=80',
        'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=700&q=80',
        'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=700&q=80'
      ],
      desc: 'Set of four speckled stoneware bowls, microwave and dishwasher safe, finished with a soft matte glaze.',
      material: 'Speckled stoneware', dims: '15 cm diameter (each)', care: 'Dishwasher safe'
    },
    {
      id: 'p6', title: 'Solstice Wool Cushion', category: 'textiles',
      price: 38, oldPrice: 48, badge: 'Sale',
      rating: 4.6, reviews: 121,
      images: [
        'https://images.unsplash.com/photo-1584346133934-2162ed4a35a0?w=700&q=80',
        'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=700&q=80',
        'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=700&q=80'
      ],
      desc: 'A chunky-knit wool cushion cover with a feather-down insert, handwoven on traditional looms by partner artisans.',
      material: 'Wool, feather-down fill', dims: '50 × 50 cm', care: 'Spot clean only'
    },
    {
      id: 'p7', title: 'Nordic Pendant Light', category: 'lighting',
      price: 165, oldPrice: null, badge: null,
      rating: 4.8, reviews: 73,
      images: [
        'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=700&q=80',
        'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=700&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=700&q=80'
      ],
      desc: 'A blown-glass pendant with brushed brass fittings, designed to diffuse light evenly across a dining table.',
      material: 'Blown glass, brass', dims: '32 cm diameter', care: 'Dust occasionally'
    },
    {
      id: 'p8', title: 'Cairn Oak Bookshelf', category: 'furniture',
      price: 398, oldPrice: 460, badge: 'Sale',
      rating: 4.9, reviews: 64,
      images: [
        'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=700&q=80',
        'https://images.unsplash.com/photo-1594026112334-d4368705f87a?w=700&q=80',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&q=80'
      ],
      desc: 'A modular oak bookshelf with adjustable shelving, built using traditional dovetail joints and finished with hardwax oil.',
      material: 'Solid oak, hardwax oil', dims: '90 × 35 × 180 cm', care: 'Re-oil every 2 years'
    }
  ];

  /* ----------------------------------------------------------------------
     Render product grid
     ---------------------------------------------------------------------- */
  const productGrid = document.getElementById('productGrid');

  function renderProducts() {
    productGrid.innerHTML = products.map((p, i) => `
      <div class="product-card reveal" style="--d:${i % 4}" data-category="${p.category}" data-id="${p.id}">
        <div class="product-media">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          <img class="img-primary" src="${p.images[0]}" alt="${p.title}">
          <img class="img-secondary" src="${p.images[1]}" alt="${p.title} alternate view">
          <div class="product-actions">
            <button class="product-action-btn qv-btn" data-id="${p.id}" data-cursor-text="View" aria-label="Quick view ${p.title}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            <button class="product-action-btn add-cart-btn" data-id="${p.id}" data-cursor-text="Add" aria-label="Add ${p.title} to bag">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 4.6A1 1 0 0 0 5.6 19H17"/><circle cx="9" cy="21" r="1"/><circle cx="17" cy="21" r="1"/></svg>
            </button>
          </div>
        </div>
        <div class="product-info">
          <span class="product-category">${p.category}</span>
          <h3 class="product-title">${p.title}</h3>
          <div class="product-rating">
            <span class="stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}</span>
            <span>${p.rating} (${p.reviews})</span>
          </div>
          <div class="product-price-row">
            <span class="product-price">$${p.price.toFixed(2)}</span>
            ${p.oldPrice ? `<span class="product-price-old">$${p.oldPrice.toFixed(2)}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');

    observeReveals(productGrid);
    attachProductEvents();
  }
  renderProducts();

  function attachProductEvents() {
    productGrid.querySelectorAll('.qv-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openQuickView(btn.getAttribute('data-id'));
      });
    });
    productGrid.querySelectorAll('.add-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(btn.getAttribute('data-id'), 1);
      });
    });
    productGrid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => openQuickView(card.getAttribute('data-id')));
    });
  }

  /* ----------------------------------------------------------------------
     Filter bar
     ---------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.product-card').forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hidden-card', !match);
      });
    });
  });

  /* ======================================================================
     QUICK VIEW MODAL
     ====================================================================== */
  // build modal dynamically
  const qvModal = document.createElement('div');
  qvModal.className = 'quickview-modal';
  qvModal.id = 'quickviewModal';
  qvModal.innerHTML = `
    <div class="quickview-box">
      <button class="qv-close" id="qvClose" aria-label="Close quick view">&times;</button>
      <div class="qv-gallery">
        <div class="qv-main-img"><img id="qvMainImg" src="" alt=""></div>
        <div class="qv-thumbs" id="qvThumbs"></div>
      </div>
      <div class="qv-details" id="qvDetails"></div>
    </div>
  `;
  document.body.appendChild(qvModal);

  let currentProduct = null;
  let currentQty = 1;

  function openQuickView(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;
    currentProduct = p;
    currentQty = 1;

    document.getElementById('qvMainImg').src = p.images[0];
    document.getElementById('qvMainImg').alt = p.title;

    document.getElementById('qvThumbs').innerHTML = p.images.map((img, i) => `
      <div class="qv-thumb ${i === 0 ? 'active' : ''}" data-img="${img}" data-cursor-text="">
        <img src="${img}" alt="${p.title} view ${i + 1}">
      </div>
    `).join('');

    document.getElementById('qvDetails').innerHTML = `
      <span class="qv-category">${p.category}</span>
      <h2 class="qv-title">${p.title}</h2>
      <div class="qv-rating">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}<span>${p.rating} · ${p.reviews} reviews</span></div>
      <div class="qv-price-row">
        <span class="qv-price">$${p.price.toFixed(2)}</span>
        ${p.oldPrice ? `<span class="qv-price-old">$${p.oldPrice.toFixed(2)}</span>` : ''}
      </div>
      <p class="qv-desc">${p.desc}</p>
      <div class="qv-meta">
        <div class="qv-meta-row"><span>Material</span><span>${p.material}</span></div>
        <div class="qv-meta-row"><span>Dimensions</span><span>${p.dims}</span></div>
        <div class="qv-meta-row"><span>Care</span><span>${p.care}</span></div>
      </div>
      <div class="qv-qty-row">
        <div class="qv-qty">
          <button id="qvQtyMinus" aria-label="Decrease quantity">&minus;</button>
          <span id="qvQtyVal">1</span>
          <button id="qvQtyPlus" aria-label="Increase quantity">+</button>
        </div>
        <span class="qv-stock">In stock — ships in 5–14 days</span>
      </div>
      <div class="qv-actions">
        <button class="btn btn-primary btn-full magnetic" id="qvAddToCart"><span>Add to bag — $${p.price.toFixed(2)}</span></button>
      </div>
    `;

    // thumb swap
    document.querySelectorAll('.qv-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        document.querySelectorAll('.qv-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        document.getElementById('qvMainImg').src = thumb.getAttribute('data-img');
      });
    });

    // qty controls
    document.getElementById('qvQtyMinus').addEventListener('click', () => {
      if (currentQty > 1) currentQty--;
      document.getElementById('qvQtyVal').textContent = currentQty;
      updateQvAddBtn();
    });
    document.getElementById('qvQtyPlus').addEventListener('click', () => {
      currentQty++;
      document.getElementById('qvQtyVal').textContent = currentQty;
      updateQvAddBtn();
    });
    document.getElementById('qvAddToCart').addEventListener('click', () => {
      addToCart(p.id, currentQty);
      closeQuickView();
    });

    qvModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateQvAddBtn() {
    const total = (currentProduct.price * currentQty).toFixed(2);
    document.querySelector('#qvAddToCart span').textContent = `Add to bag — $${total}`;
  }

  function closeQuickView() {
    qvModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('qvClose').addEventListener('click', closeQuickView);
  qvModal.addEventListener('click', (e) => { if (e.target === qvModal) closeQuickView(); });

  /* ======================================================================
     CART
     ====================================================================== */
  let cart = [];

  const cartToggle = document.getElementById('cartToggle');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartClose = document.getElementById('cartClose');
  const cartItemsEl = document.getElementById('cartItems');
  const cartCountEl = document.getElementById('cartCount');
  const cartSubtotalEl = document.getElementById('cartSubtotal');

  cartToggle.addEventListener('click', () => {
    cartDrawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  cartClose.addEventListener('click', closeAllPanels);

  function addToCart(id, qty) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;
    const existing = cart.find(item => item.id === id);
    if (existing) existing.qty += qty;
    else cart.push({ id, qty });

    renderCart();
    cartCountEl.classList.remove('bump');
    void cartCountEl.offsetWidth;
    cartCountEl.classList.add('bump');
    showToast(`Added "${p.title}" to your bag`);
  }

  function renderCart() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalCount;

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `<p class="cart-empty">Your bag is empty. Time to fix that.</p>`;
      cartSubtotalEl.textContent = '$0.00';
      return;
    }

    let subtotal = 0;
    cartItemsEl.innerHTML = cart.map(item => {
      const p = products.find(prod => prod.id === item.id);
      const lineTotal = p.price * item.qty;
      subtotal += lineTotal;
      return `
        <div class="cart-item" data-id="${p.id}">
          <img src="${p.images[0]}" alt="${p.title}">
          <div class="cart-item-info">
            <h4>${p.title}</h4>
            <span>$${p.price.toFixed(2)}</span>
            <div class="cart-item-qty">
              <button class="cart-qty-minus" data-id="${p.id}">&minus;</button>
              <span>${item.qty}</span>
              <button class="cart-qty-plus" data-id="${p.id}">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-id="${p.id}" aria-label="Remove ${p.title}">&times;</button>
        </div>
      `;
    }).join('');

    cartSubtotalEl.textContent = '$' + subtotal.toFixed(2);

    cartItemsEl.querySelectorAll('.cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = cart.find(i => i.id === btn.getAttribute('data-id'));
        item.qty++;
        renderCart();
      });
    });
    cartItemsEl.querySelectorAll('.cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = cart.find(i => i.id === btn.getAttribute('data-id'));
        item.qty--;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== item.id);
        renderCart();
      });
    });
    cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cart = cart.filter(i => i.id !== btn.getAttribute('data-id'));
        renderCart();
      });
    });
  }

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Your bag is empty');
      return;
    }
    showToast('This is a demo — checkout isn\'t connected yet');
  });

  /* ======================================================================
     GALLERY LIGHTBOX
     ====================================================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  let currentGalleryIndex = 0;

  function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    const item = galleryItems[currentGalleryIndex];
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay span');
    lightboxImg.src = img.src.replace('w=900', 'w=1600');
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption.textContent;
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  document.getElementById('lightboxClose').addEventListener('click', () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
  document.getElementById('lightboxPrev').addEventListener('click', () => {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightbox();
  });
  document.getElementById('lightboxNext').addEventListener('click', () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    updateLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
    if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
  });

  /* ======================================================================
     BLOG / JOURNAL MODAL
     ====================================================================== */
  const blogPosts = {
    0: {
      tag: 'Craft', img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1400&q=80',
      title: 'Why we still glaze every piece by hand',
      meta: 'June 02, 2026 · 6 min read · By Studio Team',
      body: `
        <p>Automation could cut our glazing time by two-thirds. We've looked at the machines, run the numbers, and even tested a small batch with a glazing robot borrowed from a partner workshop. The pieces came out consistent — almost suspiciously so. And that, it turns out, is exactly the problem.</p>
        <p>Part of what makes a Verde &amp; Oak piece feel alive on a shelf is the variation. A slightly thicker pool of glaze in one corner of a bowl, a faint brushstroke visible under the surface, a rim that catches the light just a touch differently than its neighbor. These aren't flaws we tolerate — they're the entire point.</p>
        <blockquote>"The kiln doesn't care about your plans. You glaze for the fire you're going to get, not the one you hope for."</blockquote>
        <h2>What "failure" actually teaches us</h2>
        <p>Roughly one in twelve pieces doesn't meet our standard for sale. Most of these aren't dramatic failures — a glaze ran a little further than expected, or a speckle pattern clustered unevenly. We keep every one of these in the studio. They've become our most valuable reference library, showing us exactly where the edges of a recipe sit.</p>
        <p>When a new maker joins the studio, their first month isn't spent on saleable work at all. It's spent making "seconds" — pieces we'll never sell — purely to build the muscle memory of how a glaze behaves on a wet surface versus a bone-dry one, how thick is too thick, and how to read a kiln's hot spots by the pieces that come out of them.</p>
        <h2>The case for slowness</h2>
        <p>None of this is a marketing position dressed up as philosophy. It's slower, it's more expensive, and it means we sometimes run out of a popular glaze for weeks while a maker works through a new batch by hand. But it also means that when you pick up a Kobo vase, you're holding something that passed through an actual person's judgment at every stage — and that judgment is, frankly, better than a robot's.</p>
      `
    },
    1: {
      tag: 'Materials', img: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1400&q=80',
      title: 'A short guide to caring for raw linen',
      meta: 'May 24, 2026 · 4 min read · By Studio Team',
      body: `
        <p>Linen has a reputation for being fussy. In our experience, it's the opposite — it's one of the most forgiving fabrics you can own, provided you stop treating it like cotton. Here's what actually matters.</p>
        <h2>Wash cold, wash often</h2>
        <p>Linen fibers are stronger wet than dry, which is the opposite of most fabrics. A cold wash on a gentle cycle won't damage it — in fact, the more you wash our linen, the softer it gets. We pre-wash every textile forty times before it ships specifically so this softening starts on day one rather than after a year of ownership.</p>
        <h2>Skip the dryer when you can</h2>
        <p>Heat is what makes linen feel stiff and a little scratchy. Air-drying flat or on a line preserves the fiber's natural softness and avoids the static cling that high heat causes. If you do need a dryer, a low, short cycle followed by air-drying the last stretch works well.</p>
        <h2>Wrinkles are a feature</h2>
        <p>This is the hardest habit to break. A perfectly pressed linen throw looks slightly wrong — almost like a different fabric. The characteristic texture of linen comes from those soft creases. We'd encourage you to make peace with the iron staying in the cupboard.</p>
        <h2>Stains: act fast, skip the bleach</h2>
        <p>Cold water and a gentle stain treatment, applied as soon as possible, handles almost everything. Bleach and high-heat drying are the two things most likely to shorten a linen piece's life — avoid both and a well-made linen textile will easily outlast a decade of regular use.</p>
      `
    },
    2: {
      tag: 'Studio', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1400&q=80',
      title: 'Inside our zero-waste oak workshop',
      meta: 'May 11, 2026 · 5 min read · By Studio Team',
      body: `
        <p>Walk into the woodshop on any given day and you'll notice something odd: there's almost no scrap pile. Not because we're not cutting wood — we go through several hundred kilos of FSC-certified oak a month — but because almost nothing leaves the building as waste.</p>
        <h2>Where the offcuts go</h2>
        <p>Large offcuts from side-table legs become cutting boards and coasters. Medium pieces are turned into drawer pulls and the small wooden tags that go on every textile order. The smallest scraps — sawdust included — go straight into the kiln room, where they help fuel the bisque firing for our ceramics.</p>
        <p>This loop wasn't designed top-down. It grew piece by piece as makers from different parts of the studio started asking each other "can you use this?" before anything hit a bin. After a few years, the answer was almost always yes.</p>
        <h2>Sourcing with intention</h2>
        <p>Every plank that comes into the workshop is FSC-certified, sourced from managed forests within 200 kilometers of Bristol where possible. We buy in modest batches rather than bulk, which costs more per board but means we're never sitting on excess stock that ages out of usability.</p>
        <h2>What this means for you</h2>
        <p>Practically, it means an oak side table from us costs a bit more than a mass-manufactured equivalent. It also means the table is built from wood that was alive within the last few years, finished by someone who'll personally re-oil it for you a decade from now if you ask.</p>
      `
    },
    3: {
      tag: 'Living', img: 'https://images.unsplash.com/photo-1493857671505-72967e2e9760?w=1400&q=80',
      title: 'Designing a corner that asks you to slow down',
      meta: 'April 29, 2026 · 7 min read · By Studio Team',
      body: `
        <p>We get asked a lot about "styling a room" — full redesigns, mood boards, color palettes for an entire space. But the most useful change we've seen people make is much smaller: one corner, three objects, and one rule.</p>
        <h2>The three objects</h2>
        <p>A chair you actually want to sit in — not the one that looks best in photos. A light source that's warm and low rather than overhead and bright; table lamps do more for a room's atmosphere than almost anything else. And one object with texture you can't get from a screen: a ceramic bowl, a wool cushion, something your hands want to touch.</p>
        <h2>The one rule</h2>
        <p>This is the part people resist: no phone in this corner. Not face-down on the side table, not "just for five minutes." The corner works because it's the one place in the home that doesn't compete with a screen for your attention.</p>
        <h2>A small case study</h2>
        <p>One customer wrote to us after setting up a corner with our Hearth lamp, a Solstice cushion, and a secondhand armchair from a local shop. Her note: she'd started reading again for the first time in years, not because she'd decided to "read more," but because the corner had become the most comfortable place in the house to do nothing else.</p>
        <p>That's really the whole idea. You're not redesigning a room. You're building a small, specific invitation to slow down — and trusting that, given somewhere comfortable enough, you'll take it.</p>
      `
    },
    4: {
      tag: 'Craft', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1400&q=80',
      title: 'The slow math of small-batch pricing',
      meta: 'April 14, 2026 · 5 min read · By Studio Team',
      body: `
        <p>People sometimes ask why a hand-thrown bowl costs more than a similar-looking one from a large retailer. The honest answer is that the two objects, despite looking alike in a photo, aren't really the same category of thing.</p>
        <h2>What the price actually covers</h2>
        <p>A mass-produced ceramic piece is designed once and replicated thousands of times — the design cost is spread so thin it barely registers per unit. Each of our pieces is made individually, by a person being paid a fair studio wage, with materials bought in small batches at a higher per-unit cost than bulk manufacturing allows.</p>
        <h2>The repair promise</h2>
        <p>Part of what you're paying for is support that continues after the sale. Glaze touch-ups, re-oiling for wooden pieces, and honest advice on whether something's worth repairing versus replacing — all included, indefinitely, for anyone who's bought from us.</p>
        <h2>Why we don't discount often</h2>
        <p>Frequent sales train people to wait for a discount, which then forces a business to either inflate "original" prices or cut corners to protect margins during sale periods. We'd rather price honestly year-round and run occasional, real reductions on specific pieces — like the ones currently marked "Sale" in our shop — when we genuinely have surplus stock to move.</p>
      `
    },
    5: {
      tag: 'Materials', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1400&q=80',
      title: 'Reading a glaze: what those colors are telling you',
      meta: 'March 30, 2026 · 6 min read · By Studio Team',
      body: `
        <p>Every glaze on a Verde &amp; Oak piece is a small chemical story, written in the kiln. Once you know a little about what's happening, the variations stop looking random and start looking like a record of the firing itself.</p>
        <h2>Why edges go lighter</h2>
        <p>Glaze is applied as a liquid and thins naturally over raised edges — rims, handles, the tops of ridges — as it dries and during firing. Those areas often fire to a lighter, more matte finish than the body of the piece, which is why rims on our stoneware tend to look slightly different from the rest.</p>
        <h2>Speckles aren't mistakes</h2>
        <p>The speckled finish on our Mira bowl set comes from iron particles in the clay body itself, which react with the glaze during firing to create small dark flecks. The pattern is influenced by exactly where a piece sat in the kiln, which is why no two bowls in a set are quite identical — and why we think a full set looks more interesting than four matching bowls would.</p>
        <h2>What pooling tells you</h2>
        <p>On pieces like the Kobo vase, you'll sometimes see glaze "pool" into deeper blues or greens in recessed areas. This happens because glaze is genuinely thicker there, and thickness changes how it reacts with the kiln's atmosphere. It's the clearest visual signature of hand-application — a sprayed or dipped industrial glaze rarely pools this way.</p>
      `
    }
  };

  const journalCards = document.querySelectorAll('.journal-card');
  const postModal = document.getElementById('postModal');
  const postModalContent = document.getElementById('postModalContent');

  function openPost(id) {
    const post = blogPosts[id];
    if (!post) return;
    postModalContent.innerHTML = `
      <div class="post-hero-img"><img src="${post.img}" alt="${post.title}"></div>
      <span class="post-tag">${post.tag}</span>
      <h1>${post.title}</h1>
      <span class="post-meta">${post.meta}</span>
      ${post.body}
    `;
    postModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    postModal.scrollTop = 0;
  }

  function attachJournalEvents() {
    document.querySelectorAll('.journal-card').forEach(card => {
      card.addEventListener('click', () => openPost(card.getAttribute('data-post')));
    });
  }
  attachJournalEvents();

  document.getElementById('postModalClose').addEventListener('click', () => {
    postModal.classList.remove('open');
    document.body.style.overflow = '';
  });

  /* Load more posts */
  let extraPostsLoaded = false;
  const journalGrid = document.querySelector('.journal-grid');
  document.getElementById('loadMorePosts').addEventListener('click', (e) => {
    if (extraPostsLoaded) return;
    extraPostsLoaded = true;
    const extra = document.createElement('div');
    extra.innerHTML = `
      <article class="journal-card reveal" data-post="4">
        <div class="journal-img">
          <img src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=700&q=80" alt="Close up of hands sanding a wooden surface">
          <span class="journal-tag">Craft</span>
        </div>
        <div class="journal-body">
          <span class="journal-meta">April 14, 2026 · 5 min read</span>
          <h3>The slow math of small-batch pricing</h3>
          <p>Why a hand-thrown bowl costs more than it looks like it should — and what that price actually pays for.</p>
          <span class="journal-link">Read the story <i>&rarr;</i></span>
        </div>
      </article>
      <article class="journal-card reveal" data-post="5">
        <div class="journal-img">
          <img src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=700&q=80" alt="Speckled ceramic bowls with glaze detail">
          <span class="journal-tag">Materials</span>
        </div>
        <div class="journal-body">
          <span class="journal-meta">March 30, 2026 · 6 min read</span>
          <h3>Reading a glaze: what those colors are telling you</h3>
          <p>Speckles, pooling, and lightened edges aren't flaws — they're a record of exactly what happened in the kiln.</p>
          <span class="journal-link">Read the story <i>&rarr;</i></span>
        </div>
      </article>
    `;
    while (extra.firstChild) journalGrid.appendChild(extra.firstChild);
    observeReveals(journalGrid);
    attachJournalEvents();
    e.target.style.display = 'none';
  });

  /* ======================================================================
     NEWSLETTER + CONTACT FORMS
     ====================================================================== */
  document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    showToast(`Subscribed! Look out for an email at ${input.value}`);
    input.value = '';
  });

  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('formSuccess').classList.add('show');
    setTimeout(() => {
      contactForm.reset();
    }, 300);
  });

  /* ======================================================================
     TOAST
     ====================================================================== */
  const toast = document.getElementById('toast');
  let toastTimeout;
  function showToast(message) {
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  /* ======================================================================
     ESC key closes any open overlay panel
     ====================================================================== */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (qvModal.classList.contains('open')) closeQuickView();
    if (postModal.classList.contains('open')) {
      postModal.classList.remove('open');
      document.body.style.overflow = '';
    }
    closeAllPanels();
  });

});
