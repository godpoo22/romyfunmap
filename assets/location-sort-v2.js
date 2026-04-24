const formatDistance = (km) => (km < 1 ? `${Math.round(km * 1000)} 公尺` : `${km.toFixed(1)} 公里`);

// Checked north-region venue coordinates override coarse district-center fallbacks.
const coordinateOverrides = {
  "/taipei/family-attractions/astronomy-museum/": { lat: 25.09586, lng: 121.51623 },
  "/taipei/family-attractions/daan-forest-park/": { lat: 25.03251, lng: 121.53603 },
  "/taipei/family-attractions/hushan-park-6/": { lat: 25.15136, lng: 121.57931 },
  "/taipei/family-attractions/maokong-gondola/": { lat: 24.99888, lng: 121.58253 },
  "/taipei/family-attractions/railway-museum/": { lat: 25.04962, lng: 121.54097 },
  "/taipei/family-attractions/science-education-museum/": { lat: 25.09578, lng: 121.51705 },
  "/taipei/family-attractions/taipei-children-amusement-park/": { lat: 25.09628, lng: 121.51471 },
  "/taipei/family-attractions/taipei-fine-arts-museum/": { lat: 25.07251, lng: 121.52472 },
  "/taipei/family-attractions/taipei-water-park/": { lat: 25.01112, lng: 121.53312 },
  "/taipei/family-attractions/taipei-zoo/": { lat: 24.99874, lng: 121.58211 },
  "/taipei/family-events/astronomy-museum-events/": { lat: 25.09586, lng: 121.51623 },
  "/taipei/family-events/taipei-childrens-month-2026/": { lat: 25.03746, lng: 121.56373 },
  "/taipei/family-events/taipei-family-parks/": { lat: 25.033, lng: 121.5654 },
  "/taipei/family-restaurants/moneyjump/": { lat: 25.061334, lng: 121.57543 },
  "/taipei/family-restaurants/elephant-garden-neihu/": { lat: 25.08364, lng: 121.59174 },
  "/taipei/family-restaurants/beetle-paradise/": { lat: 25.10562, lng: 121.52945 },
  "/taipei/family-restaurants/farm-table/": { lat: 25.02891, lng: 121.51646 },
  "/taipei/family-restaurants/hovii-cafe/": { lat: 25.0338, lng: 121.5432 },
  "/taipei/family-restaurants/journey-kaffe-sunshine/": { lat: 25.07966, lng: 121.57586 },
  "/taipei/family-restaurants/mr-tree-guting/": { lat: 25.02838, lng: 121.52522 },
  "/taipei/family-restaurants/rich-daddy/": { lat: 25.043934, lng: 121.53034 },
  "/taipei/family-restaurants/second-floor-renai/": { lat: 25.03798, lng: 121.53218 },
  "/taipei/family-restaurants/taoji-playtime/": { lat: 25.04703, lng: 121.53266 },

  "/newtaipei/family-attractions/bali-left-bank-park/": { lat: 25.1578, lng: 121.40802 },
  "/newtaipei/family-attractions/gold-museum/": { lat: 25.10864, lng: 121.84304 },
  "/newtaipei/family-attractions/houtong-cat-village/": { lat: 25.08734, lng: 121.82744 },
  "/newtaipei/family-attractions/new-taipei-art-museum/": { lat: 24.95463, lng: 121.35275 },
  "/newtaipei/family-attractions/shifen-old-street/": { lat: 25.04331, lng: 121.77564 },
  "/newtaipei/family-attractions/shifen-waterfall/": { lat: 25.05085, lng: 121.78733 },
  "/newtaipei/family-attractions/shihsanhang-museum/": { lat: 25.15714, lng: 121.40591 },
  "/newtaipei/family-attractions/tamsui-fishermans-wharf/": { lat: 25.18347, lng: 121.41472 },
  "/newtaipei/family-attractions/yehliu-ocean-world/": { lat: 25.20653, lng: 121.69042 },
  "/newtaipei/family-attractions/yingge-ceramics-museum/": { lat: 24.95431, lng: 121.35534 },
  "/newtaipei/family-restaurants/anran-bistro/": { lat: 25.15042, lng: 121.39967 },
  "/newtaipei/family-restaurants/baby-wonderland/": { lat: 25.00474, lng: 121.52444 },
  "/newtaipei/family-restaurants/cowboy-manor/": { lat: 25.2368, lng: 121.4994 },
  "/newtaipei/family-restaurants/doris-forest/": { lat: 25.14052, lng: 121.43171 },
  "/newtaipei/family-restaurants/funny-mama/": { lat: 25.08629, lng: 121.47617 },
  "/newtaipei/family-restaurants/little-island-thai/": { lat: 25.15291, lng: 121.40658 },
  "/newtaipei/family-restaurants/marutong-funbar/": { lat: 25.00555, lng: 121.45859 },
  "/newtaipei/family-restaurants/tong-guo-shulin/": { lat: 24.99116, lng: 121.42432 },
  "/newtaipei/family-restaurants/tonup-cafe/": { lat: 25.15232, lng: 121.40472 },
  "/newtaipei/family-restaurants/warmnest-16/": { lat: 25.02365, lng: 121.46869 },
  "/newtaipei/family-events/ceramics-family-program/": { lat: 24.95431, lng: 121.35534 },
  "/newtaipei/family-events/gold-museum-series/": { lat: 25.10864, lng: 121.84304 },
  "/newtaipei/family-events/ntcam-family-workshops/": { lat: 24.95463, lng: 121.35275 },

  "/taoyuan/family-attractions/dayou-terrace-park/": { lat: 25.01234, lng: 121.31758 },
  "/taoyuan/family-attractions/fenghe-park/": { lat: 25.00072, lng: 121.28644 },
  "/taoyuan/family-attractions/hutoushan-park/": { lat: 25.00189, lng: 121.33465 },
  "/taoyuan/family-attractions/kuos-museum-yangmei/": { lat: 24.90994, lng: 121.14543 },
  "/taoyuan/family-attractions/land-god-cultural-museum/": { lat: 24.99894, lng: 121.30651 },
  "/taoyuan/family-attractions/qingtang-park/": { lat: 25.01647, lng: 121.21173 },
  "/taoyuan/family-attractions/railway-pavilion/": { lat: 24.95529, lng: 121.22579 },
  "/taoyuan/family-attractions/simbalion-art-studio/": { lat: 24.91316, lng: 121.17186 },
  "/taoyuan/family-attractions/taoyuan-childrens-art-museum/": { lat: 25.01498, lng: 121.20167 },
  "/taoyuan/family-attractions/xpark/": { lat: 25.01429, lng: 121.21425 },
  "/taoyuan/family-restaurants/bear-grain-house/": { lat: 24.95774, lng: 121.22193 },
  "/taoyuan/family-restaurants/chappa-zhongli/": { lat: 24.95562, lng: 121.22505 },
  "/taoyuan/family-restaurants/fuwa-kitchen/": { lat: 24.95694, lng: 121.21029 },
  "/taoyuan/family-restaurants/qianlan-ramen/": { lat: 24.9557, lng: 121.2243 },
  "/taoyuan/family-restaurants/simbalion-canteen/": { lat: 24.91316, lng: 121.17186 },
  "/taoyuan/family-restaurants/smile-cafe/": { lat: 24.96871, lng: 121.19843 },
  "/taoyuan/family-restaurants/stay-kids-space/": { lat: 25.01886, lng: 121.29906 },
  "/taoyuan/family-restaurants/weilu-hotpot/": { lat: 24.95954, lng: 121.21961 },
  "/taoyuan/family-restaurants/wen-ding-art-district/": { lat: 25.01756, lng: 121.30087 },
  "/taoyuan/family-restaurants/white-peach-hotpot/": { lat: 25.06023, lng: 121.36574 },
  "/taoyuan/family-events/kuos-diy-workshop/": { lat: 24.90994, lng: 121.14543 },
  "/taoyuan/family-events/land-god-guided-tour/": { lat: 24.99894, lng: 121.30651 },
  "/taoyuan/family-events/railway-pavilion-guided-tour/": { lat: 24.95529, lng: 121.22579 },
  "/taoyuan/family-events/taoyuan-childrens-art-museum-workshop/": { lat: 25.01498, lng: 121.20167 },
};

