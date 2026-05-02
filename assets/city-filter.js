/**
 * city-filter.js
 * 縣市列表頁篩選 — 景點 / 餐廳 / 活動
 * 所有篩選列皆為單選，再點同一個取消
 *
 * 依賴：
 *   - article.modern-card[data-district?][data-tags?]
 *   - .dist-btn[data-district]   — 地區（單選）
 *   - .tag-btn[data-tag]         — 類型 / 空間 / 費用 / 設施（各列單選）
 *   - #filter-reset              — 清除篩選
 *   - #filter-count / #visible-count
 */
(function () {
  var cards    = document.querySelectorAll('article.modern-card');
  var countBar = document.getElementById('filter-count');
  var countEl  = document.getElementById('visible-count');

  function getCardDistrict(card) {
    if (card.dataset.district) return card.dataset.district;

    var tag = card.querySelector('.district-tag');
    if (!tag) return '';

    var text = tag.textContent.trim();
    if (!text) return '';
    if (/^(室內|戶外|免費|有低消|無低消)$/.test(text)) return '';
    return text;
  }

  /* ── 篩選邏輯（直接從 DOM 讀取狀態）─────────────────────── */
  function applyFilter() {
    var distBtn = document.querySelector('.dist-btn.active');
    var activeDist = distBtn ? distBtn.dataset.district : null;

    // 收集所有已選的 tag-btn（類型/空間/費用/設施）
    var activeTags = Array.from(
      document.querySelectorAll('.tag-btn[data-tag].active')
    ).map(function (b) { return b.dataset.tag; });

    var visible = 0;
    cards.forEach(function (c) {
      // 地區比對
      var distMatch = !activeDist || getCardDistrict(c) === activeDist;

      // Tag 比對（AND 邏輯，每列最多選一個，所以實際是各維度單選）
      var tagMatch = true;
      if (activeTags.length > 0) {
        var raw = c.dataset.tags || '[]';
        var cardTags = [];
        try { cardTags = JSON.parse(raw.replace(/&quot;/g, '"')); } catch (e) {}
        tagMatch = activeTags.every(function (t) {
          return cardTags.indexOf(t) !== -1;
        });
      }

      var show = distMatch && tagMatch;
      c.classList.toggle('hidden', !show);
      if (show) visible++;
    });

    var isFiltering = activeDist || activeTags.length > 0;
    if (countBar) countBar.style.display = isFiltering ? 'block' : 'none';
    if (countEl)  countEl.textContent = visible;
  }

  /* ── 統一點擊處理：每個 filter-row 內單選 ──────────────── */
  document.querySelectorAll('#filter-bar .filter-row').forEach(function (row) {
    var btns = Array.from(row.querySelectorAll(
      '.dist-btn[data-district], .tag-btn[data-tag]'
    ));
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var wasActive = btn.classList.contains('active');
        btns.forEach(function (b) { b.classList.remove('active'); });
        if (!wasActive) btn.classList.add('active');
        applyFilter();
      });
    });
  });

  /* ── 清除篩選 ───────────────────────────────────────────── */
  var resetBtn = document.getElementById('filter-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      document.querySelectorAll('#filter-bar .dist-btn, #filter-bar .tag-btn')
        .forEach(function (b) { b.classList.remove('active'); });
      applyFilter();
    });
  }

  applyFilter();

  /* ── 進入頁面顯示提示橫幅 ─────────────────────────────────── */
  (function () {
    var hint = document.createElement('div');
    hint.id = 'filter-hint-bar';
    hint.style.cssText = [
      'display:flex','align-items:center','justify-content:space-between',
      'gap:10px','background:rgba(16,185,129,0.12)',
      'border:1.5px solid rgba(16,185,129,0.35)',
      'border-radius:14px','padding:10px 14px',
      'margin:8px 16px 0','font-size:13.5px',
      'font-weight:600','color:#065f46',
      'box-shadow:0 2px 8px rgba(16,185,129,0.1)'
    ].join(';');
    hint.innerHTML =
      '<span>☰ 點左上角選單，可依地區、類型、費用篩選</span>' +
      '<button onclick="this.parentElement.remove()" style="background:none;border:none;' +
      'font-size:18px;color:#111827;cursor:pointer;padding:0 2px;line-height:1;flex-shrink:0">✕</button>';

    var grid = document.getElementById('listing-grid');
    if (grid) {
      grid.parentNode.insertBefore(hint, grid);
    }
  })();
})();
