/* ==========================================================================
   SMART CANTEEN - MODERN HOME PAGE SCRIPTS
   Handles Navigation, Mobile Drawer, Menu Rendering, Session Routing & Animations
   ========================================================================== */

(function() {
  'use strict';

  // ==========================================
  // 1. HELPERS & SESSION DETECTION
  // ==========================================

  function getSessionUser() {
    try {
      var raw = localStorage.getItem('smartCanteenCurrentUser');
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed && parsed.role) {
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function getDashboardUrl(role) {
    if (role === 'student') return 'pages/student.html';
    if (role === 'staff') return 'pages/staff.html';
    if (role === 'admin') return 'pages/admin.html';
    return 'pages/login.html';
  }

  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, function(match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[match];
    });
  }

  // ==========================================
  // 2. NAVBAR SCROLL & MOBILE DRAWER
  // ==========================================

  function initNavbar() {
    var header = document.getElementById('hpHeader');
    var navToggle = document.getElementById('hpNavToggle');
    var navLinks = document.getElementById('hpNavLinks');
    var links = document.querySelectorAll('.hp-nav-link');

    // Sticky shadow on scroll
    window.addEventListener('scroll', function() {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });

    // Initial check
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    }

    // Mobile Hamburger Toggle
    if (navToggle && navLinks) {
      function openNav() {
        navLinks.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        var iconWrap = navToggle.querySelector('.hp-toggle-icon');
        if (iconWrap) {
          // Switch to Lucide 'X' icon
          iconWrap.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
        }
      }

      function closeNav() {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        var iconWrap = navToggle.querySelector('.hp-toggle-icon');
        if (iconWrap) {
          // Switch back to Lucide 'menu' icon
          iconWrap.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>';
        }
      }

      navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = navLinks.classList.contains('open');
        if (isOpen) {
          closeNav();
        } else {
          openNav();
        }
      });

      // Close on clicking any nav anchor
      links.forEach(function(link) {
        link.addEventListener('click', function() {
          closeNav();
        });
      });

      // Close on Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
          closeNav();
          navToggle.focus();
        }
      });

      // Close when clicking outside
      document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
          closeNav();
        }
      });
    }

    // Active Navigation Highlight on Scroll
    var sections = document.querySelectorAll('section[id]');
    function highlightActiveNav() {
      var scrollY = window.pageYOffset + 100;

      sections.forEach(function(current) {
        var sectionHeight = current.offsetHeight;
        var sectionTop = current.offsetTop - 80;
        var sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          links.forEach(function(link) {
            if (link.getAttribute('href') === '#' + sectionId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', highlightActiveNav, { passive: true });
    highlightActiveNav();
  }

  // ==========================================
  // 3. POPULAR FOOD MENU RENDERING
  // ==========================================

  function renderPopularFood() {
    var container = document.getElementById('hpPopularMenuGrid');
    if (!container) return;

    // Retrieve menu from data.js or LocalStorage
    var menu = [];
    if (typeof getMenu === 'function') {
      menu = getMenu();
    } else {
      try {
        var stored = localStorage.getItem('smartCanteenMenu');
        menu = stored ? JSON.parse(stored) : [];
      } catch (e) {
        menu = [];
      }
    }

    // Filter items: only available items; prioritize popular items
    var popularItems = menu.filter(function(item) {
      return item.available !== false && item.popular === true;
    });

    // If fewer than 4 popular items, supplement with other available items
    if (popularItems.length < 4) {
      var remaining = menu.filter(function(item) {
        return item.available !== false && !popularItems.some(function(p) { return p.id === item.id; });
      });
      popularItems = popularItems.concat(remaining.slice(0, 4 - popularItems.length));
    }

    // Limit to 6 cards max
    popularItems = popularItems.slice(0, 6);

    // If completely empty, provide solid fallback items
    if (popularItems.length === 0) {
      popularItems = [
        {
          id: 1,
          name: "Veg Paneer Burger",
          category: "Snacks",
          price: 60,
          description: "Juicy grilled paneer patty topped with fresh lettuce, onions, and tandoori mayo in a toasted bun.",
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"
        },
        {
          id: 2,
          name: "Margherita Pizza",
          category: "Snacks",
          price: 120,
          description: "Stone-baked hand-tossed crust with rich tomato passata and molten mozzarella.",
          image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80"
        },
        {
          id: 4,
          name: "Crispy Masala Dosa",
          category: "Breakfast",
          price: 55,
          description: "Thin crispy golden crepe filled with spiced potato masala, served with coconut chutney and sambar.",
          image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80"
        },
        {
          id: 6,
          name: "Paneer Kathi Roll",
          category: "Snacks",
          price: 70,
          description: "Spiced marinated paneer cubes rolled in a warm flaky paratha with mint mayonnaise.",
          image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80"
        }
      ];
    }

    var user = getSessionUser();
    var orderTarget = (user && user.role === 'student') ? 'pages/student.html' : 'pages/login.html?role=student';
    var buttonText = (user && user.role === 'student') ? 'Order in App' : 'Order Now';

    var flameIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>';
    var arrowIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

    var cardsHTML = popularItems.map(function(item) {
      var imgUrl = item.image || 'assets/images/food/fallback.svg';

      return `
        <article class="hp-food-card hp-reveal">
          <div class="hp-food-img-wrap">
            <img 
              src="${escapeHTML(imgUrl)}" 
              alt="${escapeHTML(item.name)}" 
              class="hp-food-img" 
              loading="lazy" 
              width="400" 
              height="300"
              onerror="this.onerror=null; this.src='assets/images/food/fallback.svg';"
            >
            <div class="hp-food-popular-badge">
              ${flameIcon} Popular
            </div>
          </div>
          <div class="hp-food-body">
            <span class="hp-food-category">${escapeHTML(item.category || 'Special')}</span>
            <h3 class="hp-food-title">${escapeHTML(item.name)}</h3>
            <p class="hp-food-desc">${escapeHTML(item.description || 'Prepared fresh on order with quality ingredients.')}</p>
            <div class="hp-food-footer">
              <span class="hp-food-price">₹${Number(item.price || 0)}</span>
              <a href="${orderTarget}" class="hp-btn hp-btn-primary hp-btn-sm" aria-label="Order ${escapeHTML(item.name)}">
                <span>${buttonText}</span>
                ${arrowIcon}
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    container.innerHTML = cardsHTML;
  }

  // ==========================================
  // 4. SESSION & CTA ADAPTATION
  // ==========================================

  function adaptCTAsForSession() {
    var user = getSessionUser();
    if (!user) return; // Keep default login targets

    var targetUrl = getDashboardUrl(user.role);
    var roleTitle = user.role.charAt(0).toUpperCase() + user.role.slice(1);

    // Update Nav Login Button
    var navLoginBtn = document.getElementById('hpNavLoginBtn');
    if (navLoginBtn) {
      navLoginBtn.href = targetUrl;
      navLoginBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
        <span>${escapeHTML(user.name ? user.name.split(' ')[0] : roleTitle)} (${roleTitle})</span>
      `;
    }

    // Update Hero Primary CTA
    var heroPrimaryCTA = document.getElementById('hpHeroPrimaryCTA');
    if (heroPrimaryCTA) {
      heroPrimaryCTA.href = targetUrl;
      heroPrimaryCTA.innerHTML = `
        <span>Go to ${roleTitle} Dashboard</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      `;
    }

    // Update View Full Menu button
    var viewFullMenuBtn = document.getElementById('hpViewFullMenuBtn');
    if (viewFullMenuBtn) {
      if (user.role === 'student') {
        viewFullMenuBtn.href = 'pages/student.html';
        viewFullMenuBtn.textContent = 'Open Full Student Menu';
      }
    }
  }

  // ==========================================
  // 5. SCROLL REVEAL ANIMATIONS
  // ==========================================

  function initScrollReveal() {
    var reveals = document.querySelectorAll('.hp-reveal');
    if (!('IntersectionObserver' in window)) {
      // Fallback: reveal all immediately if IntersectionObserver is unsupported
      reveals.forEach(function(el) {
        el.classList.add('hp-revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('hp-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    reveals.forEach(function(el) {
      observer.observe(el);
    });
  }

  // ==========================================
// 6. INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', async function() {

    const result = await loadMenuData();

    if (!result.ok) {
        console.error("Homepage could not load menu data.");
        return;
    }

    initNavbar();
    renderPopularFood();
    adaptCTAsForSession();
    initScrollReveal();

});

})();

