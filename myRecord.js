// === Level / My Record ===
function showLevelSparkles() {
  for (let i = 0; i < 35; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "levelSparkle";
    sparkle.textContent = "✨";

    sparkle.style.left =
      (window.innerWidth / 2 + Math.random() * 280 - 140) + "px";

    sparkle.style.top =
      (window.innerHeight / 2 + Math.random() * 180 - 90) + "px";

    sparkle.style.setProperty(
      "--sparkX",
      (Math.random() * 140 - 70) + "px"
    );

    document.body.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, 2000);
  }
}
  
function showLevelPetals() {
  for (let i = 0; i < 12; i++) {
    const petal = document.createElement("div");
    petal.className = "levelPetal";
    petal.textContent = "🌸";

    petal.style.left =
      (window.innerWidth / 2 + Math.random() * 220 - 110) + "px";

    petal.style.top =
      (window.innerHeight / 2 + Math.random() * 120 - 20) + "px";

    petal.style.setProperty(
      "--drift",
      (Math.random() * 120 - 60) + "px"
    );

    document.body.appendChild(petal);

    setTimeout(() => {
      petal.remove();
    }, 2800);
  }
}

function showLevelUpEffect(level, title) {

  const oldOverlay = document.querySelector(".levelUpOverlay");
  if (oldOverlay) {
    oldOverlay.remove();
  }

  const light = document.createElement("div");
  light.className = "levelLightFlash";
  document.body.appendChild(light);

  showLevelPetals();
  showLevelSparkles();

  setTimeout(() => {
    light.remove();
  }, 1200);

  const overlay = document.createElement("div");
  overlay.className = "levelUpOverlay";

  overlay.innerHTML = `
    <div class="levelUpBox">

      <div class="levelUpTitle">
        🎉レベルアップしました🎉
      </div>

            <div class="levelUpLevel">
        ⭐ Lv.${level} ⭐
      </div>

      <div class="levelUpRank">
        👑${title}👑
      </div>

    </div>
  `;

  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.remove();
  }, 2500);
}
  
function getMyLevelInfo(postCount, thanksCount) {
  const point = postCount * 10 + thanksCount * 2;

  let level = Math.floor(Math.sqrt(point)) + 1;

  if (level > 99) {
    level = 99;
  }

  let title = "旅人";

  if (level >= 90) {
    title = "地球愛の神";
  } else if (level >= 80) {
    title = "奇跡の光使";
  } else if (level >= 70) {
    title = "祝福の女神";
  } else if (level >= 60) {
    title = "光の守護者";
  } else if (level >= 50) {
    title = "愛の天使";
  } else if (level >= 40) {
    title = "光の癒し手";
  } else if (level >= 30) {
    title = "幸せの紡ぎ手";
  } else if (level >= 20) {
    title = "虹の使者";
  } else if (level >= 10) {
    title = "吟遊詩人";
  }

  return {
    point: point,
    level: level,
    title: title
  };
}
  
function loadMyRecordPosts() {
  function loadRows(loader) {
    return new Promise((resolve, reject) => {
      try {
        loader(function(rows, headers) {
          if (!Array.isArray(rows)) {
            reject(new Error("rows is not array"));
            return;
          }

          // rows[0] が headers でないJSON実装にも備える保険
          const firstRow = rows[0] || [];
          const hasHeaderRow =
            Array.isArray(firstRow) &&
            firstRow.some(h => String(h).replace(/\s/g, "").trim() === "投稿者");

          if (!hasHeaderRow && Array.isArray(headers)) {
            resolve([headers, ...rows]);
            return;
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  Promise.all([
    loadRows(loadMapData),
    loadRows(loadHeartData)
  ])
  .then(([treasureRows, heartRows]) => {
    const counts = {};

    addPosterCounts(treasureRows, counts);
    addPosterCounts(heartRows, counts);

    const myName = localStorage.getItem("myPosterName") || "";
    const myCount = counts[myName] || 0;
    const myThanksCount = Number(localStorage.getItem("myThanksCount") || 0);
    const levelInfo = getMyLevelInfo(myCount, myThanksCount);

    const nextPoint =
      levelInfo.level >= 99
        ? levelInfo.point
        : Math.pow(levelInfo.level, 2);

    const pointText =
      levelInfo.point + " / " + nextPoint + " pt";

    const lastLevel = Number(localStorage.getItem("myLastLevel") || levelInfo.level);

    if (levelInfo.level > lastLevel) {
      showLevelUpEffect(levelInfo.level, levelInfo.title);
    }

    localStorage.setItem("myLastLevel", levelInfo.level);

    document.getElementById("myRecordLevel").textContent =
      "Lv." + levelInfo.level;

    document.getElementById("myRecordTitle").textContent =
      levelInfo.title;

    document.getElementById("myRecordPosts").textContent =
      myCount + "件";

    document.getElementById("myRecordPoint").textContent =
      pointText;
  })
  .catch(error => {
    console.error("loadMyRecordPosts failed:", error);
    document.getElementById("myRecordPosts").textContent = "0件";
  });
}
  
function addPosterCounts(rows, counts) {
  const headers = rows[0];

  rows.slice(1).forEach(row => {
    const data = {};

    headers.forEach((h, i) => {
      const key = h.replace(/\s/g, "").trim();
      data[key] = row[i];
    });

    const name = (data["投稿者"] || "").trim();

    if (!name) return;
    if (name === "未入力") return;
    if (name === "匿名") return;

    counts[name] = (counts[name] || 0) + 1;
  });
} 

function registerMyName(){
  const name = prompt("オープンチャットで使っている名前を入力してください😊");

  if(!name) return;

  localStorage.setItem("myPosterName", name.trim());

  loadMyRecordPosts();

  alert("🌸 登録しました✨");

  const guide = document.getElementById("nameGuideOverlay");
  if(guide){
    guide.style.display = "none";
  }
}
  
function loadThanksTotal() {
fetch("https://script.google.com/macros/s/AKfycbybLspt-tzGEuWKZuEi4dukk4chmcU03jwS0_F9vuhbkW2RkpfXK8KOpSot8Za8BE6r/exec?action=total")
.then(response => response.json())
.then(data => {
document.getElementById("thanksTotal").textContent = data.total || 0;
})
  
.catch(() => {
  document.getElementById("thanksTotal").textContent = "0";
});
