const HEART_JSON_URL = "https://script.google.com/macros/s/AKfycbybLspt-tzGEuWKZuEi4dukk4chmcU03jwS0_F9vuhbkW2RkpfXK8KOpSot8Za8BE6r/exec?action=heartJson";

const HEART_CACHE_KEY = "heartJsonCache";
const HEART_CACHE_TIME_KEY = "heartJsonCacheTime";
const HEART_CACHE_LIMIT = 10 * 60 * 1000;

function saveHeartData(rows, headers) {
  const data = {
    headers,
    rows
  };

  saveJsonCache(HEART_CACHE_KEY, HEART_CACHE_TIME_KEY, data);
}

function getHeartData() {
  const json = localStorage.getItem(HEART_CACHE_KEY);
  const savedTime = Number(localStorage.getItem(HEART_CACHE_TIME_KEY) || 0);

  if (!json || !savedTime) return null;

  if (Date.now() - savedTime > HEART_CACHE_LIMIT) {
    return null;
  }

  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function loadHeartData(callback) {
  const params = new URLSearchParams(location.search);
  const forceFresh = params.get("fresh") === "1";

  const cachedData = forceFresh ? null : getHeartData();

  if (cachedData) {
    callback(cachedData.rows, cachedData.headers);
    return;
  }

  fetch(HEART_JSON_URL + "&t=" + Date.now())
    .then(response => {
      if (!response.ok) {
        throw new Error("心の宝箱データの取得に失敗しました");
      }

      return response.json();
    })
    .then(data => {
      const headers = data.length > 0 ? Object.keys(data[0]) : [];

      const rows = [
        headers,
        ...data.map(item =>
          headers.map(header => item[header] ?? "")
        )
      ];

      saveHeartData(rows, headers);

      callback(rows, headers);
    })
    .catch(error => {
      console.error("loadHeartData error:", error);

      const oldCacheJson =
        localStorage.getItem(HEART_CACHE_KEY);

      if (!oldCacheJson) return;

      try {
        const oldCache = JSON.parse(oldCacheJson);

        if (oldCache.rows && oldCache.headers) {
          callback(oldCache.rows, oldCache.headers);
        }
      } catch (cacheError) {
        console.error("heart cache error:", cacheError);
      }
    });
}
