// === Thanks / Popup Visibility ===
function sendThanks(button, spotId) {
const key = "thanks_" + spotId;
const message = button.parentElement.querySelector(".thanks-message");

if (localStorage.getItem(key)) {
button.style.display = "none";
message.style.display = "table";
message.textContent = makeThanksMessage();
const hint = button.parentElement.querySelector(".thanks-hint");
if (hint) {
  hint.style.display = "none";
}  
return;
}

fetch("https://script.google.com/macros/s/AKfycbybLspt-tzGEuWKZuEi4dukk4chmcU03jwS0_F9vuhbkW2RkpfXK8KOpSot8Za8BE6r/exec?action=add&spotId=" + encodeURIComponent(spotId), {
  method: "GET",
  mode: "no-cors"
});

localStorage.setItem(key, "done");
const thanksCount = Number(localStorage.getItem("myThanksCount") || 0) + 1;

localStorage.setItem("myThanksCount", thanksCount);

document.getElementById("myRecordThanks").textContent = thanksCount + "回";

loadMyRecordPosts();
  
button.style.display = "none";
message.style.display = "inline-block";
message.textContent = makeThanksMessage();
const hint = button.parentElement.querySelector(".thanks-hint");
if (hint) {
  hint.style.display = "none";
}  
showSparkles();
}

function showSparkles() {

  // ✨キラキラ
  for (let i = 0; i < 20; i++) {

    const sparkle = document.createElement("div");

    sparkle.innerHTML = "✨";
    sparkle.style.position = "fixed";
    sparkle.style.left = Math.random() * window.innerWidth + "px";
    sparkle.style.top = Math.random() * window.innerHeight + "px";
    sparkle.style.fontSize = "24px";
    sparkle.style.pointerEvents = "none";
    sparkle.style.zIndex = "9999";

    document.body.appendChild(sparkle);

    sparkle.animate(
      [
        { transform: "translateY(0px)", opacity: 1 },
        { transform: "translateY(-100px)", opacity: 0 }
      ],
      {
        duration: 1200,
        easing: "ease-out"
      }
    );

    setTimeout(() => sparkle.remove(), 1200);
  }


  // 🌸花びら
  for (let i = 0; i < 7; i++) {

    const petal = document.createElement("div");

    petal.innerHTML = "🌸";
    petal.style.position = "fixed";
    petal.style.left = Math.random() * window.innerWidth + "px";
    petal.style.top = Math.random() * window.innerHeight + "px";
    petal.style.fontSize = "22px";
    petal.style.pointerEvents = "none";
    petal.style.zIndex = "9999";

    document.body.appendChild(petal);

    petal.animate(
      [
        {
          transform: "translate(0px,0px) rotate(0deg)",
          opacity: 1
        },
        {
          transform: "translate(40px,-120px) rotate(180deg)",
          opacity: 0
        }
      ],
      {
        duration: 1800,
        easing: "ease-out"
      }
    );

    setTimeout(() => petal.remove(), 1800);
  }

}
function makeThanksMessage() {
  const flowers = ["🌸", "🌼", "🌷", "🌻", "🌺", "🪻"];
  const flower = flowers[Math.floor(Math.random() * flowers.length)];
  return flower + "ありがとうの花が咲きました✨";
}
map.on("popupopen", function(e) {

document.querySelectorAll(".legend").forEach(box => {
box.style.display = "none";
});

document.getElementById("searchBox").style.display = "none";
document.getElementById("rainbowBox").style.display = "none";
document.getElementById("skyTempleBox").style.display = "none";  
document.getElementById("mapSwitchBox").style.display = "none";
document.getElementById("myRecordBox").style.display = "none";
const button =
e.popup.getElement().querySelector(".thanks-btn");

if (!button) return;

const spotId = button.dataset.spotId;
const key = "thanks_" + spotId;
const message = button.parentElement.querySelector(".thanks-message");

if (localStorage.getItem(key)) {

button.style.display = "none";

message.style.display = "inline-block";
message.textContent = makeThanksMessage();
const hint = button.parentElement.querySelector(".thanks-hint");
if (hint) {
  hint.style.display = "none";
}  
showSparkles();
}

});

map.on("popupclose", function() {

document.querySelectorAll(".legend").forEach(box => {
box.style.display = "block";
});

document.getElementById("searchBox").style.display = "block";

if (document.getElementById("map").style.display !== "none") {
  document.getElementById("rainbowBox").style.display = "block";
  document.getElementById("skyTempleBox").style.display = "block";
}

document.getElementById("mapSwitchBox").style.visibility = "visible";
document.getElementById("myRecordBox").style.display = "block";
  
});
