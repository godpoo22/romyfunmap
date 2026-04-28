(function () {
  function loadSiteHeader() {
    var container = document.getElementById('site-header-container');
    if (!container) return;

    var active = container.getAttribute('data-active') || 'home';

    var CITY_SLUGS = [
      'newtaipei', 'taoyuan', 'taipei',
      'miaoli', 'taichung', 'changhua', 'nantou',
      'chiayi-city', 'chiayi-county', 'tainan', 'kaohsiung', 'pingtung'
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

    var hamBtn   = document.getElementById('ham-btn');
    var overlay  = document.getElementById('drawer-overlay');
    var drawer   = document.getElementById('site-drawer');
    var closeBtn = document.getElementById('drawer-close');

    function openDrawer()  { drawer.classList.add('open');    overlay.classList.add('show');    document.body.classList.add('drawer-open');    }
    function closeDrawer() { drawer.classList.remove('open'); overlay.classList.remove('show'); document.body.classList.remove('drawer-open'); }

    hamBtn.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);
    closeBtn.addEventListener('click', closeDrawer);

    var slot = document.getElementById('drawer-filter-slot');
    if (!slot) return;

    /* ── accordion ──────────────────────────── */
    function makeAccordion(filterEl) {
      filterEl.querySelectorAll('.filter-row').forEach(function (row) {
        var labelEl = row.querySelector('.filter-label');
        if (!labelEl) return;
        var btnsWrap = document.createElement('div');
        btnsWrap.className = 'filter-row-btns';
        Array.prototype.slice.call(row.childNodes).forEach(function (n) {
          if (n !== labelEl) btnsWrap.appendChild(n);
        });
        var head = document.createElement('div');
        head.className = 'filter-row-head';
        var toggleIcon = document.createElement('span');
        toggleIcon.className = 'filter-row-toggle';
        toggleIcon.textContent = '−';
        head.appendChild(labelEl);
        head.appendChild(toggleIcon);
        row.innerHTML = '';
        row.appendChild(head);
        row.appendChild(btnsWrap);
        row.classList.add('collapsible');
        head.addEventListener('click', function () {
          var collapsed = row.classList.toggle('collapsed');
          toggleIcon.textContent = collapsed ? '+' : '−';
        });
      });
    }

    /* ── 篩選摘要 ──────────────────────────── */
    function buildFilterSummary(filterEl) {
      var summary = document.createElement('div');
      summary.id = 'drawer-filter-summary';
      summary.style.cssText =
        'display:none;margin:8px 0 4px;padding:8px 10px;' +
        'background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);' +
        'border-radius:10px;font-size:12px;color:#065f46;line-height:1.8;';
      var summaryTitle = document.createElement('div');
      summaryTitle.style.cssText = 'font-weight:700;margin-bottom:2px;font-size:11px;letter-spacing:0.03em;';
      summaryTitle.textContent = '目前篩選條件';
      summary.appendChild(summaryTitle);
      var summaryBody = document.createElement('div');
      summaryBody.id = 'drawer-filter-summary-body';
      summaryBody.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;';
      summary.appendChild(summaryBody);
      filterEl.parentNode.insertBefore(summary, filterEl);
      function updateSummary() {
        var activeBtns = Array.prototype.slice.call(
          filterEl.querySelectorAll('button.active')
        ).filter(function(b) {
          return !b.classList.contains('reset-btn') && b.id !== 'reset-btn' && b.id !== 'filter-reset';
        });
        summaryBody.innerHTML = '';
        if (activeBtns.length === 0) { summary.style.display = 'none'; return; }
        activeBtns.forEach(function(b) {
          var chip = document.createElement('span');
          chip.style.cssText =
            'display:inline-block;background:rgba(16,185,129,0.15);' +
            'border-radius:20px;padding:2px 8px;font-size:11px;font-weight:600;';
          chip.textContent = b.textContent.trim();
          summaryBody.appendChild(chip);
        });
        summary.style.display = 'block';
      }
      filterEl.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') setTimeout(updateSummary, 0);
      });
      setTimeout(updateSummary, 250);
    }

    /* ── 全台篩選頁 ──────────────────────── */
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
      buildFilterSummary(globalFilter);
      return;
    }

    /* ── 縣市列表頁 ──────────────────────── */
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
      buildFilterSummary(cityFilter);
      return;
    }

    /* ── 首頁快速篩選 Widget ─────────────── */
    var hwWidget = buildHwWidget();
    if (hwWidget) {
      var label3 = document.createElement('p');
      label3.className = 'drawer-filter-label';
      label3.textContent = '快速篩選';
      slot.appendChild(label3);
      slot.appendChild(hwWidget);
    }
  }

  /* ═══════════════════════════════════════════
     buildHwWidget：動態建立篩選 widget 並注入 drawer
     ═══════════════════════════════════════════ */
  function buildHwWidget() {
    var hc = document.getElementById('site-header-container');
    if (!hc || hc.getAttribute('data-active') !== 'home') return null;

    var CITIES = ['台北市','新北市','桃園市','台中市','苗栗縣','南投縣','彰化縣','台南市','高雄市','屏東縣','嘉義市','嘉義縣'];

    function cityBtns() {
      return CITIES.map(function(c) {
        return '<button class="hw-city-btn" data-city="' + c + '">' + c + '</button>';
      }).join('');
    }
    function tb(icon, tag) {
      return '<button class="hw-tag-btn" data-tag="' + tag + '">' + icon + ' ' + tag + '</button>';
    }
    function row(lbl, btns) {
      return '<div class="hw-row"><span class="hw-label">' + lbl + '</span><div class="hw-btns">' + btns + '</div></div>';
    }

    var attTags =
      tb('🛝','公園遊具') + tb('🐄','動物農場') + tb('🏛️','展館') +
      tb('🐟','水族館')   + tb('🎡','主題樂園') + tb('🌿','自然生態') +
      tb('🚂','鐵道交通') + tb('🏮','老街文化');

    var restTags =
      tb('🧸','親子餐廳') + tb('🌄','景觀餐廳') + tb('☕','咖啡廳') +
      tb('🐄','農場用餐') + tb('🍱','兒童餐點');

    var restFac  = tb('🎠','兒童遊戲區') + tb('🎉','可包場');

    var evtTags =
      tb('🖼️','展覽特展') + tb('🎨','手作體驗') + tb('🌿','生態自然') +
      tb('🎭','演出劇場') + tb('🎊','節慶活動') + tb('🏛️','展館活動') + tb('🧭','戶外探索');

    var spaceTags = tb('🏠','室內') + tb('☀️','戶外');
    var costTags  = tb('✅','免費') + tb('💳','付費');
    var restCost  = tb('💳','有低消') + tb('✅','無低消');

    var html =
      '<div class="hw-widget" id="hw-widget-drawer">' +
        '<div class="hw-tabs">' +
          '<button class="hw-tab active" data-target="att">🗺️ 景點</button>' +
          '<button class="hw-tab" data-target="rest">🍽️ 餐廳</button>' +
          '<button class="hw-tab" data-target="evt">🎉 活動</button>' +
        '</div>' +
        '<div class="hw-panel" id="hw-p-att">' +
          row('縣市', cityBtns()) +
          row('類型', attTags) +
          row('空間', spaceTags) +
          row('費用', costTags) +
        '</div>' +
        '<div class="hw-panel hidden" id="hw-p-rest">' +
          row('縣市', cityBtns()) +
          row('類型', restTags) +
          row('設施', restFac) +
          row('空間', spaceTags) +
          row('費用', restCost) +
        '</div>' +
        '<div class="hw-panel hidden" id="hw-p-evt">' +
          row('縣市', cityBtns()) +
          row('類型', evtTags) +
          row('費用', costTags) +
        '</div>' +
        '<div class="hw-submit-row">' +
          '<button class="hw-submit-btn" id="hw-submit-drawer">送出篩選 →</button>' +
        '</div>' +
      '</div>';

    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    var widget = wrap.firstChild;

    var DEST_MAP = { att: 'attractions', rest: 'restaurants', evt: 'events' };

    /* 分頁切換 */
    widget.querySelectorAll('.hw-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        widget.querySelectorAll('.hw-tab').forEach(function(t) { t.classList.remove('active'); });
        widget.querySelectorAll('.hw-panel').forEach(function(p) { p.classList.add('hidden'); });
        tab.classList.add('active');
        widget.querySelector('#hw-p-' + tab.dataset.target).classList.remove('hidden');
      });
    });

    /* 單選按鈕（row 內互斥） */
    widget.querySelectorAll('.hw-row').forEach(function(rowEl) {
      var btns = Array.prototype.slice.call(rowEl.querySelectorAll('.hw-city-btn, .hw-tag-btn'));
      btns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var wasActive = btn.classList.contains('active');
          btns.forEach(function(b) { b.classList.remove('active'); });
          if (!wasActive) btn.classList.add('active');
        });
      });
    });

    /* 送出 → 跳轉篩選頁 */
    widget.querySelector('#hw-submit-drawer').addEventListener('click', function() {
      var activeTab = widget.querySelector('.hw-tab.active');
      var key  = activeTab.dataset.target;
      var dest = DEST_MAP[key];
      var panel = widget.querySelector('#hw-p-' + key);
      var cityBtn = panel.querySelector('.hw-city-btn.active');
      var cities = cityBtn ? [cityBtn.dataset.city] : [];
      var tags = [];
      panel.querySelectorAll('.hw-tag-btn.active').forEach(function(btn) { tags.push(btn.dataset.tag); });
      var url = '/' + dest + '/';
      var qs = [];
      if (cities.length) qs.push('cities=' + encodeURIComponent(cities[0]));
      if (tags.length)   qs.push('tags='   + encodeURIComponent(tags.join(',')));
      if (qs.length) url += '?' + qs.join('&');
      window.location.href = url;
    });

    return widget;
  }

  document.addEventListener('DOMContentLoaded', loadSiteHeader);
})();
