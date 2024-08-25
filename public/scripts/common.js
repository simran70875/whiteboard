const socket = io("https://whiteboard-tau-eight.vercel.app");
socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

const canvasContainer = document.querySelector(".canvas-container");
const canvas = document.querySelector("#whiteboard");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const tool = canvas.getContext("2d");

const pencilColorsContainer = document.querySelector("#pencilColorsContainer");
const pickColor = document.querySelector("#pickColor");
const pencilColors = document.querySelectorAll(".boxColor");
const eraserContainer = document.querySelector("#eraserContainer");