const MAP_CSV_URL = "https://script.google.com/macros/s/AKfycbybLspt-tzGEuWKZuEi4dukk4chmcU03jwS0_F9vuhbkW2RkpfXK8KOpSot8Za8BE6r/exec?action=mapCsv";

const MAP_CACHE_KEY = "mapCsvCache";
const MAP_CACHE_TIME_KEY = "mapCsvCacheTime";
const MAP_CACHE_LIMIT = 1 * 60 * 1000;

function parseMapCSV(text) {
  const rows = [];
  let row = [], cell = "", quote = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"' && quote && next === '"') {
      cell += '"';
      i++;
    } else if (c === '"') {
      quote = !quote;
    } else if (c === "," && !quote) {
      row.push(cell);
      cell = "";
    } else if ((c === "\n" || c === "\r") && !quote) {
      if (cell || row.length) {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      }
      if (c === "\r" && next === "\n") i++;
    } else {
      cell += c;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function saveMapData(rows, headers) {
  const data = {
    headers,
    rows
  };

  localStorage.setItem(MAP_CACHE_KEY, JSON.stringify(data));
  localStorage.setItem(MAP_CACHE_TIME_KEY, String(Date.now()));
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

  fetch(MAP_CSV_URL + "&t=" + Date.now())
    .then(response => response.text())
    .then(csv => {
      const rows = parseMapCSV(csv);
      const headers = rows[0];

      saveMapData(rows, headers);

      callback(rows, headers);
    });
}
