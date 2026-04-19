function loadSiteHeader() {
  const container = document.getElementById('site-header-container');
  if (!container) return;

  const active = container.getAttribute('data-active') || 'home';

  // 已建置的縣市 slug —— 新增縣市時在這個陣列加一行即可
  const CITY_SLUGS = [
    'newtaipei', 'taoyuan', 'taipei',
    'miaoli', 'taichung', 'changhua', 'nantou',
    'tainan', 'kaohsiung'
  ];

  // 偵測目前 URL 第一層路徑，判斷是否位於某個縣市範圍內
  const firstSegment = (window.location.pathname.split('/').filter(Boolean)[0] || '').toLowerCase();
  const currentCity = CITY_SLUGS.indexOf(firstSegment) !== -1 ? firstSegment : null;

  // 依目前縣市決定導覽連結：在縣市頁面下指向該縣市分類；否則用全站預設
  const attractionsHref = currentCity
    ? '/' + currentCity + '/family-attractions/'
    : '/attractions/';
  const restaurantsHref = currentCity
    ? '/' + currentCity + '/family-restaurants/'
    : '/restaurants/';
  const eventsHref = currentCity
    ? '/' + currentCity + '/family-events/'
    : '/events/';

  const getActiveStyle = (menu) => {
    if (active !== menu) return '';
    if (menu === 'attractions') return 'style="background:#E6FFFA; color:#0D9488;"';
    if (menu === 'restaurants') return 'style="background:#FFF7ED; color:#EA580C;"';
    if (menu === 'events') return 'style="background:#EEF2FF; color:#4F46E5;"';
    return 'style="background:#F1F5F9; color:#334155;"';
  };

  const getActiveClass = (menu) => (active === menu ? 'active' : '');

  const headerHTML = `
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="/">
          <span class="brand-logo">🎒</span>
          <span class="brand-title" style="color:#14B8A6; text-decoration:none;">羅米親子玩樂地圖</span>
        </a>
        <nav class="top-links">
          <a class="top-link ${getActiveClass('attractions')}" href="${attractionsHref}" ${getActiveStyle('attractions')}>景點</a>
          <a class="top-link ${getActiveClass('restaurants')}" href="${restaurantsHref}" ${getActiveStyle('restaurants')}>餐廳</a>
          <a class="top-link ${getActiveClass('events')}" href="${eventsHref}" ${getActiveStyle('events')}>活動</a>
        </nav>
      </div>
    </header>
  `;

  container.innerHTML = headerHTML;
}

document.addEventListener('DOMContentLoaded', loadSiteHeader);
