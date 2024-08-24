function uploadImg() {
  const inputTag = document.querySelector(".input-tag");
  inputTag.click();
}

// Add event listener outside of uploadImg()
const inputTag = document.querySelector(".input-tag");
inputTag.addEventListener("change", () => {
  const dataImg = inputTag.files[0];
  const img = document.createElement("img");
  img.src = URL.createObjectURL(dataImg);
  img.className = "upload-img";
  const stickyBody = createOuterShell();
  stickyBody.appendChild(img);
  imgsrc = URL.createObjectURL(dataImg);

  socket.emit("addImage",{ imgsrc });
});

socket.on("addImage",({imgsrc}) =>{
  const img = document.createElement("img");
  img.src = imgsrc;
  img.className = "upload-img";
  const stickyBody = createOuterShell();
  stickyBody.appendChild(img);
})

function download() {
  html2canvas(canvasContainer).then((canvas) => {
    const a = document.createElement("a");
    a.download = "whiteboard_sticky_view.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  });
}
