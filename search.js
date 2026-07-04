// === Search ===
  
function searchPlace() {

  const keyword = document
    .getElementById("searchInput")
    .value
    .trim()
    .toLowerCase();

  const resultBox = document.getElementById("searchResultsBox");

  if (!keyword) {
    resultBox.style.display = "none";
    resultBox.innerHTML = "";
    return;
  }

  const results = allSpots.filter(spot => {

    return [
      spot.title,
      spot.description,
      spot.poster,
      spot.prefecture,
      spot.category
    ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(keyword);

  });

  if (results.length === 0) {
    resultBox.style.display = "none";
    resultBox.innerHTML = "";
    alert("見つかりませんでした");
    return;
  }

  if (results.length === 1) {
    const found = results[0];
    resultBox.style.display = "none";
    resultBox.innerHTML = "";

    map.setView(found.marker.getLatLng(), 12);
    found.marker.openPopup();
    return;
  }

resultBox.innerHTML = `
    <div style="position:relative; font-weight:900; color:#256b3b; margin-bottom:6px; padding-right:28px;">
      検索結果：${results.length}件
      <button
        type="button"
        onclick="closeSearchResults()"
        style="position:absolute; top:-4px; right:0; border:none; background:transparent; font-size:18px; font-weight:900; cursor:pointer;"
      >×</button>
    </div>

    ${results.slice(0, 10).map((spot, index) => `
      <div class="searchResultItem" onclick="openSearchResult(${index})">
        <div class="searchResultTitle">${spot.title || "タイトルなし"}</div>
        <div class="searchResultMeta">
          ${spot.prefecture || ""}｜${spot.category || ""}<br>
          投稿者：${spot.poster || "未入力"}
        </div>
      </div>
    `).join("")}
    ${results.length > 10 ? `
      <div style="padding:8px; color:#777;">
        ほか${results.length - 10}件あります<br>
        キーワードを追加すると絞り込めます
      </div>
    ` : ""}
  `;

  window.currentSearchResults = results.slice(0, 10);
  resultBox.style.display = "block";

}

function openSearchResult(index) {
  const spot = window.currentSearchResults[index];
  const resultBox = document.getElementById("searchResultsBox");

  if (!spot) return;

  resultBox.style.display = "none";
  resultBox.innerHTML = "";

  map.setView(spot.marker.getLatLng(), 12);
  spot.marker.openPopup();
}

function closeSearchResults() {
  const resultBox = document.getElementById("searchResultsBox");

  if (!resultBox) return;

  resultBox.style.display = "none";
  resultBox.innerHTML = "";
}
