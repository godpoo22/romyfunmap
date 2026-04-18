from __future__ import annotations

import csv
import html
import re
from pathlib import Path

ROOT = Path(r"D:\parenting-site-v1")
DATA_DIR = ROOT / "scripts" / "data"

CITY_NAMES = {
    "taipei": "\u53f0\u5317\u5e02",
    "taoyuan": "\u6843\u5712\u5e02",
    "changhua": "\u5f70\u5316\u7e23",
    "miaoli": "\u82d7\u6817\u7e23",
    "newtaipei": "\u65b0\u5317\u5e02",
    "nantou": "\u5357\u6295\u7e23",
    "tainan": "\u53f0\u5357\u5e02",
}

CATEGORY_NAMES = {
    "family-attractions": "\u89aa\u5b50\u666f\u9ede",
    "family-restaurants": "\u89aa\u5b50\u9910\u5ef3",
}

ACTIVE_KEYS = {
    "family-attractions": "attractions",
    "family-restaurants": "restaurants",
}

HERO_CLASSES = {
    "family-attractions": "green",
    "family-restaurants": "orange",
}

TSV_SOURCES = {
    ("taipei", "family-attractions"): "taipei_attractions.tsv",
    ("taipei", "family-restaurants"): "taipei_restaurants.tsv",
    ("taoyuan", "family-attractions"): "taoyuan_attractions.tsv",
    ("taoyuan", "family-restaurants"): "taoyuan_restaurants.tsv",
    ("changhua", "family-restaurants"): "changhua_restaurants.tsv",
    ("miaoli", "family-attractions"): "miaoli_attractions.tsv",
    ("miaoli", "family-restaurants"): "miaoli_restaurants.tsv",
    ("newtaipei", "family-attractions"): "newtaipei_attractions.tsv",
    ("newtaipei", "family-restaurants"): "newtaipei_restaurants.tsv",
    ("nantou", "family-attractions"): "nantou_attractions.tsv",
    ("nantou", "family-restaurants"): "nantou_restaurants.tsv",
    ("tainan", "family-restaurants"): "tainan_restaurants.tsv",
}


def read_tsv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f, delimiter="|")
        rows: list[dict[str, str]] = []
        for row in reader:
            cleaned = {}
            for key, value in row.items():
                if key is None:
                    continue
                cleaned[key.lstrip("\ufeff")] = value or ""
            rows.append(cleaned)
        return rows


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def transport_hint(item: dict[str, str]) -> str:
    text = " ".join(
        [
            item.get("type", ""),
            item.get("parking", ""),
            item.get("address", ""),
            item.get("summary", ""),
            item.get("title", ""),
        ]
    )
    if re.search(r"\u6377\u904b|\u516c\u8eca|\u706b\u8eca|\u8eca\u7ad9|\u6b65\u884c|\u8f49\u904b\u7ad9", text):
        return "\u6377\u904b\u516c\u8eca\u53ef\u5230"
    if re.search(r"\u8fb2\u5834|\u7267\u5834|\u98a8\u666f\u5340|\u5712\u5340|\u904a\u6232\u5834|\u516c\u5712|\u6e56|\u5c71|\u6e21\u5047\u6751|\u52d5\u7269\u5712|\u7cd6\u5ee0|\u8fb2\u5275|\u6587\u5316\u5712\u5340", text):
        return "\u958b\u8eca\u65b9\u4fbf"
    if re.search(r"\u505c\u8eca\u5834|\u505c\u8eca\u683c|\u505c\u8eca\u7a7a\u9593|\u5546\u5834\u505c\u8eca|\u9928\u65b9\u505c\u8eca|\u5730\u4e0b\u505c\u8eca", text):
        return "\u958b\u8eca\u65b9\u4fbf"
    return "\u958b\u8eca\u6216\u5927\u773e\u904b\u8f38\u7686\u53ef"


def top_tag(kind: str) -> str:
    if "\u5ba4\u5167" in kind:
        return "\u5ba4\u5167"
    if "\u534a\u6236\u5916" in kind:
        return "\u534a\u6236\u5916"
    if "\u6236\u5916" in kind:
        return "\u6236\u5916"
    return kind.split("/")[0].strip() if "/" in kind else kind


def city_desc(city_name: str) -> str:
    return f"\u6574\u7406{city_name}\u89aa\u5b50\u666f\u9ede\u3001\u9910\u5ef3\u8207\u6d3b\u52d5\uff0c\u5148\u770b\u4ea4\u901a\u3001\u5ba4\u5167\u5916\u8207\u9069\u5408\u5b89\u6392\u7684\u884c\u7a0b\u65b9\u5411\u3002"


def category_desc(city_name: str, category_key: str) -> str:
    lead = "\u666f\u9ede" if category_key == "family-attractions" else "\u9910\u5ef3"
    return f"{city_name}{CATEGORY_NAMES[category_key]}\u5217\u8868\uff0c\u5148\u770b{lead}\u985e\u578b\u8207\u4ea4\u901a\u8cc7\u8a0a\u3002"


