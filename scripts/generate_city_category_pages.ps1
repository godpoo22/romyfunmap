param(
  [Parameter(Mandatory = $true)][string]$CityKey,
  [Parameter(Mandatory = $true)][string]$CityName,
  [Parameter(Mandatory = $true)][string]$CategoryKey,
  [Parameter(Mandatory = $true)][string]$CategoryName,
  [Parameter(Mandatory = $true)][string]$DataPath
)

function Write-Utf8File {
  param([string]$Path, [string]$Content)
  $dir = Split-Path -Parent $Path
  if ($dir -and -not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }
  $enc = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $enc)
}

function New-DetailPage {
  param($Item, [string]$Active)
  $mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + [System.Uri]::EscapeDataString($Item.map)
  $section1 = if ($CategoryKey -eq 'family-attractions') { '遊玩重點' } else { '餐廳重點' }
  $section2 = if ($CategoryKey -eq 'family-attractions') { '安排方式' } else { '用餐安排' }
  $section3 = '補充資訊'
  $row1 = if ($CategoryKey -eq 'family-attractions') {
    "<p><strong>景點類型：</strong>$($Item.type)</p><p>$($Item.summary)</p>"
  } else {
    "<p><strong>餐廳類型：</strong>$($Item.type)</p><p>$($Item.summary)</p>"
  }
  $row2 = "<p><strong>建議停留：</strong>$($Item.stay)</p><p><strong>安排建議：</strong>$($Item.weather)</p>"
  $row3 = "<p><strong>地區：</strong>$($Item.district)</p><p><strong>親子提醒：</strong>$($Item.tip)</p>"
  @"
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>$($Item.title) | $CityName$CategoryName</title>
  <meta name="description" content="$($Item.summary)" />
  <link rel="stylesheet" href="/assets/style.css" />
  <script src="/assets/header.js"></script>
  <script src="/assets/app.js"></script>
</head>
<body>
  <div id="site-header-container" data-active="$Active"></div>
  <main class="page-pad">
    <div class="container">
      <div style="margin-top:20px;">
        <div class="breadcrumb" style="color:var(--text-muted);font-size:13px;margin-bottom:10px;"><a href="/">首頁</a> / <a href="/$CityKey/">$CityName</a> / <a href="/$CityKey/$CategoryKey/">$CategoryName</a> / $($Item.title)</div>
        <h1 style="font-size:28px;color:var(--text-dark);margin:10px 0;">$($Item.title)</h1>
        <p style="color:var(--text-muted);font-size:14px;margin:0;">$($Item.summary)</p>
      </div>
      <section class="tabelog-wrap" style="background:rgba(255,255,255,0.65);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.8);margin-top:20px;">
        <h2 class="tabelog-title">詳細資訊</h2>
        <table class="tabelog-table">
          <tbody>
            <tr><th>$section1</th><td>$row1</td></tr>
            <tr><th>$section2</th><td>$row2</td></tr>
            <tr><th>$section3</th><td>$row3</td></tr>
            <tr><th>交通與停車</th><td><p><strong>地址：</strong>$($Item.address)</p><p><strong>停車：</strong>$($Item.parking)</p><p style="margin-top:8px;"><a href="$mapUrl" style="color:var(--primary);font-size:13px;text-decoration:underline;font-weight:bold;" target="_blank">在地圖上查看</a></p></td></tr>
            <tr><th>適合年齡</th><td><p>$($Item.age)</p></td></tr>
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

$items = Import-Csv -LiteralPath $DataPath -Delimiter '|'
$active = if ($CategoryKey -eq 'family-attractions') { 'attractions' } else { 'restaurants' }
$heroClass = if ($CategoryKey -eq 'family-attractions') { 'green' } else { 'peach' }
$heroDescription = if ($CategoryKey -eq 'family-attractions') {
  "先從$CityName比較常被安排的館舍、公園、牧場和主題園區開始，看類型與停車資訊再決定順路怎麼排。"
} else {
  "先從$CityName景點順遊型、景觀型和親子友善餐廳開始，方便安排半日或一日行程。"
}

$cards = foreach ($item in $items) {
  Write-Utf8File "D:\parenting-site-v1\$CityKey\$CategoryKey\$($item.slug)\index.html" (New-DetailPage -Item $item -Active $active)
  "<article class='modern-card' data-lat='$($item.lat)' data-lng='$($item.lng)'><div class='card-header'><h3 class='card-title' style='margin-right:10px;'>$($item.title)</h3><div class='tags-group'><div class='tags-row'><span class='district-tag' style='background:#E6FFFA;color:#0D9488;'>$($item.district)</span><span class='district-tag' style='background:#FFF7ED;color:#EA580C;'>$($item.tag)</span></div><span class='district-tag distance-tag' style='background:#F3F4F6;color:#4B5563;display:none;'></span></div></div><p class='card-desc'>$($item.summary)</p><div class='info-list'><div class='info-item'><div class='info-icon'>📍</div><div class='info-text'><span>類型</span>$($item.type)</div></div><div class='info-item'><div class='info-icon'>🚗</div><div class='info-text'><span>停車</span>$($item.parking)</div></div></div><a class='action-btn' href='/$CityKey/$CategoryKey/$($item.slug)/'>閱讀整理詳情 ➜</a></article>"
}

$page = @"
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$CityName$CategoryName</title>
  <meta name="description" content="$CityName$CategoryName列表，先看類型與停車資訊。">
  <link rel="stylesheet" href="/assets/style.css">
  <script src="/assets/header.js"></script>
  <script src="/assets/location-sort.js"></script>
  <style>.card-header{align-items:flex-start}.tags-group{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}.tags-row{display:flex;gap:4px}</style>
</head>
<body>
  <div id="site-header-container" data-active="$active"></div>
  <main class="page-pad">
    <div class="container">
      <section class="hero-block $heroClass" style="margin-top:20px;text-align:left;">
        <div class="breadcrumb"><a href="/">首頁</a> / <a href="/$CityKey/">$CityName</a> / $CategoryName</div>
        <h1>$CityName$CategoryName</h1>
        <p>$heroDescription</p>
        <div style="margin-top:16px;"><button id="enable-location-btn" style="background:rgba(255,255,255,0.8);backdrop-filter:blur(8px);border:1px solid var(--primary);color:var(--primary);padding:8px 16px;border-radius:20px;font-weight:800;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s;box-shadow:0 4px 10px rgba(0,0,0,0.05);">開啟定位，依我的距離排序</button></div>
      </section>
      <section class="modern-cards-grid" id="listing-grid">$($cards -join '')</section>
    </div>
  </main>
</body>
</html>
"@

Write-Utf8File "D:\parenting-site-v1\$CityKey\$CategoryKey\index.html" $page
