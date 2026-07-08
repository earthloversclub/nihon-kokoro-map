function makeNewIcon(baseIcon) {
  const size = baseIcon.options.iconSize;
  const anchor = baseIcon.options.iconAnchor;
  const popupAnchor = baseIcon.options.popupAnchor;

  return L.divIcon({
    html: `
      <div class="newPinWrap">
        <div class="newBadge">NEW!</div>
        <img src="${baseIcon.options.iconUrl}" style="width:${size[0]}px;height:${size[1]}px;">
      </div>
    `,
    className: "",
    iconSize: [size[0], size[1] + 20],
    iconAnchor: [anchor[0], anchor[1] + 20],
    popupAnchor: popupAnchor
  });
}
  
// === Treasure Data / Markers ===
  
loadMapData(function(rows, headers) {

rows.slice(1).forEach(row => {
const data = {};
headers.forEach((h, i) => data[h] = row[i]);

if (!data["緯度"] || !data["経度"]) return;

const lat = Number(data["緯度"]);
const lng = Number(data["経度"]);
const category = data["カテゴリ"];
const prefecture = data["都道府県"];

if (prefecture) {
prefectureCounts[prefecture] =
(prefectureCounts[prefecture] || 0) + 1;

prefectureThanks[prefecture] =
(prefectureThanks[prefecture] || 0) + (Number(data["ありがとう数"]) || 0);
}
  
const markerIcon = icons[category] || icon("blue");
const spotId = data["ID"];
const isViewed = localStorage.getItem("viewed_" + spotId);
const displayMarkerIcon = isViewed ? markerIcon : makeNewIcon(markerIcon);

let popup = `
<div style="font-size:17px; line-height:1.45;">

  <div style="font-size:21px; line-height:1.2; font-weight:bold; margin-bottom:2px;">
    ${data["タイトル"] || data["名前"]}
  </div>

  ${category ? `<div style="font-size:17px; font-weight:bold;">カテゴリ：${category}</div>` : ""}

  ${data["説明"]
  ? `<div style="margin-top:8px;">${data["説明"].replace(/\n/g, "<br>")}</div>`
  : ""}

  ${data["投稿者"] ? `<div style="font-size:16px; margin-top:8px;">投稿者：${data["投稿者"]}</div>` : ""}

  ${data["投稿日"] ? `<div style="font-size:16px;">投稿日：${formatPostDate(data["投稿日"])}</div>` : ""}

</div>

<button class="thanks-btn" data-spot-id="${data["ID"]}" onclick="sendThanks(this, '${data["ID"]}')">
  ありがとうを届ける🌸
</button>

<div class="thanks-hint">
  🌸 あなたの1輪が、日本を育てます
</div>

<div class="thanks-message-wrapper">
  <div class="thanks-message"></div>
</div>
`;

function convertDriveImageUrl(url) {
if (!url) return "";

const match = url.match(/\/d\/([^/]+)/);

if (match && match[1]) {
return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
}

return url;
}

function formatPostDate(dateText) {
  if (!dateText) return "";

  return String(dateText)
    .substring(0, 10)
    .replace(/-/g, "/");
}
  
const imageUrls = [];

if (data["画像"] && data["画像"] !== data["動画"]) {
imageUrls.push(convertDriveImageUrl(data["画像"]));
}

if (data["画像2"] && data["画像2"] !== data["動画"]) {
imageUrls.push(convertDriveImageUrl(data["画像2"]));
}

if (data["画像3"] && data["画像3"] !== data["動画"]) {
imageUrls.push(convertDriveImageUrl(data["画像3"]));
}

if (data["画像4"] && data["画像4"] !== data["動画"]) {
imageUrls.push(convertDriveImageUrl(data["画像4"]));
}

if (imageUrls.length > 0 || data["動画"]) {
const mediaCount = imageUrls.length + (data["動画"] ? 1 : 0);

popup += mediaCount === 1
? `<div class="image-carousel media-count-1">`
: `<div class="image-carousel multi-images media-count-${mediaCount}">`;

const mediaItems = imageUrls.map(url => ({
type: "image",
url: url
}));

if (data["動画"]) {
mediaItems.push({
type: "video",
url: data["動画"]
});
}

const safeMediaItems = JSON.stringify(mediaItems).replace(/'/g, "&apos;");

imageUrls.forEach((url, index) => {
popup += `
<img
class="popup-img"
src="${url}"
onclick='openMediaModal(${safeMediaItems}, ${index})'
>
`;
});

if (data["動画"]) {
const videoThumbnail = data["動画"]
.replace("/video/upload/", "/video/upload/so_5/")
.replace(".mp4", ".jpg");

popup += `
<div class="popup-img video-thumb" onclick='openMediaModal(${safeMediaItems}, ${mediaItems.length - 1})'>
  <img class="video-thumb-img" src="${videoThumbnail}">
  <div class="video-play-mark">▶</div>
</div>
`;
}

popup += `</div>`;
}

function isWithin10Minutes(timeText) {
if (!timeText) return false;

const eventTime = new Date(timeText.replace(/\//g, "-")).getTime();
const nowTime = Date.now();

return nowTime - eventTime <= 30 * 60 * 1000;
}

let angelEmoji = "";

if (category === "人・活動・想い") {
if (isWithin10Minutes(data["神降臨時刻"])) {
angelEmoji = "🌈👑 神降臨 👑🌈<br><span style='font-size:10px;'>✨ THANK YOU 3000 ✨</span>";
} else if (isWithin10Minutes(data["大天使降臨時刻"])) {
angelEmoji = "🪽👼大天使降臨👼🪽";
} else if (isWithin10Minutes(data["天使降臨時刻"])) {
angelEmoji = "👼天使降臨";
}
}

const popupClassMap = {
  "温泉・宿泊": "popup-onsen",
  "自然・絶景": "popup-nature",
  "グルメ・特産品": "popup-gourmet",
  "神社仏閣・歴史": "popup-shrine",
  "自然農": "popup-farm",
  "イベント・体験": "popup-event",
  "人・活動・想い": "popup-rainbow"
};

const popupClass = popupClassMap[category] || "popup-default";

let marker;

if (angelEmoji) {
const specialIcon = L.divIcon({
html: `
<div class="special-pin-wrap">
<div class="angel-effect">${angelEmoji}</div>
<img src="${markerIcon.options.iconUrl}" style="width:${markerIcon.options.iconSize[0]}px; height:${markerIcon.options.iconSize[1]}px;">
</div>
`,
className: "",
iconSize: [90, 80],
iconAnchor: [45, 75],
popupAnchor: [0, -75]
});

marker = L.marker([lat, lng], { icon: specialIcon })
.bindPopup(popup, {
  minWidth: 230,
  maxWidth: 280,
  className: popupClass
});

} else {
  
marker = L.marker([lat, lng], { icon: displayMarkerIcon })
.bindPopup(popup, {
  minWidth: 230,
  maxWidth: 280,
  className: popupClass
});
}

allSpots.push({
  title: data["タイトル"] || data["名前"],
  description: data["説明"],
  poster: data["投稿者"],
  prefecture: data["都道府県"],
  category: category,
  marker: marker
});

marker.category = category;

marker.addTo(map);

marker.on("popupopen", function(){
  document.getElementById("mapSwitchBox").style.visibility = "hidden";

  const guideBox = document.getElementById("guideBox");
  if (guideBox) {
    guideBox.style.display = "none";
  }

  localStorage.setItem("viewed_" + spotId, "true");
  marker.setIcon(markerIcon);
});

marker.on("popupclose", function(){
  document.getElementById("mapSwitchBox").style.visibility = "visible";

  const guideBox = document.getElementById("guideBox");
  if (guideBox) {
    guideBox.style.display = "block";
  }
});

markers.push(marker);

const totalPostsCountEl =
document.getElementById("totalPostsCount");

if (totalPostsCountEl) {
totalPostsCountEl.textContent =
markers.length + "件";
}

});

loadAchievement();
loadRanking();

});
