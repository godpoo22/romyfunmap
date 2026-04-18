from __future__ import annotations

import html
import re
from pathlib import Path


ROOT = Path(r"D:\parenting-site-v1")

CITY_MAP = {
    "taipei": "台北市",
    "taichung": "台中市",
    "kaohsiung": "高雄市",
    "tainan": "台南市",
    "taoyuan": "桃園市",
    "changhua": "彰化縣",
    "miaoli": "苗栗縣",
    "newtaipei": "新北市",
    "nantou": "南投縣",
}

CITY_CENTER = {
    "taipei": ("25.0330", "121.5654"),
    "taichung": ("24.1477", "120.6736"),
    "kaohsiung": ("22.6273", "120.3014"),
    "tainan": ("22.9997", "120.2270"),
    "taoyuan": ("24.9936", "121.3010"),
    "changhua": ("24.0810", "120.5380"),
    "miaoli": ("24.5602", "120.8214"),
    "newtaipei": ("25.0121", "121.4657"),
    "nantou": ("23.9609", "120.9719"),
}

DISTRICT_COORDS = {
    "中山區": ("25.0643", "121.5330"),
    "中正區": ("25.0324", "121.5199"),
    "信義區": ("25.0337", "121.5660"),
    "內湖區": ("25.0687", "121.5889"),
    "士林區": ("25.0928", "121.5197"),
    "大安區": ("25.0260", "121.5437"),
    "文山區": ("24.9889", "121.5705"),
    "松山區": ("25.0580", "121.5570"),
    "北區": ("24.1564", "120.6829"),
    "北屯區": ("24.1882", "120.7250"),
    "南屯區": ("24.1383", "120.6167"),
    "后里區": ("24.3095", "120.7225"),
    "大里區": ("24.1042", "120.6889"),
    "大雅區": ("24.2257", "120.6471"),
    "太平區": ("24.1260", "120.7180"),
    "東勢區": ("24.2592", "120.8278"),
    "梧棲區": ("24.2547", "120.5240"),
    "沙鹿區": ("24.2377", "120.5663"),
    "清水區": ("24.2762", "120.5767"),
    "潭子區": ("24.2120", "120.7053"),
    "神岡區": ("24.2540", "120.6615"),
    "西區": ("24.1415", "120.6632"),
    "西屯區": ("24.1815", "120.6278"),
    "豐原區": ("24.2521", "120.7224"),
    "安南區": ("23.0478", "120.1880"),
    "東區": ("22.9869", "120.2226"),
    "中壢區": ("24.9657", "121.2243"),
    "桃園區": ("24.9939", "121.3010"),
    "楊梅區": ("24.9141", "121.1457"),
    "北斗鎮": ("23.8795", "120.5219"),
    "員林市": ("23.9567", "120.5717"),
    "彰化市": ("24.0809", "120.5425"),
    "三義鄉": ("24.4102", "120.7705"),
    "大湖鄉": ("24.4221", "120.8637"),
    "後龍鎮": ("24.6115", "120.7865"),
    "苗栗市": ("24.5602", "120.8214"),
    "通霄鎮": ("24.4924", "120.6840"),
    "銅鑼鄉": ("24.4866", "120.7861"),
    "頭份市": ("24.6860", "120.9130"),
    "三芝區": ("25.2574", "121.5008"),
    "八里區": ("25.1461", "121.4068"),
    "平溪區": ("25.0257", "121.7382"),
    "板橋區": ("25.0119", "121.4637"),
    "永和區": ("25.0103", "121.5146"),
    "淡水區": ("25.1719", "121.4440"),
    "瑞芳區": ("25.1086", "121.8080"),
    "萬里區": ("25.1811", "121.6895"),
    "鶯歌區": ("24.9548", "121.3545"),
    "仁愛鄉": ("24.0244", "121.1334"),
    "南投市": ("23.9157", "120.6839"),
    "埔里鎮": ("23.9642", "120.9695"),
    "魚池鄉": ("23.8961", "120.9354"),
    "全市各地": ("25.0330", "121.5654"),
    "各行政區": ("25.0330", "121.5654"),
    "西屯區（中科）": ("24.1925", "120.6038"),
}

