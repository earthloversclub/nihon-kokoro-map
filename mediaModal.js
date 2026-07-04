// === Media Modal ===
  
let modalItems = [];
let modalIndex = 0;
let modalScale = 1;
let modalTranslateX = 0;
let modalTranslateY = 0;

let touchStartX = 0;
let touchStartY = 0;
let lastTouchX = 0;
let lastTouchY = 0;
let lastTouchDistance = 0;

let isPinching = false;
let hasDraggedImage = false;

let isModalSwipeActive = false;
let modalSwipeDirection = 0;
const MODAL_SWIPE_THRESHOLD = 70;
const MODAL_SWIPE_DURATION = 220;

let isMouseDraggingImage = false;
let lastMouseX = 0;
let lastMouseY = 0;

function applyModalImageTransform() {
  const img = document.getElementById('modalImage');

  img.style.transform =
    `translate(${modalTranslateX}px, ${modalTranslateY}px) scale(${modalScale})`;
}

function resetModalZoom() {
  modalScale = 1;
  modalTranslateX = 0;
  modalTranslateY = 0;
  lastTouchDistance = 0;
  isPinching = false;
  hasDraggedImage = false;
  resetModalSwipeStage();
}

function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;

  return Math.sqrt(dx * dx + dy * dy);
}

function getModalNeighborIndex(direction) {
  let index = modalIndex + direction;

  if (index < 0) index = modalItems.length - 1;
  if (index >= modalItems.length) index = 0;

  return index;
}

function resetModalSwipeStage() {
  const stage = document.getElementById('modalSwipeStage');
  const current = document.getElementById('modalSwipeCurrent');
  const neighbor = document.getElementById('modalSwipeNeighbor');
  const img = document.getElementById('modalImage');

  if (!stage || !current || !neighbor || !img) return;

  stage.style.display = "none";
  current.src = "";
  neighbor.src = "";

  current.style.transition = "none";
  neighbor.style.transition = "none";

  current.style.transform = "translate(-50%, -50%)";
  neighbor.style.transform = "translate(-50%, -50%)";

  img.style.visibility = "visible";

  isModalSwipeActive = false;
  modalSwipeDirection = 0;
}

function moveModalSwipe(diffX) {
  const item = modalItems[modalIndex];
  const direction = diffX < 0 ? 1 : -1;
  const neighborItem = modalItems[getModalNeighborIndex(direction)];

  if (!item || item.type !== "image") return;
  if (!neighborItem || neighborItem.type !== "image") return;

  const stage = document.getElementById('modalSwipeStage');
  const current = document.getElementById('modalSwipeCurrent');
  const neighbor = document.getElementById('modalSwipeNeighbor');
  const img = document.getElementById('modalImage');

  if (!isModalSwipeActive || modalSwipeDirection !== direction) {
    modalSwipeDirection = direction;
    current.src = item.url;
    neighbor.src = neighborItem.url;
    stage.style.display = "block";
    img.style.visibility = "hidden";
  }

  isModalSwipeActive = true;

  const width = window.innerWidth;
  const neighborBaseX = direction === 1 ? width : -width;

  current.style.transition = "none";
  neighbor.style.transition = "none";

  current.style.transform =
    `translate(calc(-50% + ${diffX}px), -50%)`;

  neighbor.style.transform =
    `translate(calc(-50% + ${neighborBaseX + diffX}px), -50%)`;
}

function cancelModalSwipe() {
  const current = document.getElementById('modalSwipeCurrent');
  const neighbor = document.getElementById('modalSwipeNeighbor');

  const width = window.innerWidth;
  const neighborBaseX = modalSwipeDirection === 1 ? width : -width;

  current.style.transition = `transform ${MODAL_SWIPE_DURATION}ms ease`;
  neighbor.style.transition = `transform ${MODAL_SWIPE_DURATION}ms ease`;

  current.style.transform = "translate(-50%, -50%)";
  neighbor.style.transform =
    `translate(calc(-50% + ${neighborBaseX}px), -50%)`;

  setTimeout(() => {
    resetModalSwipeStage();
  }, MODAL_SWIPE_DURATION);
}

function completeModalSwipe() {
  const current = document.getElementById('modalSwipeCurrent');
  const neighbor = document.getElementById('modalSwipeNeighbor');

  const width = window.innerWidth;
  const currentEndX = modalSwipeDirection === 1 ? -width : width;

  current.style.transition = `transform ${MODAL_SWIPE_DURATION}ms ease`;
  neighbor.style.transition = `transform ${MODAL_SWIPE_DURATION}ms ease`;

  current.style.transform =
    `translate(calc(-50% + ${currentEndX}px), -50%)`;

  neighbor.style.transform = "translate(-50%, -50%)";

  setTimeout(() => {
    modalIndex = getModalNeighborIndex(modalSwipeDirection);
    renderModalItem(true);
  }, MODAL_SWIPE_DURATION);
}

function openMediaModal(items, index) {
modalItems = items;
modalIndex = index;

renderModalItem();

document.getElementById('imageModal').style.display = 'flex';
}

