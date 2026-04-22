(function () {
  function loadSiteHeader() {
    var container = document.getElementById('site-header-container');
    if (!container) return;

    var active = container.getAttribute('data-active') || 'home';

    var CITY_SLUGS = [
      'newtaipei', 'taoyuan', 'taipei',
      'miaoli', 'taichung', 'changhua', 'nantou',
      'tainan', 'kaohsiung'
    ];

    var firstSegment = (window.location.pathname.split('/').filter(Boolean)[0] || '').toLowerCase();
    var currentCity = CITY_SLUGS.indexOf(firstSegment) !== -1 ? firstSegment : null;

    var attractionsHref = currentCity ? '/' + currentCity + '/family-attractions/' : '/attractions/';
    var restaurantsHref = currentCity ? '/' + currentCity + '/family-restaurants/' : '/restaurants/';
    var eventsHref      = currentCity ? '/' + currentCity + '/family-events/'      : '/events/';

    function isCurrent(page) { return active === page ? 'current' : ''; }

    container.innerHTML = [
      '<header class="site-header">',
      '  <div class="container header-inner">',
      '    <button class="ham-btn" id="ham-btn" aria-label="開啟選單">',
      '      <span></span><span></span><span></span>',
      '    </button>',
      '    <a class="brand" href="/">',
      '      <span class="brand-logo">🎒</span>',
      '      <span class="brand-title">羅米親子玩樂地圖</span>',
      '    </a>',
      '    <div class="header-spacer"></div>',
      '  </div>',
      '</header>',

      '<div class="drawer-overlay" id="drawer-overlay"></div>',

      '<aside class="site-drawer" id="site-drawer">',
      '  <div class="drawer-top">',
      '    <span class="drawer-brand">🎒 羅米親子玩樂地圖</span>',
      '    <button class="drawer-close" id="drawer-close" aria-label="關閉選單">✕</button>',
      '  </div>',
      '  <nav class="drawer-nav">',
      '    <a class="drawer-nav-link ' + isCurrent('home')        + '" href="/">🏠 首頁</a>',
      '    <a class="drawer-nav-link ' + isCurrent('attractions') + '" href="' + attractionsHref + '">🗺️ 景點</a>',
      '    <a class="drawer-nav-link ' + isCurrent('restaurants') + '" href="' + restaurantsHref + '">🍽️ 餐廳</a>',
      '    <a class="drawer-nav-link ' + isCurrent('events')      + '" href="' + eventsHref      + '">🎉 活動</a>',
      '  </nav>',
      '  <div class="drawer-sep"></div>',
      '  <div class="drawer-filter-slot" id="drawer-filter-slot"></div>',
      '</aside>'
    ].join('\n');

    /* ── 開關邏輯 ─────────────────────────────── */
    var hamBtn  = document.getElementById('ham-btn');
    var overlay = document.getElementById('drawer-overlay');
    var drawer  = document.getElementById('site-drawer');
    var closeBtn = document.getElementById('drawer-close');

    function openDrawer()  { drawer.classList.add('open');    overlay.classList.add('show');    document.body.classList.add('drawer-open');    }
    function closeDrawer() { drawer.classList.remove('open'); overlay.classList.remove('show'); document.body.classList.remove('drawer-open'); }

    hamBtn.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);
    closeBtn.addEventListener('click', closeDrawer);

    /* ── 把頁面篩選器搬進 drawer ──────────────── */
    var slot = document.getElementById('drawer-filter-slot');
    if (!slot) return;

    /* 把每個 .filter-row 改成可收放的 accordion 項目 */
    function makeAccordion(filterEl) {
      filterEl.querySelectorAll('.filter-row').forEach(function (row) {
        var labelEl = row.querySelector('.filter-label');
        if (!labelEl) return;

        // 把 label 以外的所有節點包進 .filter-row-btns
        var btnsWrap = document.createElement('div');
        btnsWrap.className = 'filter-row-btns';
        // 先複製 childNodes（live list 所以要先轉陣列）
        var kids = Array.prototype.slice.call(row.childNodes);
        kids.forEach(function (n) {
          if (n !== labelEl) btnsWrap.appendChild(n);
        });

        // 建立標題列（label + 收放符號）
        var head = document.createElement('div');
        head.className = 'filter-row-head';
        var toggleIcon = document.createElement('span');
        toggleIcon.className = 'filter-row-toggle';
        toggleIcon.textContent = '−';
        head.appendChild(labelEl);
        head.appendChild(toggleIcon);

        // 重組 row（預設收起）
        row.innerHTML = '';
        row.appendChild(head);
        row.appendChild(btnsWrap);
        row.classList.add('collapsible', 'collapsed');
        toggleIcon.textContent = '+';

        // 點擊標題列收放
        head.addEventListener('click', function () {
          var collapsed = row.classList.toggle('collapsed');
          toggleIcon.textContent = collapsed ? '+' : '−';
        });
      });
    }

    // 全台篩選頁 (.filter-section)
    var globalFilter = document.querySelector('.filter-section');
    if (globalFilter) {
      globalFilter.style.cssText =
        'position:static;background:transparent;backdrop-filter:none;' +
        '-webkit-backdrop-filter:none;border-bottom:none;padding:0;';
      var label = document.createElement('p');
      label.className = 'drawer-filter-label';
      label.textContent = '篩選條件';
      slot.appendChild(label);
      slot.appendChild(globalFilter);
      makeAccordion(globalFilter);
      return;
    }

    // 縣市景點/餐廳頁 (#filter-bar)
    var cityFilter = document.getElementById('filter-bar');
    if (cityFilter) {
      cityFilter.style.cssText =
        'background:transparent;border:none;border-radius:0;padding:0;box-shadow:none;';
      var label2 = document.createElement('p');
      label2.className = 'drawer-filter-label';
      label2.textContent = '篩選條件';
      slot.appendChild(label2);
      slot.appendChild(cityFilter);
      makeAccordion(cityFilter);
    }
  }

  document.addEventListener('DOMContentLoaded', loadSiteHeader);
})();