const geocodeCacheKey = "parenting-site-location-cache-v1";

const cityNameMap = {
  taipei: "台北市",
  newtaipei: "新北市",
  taoyuan: "桃園市",
  taichung: "台中市",
  kaohsiung: "高雄市",
  tainan: "台南市",
  changhua: "彰化縣",
  miaoli: "苗栗縣",
  nantou: "南投縣",
};

const geocodeCache = (() => {
  try {
    return JSON.parse(window.localStorage.getItem(geocodeCacheKey) || "{}");
  } catch {
    return {};
  }
})();

const saveGeocodeCache = () => {
  try {
    window.localStorage.setItem(geocodeCacheKey, JSON.stringify(geocodeCache));
  } catch {
    // Ignore storage failures and continue with in-memory coordinates.
  }
};

const districtPattern = /[・·]([^|｜]+?(?:區|鄉|鎮|市))[|｜]/;

const extractDistrictFromSummary = (summary) => {
  const match = summary.match(districtPattern);
  return match ? match[1].trim() : "";
};

const inferEnvironmentTag = (text) => {
  if (
    /室內|博物館|美術館|圖書館|觀光工廠|餐廳|咖啡|火鍋|拉麵|展示館|文化館|故事館|科學館|城堡|館|室內樂園/.test(text)
  ) {
    return "室內";
  }

  if (
    /戶外|半戶外|公園|農場|牧場|步道|遊戲場|瀑布|碼頭|老街|風景區|湖|糖廠|動物園|蝴蝶園|渡假村|水岸|農創園區|廣場|纜車|書院/.test(text)
  ) {
    return "戶外";
  }

  return "室內";
};