function renderModalItem(skipAnimation = false) {
const item = modalItems[modalIndex];

const img = document.getElementById('modalImage');
const video = document.getElementById('modalVideo');

resetModalZoom();

if (item.type === "image") {
video.style.display = "none";
video.src = "";

img.style.display = "block";

if (skipAnimation) {
  img.src = item.url;
  img.style.opacity = "1";
  img.style.transform = "translateX(0) scale(1)";
} else {
  img.style.opacity = "0";
  img.style.transform = "translateX(25px) scale(1)";

  setTimeout(() => {
    img.src = item.url;

    setTimeout(() => {
      img.style.opacity = "1";
      img.style.transform = "translateX(0) scale(1)";
    }, 30);
  }, 80);
}
}

if (item.type === "video") {
img.style.display = "none";
img.src = "";

video.style.display = "block";
video.src = item.url;
}

document.getElementById('imageCounter').textContent =
(modalIndex + 1) + " / " + modalItems.length;
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

if (modalItems.length <= 1) {
  modalPrev.style.display = "none";
  modalNext.style.display = "none";
} else {
  modalPrev.style.display = "";
  modalNext.style.display = "";
}
}

function showModalImage(direction) {
if (modalItems.length === 0) return;

modalIndex += direction;

if (modalIndex < 0) {
modalIndex = modalItems.length - 1;
}

if (modalIndex >= modalItems.length) {
modalIndex = 0;
}

renderModalItem();
}

function closeImageModal() {
document.getElementById('imageModal').style.display = 'none';
document.getElementById('modalVideo').src = "";
resetModalSwipeStage();
}
const imageModal = document.getElementById('imageModal');

imageModal.addEventListener('touchstart', function(e) {
  if (modalItems[modalIndex]?.type !== "image") return;

  if (e.touches.length === 2) {
    isPinching = true;
    lastTouchDistance = getTouchDistance(e.touches);
    resetModalSwipeStage();
    e.preventDefault();
    return;
  }

if (e.touches.length === 1) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  lastTouchX = touchStartX;
  lastTouchY = touchStartY;
  hasDraggedImage = false;

  if (modalScale === 1) {
    resetModalSwipeStage();
  }
}
}, { passive: false });

imageModal.addEventListener('touchmove', function(e) {
  if (modalItems[modalIndex]?.type !== "image") return;

  if (e.touches.length === 2) {
    const distance = getTouchDistance(e.touches);

    if (lastTouchDistance > 0) {
      const zoomChange = distance / lastTouchDistance;

      modalScale *= zoomChange;
      modalScale = Math.max(1, Math.min(modalScale, 4));

      if (modalScale === 1) {
        modalTranslateX = 0;
        modalTranslateY = 0;
      }

      applyModalImageTransform();
    }

    lastTouchDistance = distance;
    isPinching = true;
    resetModalSwipeStage();
    e.preventDefault();
    return;
  }

if (e.touches.length === 1 && modalScale > 1) {
  const currentX = e.touches[0].clientX;
  const currentY = e.touches[0].clientY;

  modalTranslateX += currentX - lastTouchX;
  modalTranslateY += currentY - lastTouchY;

  lastTouchX = currentX;
  lastTouchY = currentY;
  hasDraggedImage = true;

  applyModalImageTransform();
  e.preventDefault();
  return;
}

if (e.touches.length === 1 && modalScale === 1) {
  const currentX = e.touches[0].clientX;
  const currentY = e.touches[0].clientY;
  const diffX = currentX - touchStartX;
  const diffY = currentY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 8) {
    moveModalSwipe(diffX);
    e.preventDefault();
    return;
  }
}
}, { passive: false });

imageModal.addEventListener('touchend', function(e) {
  if (modalItems[modalIndex]?.type !== "image") return;

  if (e.touches.length === 0) {
    lastTouchDistance = 0;
  }

  if (isPinching) {
    isPinching = false;
    resetModalSwipeStage();
    return;
  }

  if (modalScale > 1 || hasDraggedImage) {
    return;
  }

  const touchEndX = e.changedTouches[0].clientX;
  const diffX = touchEndX - touchStartX;

  if (!isModalSwipeActive) {
    if (Math.abs(diffX) < 50) return;

    if (diffX > 0) {
      showModalImage(-1);
    } else {
      showModalImage(1);
    }
    return;
  }

  if (Math.abs(diffX) < MODAL_SWIPE_THRESHOLD) {
    cancelModalSwipe();
    return;
  }

  completeModalSwipe();
}, { passive: true });
imageModal.addEventListener('wheel', function(e) {
  if (modalItems[modalIndex]?.type !== "image") return;

  resetModalSwipeStage();
  e.preventDefault();

  modalScale += -e.deltaY * 0.0015;
  modalScale = Math.max(1, Math.min(modalScale, 4));

  if (modalScale === 1) {
    modalTranslateX = 0;
    modalTranslateY = 0;
  }

  applyModalImageTransform();
}, { passive: false });

document.getElementById('modalImage').addEventListener('dragstart', function(e) {
  e.preventDefault();
});

imageModal.addEventListener('mousedown', function(e) {
  if (modalItems[modalIndex]?.type !== "image") return;
  if (modalScale <= 1) return;
  if (e.target.id !== "modalImage") return;

  resetModalSwipeStage();

  isMouseDraggingImage = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;

  e.preventDefault();
});

document.addEventListener('mousemove', function(e) {
  if (!isMouseDraggingImage) return;

  modalTranslateX += e.clientX - lastMouseX;
  modalTranslateY += e.clientY - lastMouseY;

  lastMouseX = e.clientX;
  lastMouseY = e.clientY;

  applyModalImageTransform();
});

document.addEventListener('mouseup', function() {
  isMouseDraggingImage = false;
});
