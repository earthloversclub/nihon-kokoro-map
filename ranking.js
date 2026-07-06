function loadRanking() {
if (!prefectureThanks || Object.keys(prefectureThanks).length === 0) {
  setTimeout(loadRanking, 500);
  return;
}

const ranking = Object.keys(prefectureThanks)
.map(pref => ({
pref: pref,
thanks: prefectureThanks[pref] || 0
}))
.sort((a, b) => b.thanks - a.thanks);

const medals = ["🥇", "🥈", "🥉"];

const top3 = ranking.slice(0, 3)
.map((item, index) =>
'<div style="display:grid; grid-template-columns:30px 1fr 65px; align-items:center; width:100%; white-space:nowrap;">' +
'<b style="text-align:center;">' + medals[index] + '</b>' +
'<b style="text-align:left;">' + item.pref + '</b>' +
'<b style="text-align:center;">' + item.thanks + '輪</b>' +
'</div>'
)
.join("");

const nearFull = ranking.slice(3, 5)
.map((item, index) =>
'<div style="text-align:center;"><b>' +
(index + 4) + '位 ' + item.pref +
'</b></div>'
)
.join("");

/* ===== スマホ版（現状維持） ===== */
const rankingHtmlMobile =

'<div style="margin-top:0px;">' +
top3 +
'</div>' +

'<div style="height:70px;"></div>' +

'<div style="text-align:center; line-height:1.35; position:relative; top:-23px;">' +
nearFull +
'</div>';

/* ===== PC版 ===== */
const rankingHtmlPc =

'<div style="text-align:center;font-size:23px;font-weight:900;color:#0b5f66;margin:0 0 16px;text-shadow:0 1px 0 #fff;">🌸満開ランキング🌸</div>' +

'<div style="margin-top:0px;">' +
top3 +
'</div>' +

'<hr style="border:none;border-top:2px solid rgba(180,160,80,.55);margin:18px 0;">' +

'<div style="text-align:center;font-size:22px;font-weight:900;color:#0b5f66;margin:0 0 14px;text-shadow:0 1px 0 #fff;">⭐注目の県⭐</div>' +

'<div style="text-align:center; line-height:1.35;">' +
nearFull +
'</div>';

/* ===== 表示切替 ===== */
if (window.innerWidth >= 768) {
document.getElementById("rankingBox").innerHTML = rankingHtmlPc;
} else {
document.getElementById("rankingBox").innerHTML = rankingHtmlMobile;
}
}