TSV_CITY_CATEGORY = {
    ("taipei", "family-attractions"): "taipei_attractions.tsv",
    ("taipei", "family-restaurants"): "taipei_restaurants.tsv",
    ("taoyuan", "family-attractions"): "taoyuan_attractions.tsv",
    ("taoyuan", "family-restaurants"): "taoyuan_restaurants.tsv",
    ("changhua", "family-restaurants"): "changhua_restaurants.tsv",
    ("miaoli", "family-attractions"): "miaoli_attractions.tsv",
    ("miaoli", "family-restaurants"): "miaoli_restaurants.tsv",
    ("nantou", "family-attractions"): "nantou_attractions.tsv",
    ("nantou", "family-restaurants"): "nantou_restaurants.tsv",
    ("newtaipei", "family-attractions"): "newtaipei_attractions.tsv",
    ("newtaipei", "family-restaurants"): "newtaipei_restaurants.tsv",
    ("tainan", "family-restaurants"): "tainan_restaurants.tsv",
}

CATEGORY_META = {
    "family-attractions": {
        "name": "親子景點",
        "active": "attractions",
        "hero_class": "green",
        "intro": "{city}適合帶孩子去的館舍、公園和特色景點整理，方便安排雨天版和放電版行程。",
        "desc": "{city}親子景點列表，先看景點類型與交通資訊。",
        "fallback_tag": "景點",
    },
    "family-restaurants": {
        "name": "親子餐廳",
        "active": "restaurants",
        "hero_class": "orange",
        "intro": "先看店型與交通方式，再決定要安排聚餐、下午茶或順遊用餐。",
        "desc": "{city}親子餐廳列表，先看餐廳類型與交通資訊。",
        "fallback_tag": "餐廳",
    },
    "family-events": {
        "name": "親子活動",
        "active": "events",
        "hero_class": "purple",
        "intro": "先從館舍導覽、工作坊與季節活動開始整理，後續再持續更新。",
        "desc": "{city}親子活動列表，先看活動類型與交通資訊。",
        "fallback_tag": "活動",
    },
}


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8-sig", newline="\n")


