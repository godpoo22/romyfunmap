const formatDistance = (km) => (km < 1 ? `${Math.round(km * 1000)} 公尺` : `${km.toFixed(1)} 公里`);

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
  const cards = Array.from(grid.querySelectorAll(".modern-card"));

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
      (position) => {
        const cards = Array.from(grid.querySelectorAll(".modern-card"));

        cards.forEach((card) => {
          const lat = Number(card.dataset.lat);
          const lng = Number(card.dataset.lng);
          const distanceTag = card.querySelector(".distance-tag");

          if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            card.dataset.distance = "9999";
            return;
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
        });

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
