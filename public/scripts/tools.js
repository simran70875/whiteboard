let toolName;
document.querySelectorAll(".tool").forEach((toolElement) => {
  toolElement.addEventListener("click", (e) => {
    toolName = toolElement.id;
    handleToolSelection(toolName);
  });
});

function handleToolSelection(toolName) {
  switch (toolName) {
    case "pencil":
      togglePencilColors();
      eraserContainer.style.display = "none";
      tool.strokeStyle = "#000";
      tool.lineWidth = 1;
      break;
    case "eraser":
      toggleEraserSize();
      pencilColorsContainer.style.display = "none";
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





