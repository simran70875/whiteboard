// Initialize slider for line width
const slider = document.querySelector("#myRange");
const output = document.querySelector(".demo");
output.innerHTML = slider.value;

slider.oninput = function () {
  output.innerHTML = this.value;
  tool.lineWidth = this.value;
};

// Initialize slider for eraser size
const sliderEraser = document.querySelector("#eraserRange");
const outputE = document.querySelector(".demoE");
outputE.innerHTML = sliderEraser.value;

sliderEraser.oninput = function () {
  outputE.innerHTML = this.value;
  tool.lineWidth = this.value;
};
