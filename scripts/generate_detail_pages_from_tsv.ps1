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

$active = if ($CategoryKey -eq 'family-attractions') { 'attractions' } else { 'restaurants' }
$items = Import-Csv -LiteralPath $DataPath -Delimiter '|'

foreach ($item in $items) {
  $mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + [System.Uri]::EscapeDataString($item.map)
  if ($CategoryKey -eq 'family-attractions') {
    $row1 = "<p><strong>景點類型：</strong>$($item.type)</p><p>$($item.summary)</p>"
    $row2 = "<p><strong>建議停留：</strong>$($item.stay)</p><p><strong>適合天氣：</strong>$($item.weather)</p>"
  } else {
    $row1 = "<p><strong>餐廳類型：</strong>$($item.type)</p><p>$($item.summary)</p>"
    $row2 = "<p><strong>建議停留：</strong>$($item.stay)</p><p><strong>適合情境：</strong>$($item.weather)</p>"
  }
  $html = @"
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>$($item.title) | $CityName$CategoryName</title>
  <meta name="description" content="$($item.summary)" />
  <link rel="stylesheet" href="/assets/style.css" />
  <script src="/assets/header.js"></script>
  <script src="/assets/app.js"></script>
</head>
<body>
  <div id="site-header-container" data-active="$active"></div>
  <main class="page-pad">
    <div class="container">
      <div style="margin-top:20px;">
        <div class="breadcrumb" style="color:var(--text-muted);font-size:13px;margin-bottom:10px;"><a href="/">首頁</a> / <a href="/$CityKey/">$CityName</a> / <a href="/$CityKey/$CategoryKey/">$CategoryName</a> / $($item.title)</div>
        <h1 style="font-size:28px;color:var(--text-dark);margin:10px 0;">$($item.title)</h1>
        <p style="color:var(--text-muted);font-size:14px;margin:0;">$($item.summary)</p>
      </div>
      <section class="tabelog-wrap" style="background:rgba(255,255,255,0.65);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.8);margin-top:20px;">
        <h2 class="tabelog-title">詳細資訊</h2>
        <table class="tabelog-table">
          <tbody>
            <tr><th>重點資訊</th><td>$row1</td></tr>
            <tr><th>行程安排</th><td>$row2</td></tr>
            <tr><th>基本資訊</th><td><p><strong>地區：</strong>$($item.district)</p><p><strong>親子提醒：</strong>$($item.tip)</p></td></tr>
            <tr><th>交通與停車</th><td><p><strong>地址：</strong>$($item.address)</p><p><strong>停車：</strong>$($item.parking)</p><p style="margin-top:8px;"><a href="$mapUrl" style="color:var(--primary);font-size:13px;text-decoration:underline;font-weight:bold;" target="_blank">在地圖上查看</a></p></td></tr>
            <tr><th>適合年齡</th><td><p>$($item.age)</p></td></tr>
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
  Write-Utf8File "D:\parenting-site-v1\$CityKey\$CategoryKey\$($item.slug)\index.html" $html
}
