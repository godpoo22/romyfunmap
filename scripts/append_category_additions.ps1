param(
  [Parameter(Mandatory = $true)][string]$PagePath,
  [Parameter(Mandatory = $true)][string]$BasePath,
  [Parameter(Mandatory = $true)][string]$DataPath,
  [Parameter(Mandatory = $true)][string]$SectionTitle
)

$items = Import-Csv -LiteralPath $DataPath -Delimiter '|'
$links = ($items | ForEach-Object { "<a href='$BasePath/$($_.slug)/'>$($_.title)</a>" }) -join '、'
$section = @"
<section id="generated-additions" class="container" style="margin-top:24px;margin-bottom:12px;background:rgba(255,255,255,0.72);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.8);border-radius:24px;padding:20px;">
  <h2 style="margin:0 0 10px 0;font-size:22px;">$SectionTitle</h2>
  <p style="margin:0;color:var(--text-muted);line-height:1.8;">這一輪新增：$links</p>
</section>
"@

$content = Get-Content -LiteralPath $PagePath -Raw
$content = [regex]::Replace($content, '<section id="generated-additions"[\s\S]*?</section>', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$content = $content -replace '</main>', "$section</main>"
[System.IO.File]::WriteAllText($PagePath, $content, (New-Object System.Text.UTF8Encoding($false)))
