const MAP_JSON_URL = "https://script.google.com/macros/s/AKfycbybLspt-tzGEuWKZuEi4dukk4chmcU03jwS0_F9vuhbkW2RkpfXK8KOpSot8Za8BE6r/exec?action=mapJson";

const MAP_CACHE_KEY = "mapJsonCache";
const MAP_CACHE_TIME_KEY = "mapJsonCacheTime";
const MAP_CACHE_LIMIT = 10 * 60 * 1000;

function saveMapData(rows, headers) {
  const data = {
    headers,
    rows
  };

  saveJsonCache(MAP_CACHE_KEY, MAP_CACHE_TIME_KEY, data);
}

function getMapData() {
  const json = localStorage.getItem(MAP_CACHE_KEY);
  const savedTime = Number(localStorage.getItem(MAP_CACHE_TIME_KEY) || 0);

  if (!json || !savedTime) return null;

  if (Date.now() - savedTime > MAP_CACHE_LIMIT) {
    return null;
  }

  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function loadMapData(callback) {
  const params = new URLSearchParams(location.search);
  const forceFresh = params.get("fresh") === "1";

  const cachedData = forceFresh ? null : getMapData();

  if (cachedData) {
    callback(cachedData.rows, cachedData.headers);
    return;
  }

  fetch(MAP_JSON_URL + "&t=" + Date.now())
    .then(response => response.json())
    .then(data => {

      const headers = data.length > 0 ? Object.keys(data[0]) : [];
      const rows = [
        headers,
        ...data.map(item => headers.map(header => item[header] ?? ""))
      ];

      saveMapData(rows, headers);

      callback(rows, headers);
    });
}
