
let isOpenPencilColors = false;
let isOpenEraserContainer = false;

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
    pencilcolor = colorMap[color] || "#000000"
    pencilWidth  = 1

    socket.emit("pencilColor", { pencilcolor, pencilWidth });
  });
});

socket.on("pencilColor", ({ pencilcolor, pencilWidth }) => {
  tool.strokeStyle = pencilcolor;
  tool.lineWidth = pencilWidth;
});

function togglePencilColors() {
  pencilColorsContainer.style.display = isOpenPencilColors ? "none" : "block";
  isOpenPencilColors = !isOpenPencilColors;
}
function toggleEraserSize() {
  eraserContainer.style.display = isOpenEraserContainer ? "none" : "block";
  isOpenEraserContainer = !isOpenEraserContainer;
}
