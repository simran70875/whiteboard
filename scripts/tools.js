let tools = document.querySelectorAll(".tool");
let canvasContainer = document.querySelector(".canvas-container");
let canvas = document.querySelector("#whiteboard");
canvas.width = window.innerWidth * 0.85;
canvas.height = window.innerHeight * 0.85;
let tool = canvas.getContext("2d");
let drawing = false;
let isOpen = false;
let isOpenSize = false;
let sidebar = document.querySelector("#sidebar");
let slidecontainer = document.querySelector("#slidecontainer");
let pencilColors = document.querySelectorAll(".boxColor");
var slider = document.querySelector("#myRange");
var output = document.querySelector(".demo");
output.innerHTML = slider.value;
slider.oninput = function () {
  output.innerHTML = this.value;
  tool.lineWidth = this.value;
  tool.strokeStyle = "#fff";
};

for (let i = 0; i < pencilColors.length; i++) {
  pencilColors[i].addEventListener("click", function () {
    const color = pencilColors[i].id;
    console.log(color);
    if (color == "redColor") {
      tool.strokeStyle = "#FF0000";
    } else if (color == "blueColor") {
      tool.strokeStyle = "#0F00FF";
    } else if (color == "greenColor") {
      tool.strokeStyle = "#007C08";
    } else if (color == "pinkColor") {
      tool.strokeStyle = "#FF00E0";
    } else if (color == "yellowColor") {
      tool.strokeStyle = "#F1C40F";
    } else if (color == "blackColor") {
      tool.strokeStyle = "#000000";
    } else {
      tool.strokeStyle = "#000000";
    }
    tool.lineWidth = 1;
  });
}

for (let i = 0; i < tools.length; i++) {
  tools[i].addEventListener("click", function (e) {
    let toolName = tools[i].id;
    if (toolName == "pencil") {
      sidebar.style.display = isOpen ? "block" : "none";
      isOpen = !isOpen;
    } else if (toolName == "eraser") {
      slidecontainer.style.display = isOpenSize ? "block" : "none";
      isOpenSize = !isOpenSize;
      tool.strokeStyle = "#fff";
      tool.lineWidth = 10;
    } else if (toolName == "sticky") {
      createSticky();
    } else if (toolName == "upload") {
      uploadImg();
    } else if (toolName == "download") {
      download();
    } else if (toolName == "undo") {
      undo();
    }else if (toolName == "redo") {
      redo();
    }
  });
}

let undoStack = [];
canvas.addEventListener("mousedown", function (e) {
  drawing = true;
  const rect = canvas.getBoundingClientRect();
  let sidx = e.clientX - rect.left;
  let sidy = e.clientY - rect.top;
  tool.beginPath();
  tool.moveTo(sidx, sidy);
  const xyCoordinates = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
    desc: "md",
  };
  undoStack.push(xyCoordinates);
});

canvas.addEventListener("mousemove", function (e) {
  if (drawing == false) {
    return;
  }
  const rect = canvas.getBoundingClientRect();
  let eidx = e.clientX - rect.left;
  let eidy = e.clientY - rect.top;
  tool.lineTo(eidx, eidy);
  tool.stroke();
  const xyCoordinates = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
    desc: "mm",
  };
  undoStack.push(xyCoordinates);
});

canvas.addEventListener("mouseup", function (e) {
  drawing = false;
});

function createOuterShell() {
  let stickyCenter = document.createElement("div");
  let stickyDiv = document.createElement("div");
  let header = document.createElement("div");
  let body = document.createElement("div");
  let title = document.createElement("p");
  let closeIcon = document.createElement("span");
  let minimizeDiv = document.createElement("span");

  stickyCenter.setAttribute("class", "stickyCenter");
  stickyDiv.setAttribute("class", "sticky");
  header.setAttribute("class", "header");
  body.setAttribute("class", "body");
  title.innerHTML = "Header";
  closeIcon.setAttribute("class", "close-icon");
  minimizeDiv.setAttribute("class", "close-icon");
  closeIcon.innerHTML = "&times;";
  minimizeDiv.innerText = "--";
  header.appendChild(title);
  header.appendChild(closeIcon);
  header.appendChild(minimizeDiv);
  stickyDiv.appendChild(header);
  stickyDiv.appendChild(body);
  stickyCenter.appendChild(stickyDiv);
  canvasContainer.appendChild(stickyCenter);

  let isMinimized = false;

  // On click close icon, remove sticky
  closeIcon.addEventListener("click", function () {
    stickyCenter.remove();
  });

  minimizeDiv.addEventListener("click", function () {
    body.style.display = isMinimized ? "block" : "none";
    isMinimized = !isMinimized;
  });

  // Add dragstart event listener
  let isStickyDown = false;
  let initialX, initialY;

  //start drag
  stickyCenter.addEventListener("mousedown", function (e) {
    initialX = e.clientX;
    initialY = e.clientY;
    isStickyDown = true;
    console.log(initialX, initialY);
  });
  //move sticky with mouse move
  stickyCenter.addEventListener("mousemove", function (e) {
    console.log(e);
    if (isStickyDown) {
      let finalX = e.clientX;
      let finalY = e.clientY;

      let dx = finalX - initialX;
      let dy = finalY - initialY;

      let { top, left } = stickyCenter.getBoundingClientRect();

      stickyCenter.style.top = top + dy + "px";
      stickyCenter.style.left = left + dx + "px";

      initialX = finalX;
      initialY = finalY;
    }
  });
  //stop drag
  stickyCenter.addEventListener("mouseup", function () {
    isStickyDown = false;
  });

  return body;
}

function createSticky() {
  let stickydiv = createOuterShell();
  let textArea = document.createElement("textarea");
  textArea.setAttribute("class", "body");
  textArea.textContent = "I am body content";
  // Append stickyDiv to stickyCenter
  stickydiv.appendChild(textArea);
}

let inputTag = document.querySelector(".input-tag");
function uploadImg() {
  // 1. input tag -> file(<input type="file">) [hide] -> css
  // 2. click image icon -> input tag click
  console.log("upload img");
  inputTag.click();
  inputTag.addEventListener("change", function () {
    let dataImg = inputTag.files[0];
    console.log(dataImg);
    let img = document.createElement("img");
    // src -> file url
    let url = URL.createObjectURL(dataImg);
    img.src = url;
    img.setAttribute("class", "upload-img");

    let stickydiv = createOuterShell();
    stickydiv.appendChild(img);
  });
}
function download() {
  html2canvas(canvasContainer).then(function (canvas) {
    const a = document.createElement("a");
    a.download = "whiteboard_sticky_view.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
    a.remove();
  });
}

function reDraw() {
  for (let i = 0; i < undoStack.length; i++) {
    let { x, y, desc } = undoStack[i];
    if (desc == "md") {
      tool.beginPath();
      tool.moveTo(x, y);
    } else {
      tool.lineTo(x, y);
      tool.stroke();
    }
  }
}
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
