const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const brushTool = document.getElementById('brushTool');
const eraserTool = document.getElementById('eraserTool');
const colorPicker = document.getElementById('colorPicker');
const opacitySlider = document.getElementById('opacitySlider');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
const saveButton = document.getElementById('saveButton');
const shareButton = document.getElementById('shareButton');

let currentTool = 'brush';
let currentColor = colorPicker.value;
let currentOpacity = opacitySlider.value;
let isDrawing = false;
let drawingStack = [];
let redoStack = [];
let currentDrawing = null;

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 60;

brushTool.addEventListener('click', () => {
  currentTool = 'brush';
});

eraserTool.addEventListener('click', () => {
  currentTool = 'eraser';
});

colorPicker.addEventListener('change', () => {
  currentColor = colorPicker.value;
});

opacitySlider.addEventListener('input', () => {
  currentOpacity = opacitySlider.value;
});

undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);
saveButton.addEventListener('click', save);
shareButton.addEventListener('click', share);

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mouseout', endDrawing);

// Function to start drawing
function startDrawing(event) {
  isDrawing = true;
  const startPoint = {
    x: event.pageX - canvas.offsetLeft,
    y: event.pageY - canvas.offsetTop
  };
  currentDrawing = [startPoint];
  drawingStack.push(currentDrawing);
}

// Function to draw on the canvas
function draw(event) {
  if (!isDrawing) return;
  const currentPoint = {
    x: event.pageX - canvas.offsetLeft,
    y: event.pageY - canvas.offsetTop
  };
  
  context.strokeStyle = currentColor;
  context.lineWidth = 5;
  context.globalAlpha = currentOpacity;

  if (currentTool === 'brush') {
    context.lineCap = 'round';
  } else if (currentTool === 'eraser') {
    context.lineCap = 'square';
    context.strokeStyle = '#ffffff'; // Eraser color
  }

  context.beginPath();
  context.moveTo(currentDrawing[currentDrawing.length - 1].x, currentDrawing[currentDrawing.length - 1].y);
  context.lineTo(currentPoint.x, currentPoint.y);
  context.stroke();

  currentDrawing.push(currentPoint);
}

// function to end drawing
function endDrawing() {
  isDrawing = false;
  currentDrawing = null;
}

// function to undo the last drawn stroke
function undo() {
  if (drawingStack.length === 0) return;
  const lastDrawing = drawingStack.pop();
  redoStack.push(lastDrawing);
  clearCanvas();
  redraw();
}

// function to redo the last undone stroke
function redo() {
  if (redoStack.length === 0) return;
  const lastUndoneDrawing = redoStack.pop();
  drawingStack.push(lastUndoneDrawing);
  redraw();
}

// function to clear the canvas
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// function to redraw the canvas based on the drawing stack
function redraw() {
  clearCanvas();
  drawingStack.forEach((drawing) => {
    for (let i = 1; i < drawing.length; i++) {
      context.strokeStyle = currentColor;
      context.lineWidth = 5;
      context.globalAlpha = currentOpacity;
      context.lineCap = 'round';
      context.beginPath();
      context.moveTo(drawing[i - 1].x, drawing[i - 1].y);
      context.lineTo(drawing[i].x, drawing[i].y);
      context.stroke();
    }
  });
}

// function to save the canvas as an image
function save() {
  const image = canvas.toDataURL();
  const link = document.createElement('a');
  link.href = image;
  link.download = 'drawing.png';
  link.click();
}

// function to share the canvas
function share() {
  if (navigator.share) {
    canvas.toBlob(function (blob) {
      const filesArray = [
        new File([blob], 'drawing.png', { type: blob.type }),
      ];
      navigator.share({
        files: filesArray,
      });
    });
  } else {
    alert('Your browser does not support sharing.');
  }
}