def category_intro(city_name: str, category_key: str) -> str:
    if category_key == "family-attractions":
        return f"\u5148\u5f9e{city_name}\u9069\u5408\u5e36\u5b69\u5b50\u53bb\u7684\u9928\u820d\u3001\u516c\u5712\u548c\u7279\u8272\u666f\u9ede\u958b\u59cb\uff0c\u65b9\u4fbf\u5b89\u6392\u96e8\u5929\u7248\u548c\u653e\u96fb\u7248\u884c\u7a0b\u3002"
    return "\u5148\u770b\u5e97\u578b\u8207\u4ea4\u901a\u65b9\u5f0f\uff0c\u518d\u6c7a\u5b9a\u8981\u5b89\u6392\u805a\u9910\u3001\u4e0b\u5348\u8336\u6216\u9806\u904a\u7528\u9910\u3002"


def render_detail(city_key: str, category_key: str, item: dict[str, str]) -> str:
    city_name = CITY_NAMES[city_key]
    cat_name = CATEGORY_NAMES[category_key]
    active = ACTIVE_KEYS[category_key]
    label = "\u9910\u5ef3\u985e\u578b" if category_key == "family-restaurants" else "\u985e\u578b"
    map_query = item.get("map", item["title"]).replace(" ", "%20")
    map_url = f"https://www.google.com/maps/search/?api=1&query={map_query}"
    return f"""<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{html.escape(item['title'])} | {city_name}{cat_name}</title>
  <meta name="description" content="{html.escape(item['summary'])}" />
  <link rel="stylesheet" href="/assets/style.css" />
  <script src="/assets/header.js"></script>
  <script src="/assets/app.js"></script>
</head>
<body>
  <div id="site-header-container" data-active="{active}"></div>
  <main class="page-pad">
    <div class="container">
      <div style="margin-top:20px;">
        <div class="breadcrumb" style="color:var(--text-muted);font-size:13px;margin-bottom:10px;"><a href="/">首頁</a> / <a href="/{city_key}/">{city_name}</a> / <a href="/{city_key}/{category_key}/">{cat_name}</a> / {html.escape(item['title'])}</div>
        <h1 style="font-size:28px;color:var(--text-dark);margin:10px 0;">{html.escape(item['title'])}</h1>
        <p style="color:var(--text-muted);font-size:14px;margin:0;">{html.escape(item['summary'])}</p>
      </div>
      <section class="tabelog-wrap" style="background:rgba(255,255,255,0.65);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.8);margin-top:20px;">
        <h2 class="tabelog-title">詳細資訊</h2>
        <table class="tabelog-table">
          <tbody>
            <tr><th>基本介紹</th><td><p><strong>{label}：</strong>{html.escape(item['type'])}</p><p>{html.escape(item['summary'])}</p></td></tr>
            <tr><th>安排建議</th><td><p><strong>建議停留：</strong>{html.escape(item.get('stay', '1 到 2 小時'))}</p><p><strong>雨天備案：</strong>{html.escape(item.get('weather', '依現場狀況而定'))}</p></td></tr>
            <tr><th>補充資訊</th><td><p><strong>地區：</strong>{html.escape(item.get('district', city_name))}</p><p><strong>提醒：</strong>{html.escape(item.get('tip', '建議出發前再確認最新資訊'))}</p></td></tr>
            <tr><th>交通與停車</th><td><p><strong>地址：</strong>{html.escape(item.get('address', '建議直接導航店名'))}</p><p><strong>停車：</strong>{html.escape(item.get('parking', '周邊停車場'))}</p><p style="margin-top:8px;"><a href="{map_url}" style="color:var(--primary);font-size:13px;text-decoration:underline;font-weight:bold;" target="_blank">在地圖上查看</a></p></td></tr>
            <tr><th>適合年齡</th><td><p>{html.escape(item.get('age', '各年齡層都可安排'))}</p></td></tr>
          </tbody>
        </table>
      </section>
    </div>
  </main>
  <div class="sticky-bottom-bar" style="background:rgba(255,255,255,0.85);backdrop-filter:blur(15px);">
    <div class="sticky-bottom-inner">
      <button class="action-share" data-copy-url>分享</button>
      <a href="{map_url}" target="_blank" class="action-main-btn"><span class="btn-icon" style="margin-right:8px;">📍</span>在地圖查看位置</a>
    </div>
  </div>
</body>
</html>
"""


