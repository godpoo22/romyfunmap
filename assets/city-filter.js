/**
 * city-filter.js
 * 縣市列表頁篩選邏輯（地區 + 空間 + 設施標籤）
 * 用法：HTML 頁面引入此檔案即可，不需額外設定
 *
 * 依賴：
 *   - article.modern-card[data-district][data-space][data-tags] — 卡片元素
 *   - .dist-btn[data-district]   — 地區按鈕（單選）
 *   - .space-btn[data-space]     — 空間按鈕（單選）
 *   - .tag-btn[data-tag]         — 設施標籤按鈕（多選 AND）
 *   - #filter-reset              — 清除篩選
 *   - #filter-count              — 計數列容器
 *   - #visible-count             — 顯示數量的 <strong>
 */
(function () {
  var activeDist  = null;
  var activeSpace = null;
  var activeTags  = [];   // AND 邏輯，多選

  var cards    = document.querySelectorAll('article.modern-card');
  var countBar = document.getElementById('filter-count');
  var countEl  = document.getElementById('visible-count');

  function applyFilter() {
    var visible = 0;
    cards.forEach(function (c) {
      var distMatch  = !activeDist  || c.dataset.district === activeDist;
      var spaceMatch = !activeSpace || c.dataset.space    === activeSpace;

      var tagMatch = true;
      if (activeTags.length > 0) {
        var raw = c.dataset.tags || '[]';
        var cardTags = [];
        try { cardTags = JSON.parse(raw.replace(/&quot;/g, '"')); } catch (e) {}
        tagMatch = activeTags.every(function (t) { return cardTags.indexOf(t) !== -1; });
      }

      var show = distMatch && spaceMatch && tagMatch;
      c.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    var isFiltering = activeDist || activeSpace || activeTags.length > 0;
    if (countBar) countBar.style.display = isFiltering ? 'block' : 'none';
    if (countEl)  countEl.textContent = visible;
  }

  // 地區按鈕（單選，再點取消）
  document.querySelectorAll('.dist-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (activeDist === btn.dataset.district) {
        activeDist = null;
        btn.classList.remove('active');
      } else {
        document.querySelectorAll('.dist-btn').forEach(function (b) { b.classList.remove('active'); });
        activeDist = btn.dataset.district;
        btn.classList.add('active');
      }
      applyFilter();
    });
  });

  // 空間按鈕（單選，再點取消）
  document.querySelectorAll('.space-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (activeSpace === btn.dataset.space) {
        activeSpace = null;
        btn.classList.remove('active');
      } else {
        document.querySelectorAll('.space-btn').forEach(function (b) { b.classList.remove('active'); });
        activeSpace = btn.dataset.space;
        btn.classList.add('active');
      }
      applyFilter();
    });
  });

  // 設施標籤按鈕（多選 AND，再點取消）
  document.querySelectorAll('.tag-btn[data-tag]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tag = btn.dataset.tag;
      var idx = activeTags.indexOf(tag);
      if (idx !== -1) {
        activeTags.splice(idx, 1);
        btn.classList.remove('active');
      } else {
        activeTags.push(tag);
        btn.classList.add('active');
      }
      applyFilter();
    });
  });

  // 清除篩選（同時清除地區、空間、標籤）
  var resetBtn = document.getElementById('filter-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      activeDist  = null;
      activeSpace = null;
      activeTags  = [];
      document.querySelectorAll('.f-btn.active').forEach(function (b) { b.classList.remove('active'); });
      applyFilter();
    });
  }

  applyFilter();
})();
