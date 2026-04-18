param()

function Write-Utf8File {
  param([string]$Path, [string]$Content)
  $dir = Split-Path -Parent $Path
  if ($dir -and -not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
  }
  $enc = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $enc)
}

function Get-PlainText {
  param([string]$Text)
  if ($null -eq $Text) { return '' }
  $text = [regex]::Replace($Text, '<[^>]+>', '')
  $text = [System.Net.WebUtility]::HtmlDecode($text)
  $text = [regex]::Replace($text, '\s+', ' ')
  return $text.Trim()
}

function Encode-Html {
  param([string]$Text)
  if ($null -eq $Text) { return '' }
  return [System.Net.WebUtility]::HtmlEncode($Text)
}

function Extract-Value {
  param([string]$Html,[string[]]$Labels)
  foreach ($label in $Labels) {
    $pattern = "<strong>\s*$([regex]::Escape($label))\s*：</strong>\s*([^<]+)"
    $match = [regex]::Match($Html, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($match.Success) { return (Get-PlainText $match.Groups[1].Value) }
  }
  return ''
}

function Get-CoordsLookup {
  param([string]$CategoryIndexPath)
  $lookup = @{}
  if (-not (Test-Path $CategoryIndexPath)) { return $lookup }
  $html = Get-Content -LiteralPath $CategoryIndexPath -Raw
  $pattern = '<article class="modern-card"(?:(?!<article).)*?data-lat="([^"]*)"(?:(?!<article).)*?data-lng="([^"]*)"(?:(?!<article).)*?<a class="action-btn" href="/[^/]+/[^/]+/([^/]+)/"'
  $matches = [regex]::Matches($html, $pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  foreach ($match in $matches) {
    $lookup[$match.Groups[3].Value] = @{ lat = $match.Groups[1].Value; lng = $match.Groups[2].Value }
  }
  return $lookup
}

function Get-ItemFromDetail {
  param([System.IO.DirectoryInfo]$Dir,[hashtable]$CoordsLookup)
  $detailPath = Join-Path $Dir.FullName 'index.html'
  if (-not (Test-Path $detailPath)) { return $null }
  $html = Get-Content -LiteralPath $detailPath -Raw
  $titleMatch = [regex]::Match($html, '<h1[^>]*>(.*?)</h1>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  $summaryMatch = [regex]::Match($html, '<h1[^>]*>.*?</h1>\s*<p[^>]*>(.*?)</p>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  $title = if ($titleMatch.Success) { Get-PlainText $titleMatch.Groups[1].Value } else { $Dir.Name }
  $summary = if ($summaryMatch.Success) { Get-PlainText $summaryMatch.Groups[1].Value } else { '' }
  $district = Extract-Value -Html $html -Labels @('地區')
  $parking = Extract-Value -Html $html -Labels @('停車')
  $address = Extract-Value -Html $html -Labels @('地址')
  $type = Extract-Value -Html $html -Labels @('類型','餐廳類型','活動類型','主題內容','主題','空間型態')
  $coords = $CoordsLookup[$Dir.Name]
  [pscustomobject]@{
    slug = $Dir.Name
    title = $title
    summary = $summary
    district = $district
    parking = $parking
    address = $address
    type = $type
    lat = if ($coords) { $coords.lat } else { '' }
    lng = if ($coords) { $coords.lng } else { '' }
  }
}

function Get-HeroClass { param([string]$CategoryKey) switch ($CategoryKey) { 'family-attractions' { 'green' } 'family-restaurants' { 'orange' } 'family-events' { 'purple' } default { '' } } }
function Get-ActiveKey { param([string]$CategoryKey) switch ($CategoryKey) { 'family-attractions' { 'attractions' } 'family-restaurants' { 'restaurants' } 'family-events' { 'events' } default { 'home' } } }
function Get-CategoryName { param([string]$CategoryKey) switch ($CategoryKey) { 'family-attractions' { '親子景點' } 'family-restaurants' { '親子餐廳' } 'family-events' { '親子活動' } default { '' } } }
function Get-CategoryDescription { param([string]$CityName,[string]$CategoryKey) switch ($CategoryKey) { 'family-attractions' { "$CityName親子景點列表，先看景點類型與交通資訊。" } 'family-restaurants' { "$CityName親子餐廳列表，先看餐廳類型與交通資訊。" } 'family-events' { "$CityName親子活動列表，先看活動類型與交通資訊。" } default { "$CityName親子資訊整理。" } } }
function Get-CategoryIntro { param([string]$CityName,[string]$CategoryKey) switch ($CategoryKey) { 'family-attractions' { "先從$CityName適合帶孩子去的館舍、公園和特色景點開始，方便安排雨天版和放電版行程。" } 'family-restaurants' { '先看店型與交通方式，再決定要安排聚餐、下午茶或順遊用餐。' } 'family-events' { '先從館舍導覽、工作坊與季節活動開始整理，後續再持續更新。' } default { '' } } }
function Get-TopTag { param([string]$CategoryKey,[string]$Type) if ($Type -match '室內') { return '室內' } if ($Type -match '半戶外') { return '半戶外' } if ($Type -match '戶外') { return '戶外' } if ($Type -match '/') { return ($Type -split '/')[0].Trim() } if ($Type) { return $Type } switch ($CategoryKey) { 'family-attractions' { '景點' } 'family-restaurants' { '餐廳' } 'family-events' { '活動' } default { '' } } }
function Get-EventBadge { param([pscustomobject]$Item) if ($Item.title -match '202[0-9]' -or $Item.summary -match '年度|檔期') { return '年度檔期' } if ($Item.type -match '常設|導覽|工作坊' -or $Item.summary -match '持續更新|常設') { return '常設更新' } return '' }
function Get-TransportHint {
  param([pscustomobject]$Item)
  $text = @($Item.type, $Item.parking, $Item.address, $Item.summary, $Item.title) -join ' '
  if ($text -match '捷運|公車|火車|車站|步行|轉運站') { return '捷運公車可到' }
  if ($text -match '農場|牧場|風景區|園區|遊戲場|公園|湖|山|渡假村|動物園|糖廠|農創|文化園區') { return '開車方便' }
  if ($text -match '停車場|停車格|停車空間|商場停車|館方停車|地下停車') { return '開車方便' }
  if ($Item.district -match '中正|大安|信義|中山|松山|萬華|大同|士林|北投|內湖|南港|文山|板橋|永和|中和|三重|新莊|蘆洲|土城|樹林|鶯歌|桃園|中壢|西屯|北屯|西區|南屯|前鎮|鹽埕|鼓山|三民|苓雅|東區|中西區|安平') { return '捷運公車可到' }
  return '開車或大眾運輸皆可'
}

function Build-CardHtml {
  param([string]$CityKey,[string]$CategoryKey,[pscustomobject]$Item)
  $coordAttr = ''
  if ($Item.lat -and $Item.lng) { $coordAttr = ' data-lat="' + $Item.lat + '" data-lng="' + $Item.lng + '"' }
  $topTag = Get-TopTag -CategoryKey $CategoryKey -Type $Item.type
  $transport = Get-TransportHint -Item $Item
  $badgeHtml = ''
  if ($CategoryKey -eq 'family-events') {
    $badge = Get-EventBadge $Item
    if ($badge) { $badgeHtml = '<span class="event-date-badge">' + $badge + '</span>' }
  }
  return @"
<article class="modern-card"$coordAttr><div class="card-header"><h3 class="card-title" style="margin-right:10px;">$(Encode-Html $Item.title)</h3><div class="tags-group"><div class="tags-row"><span class="district-tag" style="background:#E6FFFA;color:#0D9488;">$(Encode-Html $Item.district)</span><span class="district-tag" style="background:#FFF7ED;color:#EA580C;">$(Encode-Html $topTag)</span></div>$badgeHtml<span class="district-tag distance-tag" style="background:#F3F4F6;color:#4B5563;display:none;"></span></div></div><p class="card-desc">$(Encode-Html $Item.summary)</p><div class="info-list"><div class="info-item"><div class="info-icon">📍</div><div class="info-text"><span>類型</span>$(Encode-Html $Item.type)</div></div><div class="info-item"><div class="info-icon">🚗</div><div class="info-text"><span>交通</span>$(Encode-Html $transport)</div></div></div><a class="action-btn" href="/$CityKey/$CategoryKey/$($Item.slug)/">閱讀整理詳情 ➜</a></article>
"@
}

function Build-CategoryPage {
  param([string]$CityKey,[string]$CityName,[string]$CategoryKey,[System.Collections.Generic.List[object]]$Items)
  $categoryName = Get-CategoryName $CategoryKey
  $active = Get-ActiveKey $CategoryKey
  $heroClass = Get-HeroClass $CategoryKey
  $desc = Get-CategoryDescription -CityName $CityName -CategoryKey $CategoryKey
  $intro = Get-CategoryIntro -CityName $CityName -CategoryKey $CategoryKey
  $cards = ($Items | ForEach-Object { Build-CardHtml -CityKey $CityKey -CategoryKey $CategoryKey -Item $_ }) -join ''
  $extraStyle = if ($CategoryKey -eq 'family-events') { '.event-date-badge{display:inline-block;background:#F0FDF4;color:#16A34A;font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px}' } else { '' }
  $html = @"
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$CityName$categoryName</title>
  <meta name="description" content="$desc">
  <link rel="stylesheet" href="/assets/style.css">
  <script src="/assets/header.js"></script>
  <script src="/assets/location-sort.js"></script>
  <style>.card-header{align-items:flex-start}.tags-group{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}.tags-row{display:flex;gap:4px}$extraStyle</style>
</head>
<body>
  <div id="site-header-container" data-active="$active"></div>
  <main class="page-pad"><div class="container"><section class="hero-block $heroClass" style="margin-top:20px;text-align:left;"><div class="breadcrumb"><a href="/">首頁</a> / <a href="/$CityKey/">$CityName</a> / $categoryName</div><h1>$CityName$categoryName</h1><p>$intro</p><div style="margin-top:16px;"><button id="enable-location-btn" style="background:rgba(255,255,255,0.8);backdrop-filter:blur(8px);border:1px solid var(--primary);color:var(--primary);padding:8px 16px;border-radius:20px;font-weight:800;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s;box-shadow:0 4px 10px rgba(0,0,0,0.05);">開啟定位，依我的距離排序</button></div></section><section class="modern-cards-grid" id="listing-grid">$cards</section></div></main>
</body>
</html>
"@
  Write-Utf8File "D:\parenting-site-v1\$CityKey\$CategoryKey\index.html" $html
}

function Get-PreviewCard {
  param([string]$CityKey,[string]$CategoryKey,[string]$Label,[string]$IconStyle,[pscustomobject]$Item)
  return @"
<a href="/$CityKey/$CategoryKey/$($Item.slug)/" class="mini-card"><div class="mini-card-icon" style="$IconStyle">$Label</div><div class="mini-card-info"><h3>$(Encode-Html $Item.title)</h3><p>$(Encode-Html $Item.summary)</p></div></a>
"@
}

function Build-CityPage {
  param([string]$CityKey,[string]$CityName,[System.Collections.Generic.List[object]]$Attractions,[System.Collections.Generic.List[object]]$Restaurants,[System.Collections.Generic.List[object]]$Events)
  $previews = New-Object System.Collections.Generic.List[string]
  foreach ($item in $Attractions | Select-Object -First 4) { $previews.Add((Get-PreviewCard -CityKey $CityKey -CategoryKey 'family-attractions' -Label '景' -IconStyle 'background:#DBEAFE;color:#2563EB;' -Item $item)) }
  foreach ($item in $Restaurants | Select-Object -First 2) { $previews.Add((Get-PreviewCard -CityKey $CityKey -CategoryKey 'family-restaurants' -Label '餐' -IconStyle 'background:#FDF2F8;color:#DB2777;' -Item $item)) }
  foreach ($item in $Events | Select-Object -First 2) { $previews.Add((Get-PreviewCard -CityKey $CityKey -CategoryKey 'family-events' -Label '活' -IconStyle 'background:#DCFCE7;color:#16A34A;' -Item $item)) }
  $previewHtml = $previews -join ''
  $description = "整理$CityName親子景點、餐廳與活動，先看停車、室內外與適合安排的行程方向。"
  $html = @"
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$CityName親子景點、餐廳、活動整理</title>
  <meta name="description" content="$description">
  <link rel="stylesheet" href="/assets/style.css">
  <script src="/assets/header.js"></script>
</head>
<body>
  <div id="site-header-container" data-active="home"></div>
  <main class="page-pad container">
    <div class="city-header">
      <div class="breadcrumb"><a href="/index.html">首頁</a> / $CityName</div>
      <h1>$CityName親子資訊</h1>
      <p style="color:var(--text-muted); margin-top:8px;">$description</p>
      <div class="wrap-nav">
        <a href="/$CityKey/family-attractions/index.html" class="mini-pill active">景點 ($($Attractions.Count))</a>
        <a href="/$CityKey/family-restaurants/index.html" class="mini-pill">餐廳 ($($Restaurants.Count))</a>
        <a href="/$CityKey/family-events/index.html" class="mini-pill">活動 ($($Events.Count))</a>
      </div>
    </div>
    <div class="preview-grid">
      $previewHtml
    </div>
  </main>
</body>
</html>
"@
  Write-Utf8File "D:\parenting-site-v1\$CityKey\index.html" $html
}

$cityMap = [ordered]@{ taipei = '台北市'; taichung = '台中市'; kaohsiung = '高雄市'; tainan = '台南市'; taoyuan = '桃園市'; changhua = '彰化縣'; miaoli = '苗栗縣'; newtaipei = '新北市'; nantou = '南投縣' }
$categories = @('family-attractions','family-restaurants','family-events')
foreach ($cityKey in $cityMap.Keys) {
  $cityName = $cityMap[$cityKey]
  $categoryItems = @{}
  foreach ($categoryKey in $categories) {
    $categoryPath = "D:\parenting-site-v1\$cityKey\$categoryKey"
    if (-not (Test-Path $categoryPath)) { $categoryItems[$categoryKey] = New-Object System.Collections.Generic.List[object]; continue }
    $coords = Get-CoordsLookup -CategoryIndexPath (Join-Path $categoryPath 'index.html')
    $items = New-Object System.Collections.Generic.List[object]
    foreach ($dir in Get-ChildItem -LiteralPath $categoryPath -Directory | Sort-Object Name) {
      $item = Get-ItemFromDetail -Dir $dir -CoordsLookup $coords
      if ($item -and $item.title) { $items.Add($item) }
    }
    $categoryItems[$categoryKey] = $items
    Build-CategoryPage -CityKey $cityKey -CityName $cityName -CategoryKey $categoryKey -Items $items
  }
  Build-CityPage -CityKey $cityKey -CityName $cityName -Attractions $categoryItems['family-attractions'] -Restaurants $categoryItems['family-restaurants'] -Events $categoryItems['family-events']
}