def render_category(city_key: str, category_key: str, items: list[dict[str, str]]) -> str:
    city_name = CITY_NAMES[city_key]
    cat_name = CATEGORY_NAMES[category_key]
    cards: list[str] = []
    for item in items:
        lat = item.get("lat", "")
        lng = item.get("lng", "")
        coord_attr = f' data-lat="{lat}" data-lng="{lng}"' if lat and lng else ""
        cards.append(
            f'<article class="modern-card"{coord_attr}><div class="card-header"><h3 class="card-title" style="margin-right:10px;">{html.escape(item["title"])}</h3><div class="tags-group"><div class="tags-row"><span class="district-tag" style="background:#E6FFFA;color:#0D9488;">{html.escape(item.get("district", city_name))}</span><span class="district-tag" style="background:#FFF7ED;color:#EA580C;">{html.escape(top_tag(item["type"]))}</span></div><span class="district-tag distance-tag" style="background:#F3F4F6;color:#4B5563;display:none;"></span></div></div><p class="card-desc">{html.escape(item["summary"])}</p><div class="info-list"><div class="info-item"><div class="info-icon">📍</div><div class="info-text"><span>類型</span>{html.escape(item["type"])}</div></div><div class="info-item"><div class="info-icon">🚗</div><div class="info-text"><span>交通</span>{html.escape(transport_hint(item))}</div></div></div><a class="action-btn" href="/{city_key}/{category_key}/{item["slug"]}/">閱讀整理詳情 ➜</a></article>'
        )
    return f"""<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{city_name}{cat_name}</title>
  <meta name="description" content="{category_desc(city_name, category_key)}">
  <link rel="stylesheet" href="/assets/style.css">
  <script src="/assets/header.js"></script>
  <script src="/assets/location-sort.js"></script>
  <style>.card-header{{align-items:flex-start}}.tags-group{{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}}.tags-row{{display:flex;gap:4px}}</style>
</head>
<body>
  <div id="site-header-container" data-active="{ACTIVE_KEYS[category_key]}"></div>
  <main class="page-pad"><div class="container"><section class="hero-block {HERO_CLASSES[category_key]}" style="margin-top:20px;text-align:left;"><div class="breadcrumb"><a href="/">首頁</a> / <a href="/{city_key}/">{city_name}</a> / {cat_name}</div><h1>{city_name}{cat_name}</h1><p>{category_intro(city_name, category_key)}</p><div style="margin-top:16px;"><button id="enable-location-btn" style="background:rgba(255,255,255,0.8);backdrop-filter:blur(8px);border:1px solid var(--primary);color:var(--primary);padding:8px 16px;border-radius:20px;font-weight:800;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s;box-shadow:0 4px 10px rgba(0,0,0,0.05);">開啟定位，依我的距離排序</button></div></section><section class="modern-cards-grid" id="listing-grid">{''.join(cards)}</section></div></main>
</body>
</html>
"""


def render_city(city_key: str, sections: dict[str, list[dict[str, str]]]) -> str:
    city_name = CITY_NAMES[city_key]
    desc = city_desc(city_name)
    previews: list[str] = []
    for category_key, label, style, limit in [
        ("family-attractions", "景", "background:#DBEAFE;color:#2563EB;", 4),
        ("family-restaurants", "餐", "background:#FDF2F8;color:#DB2777;", 2),
    ]:
        for item in sections.get(category_key, [])[:limit]:
            previews.append(
                f'<a href="/{city_key}/{category_key}/{item["slug"]}/" class="mini-card"><div class="mini-card-icon" style="{style}">{label}</div><div class="mini-card-info"><h3>{html.escape(item["title"])}</h3><p>{html.escape(item["summary"])}</p></div></a>'
            )
    return f"""<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{city_name}親子景點、餐廳、活動整理</title>
  <meta name="description" content="{desc}">
  <link rel="stylesheet" href="/assets/style.css">
  <script src="/assets/header.js"></script>
</head>
<body>
  <div id="site-header-container" data-active="home"></div>
  <main class="page-pad container">
    <div class="city-header">
      <div class="breadcrumb"><a href="/index.html">首頁</a> / {city_name}</div>
      <h1>{city_name}親子資訊</h1>
      <p style="color:var(--text-muted); margin-top:8px;">{desc}</p>
      <div class="wrap-nav">
        <a href="/{city_key}/family-attractions/index.html" class="mini-pill active">景點 ({len(sections.get("family-attractions", []))})</a>
        <a href="/{city_key}/family-restaurants/index.html" class="mini-pill">餐廳 ({len(sections.get("family-restaurants", []))})</a>
        <a href="/{city_key}/family-events/index.html" class="mini-pill">活動</a>
      </div>
    </div>
    <div class="preview-grid">{''.join(previews)}</div>
  </main>
</body>
</html>
"""


def main() -> None:
    grouped: dict[str, dict[str, list[dict[str, str]]]] = {city: {} for city in CITY_NAMES}

    for (city_key, category_key), filename in TSV_SOURCES.items():
        rows = read_tsv(DATA_DIR / filename)
        grouped[city_key][category_key] = rows
        for row in rows:
            write_text(ROOT / city_key / category_key / row["slug"] / "index.html", render_detail(city_key, category_key, row))
        write_text(ROOT / city_key / category_key / "index.html", render_category(city_key, category_key, rows))

    for city_key, sections in grouped.items():
        if sections:
            write_text(ROOT / city_key / "index.html", render_city(city_key, sections))


if __name__ == "__main__":
    main()
