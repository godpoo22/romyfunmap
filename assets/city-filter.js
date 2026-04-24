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
      var distMatch = !activeDist || c.dataset.district === activeDist;

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
})();
