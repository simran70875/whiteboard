canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);

let drawing = false;

function getCanvasCoordinates(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function startDrawing(e) {
  drawing = true;
  const { x, y } = getCanvasCoordinates(e);
  tool.beginPath();
  tool.moveTo(x, y);
  console.log(toolName);
  if (toolName != "eraser") {
    undoStack.push({
      x,
      y,
      desc: "md",
      strokeColor: tool.strokeStyle,
      strokWidth: tool.lineWidth,
    });
  }
  socket.emit("drawing", { x, y, toolName, action: "start" });
}

function draw(e) {
  if (!drawing) return;
  const { x, y } = getCanvasCoordinates(e);
  tool.lineTo(x, y);
  tool.stroke();
  if (toolName != "eraser") {
    undoStack.push({
      x,
      y,
      desc: "mm",
      strokeColor: tool.strokeStyle,
      strokWidth: tool.lineWidth,
    });
  }
  // Emit drawing event
  socket.emit("drawing", { x, y, toolName, action: "draw" });
}

function stopDrawing() {
  drawing = false;
  // Emit drawing stop event
  socket.emit("drawing", { action: "stop" });
}



// Listen for drawing events from the server
socket.on("drawing", ({ x, y, toolName, action }) => {
  switch (action) {
    case "start":
      tool.beginPath();
      tool.moveTo(x, y);
      break;
    case "draw":
      tool.lineTo(x, y);
      tool.stroke();

      break;
    case "stop":
      drawing = false;
      break;
  }
});
