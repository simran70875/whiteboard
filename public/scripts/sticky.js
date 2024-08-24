// Sticky note logic
function createOuterShell() {
  const stickyCenter = document.createElement("div");
  const stickyDiv = document.createElement("div");
  const header = document.createElement("div");
  const body = document.createElement("div");
  const title = document.createElement("p");
  const closeIcon = document.createElement("span");
  const minimizeDiv = document.createElement("span");

  // Assign a unique ID to the sticky note
  const stickyId = `sticky-${Date.now()}`;
  stickyCenter.id = stickyId;

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

  closeIcon.addEventListener("click", () => {
    stickyCenter.remove();
    socket.emit("closeSticky", { stickyId });
  });

  socket.on("closeSticky", ({ id }) => {
    stickyCenter.remove();
  });

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
  // Emit sticky note creation event
  socket.emit("createSticky", { content: textArea.textContent });
}
// Listen for sticky note events
socket.on("createSticky", ({ content }) => {
  const stickyBody = createOuterShell();
  const textArea = document.createElement("textarea");
  textArea.className = "body";
  textArea.textContent = content;
  stickyBody.appendChild(textArea);
});

function addDragAndDrop(element) {
  let isDragging = false;
  let initialX, initialY, currentX, currentY;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    initialX = e.clientX;
    initialY = e.clientY;
    const { top, left } = element.getBoundingClientRect();
    currentX = left;
    currentY = top;
    socket.emit("dragAndDrop", { x: currentX, y: currentY, action: "start" });
  });

  element.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const dx = e.clientX - initialX;
      const dy = e.clientY - initialY;
      currentX += dx;
      currentY += dy;
      element.style.top = currentY + "px";
      element.style.left = currentX + "px";
      initialX = e.clientX;
      initialY = e.clientY;
      socket.emit("dragAndDrop", { x: currentX, y: currentY, action: "draw" });
    }
  });

  element.addEventListener("mouseup", () => {
    isDragging = false;
    socket.emit("dragAndDrop", { action: "stop" });
  });

  socket.on("dragAndDrop", ({ x, y, action }) => {
    switch (action) {
      case "start":
        isDragging = true;
        currentX = x;
        currentY = y;
        break;
      case "draw":
        if (isDragging) {
          element.style.top = y + "px";
          element.style.left = x + "px";
        }
        break;
      case "stop":
        isDragging = false;
        break;
    }
  });
}