const normalizeListingCards = (grid) => {
  const cards = Array.from(document.querySelectorAll(".modern-card"));

  cards.forEach((card) => {
    const tags = card.querySelectorAll(".tags-row .district-tag");
    if (tags.length < 2) {
      return;
    }

    const title = card.querySelector(".card-title")?.textContent?.trim() || "";
    const summary = card.querySelector(".card-desc")?.textContent?.trim() || "";
    const infoTexts = card.querySelectorAll(".info-list .info-text");
    const typeText = infoTexts[0]?.textContent?.replace(/\s+/g, " ").replace("類型", "").trim() || "";
    const district = extractDistrictFromSummary(summary) || tags[0].textContent.trim();

    if (district) {
      tags[0].textContent = district;
    }

    tags[1].textContent = inferEnvironmentTag(`${tags[1].textContent} ${typeText} ${summary} ${title}`);
  });
};

const distanceBetween = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const buildGeocodeQuery = (card, path) => {
  const segments = path.split("/").filter(Boolean);
  const cityName = cityNameMap[segments[0]] || "";
  const title = card.querySelector(".card-title")?.textContent?.trim() || "";
  const district = card.querySelector(".district-tag")?.textContent?.trim() || "";
  return [title, district, cityName, "台灣"].filter(Boolean).join(" ");
};

const geocodeByQuery = async (query) => {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", query);

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    return null;
  }

  const results = await response.json();
  const first = results?.[0];

  if (!first) {
    return null;
  }

  return {
    lat: Number(first.lat),
    lng: Number(first.lon),
  };
};

const getCardCoordinates = async (card) => {
  const actionLink = card.querySelector(".action-btn");
  const path = actionLink
    ? new URL(actionLink.getAttribute("href"), window.location.origin).pathname
    : "";

  if (path) {
    const override = coordinateOverrides[path];

    if (override) {
      return override;
    }

    if (geocodeCache[path]) {
      return geocodeCache[path];
    }
  }

  const fallback = {
    lat: Number(card.dataset.lat),
    lng: Number(card.dataset.lng),
  };

  if (path) {
    const query = buildGeocodeQuery(card, path);

    if (query) {
      try {
        const geocoded = await geocodeByQuery(query);

        if (geocoded && Number.isFinite(geocoded.lat) && Number.isFinite(geocoded.lng)) {
          geocodeCache[path] = geocoded;
          saveGeocodeCache();
          return geocoded;
        }
      } catch {
        // Keep graceful fallback to existing coordinates.
      }
    }
  }

  return fallback;
};

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("enable-location-btn");
  const grid = document.getElementById("listing-grid");

  if (!button || !grid) {
    return;
  }

  normalizeListingCards(grid);

  button.addEventListener("click", () => {
    if (!navigator.geolocation) {
      window.alert("這個裝置目前不支援定位功能。");
      return;
    }

    button.textContent = "定位中...";

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Collect ALL cards on the page (including cards in secondary sections)
        const cards = Array.from(document.querySelectorAll(".modern-card"));

        for (const card of cards) {
          const { lat, lng } = await getCardCoordinates(card);
          const distanceTag = card.querySelector(".distance-tag");

          if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            card.dataset.distance = "9999";
            continue;
          }

          const distance = distanceBetween(
            position.coords.latitude,
            position.coords.longitude,
            lat,
            lng
          );

          card.dataset.distance = String(distance);

          if (distanceTag) {
            distanceTag.style.display = "inline-block";
            distanceTag.textContent = formatDistance(distance);
          }
        }

        // Hide section dividers, sort all cards together into one grid
        document.querySelectorAll(".section-divider").forEach((d) => { d.style.display = "none"; });
        cards
          .sort((a, b) => Number(a.dataset.distance) - Number(b.dataset.distance))
          .forEach((card) => grid.appendChild(card));

        button.textContent = "已依距離排序";
        button.style.background = "var(--primary)";
        button.style.color = "#fff";
      },
      () => {
        button.textContent = "開啟定位，依我的距離排序";
        window.alert("沒有取得定位權限，頁面維持原本排序。");
      }
    );
  });
});
