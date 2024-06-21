// Initialize canvas and drawing tool
const canvasContainer = document.querySelector(".canvas-container");
const canvas = document.querySelector("#whiteboard");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const tool = canvas.getContext("2d");

let drawing = false;
let isOpenPencilColors = false;
let isOpenEraserSize = false;
const pencilColorsContainer = document.querySelector("#pencilColorsContainer");
const eraserSize = document.querySelector("#eraserSize");
const pickColor = document.querySelector("#pickColor");
const pencilColors = document.querySelectorAll(".boxColor");

// Initialize slider for line width
const slider = document.querySelector("#myRange");
const output = document.querySelector(".demo");
output.innerHTML = slider.value;

slider.oninput = function () {
  output.innerHTML = this.value;
  tool.lineWidth = this.value;
};

// Handle pencil color selection
pencilColors.forEach((colorBox) => {
  colorBox.addEventListener("click", () => {
    const color = colorBox.id;
    const colorMap = {
      redColor: "#FF0000",
      blueColor: "#0F00FF",
      greenColor: "#007C08",
      pinkColor: "#FF00E0",
      yellowColor: "#F1C40F",
      blackColor: "#000000",
    };
    tool.strokeStyle = colorMap[color] || "#000000";
    tool.lineWidth = 1;
  });
});

// Handle tool selection
document.querySelectorAll(".tool").forEach((toolElement) => {
  toolElement.addEventListener("click", (e) => {
    const toolName = toolElement.id;
    handleToolSelection(toolName);
  });
});

function handleToolSelection(toolName) {
  switch (toolName) {
    case "pencil":
      togglePencilColors();
      pickColor.style.display = "block";
      tool.strokeStyle = "#000";
      tool.lineWidth = 1;
      break;
    case "eraser":
      togglePencilColors();
      pickColor.style.display = "none";
      tool.strokeStyle = "#fff";
      tool.lineWidth = 10;
      break;
    case "sticky":
      createSticky();
      break;
    case "upload":
      uploadImg();
      break;
    case "download":
      download();
      break;
    case "undo":
      undo();
      break;
    case "redo":
      redo();
      break;
  }
}

function togglePencilColors() {
  pencilColorsContainer.style.display = isOpenPencilColors ? "none" : "block";
  isOpenPencilColors = !isOpenPencilColors;
}

// Drawing logic
const undoStack = [];
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);

function startDrawing(e) {
  drawing = true;
  const { x, y } = getCanvasCoordinates(e);
  tool.beginPath();
  tool.moveTo(x, y);
  undoStack.push({ x, y, desc: "md" });
}

function draw(e) {
  if (!drawing) return;
  const { x, y } = getCanvasCoordinates(e);
  tool.lineTo(x, y);
  tool.stroke();
  undoStack.push({ x, y, desc: "mm" });
}

function stopDrawing() {
  drawing = false;
}

function getCanvasCoordinates(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

// Sticky note logic
function createOuterShell() {
  const stickyCenter = document.createElement("div");
  const stickyDiv = document.createElement("div");
  const header = document.createElement("div");
  const body = document.createElement("div");
  const title = document.createElement("p");
  const closeIcon = document.createElement("span");
  const minimizeDiv = document.createElement("span");

  stickyCenter.className = "stickyCenter";
  stickyDiv.className = "sticky";
  header.className = "header";
  body.className = "body";
  title.innerHTML = "Header";
  closeIcon.className = "close-icon";
  minimizeDiv.className = "close-icon";
  closeIcon.innerHTML = "&times;";
  minimizeDiv.innerText = "--";

  header.appendChild(title);
  header.appendChild(closeIcon);
  header.appendChild(minimizeDiv);
  stickyDiv.appendChild(header);
  stickyDiv.appendChild(body);
  stickyCenter.appendChild(stickyDiv);
  canvasContainer.appendChild(stickyCenter);

  closeIcon.addEventListener("click", () => stickyCenter.remove());
  minimizeDiv.addEventListener("click", () => {
    body.style.display = body.style.display === "none" ? "block" : "none";
  });

  addDragAndDrop(stickyCenter);
  return body;
}

function createSticky() {
  const stickyBody = createOuterShell();
  const textArea = document.createElement("textarea");
  textArea.className = "body";
  textArea.textContent = "I am body content";
  stickyBody.appendChild(textArea);
}

function uploadImg() {
  const inputTag = document.querySelector(".input-tag");
  inputTag.click();
  inputTag.addEventListener("change", () => {
    const dataImg = inputTag.files[0];
    const img = document.createElement("img");
    img.src = URL.createObjectURL(dataImg);
    img.className = "upload-img";

    const stickyBody = createOuterShell();
    stickyBody.appendChild(img);
  });
}

function download() {
  html2canvas(canvasContainer).then((canvas) => {
    const a = document.createElement("a");
    a.download = "whiteboard_sticky_view.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  });
}

// Undo/Redo logic
const redoStack = [];
function undo() {
  if (undoStack.length > 0) {
    tool.clearRect(0, 0, canvas.width, canvas.height);
    redoStack.push(undoStack.pop());
    reDraw();
  }
}

function redo() {
  if (redoStack.length > 0) {
    tool.clearRect(0, 0, canvas.width, canvas.height);
    undoStack.push(redoStack.pop());
    reDraw();
  }
}

function reDraw() {
  for (const { x, y, desc } of undoStack) {
    if (desc === "md") {
      tool.beginPath();
      tool.moveTo(x, y);
    } else {
      tool.lineTo(x, y);
      tool.stroke();
    }
  }
}

// Drag and Drop functionality
function addDragAndDrop(element) {
  let isDragging = false;
  let initialX, initialY;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    initialX = e.clientX;
    initialY = e.clientY;
  });

  element.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const dx = e.clientX - initialX;
      const dy = e.clientY - initialY;
      const { top, left } = element.getBoundingClientRect();
      element.style.top = top + dy + "px";
      element.style.left = left + dx + "px";
      initialX = e.clientX;
      initialY = e.clientY;
    }
  });

  element.addEventListener("mouseup", () => {
    isDragging = false;
  });
}
