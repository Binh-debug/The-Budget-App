const overViewChart = document.querySelector(".overview-chart");
const canvas = document.createElement("canvas");
overViewChart.appendChild(canvas);

canvas.width = 120;
canvas.height = 120;

const context2D = canvas.getContext("2d");
context2D.lineWidth = 10;
const radius = 50;

// function drawCircle
function drawCircle(ratio, color, anticlockwise) {
  context2D.beginPath();
  context2D.arc(60, 60, radius, 0, ratio * Math.PI * 2, anticlockwise);
  context2D.strokeStyle = color;
  context2D.stroke();
}

// function updateChart
function updateChart(amountIncome, amountExpense) {
  context2D.clearRect(0, 0, canvas.width, canvas.height);
  let ratio = amountIncome / (amountExpense + amountIncome);
  drawCircle(-ratio, "#009432", true);
  drawCircle(1 - ratio, "#ff5252", false);
}
