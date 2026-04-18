/* =========================================
   羅米親子玩樂地圖 - 全站共用頁尾（行動優先精簡版）
   ========================================= */
(function () {
  var CONTACT_EMAIL = 'romyfunmap@gmail.com';

  function loadSiteFooter() {
    var container = document.getElementById('site-footer-container');
    if (!container) return;

    var year = new Date().getFullYear();

    var footerHTML =
      '<footer class="site-footer-main">' +
      '  <div class="footer-inner">' +
      '    <nav class="footer-legal">' +
      '      <a href="/about.html">關於我們</a>' +
      '      <span class="footer-sep">·</span>' +
      '      <a href="/contact.html">聯絡我們</a>' +
      '      <span class="footer-sep">·</span>' +
      '      <a href="/privacy-policy.html">隱私權政策</a>' +
      '    </nav>' +
      '    <div class="footer-mail">' +
      '      <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>' +
      '    </div>' +
      '    <div class="footer-copy">© ' + year + ' 羅米親子玩樂地圖</div>' +
      '  </div>' +
      '</footer>';

    container.innerHTML = footerHTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSiteFooter);
  } else {
    loadSiteFooter();
  }
})();
