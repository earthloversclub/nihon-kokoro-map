// === Map Switching ===

let growthMapInstance = null;

function showMapA() {
document.getElementById("mapContainer").style.display = "block";
document.getElementById("rainbowBox").style.display = "block";
document.getElementById("skyTempleBox").style.display = "block";  
document.getElementById("map").style.display = "block";
document.getElementById("growthMap").style.display = "none";
document.getElementById("searchBox").style.display = "block";
document.getElementById("thanksEnergyLegend").style.display = "none";

document.getElementById("mapSwitchButton").textContent = "🌷成長地図▶";
document.getElementById("mapSwitchButton").onclick = showMapB;

setTimeout(() => {
map.invalidateSize();
}, 100);
}

function showMapB() {
document.getElementById("mapContainer").style.display = "none";
document.getElementById("growthMap").style.display = "block";
document.getElementById("thanksEnergyLegend").style.display = "block";

setTimeout(function() {
loadJapanGrowthMap();
}, 100);
}



// === Growth Map ===

function loadAchievement() {
const total = 47;
const achieved = Object.keys(prefectureCounts).length;

document.getElementById("achievementCount").textContent =
achieved + " / " + total + "県";

document.getElementById("achievementPercent").textContent =
((achieved / total) * 100).toFixed(1) + "%";
}

function getThanksColor(count) {
if (count === 0) return "#dddddd";
if (count <= 100) return "#ffffff";
if (count <= 200) return "#aeefff";
if (count <= 300) return "#4da3ff";
if (count <= 400) return "#66cc66";
if (count <= 500) return "#fff176";
if (count <= 600) return "#ff9800";
if (count <= 700) return "#ff8acb";
return "#ff3333";
}

function showFlowerConfetti(level) {
const flowers = ["🌸", "🌼", "🌷", "🌺", "🪻", "🌻"];
const count = level === "max" ? 80 : 35;
const size = level === "max" ? 34 : 26;
const duration = level === "max" ? 2500 : 1600;

for (let i = 0; i < count; i++) {
const flower = document.createElement("div");
flower.innerHTML = flowers[Math.floor(Math.random() * flowers.length)];

flower.style.position = "fixed";
flower.style.left = Math.random() * window.innerWidth + "px";
flower.style.top = "-40px";
flower.style.fontSize = size + "px";
flower.style.pointerEvents = "none";
flower.style.zIndex = "9999";

document.body.appendChild(flower);

flower.animate(
[
{ transform: "translateY(0px) rotate(0deg)", opacity: 1 },
{ transform: "translateY(" + (window.innerHeight + 100) + "px) rotate(720deg)", opacity: 0 }
],
{
duration: duration + Math.random() * 800,
easing: "ease-in"
}
);

setTimeout(() => flower.remove(), duration + 1000);
}
}

