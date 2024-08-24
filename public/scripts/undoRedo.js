// Undo/Redo logic
const undoStack = [];
const redoStack = [];
function undo() {
  if (undoStack.length > 0) {
    tool.clearRect(0, 0, canvas.width, canvas.height);
    redoStack.push(undoStack.pop());
    // Emit undo event
    socket.emit("undo", { undoStack, redoStack });
    reDraw();
  }
}

function redo() {
  if (redoStack.length > 0) {
    tool.clearRect(0, 0, canvas.width, canvas.height);
    undoStack.push(redoStack.pop());
    // Emit redo event
    socket.emit("redo", { undoStack, redoStack });
    reDraw();
  }
}

// Listen for undo/redo events
socket.on("undo", ({ undoStack, redoStack }) => {
  tool.clearRect(0, 0, canvas.width, canvas.height);
  reDraw(undoStack);
});

socket.on("redo", ({ undoStack, redoStack }) => {
  tool.clearRect(0, 0, canvas.width, canvas.height);
  reDraw(undoStack);
});

function reDraw() {
  for (const { x, y, desc, strokeColor, strokWidth } of undoStack) {
    tool.strokeStyle = strokeColor;
    tool.lineWidth = strokWidth;
    if (desc === "md") {
      tool.beginPath();
      tool.moveTo(x, y);
    } else {
      tool.lineTo(x, y);
      tool.stroke();
    }
  }
}
