const HEART_JSON_URL = "https://script.google.com/macros/s/AKfycbybLspt-tzGEuWKZuEi4dukk4chmcU03jwS0_F9vuhbkW2RkpfXK8KOpSot8Za8BE6r/exec?action=heartJson";

const HEART_CACHE_KEY = "heartJsonCache";
const HEART_CACHE_TIME_KEY = "heartJsonCacheTime";
const HEART_CACHE_LIMIT = 1 * 60 * 1000;

function saveHeartData(rows, headers) {
  const data = {
    headers,
    rows
  };

  localStorage.setItem(
    HEART_CACHE_KEY,
    JSON.stringify(data)
  );

  localStorage.setItem(
    HEART_CACHE_TIME_KEY,
    String(Date.now())
  );
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
    .then(response => response.json())
    .then(data => {
      const headers = data.length > 0 ? Object.keys(data[0]) : [];
      const rows = [
        headers,
        ...data.map(item => headers.map(header => item[header] ?? ""))
      ];

      saveHeartData(rows, headers);

      callback(rows, headers);
    });
}
