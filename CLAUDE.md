# 羅米親子玩樂地圖 - 專案說明

## 網站簡介
- 網域：romyfunmap.com
- 定位：台灣親子旅遊靜態網站，收錄各縣市親子景點、餐廳、活動
- 品牌名稱：羅米親子玩樂地圖

---

## 內容撰寫規範

### 語氣與用詞
- 描述文字保持**客觀**，以事實與資訊為主
- **禁止**使用第一人稱：我、我們、小編
- **禁止**使用主觀強度詞語，例如：
  - 必須、一定要、絕對
  - 最好、最棒、超棒、超讚
  - 超愛、強推、強力推薦
  - 非～不可、值得一去
- **禁止**使用誇大或情緒化形容詞
- 描述地點時，說明「提供什麼」「適合什麼情境」，不做主觀評價

### 範例對照
| ❌ 不好 | ✅ 正確 |
|--------|--------|
| 這裡絕對是帶小孩的必去景點！ | 設有兒童遊具區，適合幼兒到國小低年級。 |
| 超愛這個公園，強力推薦！ | 公園內設有特色遊戲場，含溜滑梯與攀爬遊具。 |
| 一定要在晴天去才值得 | 晴天時戶外空間較適合活動。 |

---

## 專案架構

### 目錄結構
```
romyfunmap/
├── assets/          # 全站共用 CSS / JS（style.css, header.js, app.js）
├── images/          # 圖片資源
├── scripts/         # 頁面生成腳本
│   └── data/        # TSV 資料檔（各縣市景點/餐廳）
├── taipei/          # 各縣市頁面目錄
│   ├── index.html
│   ├── family-attractions/
│   ├── family-restaurants/
│   └── family-events/
├── newtaipei/       # 同上，各縣市結構相同
├── taoyuan/
├── miaoli/
├── nantou/
├── changhua/
├── tainan/
├── kaohsiung/
├── pingtung/
├── taichung/
├── chiayi-city/
├── chiayi-county/
├── attractions/     # 全站景點總覽
├── restaurants/     # 全站餐廳總覽
├── events/          # 全站活動總覽
├── index.html       # 首頁
├── about.html
├── contact.html
└── privacy-policy.html
```

### TSV 資料欄位（景點）
`title|slug|district|type|tag|parking|address|map|summary|stay|weather|tip|age`

| 欄位 | 說明 |
|------|------|
| title | 景點名稱 |
| slug | URL 路徑（英文小寫加連字號） |
| district | 行政區 |
| type | 主分類（例：特色公園 / 遊戲場） |
| tag | 標籤分類（例：公園 / 戶外） |
| parking | 停車資訊 |
| address | 完整地址 |
| map | Google Maps 搜尋關鍵字 |
| summary | 一句話摘要（簡短，用於列表頁） |
| stay | 建議停留時間 |
| weather | 天氣建議 |
| tip | 注意事項 |
| age | 適合年齡 |

### 頁面生成腳本
- `safe_rebuild_tsv_pages.py` — 從 TSV 重建詳細頁（主要使用）
- `rebuild_index_pages_utf8.py` — 重建城市/分類列表頁
- `format_html_readable.py` — HTML 格式化工具

---

## 技術慣例

### Slug 命名規則
- 全英文小寫
- 空格改為連字號 `-`
- 不使用底線或特殊字元
- 例：`daan-forest-park`、`beitou-hot-spring-museum`

### 頁面路徑規則
- 景點：`/{city}/family-attractions/{slug}/index.html`
- 餐廳：`/{city}/family-restaurants/{slug}/index.html`
- 活動：`/{city}/family-events/{slug}/index.html`

### 城市目錄對照
| 目錄名 | 縣市 |
|--------|------|
| taipei | 台北市 |
| newtaipei | 新北市 |
| taoyuan | 桃園市 |
| miaoli | 苗栗縣 |
| taichung | 台中市 |
| changhua | 彰化縣 |
| nantou | 南投縣 |
| chiayi-city | 嘉義市 |
| chiayi-county | 嘉義縣 |
| tainan | 台南市 |
| kaohsiung | 高雄市 |
| pingtung | 屏東縣 |

### 主題色
- 景點（綠）：`--primary: #14B8A6`
- 餐廳（橘）：`--secondary: #F97316`
- 活動（紫）：`--tertiary: #6366F1`

---

## 作業規範

### 修改回報
每次完成任何修改，**必須**在回覆末尾列出所有異動過的檔案，格式如下：

```
異動檔案：
- 新增：{路徑}
- 修改：{路徑}
- 刪除：{路徑}
```

### Code Review
修改完成後，會請 Codex 進行 review，確保品質。

### 檔案修改方式
- **優先使用 Edit 工具**直接編輯檔案
- **避免使用腳本**（Python / shell script）進行檔案修改，腳本容易造成 code 缺失或截斷
- 若內容量大無法一次 Edit，應分段進行，每段完成後確認檔案完整性
- 使用腳本時須格外小心，完成後務必用 Read 工具檢查輸出結果
