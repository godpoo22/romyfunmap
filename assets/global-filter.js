/**
 * global-filter.js
 * 全台景點 / 全台餐廳篩選頁共用邏輯
 * 用法：HTML 頁面引入此檔案即可，不需額外設定
 *
 * 依賴：
 *   - .att-card[data-city][data-tags]  — 卡片元素
 *   - .city-btn[data-city]             — 縣市按鈕（OR 邏輯）
 *   - [data-tag]                       — 標籤按鈕（AND 邏輯）
 *   - #reset-btn                       — 清除篩選
 *   - #result-count                    — 顯示結果數量的 <strong>
 *   - #empty-msg                       — 無結果時顯示的訊息
 */
(function () {
  const activeCities = new Set();
  const activeTags   = new Set();

  const cards      = document.querySelectorAll('.att-card');
  const countEl    = document.getElementById('result-count');
  const emptyMsg   = document.getElementById('empty-msg');

  function applyFilter() {
    let visible = 0;
    cards.forEach(card => {
      const tags = JSON.parse(card.dataset.tags.replace(/&quot;/g, '"'));
      const cityMatch = activeCities.size === 0 || activeCities.has(card.dataset.city);
      const tagMatch  = activeTags.size === 0   || [...activeTags].every(t => tags.includes(t));
      const show = cityMatch && tagMatch;
      card.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    if (countEl) countEl.textContent = visible;
    if (emptyMsg) emptyMsg.classList.toggle('show', visible === 0);
  }

  // 縣市按鈕（多選 OR）
  document.querySelectorAll('.city-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const city = btn.dataset.city;
      if (activeCities.has(city)) {
        activeCities.delete(city);
        btn.classList.remove('active');
      } else {
        activeCities.add(city);
        btn.classList.add('active');
      }
      applyFilter();
    });
  });

  // 標籤按鈕（多選 AND）
  document.querySelectorAll('.tag-btn[data-tag]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      if (activeTags.has(tag)) {
        activeTags.delete(tag);
        btn.classList.remove('active');
      } else {
        activeTags.add(tag);
        btn.classList.add('active');
      }
      applyFilter();
    });
  });

  // 清除篩選
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeCities.clear();
      activeTags.clear();
      document.querySelectorAll('.city-btn, .tag-btn[data-tag]')
        .forEach(b => b.classList.remove('active'));
      applyFilter();
    });
  }

  applyFilter();

  // ── 讀取首頁送出的 URL params，直接套用篩選 ──────────────
  (function () {
    var params = new URLSearchParams(window.location.search);

    if (params.has('cities')) {
      params.get('cities').split(',').forEach(function (city) {
        city = city.trim();
        var btn = document.querySelector('.city-btn[data-city="' + city + '"]');
        if (btn) { activeCities.add(city); btn.classList.add('active'); }
      });
    }
    if (params.has('tags')) {
      params.get('tags').split(',').forEach(function (tag) {
        tag = tag.trim();
        var btn = document.querySelector('.tag-btn[data-tag="' + tag + '"]');
        if (btn) { activeTags.add(tag); btn.classList.add('active'); }
      });
    }
    if (params.has('cities') || params.has('tags')) applyFilter();
  })();

  // ── 進入頁面就顯示提示橫幅（可點 ✕ 關閉）──────────────
  (function () {
    var hint = document.createElement('div');
    hint.id = 'filter-hint-bar';
    hint.style.cssText = [
      'display:flex', 'align-items:center', 'justify-content:space-between',
      'gap:10px', 'background:rgba(255,255,255,0.88)',
      'backdrop-filter:blur(10px)', '-webkit-backdrop-filter:blur(10px)',
      'border:1px solid rgba(255,255,255,0.9)',
      'border-radius:12px', 'padding:10px 14px',
      'margin:8px 16px 0', 'font-size:13px', 'color:#374151',
      'box-shadow:0 2px 8px rgba(0,0,0,0.06)'
    ].join(';');
    hint.innerHTML =
      '<span>如需修改篩選條件，請點左上角 <strong>☰</strong> 開啟選單</span>' +
      '<button onclick="this.parentElement.remove()" style="' +
        'background:none;border:none;font-size:18px;color:#9CA3AF;' +
        'cursor:pointer;padding:0 2px;line-height:1;flex-shrink:0' +
      '">✕</button>';

    var resultBar = document.querySelector('.result-bar');
    if (resultBar && resultBar.parentNode) {
      resultBar.parentNode.insertBefore(hint, resultBar);
    }
  })();
})();
