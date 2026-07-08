function saveJsonCache(cacheKey, timeKey, data) {
  localStorage.setItem(cacheKey, JSON.stringify(data));
  localStorage.setItem(timeKey, Date.now().toString());
}

function getJsonCache(cacheKey, timeKey, limit) {
  const cache = localStorage.getItem(cacheKey);
  const cacheTime = Number(localStorage.getItem(timeKey) || 0);

  if (!cache || !cacheTime) {
    return null;
  }

  const now = Date.now();

  if (now - cacheTime > limit) {
    return null;
  }

  try {
    return JSON.parse(cache);
  } catch (e) {
    return null;
  }
}