def clean_text(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def encode_text(text: str) -> str:
    return html.escape(text or "", quote=True)


def load_tsv_lookup(city_key: str, category_key: str) -> dict[str, dict[str, str]]:
    name = TSV_CITY_CATEGORY.get((city_key, category_key))
    if not name:
        return {}
    path = ROOT / "scripts" / "data" / name
    if not path.exists():
        return {}
    lines = read_text(path).splitlines()
    if not lines:
        return {}
    headers = lines[0].split("|")
    lookup: dict[str, dict[str, str]] = {}
    for line in lines[1:]:
        if not line.strip():
            continue
        parts = line.split("|")
        row = {headers[i]: (parts[i] if i < len(parts) else "") for i in range(len(headers))}
        slug = row.get("slug", "").strip()
        if slug:
            lookup[slug] = row
    return lookup


def extract_tag_text(source: str, pattern: str) -> str:
    match = re.search(pattern, source, flags=re.S)
    return clean_text(match.group(1)) if match else ""


def extract_value(source: str, labels: list[str]) -> str:
    for label in labels:
        pattern = rf"<strong>\s*{re.escape(label)}\s*[：:]\s*</strong>\s*([^<]+)"
        match = re.search(pattern, source, flags=re.I | re.S)
        if match:
            return clean_text(match.group(1))
    return ""


def get_coords_lookup(index_path: Path) -> dict[str, tuple[str, str]]:
    lookup: dict[str, tuple[str, str]] = {}
    if not index_path.exists():
        return lookup
    source = read_text(index_path)
    pattern = re.compile(
        r'<article class="modern-card"[^>]*?(?:data-lat="([^"]*)"\s+data-lng="([^"]*)")?[^>]*>.*?'
        r'<a class="action-btn" href="/[^/]+/[^/]+/([^/]+)/">',
        re.S,
    )
    for lat, lng, slug in pattern.findall(source):
        lookup[slug] = (lat or "", lng or "")
    return lookup


def get_top_tag(category_key: str, type_text: str) -> str:
    if "室內" in type_text:
        return "室內"
    if "半戶外" in type_text:
        return "半戶外"
    if "戶外" in type_text:
        return "戶外"
    if "/" in type_text:
        return type_text.split("/")[0].strip()
    return type_text or CATEGORY_META[category_key]["fallback_tag"]


def get_event_badge(item: dict[str, str]) -> str:
    title = item["title"]
    summary = item["summary"]
    type_text = item["type"]
    if re.search(r"202\d", title) or re.search(r"年度|檔期", summary):
        return "年度檔期"
    if re.search(r"常設|導覽|工作坊", type_text) or re.search(r"持續更新|常設", summary):
        return "常設更新"
    return ""


def get_transport_hint(item: dict[str, str]) -> str:
    text = " ".join(
        [
            item.get("type", ""),
            item.get("parking", ""),
            item.get("address", ""),
            item.get("summary", ""),
            item.get("title", ""),
        ]
    )
    if re.search(r"捷運|公車|火車|車站|步行|轉運站", text):
        return "大眾運輸可到"
    if re.search(r"農場|牧場|風景區|園區|遊戲場|公園|湖|山|渡假村|動物園|糖廠|農創|文化園區", text):
        return "開車方便"
    if re.search(r"停車場|停車格|停車空間|商場停車|館方停車|地下停車", text):
        return "開車方便"
    if re.search(
        r"中正|大安|信義|中山|松山|萬華|大同|士林|北投|內湖|南港|文山|板橋|永和|中和|三重|新莊|蘆洲|土城|樹林|鶯歌|桃園|中壢|西屯|北屯|西區|南屯|前鎮|鹽埕|鼓山|三民|苓雅|東區|中西區|安平",
        item.get("district", ""),
    ):
        return "大眾運輸可到"
    return "開車方便"


def parse_detail(
    detail_path: Path,
    coords_lookup: dict[str, tuple[str, str]],
    tsv_lookup: dict[str, dict[str, str]],
    category_key: str,
) -> dict[str, str]:
    source = read_text(detail_path)
    slug = detail_path.parent.name
    lat, lng = coords_lookup.get(slug, ("", ""))
    tsv = tsv_lookup.get(slug, {})
    summary = tsv.get("summary") or extract_tag_text(source, r"<h1[^>]*>.*?</h1>\s*<p[^>]*>(.*?)</p>")
    district = tsv.get("district") or extract_value(source, ["地區"])
    if not district:
        match = re.search(r"^[^・]+・([^｜|]+)[｜|]", summary)
        if match:
            district = match.group(1).strip()
    type_text = tsv.get("type") or extract_value(source, ["類型", "餐廳類型", "活動類型", "主題內容", "主題", "空間型態"])
    if not type_text:
        type_text = CATEGORY_META[category_key]["name"]
    parking = tsv.get("parking") or extract_value(source, ["停車"])
    if not parking:
        parking = "建議查看地圖周邊停車資訊"
    return {
        "slug": slug,
        "title": tsv.get("title") or extract_tag_text(source, r"<h1[^>]*>(.*?)</h1>"),
        "summary": summary,
        "district": district,
        "type": type_text,
        "parking": parking,
        "address": tsv.get("address") or extract_value(source, ["地址"]),
        "lat": lat,
        "lng": lng,
    }


def resolve_coords(city_key: str, item: dict[str, str]) -> tuple[str, str]:
    lat = item.get("lat", "")
    lng = item.get("lng", "")
    if lat and lng:
        return lat, lng
    district = item.get("district", "").strip()
    if district in DISTRICT_COORDS:
        return DISTRICT_COORDS[district]
    summary = item.get("summary", "")
    match = re.search(r"^[^・]+・([^｜|]+)[｜|]", summary)
    if match:
        parsed = match.group(1).strip()
        if parsed in DISTRICT_COORDS:
            return DISTRICT_COORDS[parsed]
    return CITY_CENTER.get(city_key, ("", ""))


def build_card(city_key: str, category_key: str, item: dict[str, str]) -> str:
    lat, lng = resolve_coords(city_key, item)
    coord_attr = ""
    if lat and lng:
        coord_attr = f' data-lat="{encode_text(lat)}" data-lng="{encode_text(lng)}"'
    badge_html = ""
    if category_key == "family-events":
        badge = get_event_badge(item)
        if badge:
            badge_html = f'\n                <span class="event-date-badge">{encode_text(badge)}</span>'
    return f"""          <article class="modern-card"{coord_attr}>
            <div class="card-header">
              <h3 class="card-title" style="margin-right:10px;">{encode_text(item["title"])}</h3>
              <div class="tags-group">
                <div class="tags-row">
                  <span class="district-tag" style="background:#E6FFFA;color:#0D9488;">{encode_text(item["district"])}</span>
                  <span class="district-tag" style="background:#FFF7ED;color:#EA580C;">{encode_text(get_top_tag(category_key, item["type"]))}</span>
                </div>{badge_html}
                <span class="district-tag distance-tag" style="background:#F3F4F6;color:#4B5563;display:none;"></span>
              </div>
            </div>
            <p class="card-desc">{encode_text(item["summary"])}</p>
            <div class="info-list">
              <div class="info-item">
                <div class="info-icon">📍</div>
                <div class="info-text">
                  <span>類型</span>{encode_text(item["type"])}
                </div>
              </div>
              <div class="info-item">
                <div class="info-icon">🚗</div>
                <div class="info-text">
                  <span>交通</span>{encode_text(get_transport_hint(item))}
                </div>
              </div>
            </div>
            <a class="action-btn" href="/{city_key}/{category_key}/{item["slug"]}/">閱讀整理詳情 ➜</a>
          </article>"""


def build_category_page(city_key: str, city_name: str, category_key: str, items: list[dict[str, str]]) -> str:
    meta = CATEGORY_META[category_key]
    extra_style = (
        ".event-date-badge{display:inline-block;background:#F0FDF4;color:#16A34A;font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px}"
        if category_key == "family-events"
        else ""
    )
    cards = "\n".join(build_card(city_key, category_key, item) for item in items)
    return f"""<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{city_name}{meta["name"]}</title>
    <meta name="description" content="{encode_text(meta["desc"].format(city=city_name))}">
    <link rel="stylesheet" href="/assets/style.css">
    <script src="/assets/header.js"></script>
    <script src="/assets/location-sort.js"></script>
    <style>
      .card-header{{align-items:flex-start}}
      .tags-group{{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}}
      .tags-row{{display:flex;gap:4px}}
      {extra_style}
    </style>
  </head>
  <body>
    <div id="site-header-container" data-active="{meta["active"]}"></div>
    <main class="page-pad">
      <div class="container">
        <section class="hero-block {meta["hero_class"]}" style="margin-top:20px;text-align:left;">
          <div class="breadcrumb">
            <a href="/">首頁</a>
            /
            <a href="/{city_key}/">{city_name}</a>
            / {meta["name"]}
          </div>
          <h1>{city_name}{meta["name"]}</h1>
          <p>{encode_text(meta["intro"].format(city=city_name))}</p>
          <div style="margin-top:16px;">
            <button id="enable-location-btn" style="background:rgba(255,255,255,0.8);backdrop-filter:blur(8px);border:1px solid var(--primary);color:var(--primary);padding:8px 16px;border-radius:20px;font-weight:800;font-size:14px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s;box-shadow:0 4px 10px rgba(0,0,0,0.05);">開啟定位，依我的距離排序</button>
          </div>
        </section>
        <section class="modern-cards-grid" id="listing-grid">
{cards}
        </section>
      </div>
    </main>
  </body>
</html>
"""


def build_preview_card(city_key: str, category_key: str, label: str, icon_style: str, item: dict[str, str]) -> str:
    return f"""      <a href="/{city_key}/{category_key}/{item["slug"]}/" class="mini-card">
        <div class="mini-card-icon" style="{icon_style}">{label}</div>
        <div class="mini-card-info">
          <h3>{encode_text(item["title"])}</h3>
          <p>{encode_text(item["summary"])}</p>
        </div>
      </a>"""


def build_city_page(city_key: str, city_name: str, category_items: dict[str, list[dict[str, str]]]) -> str:
    previews: list[str] = []
    for item in category_items["family-attractions"][:4]:
        previews.append(build_preview_card(city_key, "family-attractions", "景", "background:#DBEAFE;color:#2563EB;", item))
    for item in category_items["family-restaurants"][:2]:
        previews.append(build_preview_card(city_key, "family-restaurants", "餐", "background:#FDF2F8;color:#DB2777;", item))
    for item in category_items["family-events"][:2]:
        previews.append(build_preview_card(city_key, "family-events", "活", "background:#DCFCE7;color:#16A34A;", item))
    previews_html = "\n".join(previews)
    description = f"整理{city_name}親子景點、餐廳與活動，先看交通方式、室內外與適合安排的行程方向。"
    return f"""<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{city_name}親子景點、餐廳、活動整理</title>
    <meta name="description" content="{encode_text(description)}">
    <link rel="stylesheet" href="/assets/style.css">
    <script src="/assets/header.js"></script>
  </head>
  <body>
    <div id="site-header-container" data-active="home"></div>
    <main class="page-pad container">
      <div class="city-header">
        <div class="breadcrumb">
          <a href="/index.html">首頁</a>
          / {city_name}
        </div>
        <h1>{city_name}親子資訊</h1>
        <p style="color:var(--text-muted); margin-top:8px;">{encode_text(description)}</p>
        <div class="wrap-nav">
          <a href="/{city_key}/family-attractions/index.html" class="mini-pill active">景點 ({len(category_items["family-attractions"])})</a>
          <a href="/{city_key}/family-restaurants/index.html" class="mini-pill">餐廳 ({len(category_items["family-restaurants"])})</a>
          <a href="/{city_key}/family-events/index.html" class="mini-pill">活動 ({len(category_items["family-events"])})</a>
        </div>
      </div>
      <div class="preview-grid">
{previews_html}
      </div>
    </main>
  </body>
</html>
"""


def collect_items(city_key: str, category_key: str) -> list[dict[str, str]]:
    category_dir = ROOT / city_key / category_key
    if not category_dir.exists():
        return []
    coords_lookup = get_coords_lookup(category_dir / "index.html")
    tsv_lookup = load_tsv_lookup(city_key, category_key)
    items: list[dict[str, str]] = []
    for detail_dir in sorted([p for p in category_dir.iterdir() if p.is_dir()]):
        detail_index = detail_dir / "index.html"
        if detail_index.exists():
            item = parse_detail(detail_index, coords_lookup, tsv_lookup, category_key)
            if item["title"]:
                items.append(item)
    return items


def main() -> None:
    for city_key, city_name in CITY_MAP.items():
        category_items = {
            category_key: collect_items(city_key, category_key)
            for category_key in CATEGORY_META.keys()
        }
        for category_key, items in category_items.items():
            page = build_category_page(city_key, city_name, category_key, items)
            write_text(ROOT / city_key / category_key / "index.html", page)
        city_page = build_city_page(city_key, city_name, category_items)
        write_text(ROOT / city_key / "index.html", city_page)


if __name__ == "__main__":
    main()
