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
  // Emit sticky note creation event
  socket.emit("createSticky", { content: textArea.textContent });
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

// Listen for sticky note events
socket.on("createSticky", ({ content }) => {
  const stickyBody = createOuterShell();
  const textArea = document.createElement("textarea");
  textArea.className = "body";
  textArea.textContent = content;
  stickyBody.appendChild(textArea);
});
