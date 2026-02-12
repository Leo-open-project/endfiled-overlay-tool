const img = document.getElementById("img");
const file = document.getElementById("file");
const btnLoad = document.getElementById("btnLoad");
const opacity = document.getElementById("opacity");
const opacityVal = document.getElementById("opacityVal");
const chkLocked = document.getElementById("chkLocked");

let locked = false;
let scale = 1.0;
let rotation = 0;
let pos = { x: 100, y: 100 };

function applyTransform() {
  img.style.left = `${pos.x}px`;
  img.style.top = `${pos.y}px`;
  img.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
}

function applyOpacity() {
  const v = Number(opacity.value);
  img.style.opacity = String(v / 100);
  opacityVal.textContent = `${v}%`
}

const btnQuit = document.getElementById("btnQuit");
const btnRotL = document.getElementById("btnRotL");
const btnRotR = document.getElementById("btnRotR");
const rotVal = document.getElementById("rotVal");
const chkGrid = document.getElementById("chkGrid");
const grid = document.getElementById("grid");
const chkChroma = document.getElementById("chkChroma");
const chromaColor = document.getElementById("chromaColor");
const chromaTol = document.getElementById("chromaTol");
const chromaTolVal = document.getElementById("chromaTolVal");
const chromaRow = document.getElementById("chromaRow");
const chromaCanvas = document.createElement("canvas");
const chromaCtx = chromaCanvas.getContext("2d");
let originalImg = null;

btnLoad.onclick = () => file.click();
btnQuit.onclick = () => window.overlayApi.quit();
file.onchange = () => {
  const f = file.files?.[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  originalImg = new Image();
  originalImg.onload = () => {
    if (chkChroma.checked) applyChroma();
    else img.src = url;
  };
  originalImg.src = url;
};

btnRotL.onclick = () => {
  rotation = (rotation - 90) % 360;
  rotVal.textContent = `${rotation}°`;
  applyTransform();
};
btnRotR.onclick = () => {
  rotation = (rotation + 90) % 360;
  rotVal.textContent = `${rotation}°`;
  applyTransform();
};

function applyChroma() {
  if (!originalImg) return;
  chromaCanvas.width = originalImg.naturalWidth;
  chromaCanvas.height = originalImg.naturalHeight;
  chromaCtx.drawImage(originalImg, 0, 0);
  const data = chromaCtx.getImageData(0, 0, chromaCanvas.width, chromaCanvas.height);
  const hex = chromaColor.value;
  const kr = parseInt(hex.slice(1, 3), 16);
  const kg = parseInt(hex.slice(3, 5), 16);
  const kb = parseInt(hex.slice(5, 7), 16);
  const tol = Number(chromaTol.value);
  for (let i = 0; i < data.data.length; i += 4) {
    const dr = data.data[i] - kr;
    const dg = data.data[i + 1] - kg;
    const db = data.data[i + 2] - kb;
    if (Math.sqrt(dr * dr + dg * dg + db * db) < tol) {
      data.data[i + 3] = 0;
    }
  }
  chromaCtx.putImageData(data, 0, 0);
  img.src = chromaCanvas.toDataURL();
}

chkChroma.onchange = () => {
  chromaRow.style.display = chkChroma.checked ? "flex" : "none";
  if (!originalImg) return;
  if (chkChroma.checked) applyChroma();
  else img.src = originalImg.src;
};

chromaColor.oninput = () => { if (chkChroma.checked) applyChroma(); };
chromaTol.oninput = () => {
  chromaTolVal.textContent = chromaTol.value;
  if (chkChroma.checked) applyChroma();
};

chkGrid.onchange = () => {
  grid.classList.toggle("visible", chkGrid.checked);
};

chkLocked.onchange = () => {
  locked = chkLocked.checked;
  window.overlayApi.setLocked(locked);
};

// 메인에서 오는 잠금 상태 동기화
window.overlayApi.onLockState((v) => {
  locked = v;
  chkLocked.checked = v

  // 잠금 상태라면 HUD 만 조작 가능하게하고, 이미지 드래그는 차단
  img.style.pointerEvents = locked ? "none" : "auto";
  document.body.classList.toggle("unlocked", !locked);
});


// 이미지 드래그 이동 (잠금 해제 상태일때만)
let dragging = false;
let dragStart = { x: 0, y: 0 };
let posStart = { x: 0, y: 0 };

img.addEventListener("mousedown", (e) => {
  if (locked) return;
  dragging = true;
  dragStart = { x: e.clientX, y: e.clientY };
  posStart = { ...pos };
});

window.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  pos.x = posStart.x + (e.clientX - dragStart.x);
  pos.y = posStart.y + (e.clientY - dragStart.y);
  applyTransform();
});

window.addEventListener("mouseup", () => {
  dragging = false;
});

// Ctrl + +/-: 확대/축소
window.addEventListener("keydown", (e) => {
  if (locked) return;
  if (e.ctrlKey && (e.key === "+" || e.key === "=")) {
    e.preventDefault();
    scale = Math.min(5, scale + 0.01);
    applyTransform();
  }
  if (e.ctrlKey && (e.key === "-" || e.key === "_")) {
    e.preventDefault();
    scale = Math.max(0.1, scale - 0.01);
    applyTransform();
  }
});

applyTransform();
applyOpacity();
opacity.addEventListener("input", applyOpacity);