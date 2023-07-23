// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
  // Get the canvas element and its context
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Circle properties
  const circleRadius = 15;

  // Circle objects with position and move state
  const circles = [
    { x: 100, y: 100, isMoving: false }, // Red circle
    { x: 200, y: 200, isMoving: false }, // Blue circle
    { x: 300, y: 150, isMoving: false }, // Yellow circle
  ];

  // Image URL for the yellow circle
  const yellowCircleImageUrl = "https://waterpoloauthority.com/wp-content/uploads/2023/07/WaterPoloBall.svg";

  // Create image object for the yellow circle
  const yellowCircleImage = new Image();
  yellowCircleImage.src = yellowCircleImageUrl;

  // Variables for drawing functionality
  let isDrawing = false;
  let prevX, prevY;
  const drawingPaths = []; // Store drawing paths

  // Function to draw circles on the canvas
  function drawCircles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw red circle
    ctx.beginPath();
    ctx.arc(circles[0].x, circles[0].y, circleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    // Draw blue circle
    ctx.beginPath();
    ctx.arc(circles[1].x, circles[1].y, circleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();

    // Draw yellow circle with image
    const yellowCircleSize = 25;
    ctx.drawImage(yellowCircleImage, circles[2].x - yellowCircleSize / 2, circles[2].y - yellowCircleSize / 2, yellowCircleSize, yellowCircleSize);

    // Redraw stored drawing paths
    for (const path of drawingPaths) {
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (const point of path) {
        ctx.lineTo(point.x, point.y);
      }
      ctx.lineWidth = 3;
      ctx.strokeStyle = "black";
      ctx.stroke();
      ctx.closePath();
    }
  }

  // Function to check if a point (x, y) is inside the circle
  function isInsideCircle(x, y, circleX, circleY) {
    return Math.sqrt((x - circleX) ** 2 + (y - circleY) ** 2) <= circleRadius;
  }

  // Function to handle mouse/touch movement
  function handleMove(e) {
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;

    if (isDrawing) {
      if (e.type === "touchmove") {
        e.preventDefault();
      }
      ctx.lineTo(mouseX, mouseY);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "black";
      ctx.stroke();
      prevX = mouseX;
      prevY = mouseY;
      // Store drawing path points
      drawingPaths[drawingPaths.length - 1].push({ x: mouseX, y: mouseY });
    } else {
      for (const circle of circles) {
        if (circle.isMoving) {
          circle.x = mouseX;
          circle.y = mouseY;
          drawCircles();
        }
      }
    }
  }

  // Add event listeners for touch events
  canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    isDrawing = drawBtn.classList.contains("active");

    if (isDrawing) {
      ctx.beginPath();
      ctx.moveTo(e.touches[0].clientX - canvas.offsetLeft, e.touches[0].clientY - canvas.offsetTop);
      prevX = e.touches[0].clientX - canvas.offsetLeft;
      prevY = e.touches[0].clientY - canvas.offsetTop;
      // Start a new drawing path
      drawingPaths.push([{ x: prevX, y: prevY }]);
    } else {
      for (const circle of circles) {
        if (isInsideCircle(e.touches[0].clientX - canvas.offsetLeft, e.touches[0].clientY - canvas.offsetTop, circle.x, circle.y)) {
          circle.isMoving = true;
        }
      }
    }
  });

  canvas.addEventListener("touchmove", handleMove);

  canvas.addEventListener("touchend", function () {
    isDrawing = false;
    if (isDrawing) {
      ctx.closePath();
    } else {
      for (const circle of circles) {
        circle.isMoving = false;
      }
    }
  });

  // Add event listeners for mouse events
  canvas.addEventListener("mousedown", function (e) {
    e.preventDefault();
    isDrawing = drawBtn.classList.contains("active");

    if (isDrawing) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      prevX = e.clientX - canvas.offsetLeft;
      prevY = e.clientY - canvas.offsetTop;
      // Start a new drawing path
      drawingPaths.push([{ x: prevX, y: prevY }]);
    } else {
      for (const circle of circles) {
        if (isInsideCircle(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, circle.x, circle.y)) {
          circle.isMoving = true;
        }
      }
    }
  });

  canvas.addEventListener("mousemove", handleMove);

  canvas.addEventListener("mouseup", function () {
    isDrawing = false;
    if (isDrawing) {
      ctx.closePath();
    } else {
      for (const circle of circles) {
        circle.isMoving = false;
      }
    }
  });

  // Add event listeners for button clicks
  const moveBtn = document.getElementById("moveBtn");
  const drawBtn = document.getElementById("drawBtn");
  const clearBtn = document.getElementById("clearBtn");

  moveBtn.addEventListener("click", function () {
    moveBtn.classList.toggle("active");
    drawBtn.classList.remove("active");
    isDrawing = false;
  });

  drawBtn.addEventListener("click", function () {
    drawBtn.classList.toggle("active");
    moveBtn.classList.remove("active");
    isDrawing = false;
  });

  clearBtn.addEventListener("click", function () {
    // Clear the stored drawing paths
    drawingPaths.length = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircles();
  });

  // When the yellow circle's image loads, draw the circles and drawings
  yellowCircleImage.onload = () => {
    drawCircles();
  };
});
