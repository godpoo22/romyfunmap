/**
 * global-filter.js — 全台景點 / 餐廳 / 活動篩選頁
 * 所有篩選群組（縣市、類型、空間、費用）皆為單選，再點同一個取消
 */
(function () {
  const cards   = document.querySelectorAll('.att-card');
  const countEl = document.getElementById('result-count');
  const emptyMsg = document.getElementById('empty-msg');

  /* ── 篩選邏輯 ─────────────────────────────────────────────── */
  function applyFilter() {
    // 直接從 DOM 讀取目前選中的值
    const cityBtn  = document.querySelector('.city-btn.active');
    const activeCity = cityBtn ? cityBtn.dataset.city : null;

    const activeTags = Array.from(
      document.querySelectorAll('.tag-btn[data-tag].active')
    ).map(b => b.dataset.tag);

    let visible = 0;
    cards.forEach(card => {
      const cityMatch = !activeCity || card.dataset.city === activeCity;
      const tags = JSON.parse(card.dataset.tags.replace(/&quot;/g, '"'));
      const tagMatch = activeTags.length === 0 || activeTags.every(t => tags.includes(t));
      const show = cityMatch && tagMatch;
      card.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    if (countEl) countEl.textContent = visible;
    if (emptyMsg) emptyMsg.classList.toggle('show', visible === 0);
  }

  /* ── 統一點擊處理：每個 filter-row 內單選 ─────────────────── */
  document.querySelectorAll('.filter-row').forEach(row => {
    // 找出這一列所有可篩選的按鈕（排除清除篩選按鈕）
    const btns = Array.from(row.querySelectorAll('button[data-city], button[data-tag]'));
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const wasActive = btn.classList.contains('active');
        // 清除同列所有按鈕
        btns.forEach(b => b.classList.remove('active'));
        // 原本未選 → 選上；原本已選 → 取消（已清除）
        if (!wasActive) btn.classList.add('active');
        applyFilter();
      });
    });
  });

  /* ── 清除篩選 ──────────────────────────────────────────────── */
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.city-btn, .tag-btn[data-tag]')
        .forEach(b => b.classList.remove('active'));
      applyFilter();
    });
  }

  applyFilter();

  /* ── URL params（從首頁帶入篩選條件）─────────────────────── */
  (function () {
    const params = new URLSearchParams(window.location.search);
    let changed = false;
    if (params.has('cities')) {
      // 單選：只取第一個
      const city = params.get('cities').split(',')[0].trim();
      const btn = document.querySelector(`.city-btn[data-city="${city}"]`);
      if (btn) { btn.classList.add('active'); changed = true; }
    }
    if (params.has('tags')) {
      params.get('tags').split(',').forEach(tag => {
        tag = tag.trim();
        const btn = document.querySelector(`.tag-btn[data-tag="${tag}"]`);
        if (btn) { btn.classList.add('active'); changed = true; }
      });
    }
    if (changed) applyFilter();
  })();

  /* ── 進入頁面顯示提示橫幅 ─────────────────────────────────── */
  (function () {
    const hint = document.createElement('div');
    hint.id = 'filter-hint-bar';
    hint.style.cssText = [
      'display:flex','align-items:center','justify-content:space-between',
      'gap:10px','background:rgba(255,255,255,0.88)',
      'backdrop-filter:blur(10px)','-webkit-backdrop-filter:blur(10px)',
      'border:1px solid rgba(255,255,255,0.9)',
      'border-radius:12px','padding:10px 14px',
      'margin:8px 16px 0','font-size:13px','color:#374151',
      'box-shadow:0 2px 8px rgba(0,0,0,0.06)'
    ].join(';');
    hint.innerHTML =
      '<span>如需修改篩選條件，請點左上角 <strong>☰</strong> 開啟選單</span>' +
      '<button onclick="this.parentElement.remove()" style="background:none;border:none;' +
      'font-size:18px;color:#9CA3AF;cursor:pointer;padding:0 2px;line-height:1;flex-shrink:0">✕</button>';
    const resultBar = document.querySelector('.result-bar');
    if (resultBar && resultBar.parentNode) {
      resultBar.parentNode.insertBefore(hint, resultBar);
    }
  })();
})();
