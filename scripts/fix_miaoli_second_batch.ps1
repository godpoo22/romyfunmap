function Write-Utf8File {
  param([string]$Path, [string]$Content)
  $dir = Split-Path -Parent $Path
  if ($dir -and -not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function New-DetailPage {
  param(
    [string]$Category,
    [string]$CategoryName,
    [string]$Title,
    [string]$Summary,
    [string]$Info1Title,
    [string]$Info1Body,
    [string]$Info2Title,
    [string]$Info2Body,
    [string]$Info3Title,
    [string]$Info3Body,
    [string]$Address,
    [string]$Parking,
    [string]$MapQuery,
    [string]$AgeInfo
  )

  $active = if ($Category -eq 'family-attractions') {
    'attractions'
  } elseif ($Category -eq 'family-restaurants') {
    'restaurants'
  } else {
    'events'
  }

  $mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + [System.Uri]::EscapeDataString($MapQuery)

  return @"
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>$Title | 苗栗$CategoryName</title>
  <meta name="description" content="$Summary" />
  <link rel="stylesheet" href="/assets/style.css" />
  <script src="/assets/header.js"></script>
  <script src="/assets/app.js"></script>
</head>
<body>
  <div id="site-header-container" data-active="$active"></div>
  <main class="page-pad">
    <div class="container">
      <div style="margin-top:20px;">
        <div class="breadcrumb" style="color:var(--text-muted);font-size:13px;margin-bottom:10px;"><a href="/">首頁</a> / <a href="/miaoli/">苗栗</a> / <a href="/miaoli/$Category/">$CategoryName</a> / $Title</div>
        <h1 style="font-size:28px;color:var(--text-dark);margin:10px 0;">$Title</h1>
        <p style="color:var(--text-muted);font-size:14px;margin:0;">$Summary</p>
      </div>
      <section class="tabelog-wrap" style="background:rgba(255,255,255,0.65);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.8);margin-top:20px;">
        <h2 class="tabelog-title">詳細資訊</h2>
        <table class="tabelog-table">
          <tbody>
            <tr>
              <th>$Info1Title</th>
              <td>$Info1Body</td>
            </tr>
            <tr>
              <th>$Info2Title</th>
              <td>$Info2Body</td>
            </tr>
            <tr>
              <th>$Info3Title</th>
              <td>$Info3Body</td>
            </tr>
            <tr>
              <th>交通與停車</th>
              <td><p><strong>地址：</strong>$Address</p><p><strong>停車：</strong>$Parking</p><p style="margin-top:8px;"><a href="$mapUrl" style="color:var(--primary);font-size:13px;text-decoration:underline;font-weight:bold;" target="_blank">在地圖上查看</a></p></td>
            </tr>
            <tr>
              <th>適合年齡</th>
              <td><p>$AgeInfo</p></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </main>
  <div class="sticky-bottom-bar" style="background:rgba(255,255,255,0.85);backdrop-filter:blur(15px);">
    <div class="sticky-bottom-inner">
      <button class="action-share" data-copy-url>分享</button>
      <a href="$mapUrl" target="_blank" class="action-main-btn"><span class="btn-icon" style="margin-right:8px;">📍</span>在地圖查看位置</a>
    </div>
  </div>
</body>
</html>
"@
}

$root = 'D:\parenting-site-v1\miaoli'

Write-Utf8File "$root\index.html" @'
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>苗栗親子景點、餐廳與活動</title>
  <meta name="description" content="整理苗栗親子景點、親子餐廳與親子活動，先從牧場、園區、館舍和親子友善餐廳開始安排。">
  <link rel="stylesheet" href="/assets/style.css">
  <script src="/assets/header.js"></script>
</head>
<body>
  <div id="site-header-container" data-active="home"></div>
  <main class="page-pad container">
    <div class="city-header">
      <div class="breadcrumb"><a href="/index.html">首頁</a> / 苗栗</div>
      <h1>苗栗親子景點</h1>
      <p style="color:var(--text-muted); margin-top:8px;">先從牧場、主題園區、共融公園與客家館舍開始，搭配親子餐廳和館舍活動安排一日遊。</p>
      <div class="wrap-nav"><a href="/miaoli/family-attractions/index.html" class="mini-pill active">景點 (6)</a><a href="/miaoli/family-restaurants/index.html" class="mini-pill">餐廳 (3)</a><a href="/miaoli/family-events/index.html" class="mini-pill">活動 (3)</a></div>
    </div>
    <div class="preview-grid">
      <a href="/miaoli/family-attractions/shangshun-theme-world/index.html" class="mini-card"><div class="mini-card-icon" style="background:#DBEAFE;color:#2563EB;">景</div><div class="mini-card-info"><h3>尚順育樂世界</h3><p>室內遊樂設施多，雨天和炎熱天氣都好安排。</p></div></a>
      <a href="/miaoli/family-attractions/arwin-rose-garden/index.html" class="mini-card"><div class="mini-card-icon" style="background:#FEF3C7;color:#B45309;">景</div><div class="mini-card-info"><h3>雅聞七里香玫瑰森林</h3><p>散步、拍照和輕鬆放風都很適合。</p></div></a>
      <a href="/miaoli/family-attractions/flying-cow-ranch/index.html" class="mini-card"><div class="mini-card-icon" style="background:#DCFCE7;color:#16A34A;">景</div><div class="mini-card-info"><h3>飛牛牧場</h3><p>餵動物、草地活動和手作體驗都很完整。</p></div></a>
      <a href="/miaoli/family-attractions/taiwan-hakka-museum/index.html" class="mini-card"><div class="mini-card-icon" style="background:#E0F2FE;color:#0284C7;">景</div><div class="mini-card-info"><h3>臺灣客家文化館</h3><p>館舍展覽加草地空間，適合安排半日行程。</p></div></a>
      <a href="/miaoli/family-restaurants/grand-royal-aura-court/index.html" class="mini-card"><div class="mini-card-icon" style="background:#FDF2F8;color:#BE185D;">餐</div><div class="mini-card-info"><h3>尚順君樂飯店 食采</h3><p>靠近尚順育樂世界，順遊用餐很方便。</p></div></a>
      <a href="/miaoli/family-restaurants/zaozhuang-hakka-restaurant/index.html" class="mini-card"><div class="mini-card-icon" style="background:#EDE9FE;color:#7C3AED;">餐</div><div class="mini-card-info"><h3>棗莊古藝庭園膳坊</h3><p>庭園空間寬鬆，適合聚餐和帶孩子走走。</p></div></a>
      <a href="/miaoli/family-events/arwin-rose-program/index.html" class="mini-card"><div class="mini-card-icon" style="background:#DCFCE7;color:#16A34A;">活</div><div class="mini-card-info"><h3>雅聞七里香季節活動</h3><p>可持續更新花季與假日活動資訊。</p></div></a>
      <a href="/miaoli/family-events/taiwan-hakka-museum-program/index.html" class="mini-card"><div class="mini-card-icon" style="background:#DBEAFE;color:#2563EB;">活</div><div class="mini-card-info"><h3>臺灣客家文化館親子活動</h3><p>導覽、工作坊和節慶活動都適合整理。</p></div></a>
    </div>
  </main>
</body>
</html>
'@

Write-Utf8File "$root\family-attractions\index.html" @'
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>苗栗親子景點</title>
  <meta name="description" content="苗栗親子景點列表，先看景點類型與停車資訊。">
  <link rel="stylesheet" href="/assets/style.css">
  <script src="/assets/header.js"></script>
  <script src="/assets/location-sort.js"></script>
  <style>.card-header{align-items:flex-start}.tags-group{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}.tags-row{display:flex;gap:4px}</style>
</head>
<body>
  <div id="site-header-container" data-active="attractions"></div>
  <main class="page-pad"><div class="container"><section class="hero-block green" style="margin-top:20px;text-align:left;"><div class="breadcrumb"><a href="/">首頁</a> / <a href="/miaoli/">苗栗</a> / 親子景點</div><h1>苗栗親子景點</h1><p>先從室內園區、共融公園、牧場和館舍開始，看類型與停車再決定行程節奏。</p><div style="margin-top:16px;"><button id="enable-location-btn" style="background:rgba(255,255,255,0.8);backdrop-filter:blur(8px);border:1px solid var(--primary);color:var(--primary);padding:8px 16px;border-radius:20px;font-weight:800;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s;box-shadow:0 4px 10px rgba(0,0,0,0.05);">開啟定位，依我的距離排序</button></div></section><section class="modern-cards-grid" id="listing-grid">
      <article class="modern-card" data-lat="24.6856" data-lng="120.9045"><div class="card-header"><h3 class="card-title" style="margin-right:10px;">尚順育樂世界</h3><div class="tags-group"><div class="tags-row"><span class="district-tag" style="background:#E6FFFA;color:#0D9488;">頭份市</span><span class="district-tag" style="background:#FFF7ED;color:#EA580C;">遊樂世界 / 室內</span></div><span class="district-tag distance-tag" style="background:#F3F4F6;color:#4B5563;display:none;"></span></div></div><p class="card-desc">苗栗最穩定的室內親子景點之一，適合雨天安排。</p><div class="info-list"><div class="info-item"><div class="info-icon">📍</div><div class="info-text"><span>類型</span>遊樂世界 / 室內</div></div><div class="info-item"><div class="info-icon">🚗</div><div class="info-text"><span>停車</span>商場停車場</div></div></div><a class="action-btn" href="/miaoli/family-attractions/shangshun-theme-world/">閱讀整理詳情 ➜</a></article>
      <article class="modern-card" data-lat="24.5903" data-lng="120.8803"><div class="card-header"><h3 class="card-title" style="margin-right:10px;">雅聞七里香玫瑰森林</h3><div class="tags-group"><div class="tags-row"><span class="district-tag" style="background:#E6FFFA;color:#0D9488;">銅鑼鄉</span><span class="district-tag" style="background:#F0FDF4;color:#16A34A;">園區 / 戶外</span></div><span class="district-tag distance-tag" style="background:#F3F4F6;color:#4B5563;display:none;"></span></div></div><p class="card-desc">花園步道和庭園空間很適合輕量親子行程。</p><div class="info-list"><div class="info-item"><div class="info-icon">📍</div><div class="info-text"><span>類型</span>庭園景點 / 散步拍照</div></div><div class="info-item"><div class="info-icon">🚗</div><div class="info-text"><span>停車</span>園區停車場</div></div></div><a class="action-btn" href="/miaoli/family-attractions/arwin-rose-garden/">閱讀整理詳情 ➜</a></article>
      <article class="modern-card" data-lat="24.5624" data-lng="120.8296"><div class="card-header"><h3 class="card-title" style="margin-right:10px;">貓裏喵親子公園</h3><div class="tags-group"><div class="tags-row"><span class="district-tag" style="background:#E6FFFA;color:#0D9488;">苗栗市</span><span class="district-tag" style="background:#F0FDF4;color:#16A34A;">特色公園 / 戶外</span></div><span class="district-tag distance-tag" style="background:#F3F4F6;color:#4B5563;display:none;"></span></div></div><p class="card-desc">共融遊具和放電空間都夠，是市區型親子公園。</p><div class="info-list"><div class="info-item"><div class="info-icon">📍</div><div class="info-text"><span>類型</span>特色公園 / 遊戲場</div></div><div class="info-item"><div class="info-icon">🚗</div><div class="info-text"><span>停車</span>路邊停車格</div></div></div><a class="action-btn" href="/miaoli/family-attractions/maolimao-park/">閱讀整理詳情 ➜</a></article>
      <article class="modern-card" data-lat="24.3901" data-lng="120.7602"><div class="card-header"><h3 class="card-title" style="margin-right:10px;">西湖渡假村</h3><div class="tags-group"><div class="tags-row"><span class="district-tag" style="background:#E6FFFA;color:#0D9488;">三義鄉</span><span class="district-tag" style="background:#F0FDF4;color:#16A34A;">渡假園區 / 戶外</span></div><span class="district-tag distance-tag" style="background:#F3F4F6;color:#4B5563;display:none;"></span></div></div><p class="card-desc">園區空間大，適合搭配季節活動安排整天行程。</p><div class="info-list"><div class="info-item"><div class="info-icon">📍</div><div class="info-text"><span>類型</span>渡假園區 / 戶外景點</div></div><div class="info-item"><div class="info-icon">🚗</div><div class="info-text"><span>停車</span>園區停車場</div></div></div><a class="action-btn" href="/miaoli/family-attractions/westlake-resort/">閱讀整理詳情 ➜</a></article>
      <article class="modern-card" data-lat="24.3823" data-lng="120.7827"><div class="card-header"><h3 class="card-title" style="margin-right:10px;">飛牛牧場</h3><div class="tags-group"><div class="tags-row"><span class="district-tag" style="background:#E6FFFA;color:#0D9488;">通霄鎮</span><span class="district-tag" style="background:#F0FDF4;color:#16A34A;">牧場 / 戶外</span></div><span class="district-tag distance-tag" style="background:#F3F4F6;color:#4B5563;display:none;"></span></div></div><p class="card-desc">餵動物、草地活動和手作體驗都很完整，適合半日到一日遊。</p><div class="info-list"><div class="info-item"><div class="info-icon">📍</div><div class="info-text"><span>類型</span>牧場 / 動物互動</div></div><div class="info-item"><div class="info-icon">🚗</div><div class="info-text"><span>停車</span>牧場停車場</div></div></div><a class="action-btn" href="/miaoli/family-attractions/flying-cow-ranch/">閱讀整理詳情 ➜</a></article>
      <article class="modern-card" data-lat="24.5183" data-lng="120.8082"><div class="card-header"><h3 class="card-title" style="margin-right:10px;">臺灣客家文化館</h3><div class="tags-group"><div class="tags-row"><span class="district-tag" style="background:#E6FFFA;color:#0D9488;">銅鑼鄉</span><span class="district-tag" style="background:#FFF7ED;color:#EA580C;">館舍 / 室內</span></div><span class="district-tag distance-tag" style="background:#F3F4F6;color:#4B5563;display:none;"></span></div></div><p class="card-desc">館舍展覽和戶外草地都好安排，適合雨天備案。</p><div class="info-list"><div class="info-item"><div class="info-icon">📍</div><div class="info-text"><span>類型</span>文化館 / 展覽空間</div></div><div class="info-item"><div class="info-icon">🚗</div><div class="info-text"><span>停車</span>館方停車場</div></div></div><a class="action-btn" href="/miaoli/family-attractions/taiwan-hakka-museum/">閱讀整理詳情 ➜</a></article>
    </section></div></main>
</body>
</html>
'@

Write-Utf8File "$root\family-restaurants\index.html" @'
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>苗栗親子餐廳</title>
  <meta name="description" content="苗栗親子餐廳列表，先看餐廳類型與停車資訊。">
  <link rel="stylesheet" href="/assets/style.css">
  <script src="/assets/header.js"></script>
  <script src="/assets/location-sort.js"></script>
  <style>.card-header{align-items:flex-start}.tags-group{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}.tags-row{display:flex;gap:4px}</style>
</head>
<body>
  <div id="site-header-container" data-active="restaurants"></div>
  <main class="page-pad"><div class="container"><section class="hero-block peach" style="margin-top:20px;text-align:left;"><div class="breadcrumb"><a href="/">首頁</a> / <a href="/miaoli/">苗栗</a> / 親子餐廳</div><h1>苗栗親子餐廳</h1><p>先從景點旁順遊型餐廳、庭園餐廳和適合聚餐的空間開始，方便安排半日或一日行程。</p><div style="margin-top:16px;"><button id="enable-location-btn" style="background:rgba(255,255,255,0.8);backdrop-filter:blur(8px);border:1px solid var(--primary);color:var(--primary);padding:8px 16px;border-radius:20px;font-weight:800;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s;box-shadow:0 4px 10px rgba(0,0,0,0.05);">開啟定位，依我的距離排序</button></div></section><section class="modern-cards-grid" id="listing-grid">
      <article class="modern-card" data-lat="24.6850" data-lng="120.9050"><div class="card-header"><h3 class="card-title" style="margin-right:10px;">尚順君樂飯店 食采</h3><div class="tags-group"><div class="tags-row"><span class="district-tag" style="background:#E6FFFA;color:#0D9488;">頭份市</span><span class="district-tag" style="background:#FFF7ED;color:#EA580C;">飯店餐廳 / 室內</span></div><span class="district-tag distance-tag" style="background:#F3F4F6;color:#4B5563;display:none;"></span></div></div><p class="card-desc">靠近尚順育樂世界，安排用餐很順手。</p><div class="info-list"><div class="info-item"><div class="info-icon">📍</div><div class="info-text"><span>類型</span>飯店餐廳 / 景點順遊</div></div><div class="info-item"><div class="info-icon">🚗</div><div class="info-text"><span>停車</span>飯店停車場</div></div></div><a class="action-btn" href="/miaoli/family-restaurants/grand-royal-aura-court/">閱讀整理詳情 ➜</a></article>
      <article class="modern-card" data-lat="24.3390" data-lng="120.8431"><div class="card-header"><h3 class="card-title" style="margin-right:10px;">Vilavilla 魔法莊園</h3><div class="tags-group"><div class="tags-row"><span class="district-tag" style="background:#E6FFFA;color:#0D9488;">卓蘭鎮</span><span class="district-tag" style="background:#FFF7ED;color:#EA580C;">庭園餐廳 / 戶外</span></div><span class="district-tag distance-tag" style="background:#F3F4F6;color:#4B5563;display:none;"></span></div></div><p class="card-desc">庭園氛圍輕鬆，適合慢步調用餐和拍照。</p><div class="info-list"><div class="info-item"><div class="info-icon">📍</div><div class="info-text"><span>類型</span>庭園餐廳 / 景觀空間</div></div><div class="info-item"><div class="info-icon">🚗</div><div class="info-text"><span>停車</span>園區停車場</div></div></div><a class="action-btn" href="/miaoli/family-restaurants/vilavilla/">閱讀整理詳情 ➜</a></article>
      <article class="modern-card" data-lat="24.4895" data-lng="120.7918"><div class="card-header"><h3 class="card-title" style="margin-right:10px;">棗莊古藝庭園膳坊</h3><div class="tags-group"><div class="tags-row"><span class="district-tag" style="background:#E6FFFA;color:#0D9488;">公館鄉</span><span class="district-tag" style="background:#FFF7ED;color:#EA580C;">庭園餐廳 / 客家料理</span></div><span class="district-tag distance-tag" style="background:#F3F4F6;color:#4B5563;display:none;"></span></div></div><p class="card-desc">庭園感明顯，適合家庭聚餐和孩子下車走走。</p><div class="info-list"><div class="info-item"><div class="info-icon">📍</div><div class="info-text"><span>類型</span>客家料理 / 庭園餐廳</div></div><div class="info-item"><div class="info-icon">🚗</div><div class="info-text"><span>停車</span>店家停車空間</div></div></div><a class="action-btn" href="/miaoli/family-restaurants/zaozhuang-hakka-restaurant/">閱讀整理詳情 ➜</a></article>
    </section></div></main>
</body>
</html>
'@

Write-Utf8File "$root\family-events\index.html" @'
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>苗栗親子活動</title>
  <meta name="description" content="苗栗親子活動列表，先看活動類型與停車資訊。">
  <link rel="stylesheet" href="/assets/style.css">
  <script src="/assets/header.js"></script>
  <script src="/assets/location-sort.js"></script>
  <style>.card-header{align-items:flex-start}.tags-group{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}.tags-row{display:flex;gap:4px}.event-date-badge{display:inline-block;background:#F0FDF4;color:#16A34A;font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px}</style>
</head>
<body>
  <div id="site-header-container" data-active="events"></div>
  <main class="page-pad"><div class="container"><section class="hero-block purple" style="margin-top:20px;text-align:left;"><div class="breadcrumb"><a href="/">首頁</a> / <a href="/miaoli/">苗栗</a> / 親子活動</div><h1>苗栗親子活動</h1><p>先從園區季節活動、館舍導覽和手作課程開始，之後再持續更新不同檔期內容。</p><div style="margin-top:16px;"><button id="enable-location-btn" style="background:rgba(255,255,255,0.8);backdrop-filter:blur(8px);border:1px solid var(--primary);color:var(--primary);padding:8px 16px;border-radius:20px;font-weight:800;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s;box-shadow:0 4px 10px rgba(0,0,0,0.05);">開啟定位，依我的距離排序</button></div></section><section class="modern-cards-grid" id="listing-grid">
      <article class="modern-card" data-lat="24.5903" data-lng="120.8803"><div class="card-header"><h3 class="card-title" style="margin-right:10px;">雅聞七里香季節活動</h3><div class="tags-group"><div class="tags-row"><span class="district-tag" style="background:#E6FFFA;color:#0D9488;">銅鑼鄉</span><span class="district-tag" style="background:#FFF7ED;color:#EA580C;">季節活動</span></div><span class="event-date-badge">常設更新</span><span class="district-tag distance-tag" style="background:#F3F4F6;color:#4B5563;display:none;"></span></div></div><p class="card-desc">適合整理花季、假日活動和園區限定活動。</p><div class="info-list"><div class="info-item"><div class="info-icon">📍</div><div class="info-text"><span>類型</span>季節活動 / 園區活動</div></div><div class="info-item"><div class="info-icon">🚗</div><div class="info-text"><span>停車</span>園區停車場</div></div></div><a class="action-btn" href="/miaoli/family-events/arwin-rose-program/">閱讀整理詳情 ➜</a></article>
      <article class="modern-card" data-lat="24.3901" data-lng="120.7602"><div class="card-header"><h3 class="card-title" style="margin-right:10px;">西湖渡假村季節活動</h3><div class="tags-group"><div class="tags-row"><span class="district-tag" style="background:#E6FFFA;color:#0D9488;">三義鄉</span><span class="district-tag" style="background:#FFF7ED;color:#EA580C;">園區活動</span></div><span class="event-date-badge">常設更新</span><span class="district-tag distance-tag" style="background:#F3F4F6;color:#4B5563;display:none;"></span></div></div><p class="card-desc">假日活動和節慶活動適合收在同一頁持續更新。</p><div class="info-list"><div class="info-item"><div class="info-icon">📍</div><div class="info-text"><span>類型</span>園區活動 / 節慶檔期</div></div><div class="info-item"><div class="info-icon">🚗</div><div class="info-text"><span>停車</span>園區停車場</div></div></div><a class="action-btn" href="/miaoli/family-events/westlake-season-events/">閱讀整理詳情 ➜</a></article>
      <article class="modern-card" data-lat="24.5183" data-lng="120.8082"><div class="card-header"><h3 class="card-title" style="margin-right:10px;">臺灣客家文化館親子活動</h3><div class="tags-group"><div class="tags-row"><span class="district-tag" style="background:#E6FFFA;color:#0D9488;">銅鑼鄉</span><span class="district-tag" style="background:#FFF7ED;color:#EA580C;">館舍活動</span></div><span class="event-date-badge">常設更新</span><span class="district-tag distance-tag" style="background:#F3F4F6;color:#4B5563;display:none;"></span></div></div><p class="card-desc">導覽、工作坊與節慶體驗都適合長期整理。</p><div class="info-list"><div class="info-item"><div class="info-icon">📍</div><div class="info-text"><span>類型</span>館舍活動 / 工作坊</div></div><div class="info-item"><div class="info-icon">🚗</div><div class="info-text"><span>停車</span>館方停車場</div></div></div><a class="action-btn" href="/miaoli/family-events/taiwan-hakka-museum-program/">閱讀整理詳情 ➜</a></article>
    </section></div></main>
</body>
</html>
'@

Write-Utf8File "$root\family-attractions\shangshun-theme-world\index.html" (New-DetailPage -Category 'family-attractions' -CategoryName '親子景點' -Title '尚順育樂世界' -Summary '整理尚順育樂世界的室內遊樂設施、停留時間與停車方式。' -Info1Title '入場與費用' -Info1Body '<p><strong>費用形式：</strong>依設施或票種計價。</p><p>建議先看當日票種與營業公告，再安排停留時間。</p>' -Info2Title '體驗內容' -Info2Body '<p><strong>主要內容：</strong>室內遊樂設施、主題空間與商場周邊。</p><p>雨天或炎熱天氣時，這類型景點特別好安排。</p>' -Info3Title '基本資訊' -Info3Body '<p><strong>空間型態：</strong>室內遊樂世界。</p><p><strong>建議停留：</strong>2 小時以上。</p><p><strong>雨天備案：</strong>適合。</p>' -Address '苗栗縣頭份市中央路 103 號' -Parking '商場停車場' -MapQuery '尚順育樂世界' -AgeInfo '學齡前到國小階段都可安排，依孩子身高與設施限制調整。')
Write-Utf8File "$root\family-attractions\arwin-rose-garden\index.html" (New-DetailPage -Category 'family-attractions' -CategoryName '親子景點' -Title '雅聞七里香玫瑰森林' -Summary '整理雅聞七里香玫瑰森林的散步動線、停留時間與停車資訊。' -Info1Title '入場與費用' -Info1Body '<p><strong>費用形式：</strong>多數時段可免費入園，依現場公告為準。</p><p>花季與連假前後人潮較多，建議避開最熱時段。</p>' -Info2Title '體驗內容' -Info2Body '<p><strong>主要內容：</strong>玫瑰庭園、步道、造景空間與伴手禮區。</p><p>很適合安排短停散步或和附近景點順遊。</p>' -Info3Title '基本資訊' -Info3Body '<p><strong>空間型態：</strong>戶外園區。</p><p><strong>建議停留：</strong>1 到 2 小時。</p><p><strong>雨天備案：</strong>不建議當主要行程。</p>' -Address '苗栗縣銅鑼鄉九湖村銅科南路 6 號' -Parking '園區停車場' -MapQuery '雅聞七里香玫瑰森林' -AgeInfo '各年齡層都可安排，推車族可走主要步道區。')
Write-Utf8File "$root\family-attractions\maolimao-park\index.html" (New-DetailPage -Category 'family-attractions' -CategoryName '親子景點' -Title '貓裏喵親子公園' -Summary '整理貓裏喵親子公園的遊具重點、停留時間與停車方式。' -Info1Title '遊玩重點' -Info1Body '<p><strong>主要設施：</strong>特色遊具、攀爬與滑梯空間。</p><p>適合安排孩子放電，建議帶替換衣物與飲水。</p>' -Info2Title '場地資訊' -Info2Body '<p><strong>空間型態：</strong>戶外特色公園。</p><p>白天遮蔭有限，夏季建議避開正中午。</p>' -Info3Title '基本資訊' -Info3Body '<p><strong>建議停留：</strong>1 到 2 小時。</p><p><strong>雨天備案：</strong>不適合。</p><p><strong>鄰近安排：</strong>可和苗栗市區行程一起排。</p>' -Address '苗栗縣苗栗市自治路' -Parking '周邊停車格' -MapQuery '貓裏喵親子公園' -AgeInfo '幼兒到國小都適合，家長需留意各遊具年齡與高度差。')
Write-Utf8File "$root\family-attractions\westlake-resort\index.html" (New-DetailPage -Category 'family-attractions' -CategoryName '親子景點' -Title '西湖渡假村' -Summary '整理西湖渡假村的園區玩法、停留時間與停車資訊。' -Info1Title '入場與費用' -Info1Body '<p><strong>費用形式：</strong>依票種與活動檔期調整。</p><p>建議先看官方公告，再安排要不要搭配季節活動一起玩。</p>' -Info2Title '體驗內容' -Info2Body '<p><strong>主要內容：</strong>園區散步、親子遊樂設施與節慶活動。</p><p>適合排半日到一日行程。</p>' -Info3Title '基本資訊' -Info3Body '<p><strong>空間型態：</strong>戶外渡假園區。</p><p><strong>建議停留：</strong>半日以上。</p><p><strong>雨天備案：</strong>視活動區域而定。</p>' -Address '苗栗縣三義鄉西湖 11 號' -Parking '園區停車場' -MapQuery '西湖渡假村' -AgeInfo '幼兒到國小都可安排，若園區步行較多建議帶推車。')
Write-Utf8File "$root\family-attractions\flying-cow-ranch\index.html" (New-DetailPage -Category 'family-attractions' -CategoryName '親子景點' -Title '飛牛牧場' -Summary '整理飛牛牧場的動物互動、園區停留時間與停車資訊。' -Info1Title '入場與費用' -Info1Body '<p><strong>費用形式：</strong>依門票與體驗項目計價。</p><p>若要安排擠奶、餵食或手作，建議先看當日場次。</p>' -Info2Title '體驗內容' -Info2Body '<p><strong>主要內容：</strong>牧場動物互動、草地活動、乳製品與手作體驗。</p><p>適合安排半日到一日行程。</p>' -Info3Title '基本資訊' -Info3Body '<p><strong>空間型態：</strong>戶外牧場。</p><p><strong>建議停留：</strong>3 小時以上。</p><p><strong>雨天備案：</strong>不建議當主要行程。</p>' -Address '苗栗縣通霄鎮南和里 166 號' -Parking '牧場停車場' -MapQuery '飛牛牧場' -AgeInfo '低齡幼兒到國小都適合，喜歡動物互動的孩子會更有感。')
Write-Utf8File "$root\family-attractions\taiwan-hakka-museum\index.html" (New-DetailPage -Category 'family-attractions' -CategoryName '親子景點' -Title '臺灣客家文化館' -Summary '整理臺灣客家文化館的展覽空間、草地環境與停車資訊。' -Info1Title '入場與費用' -Info1Body '<p><strong>費用形式：</strong>常設展多數可免費參觀，依館方公告為準。</p><p>特展或活動若需報名，建議先看場次資訊。</p>' -Info2Title '體驗內容' -Info2Body '<p><strong>主要內容：</strong>客家主題展覽、戶外草地與假日活動。</p><p>適合安排室內外混合型親子行程。</p>' -Info3Title '基本資訊' -Info3Body '<p><strong>空間型態：</strong>文化館舍。</p><p><strong>建議停留：</strong>1.5 到 2.5 小時。</p><p><strong>雨天備案：</strong>適合。</p>' -Address '苗栗縣銅鑼鄉九湖村銅科南路 6 號' -Parking '館方停車場' -MapQuery '臺灣客家文化館 苗栗' -AgeInfo '學齡前可走輕鬆參觀路線，國小以上較能理解展覽內容。')

Write-Utf8File "$root\family-restaurants\grand-royal-aura-court\index.html" (New-DetailPage -Category 'family-restaurants' -CategoryName '親子餐廳' -Title '尚順君樂飯店 食采' -Summary '整理尚順君樂飯店食采的用餐環境、順遊安排與停車資訊。' -Info1Title '餐廳重點' -Info1Body '<p><strong>用餐形式：</strong>飯店餐廳。</p><p>適合搭配尚順育樂世界或頭份市區行程安排用餐。</p>' -Info2Title '親子體驗' -Info2Body '<p><strong>空間感受：</strong>座位穩定、帶小孩用餐相對方便。</p><p>若是連假或熱門時段，建議先確認訂位。</p>' -Info3Title '基本資訊' -Info3Body '<p><strong>餐廳類型：</strong>飯店餐廳 / 景點順遊。</p><p><strong>建議停留：</strong>1 到 1.5 小時。</p><p><strong>雨天備案：</strong>適合。</p>' -Address '苗栗縣頭份市中央路 103 號' -Parking '飯店停車場' -MapQuery '尚順君樂飯店 食采' -AgeInfo '各年齡層都可安排，嬰幼兒同行建議先確認兒童座椅。')
Write-Utf8File "$root\family-restaurants\vilavilla\index.html" (New-DetailPage -Category 'family-restaurants' -CategoryName '親子餐廳' -Title 'Vilavilla 魔法莊園' -Summary '整理 Vilavilla 魔法莊園的庭園空間、停留時間與停車資訊。' -Info1Title '餐廳重點' -Info1Body '<p><strong>用餐形式：</strong>庭園餐廳。</p><p>環境偏慢步調，適合安排聚餐或景觀型用餐。</p>' -Info2Title '親子體驗' -Info2Body '<p><strong>空間感受：</strong>戶外景觀與拍照點較多。</p><p>若帶小小孩同行，建議留意戶外步行區域。</p>' -Info3Title '基本資訊' -Info3Body '<p><strong>餐廳類型：</strong>庭園餐廳 / 景觀空間。</p><p><strong>建議停留：</strong>1.5 小時左右。</p><p><strong>雨天備案：</strong>視室內座位情況而定。</p>' -Address '苗栗縣卓蘭鎮西坪里西坪 43-3 號' -Parking '園區停車場' -MapQuery 'Vilavilla 魔法莊園' -AgeInfo '學齡前到國小都可安排，喜歡庭園空間的家庭會更適合。')
Write-Utf8File "$root\family-restaurants\zaozhuang-hakka-restaurant\index.html" (New-DetailPage -Category 'family-restaurants' -CategoryName '親子餐廳' -Title '棗莊古藝庭園膳坊' -Summary '整理棗莊古藝庭園膳坊的用餐環境、庭園空間與停車資訊。' -Info1Title '餐廳重點' -Info1Body '<p><strong>用餐形式：</strong>客家料理 / 庭園餐廳。</p><p>適合家庭聚餐，餐後也能讓孩子在庭園周邊走動。</p>' -Info2Title '親子體驗' -Info2Body '<p><strong>空間感受：</strong>庭園感明顯，帶孩子用餐較不壓迫。</p><p>熱門時段建議先訂位，避免現場久候。</p>' -Info3Title '基本資訊' -Info3Body '<p><strong>餐廳類型：</strong>客家料理 / 庭園餐廳。</p><p><strong>建議停留：</strong>1 到 1.5 小時。</p><p><strong>雨天備案：</strong>適合。</p>' -Address '苗栗縣公館鄉館義路 43-6 號' -Parking '店家停車空間' -MapQuery '棗莊古藝庭園膳坊' -AgeInfo '各年齡層都可安排，家庭聚餐需求特別適合。')

Write-Utf8File "$root\family-events\arwin-rose-program\index.html" (New-DetailPage -Category 'family-events' -CategoryName '親子活動' -Title '雅聞七里香季節活動' -Summary '整理雅聞七里香玫瑰森林的花季活動、假日活動與停車資訊。' -Info1Title '活動形式' -Info1Body '<p><strong>活動類型：</strong>季節活動 / 園區活動。</p><p>適合收錄花季、假日市集與節慶限定活動。</p>' -Info2Title '活動內容' -Info2Body '<p><strong>常見安排：</strong>花季布置、園區散步與假日限定活動。</p><p>建議出發前先看官方公告，確認當期主題。</p>' -Info3Title '基本資訊' -Info3Body '<p><strong>活動型態：</strong>常設更新頁。</p><p><strong>建議停留：</strong>1 到 2 小時。</p><p><strong>雨天備案：</strong>不適合作主要活動。</p>' -Address '苗栗縣銅鑼鄉九湖村銅科南路 6 號' -Parking '園區停車場' -MapQuery '雅聞七里香玫瑰森林' -AgeInfo '各年齡層都可安排，若孩子較小可走輕鬆散步路線。')
Write-Utf8File "$root\family-events\westlake-season-events\index.html" (New-DetailPage -Category 'family-events' -CategoryName '親子活動' -Title '西湖渡假村季節活動' -Summary '整理西湖渡假村的節慶活動、園區檔期與停車資訊。' -Info1Title '活動形式' -Info1Body '<p><strong>活動類型：</strong>園區活動 / 節慶檔期。</p><p>適合收錄不同季節的主題活動與連假安排。</p>' -Info2Title '活動內容' -Info2Body '<p><strong>常見安排：</strong>園區表演、節慶布置與假日活動。</p><p>不同檔期差異較大，建議出發前先看當期公告。</p>' -Info3Title '基本資訊' -Info3Body '<p><strong>活動型態：</strong>常設更新頁。</p><p><strong>建議停留：</strong>半日以上。</p><p><strong>雨天備案：</strong>視當期活動區域而定。</p>' -Address '苗栗縣三義鄉西湖 11 號' -Parking '園區停車場' -MapQuery '西湖渡假村' -AgeInfo '幼兒到國小都可安排，若活動範圍大建議帶推車。')
Write-Utf8File "$root\family-events\taiwan-hakka-museum-program\index.html" (New-DetailPage -Category 'family-events' -CategoryName '親子活動' -Title '臺灣客家文化館親子活動' -Summary '整理臺灣客家文化館的導覽、工作坊與節慶活動資訊。' -Info1Title '活動形式' -Info1Body '<p><strong>活動類型：</strong>館舍活動 / 導覽工作坊。</p><p>適合收錄常設導覽、假日課程與節慶主題活動。</p>' -Info2Title '活動內容' -Info2Body '<p><strong>常見安排：</strong>展覽導覽、文化體驗與手作活動。</p><p>若需要報名，建議先確認名額與場次。</p>' -Info3Title '基本資訊' -Info3Body '<p><strong>活動型態：</strong>常設更新頁。</p><p><strong>建議停留：</strong>1.5 到 2 小時。</p><p><strong>雨天備案：</strong>適合。</p>' -Address '苗栗縣銅鑼鄉九湖村銅科南路 6 號' -Parking '館方停車場' -MapQuery '臺灣客家文化館 苗栗' -AgeInfo '學齡前可選輕鬆導覽，國小以上較適合參加工作坊或主題活動。')
