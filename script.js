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
        <button class="btn btn-primary btn-full magnetic" id="qvAddToCart"><span>Add to bag — $${p.price.toF