function loadJapanGrowthMap() {

if (growthMapInstance) {
growthMapInstance.invalidateSize();
return;
}

growthMapInstance = L.map("japanGrowthMap", {
zoomControl: false,
attributionControl: false
}).setView([37.8, 138.5], 5);

fetch("japan.geojson")
.then(response => response.json())
.then(geojson => {
L.geoJSON(geojson, {
style: function(feature) {
const pref = feature.properties.nam_ja;

return {
color: "#ffffff",
weight: 1,
fillColor: getThanksColor(prefectureThanks[
pref.replace("都","").replace("府","").replace("県","")
] || 0),
fillOpacity: 0.9
};
},

onEachFeature: function(feature, layer) {

const pref = feature.properties.nam_ja;

const shortPref = pref
.replace("都","")
.replace("府","")
.replace("県","");

const postCount = prefectureCounts[shortPref] || 0;
const thanksCount = prefectureThanks[shortPref] || 0;

let energyMessage = "";

let titleName = "";

if (thanksCount === 0) {
titleName = "🌑眠りの大地🌑";
} else if (thanksCount <= 100) {
titleName = "🟤目覚めの大地🟤";
} else if (thanksCount <= 200) {
titleName = "🌿双葉の里🌿";
} else if (thanksCount <= 300) {
titleName = "🍀成長の里🍀";
} else if (thanksCount <= 400) {
titleName = "🌳豊かな森🌳";
} else if (thanksCount <= 500) {
titleName = "🌻希望の花園🌻";
} else if (thanksCount <= 600) {
titleName = "🧡感謝の広場🧡";
} else if (thanksCount <= 700) {
titleName = "🌸笑顔の楽園🌸";
} else {
titleName = "🌈幸せの楽園👼";
}
let glowClass = "";
if (thanksCount === 0) {
glowClass = "growth-gray";
} else if (thanksCount <= 100) {
glowClass = "growth-brown";
} else if (thanksCount <= 200) {
glowClass = "growth-lightgreen";
} else if (thanksCount <= 300) {
glowClass = "growth-green";
} else if (thanksCount <= 400) {
glowClass = "growth-deepgreen";
} else if (thanksCount <= 500) {
glowClass = "growth-yellow";
} else if (thanksCount <= 600) {
glowClass = "growth-orange";
} else if (thanksCount <= 700) {
glowClass = "growth-pink";
} else {
glowClass = "growth-rainbow";
}
if (thanksCount === 0) {
energyMessage = "<b>🩶静かに眠る希望の大地<br>今は深い沈黙に包まれています<br>誰かが来るのを待っています</b>";
} else if (thanksCount <= 100) {
energyMessage = "<b>🤍芽がちょこんと顔を出し<br>暖かな陽の光を浴びています🌱<br>ここから物語が始まります✨</b>";
} else if (thanksCount <= 200) {
energyMessage = "<b>🩵双葉の赤ちゃんが生まれました👶<br>小さな命がすくすく育っています<br>この子にはどんな未来が訪れるのでしょうか✨</b>";
} else if (thanksCount <= 300) {
energyMessage = "<b>💙若葉が元気よく広がり始め<br>大地が緑でいっぱいになってきました<br>感謝の風がそよぎ始めています✨</b>";
} else if (thanksCount <= 400) {
energyMessage = "<b>💚大木に小鳥が遊びに来ています🐦<br>たくさんの想いが集まって<br>豊かな森へと成長しました✨</b>";
} else if (thanksCount <= 500) {
energyMessage = "<b>💛希望の花が咲き始めました🌻<br>花に集う人たちは微笑み<br>大地が明るく輝き出しています✨</b>";
} else if (thanksCount <= 600) {
energyMessage = "<b>🧡感謝の輪がどんどん広がっています<br>人と人の心がつながり、<br>温かな交流が生まれています✨</b>";
} else if (thanksCount <= 700) {
energyMessage = "<b>🩷みんなの笑顔が花満開🌸<br>幸せがたくさん咲き誇っています<br>楽園はもうすぐ完成です✨</b>";
} else {
energyMessage = "<b>❤️感謝エネルギー全開✨<br>幸せの楽園が完成しました🌈<br>みんなの想いが<br>美しい未来を育てていきます🥰</b>";
}
let nextTarget = 0;

if (thanksCount === 0) {
nextTarget = 1;
} else if (thanksCount <= 100) {
nextTarget = 101;
} else if (thanksCount <= 200) {
nextTarget = 201;
} else if (thanksCount <= 300) {
nextTarget = 301;
} else if (thanksCount <= 400) {
nextTarget = 401;
} else if (thanksCount <= 500) {
nextTarget = 501;
} else if (thanksCount <= 600) {
nextTarget = 601;
} else if (thanksCount <= 700) {
nextTarget = 701;
} else {
nextTarget = thanksCount;
}

let remainFlowers = nextTarget - thanksCount;
layer.bindPopup(
'<div style="text-align:center;font-size:21px;font-weight:bold;">🌸' +
shortPref +
(shortPref === "北海道" ? "の成長記録🌸" : "県の成長記録🌸") +
'</div><br>' +
'<div style="text-align:center;">' +
'<span style="font-size:17px;font-weight:bold;">🏆現在の称号🏆</span><br>' +
'<span style="font-size:20px;"><b>' +
titleName +
'</b></span>' +
'</div><br>' +

'<div style="text-align:center;">' +
energyMessage +
'</div><br>' +
'<span style="font-size:16px;"><b>投稿数： ' + postCount + '件</b></span><br>' +
'<span style="font-size:16px;"><b>ありがとうの花： ' + thanksCount + '輪</b></span><br>' +
'<div style="text-align:center;">🌈次の称号まであと ' +
remainFlowers +
'輪</div>'
, {
className: glowClass
});
layer.on("click", function() {

if (thanksCount >= 1000) {
showFlowerConfetti("max");
showSparkles();
}

else if (thanksCount >= 701) {
showFlowerConfetti("max");
}

else if (thanksCount >= 501) {
showFlowerConfetti("middle");
}

});
}

}).addTo(growthMapInstance);
});
}
