var xChart = echarts.init(document.getElementById("x-chart"));
var yChart = echarts.init(document.getElementById("y-chart"));
var zChart = echarts.init(document.getElementById("z-chart"));

const clearButton = document.getElementById("clear");
const timeOut = 100;

if (window.DeviceMotionEvent == undefined) {
  //No accelerometer is present. Use buttons.
  console.log("No accelerometer present");
} else {
  window.addEventListener(
    "devicemotion",
    _.throttle(accelerometerUpdate, timeOut),
    true
  );
}

function accelerometerUpdate(event) {
  console.log({ x: event.acceleration.x, t: event.time });
  let time = (event.time || 16) / 1000;

  var aX = event.acceleration.x * time;
  var aY = event.acceleration.y * time;
  var aZ = event.acceleration.z * time;

  updateGraphs({ x: aX, y: aY, z: aZ });
  document.getElementById("interval").innerHTML = event.interval;
}

// Mock accelerometer data
function generateMockAccelerometerData() {
  const maxAcceleration = 10; // You can adjust this value as needed
  const mockData = {
    acceleration: {
      x: Math.random() * maxAcceleration,
      y: Math.random() * maxAcceleration,
      z: Math.random() * maxAcceleration,
    },
  };

  return mockData;
}

function clampValue(value) {
  if (value < 0.2 && value > -0.2) {
    return 0;
  }
  return value;
}
let x = 0,
  y = 0,
  z = 0;

function updateGraphs(data) {
  time = time + timeOut;
  xOption.xAxis.data.push(time);
  yOption.xAxis.data.push(time);
  zOption.xAxis.data.push(time);

  x += data.x;
  y += data.y;
  z += data.z;

  xOption.series[0].data.push(x);
  xOption && chartX.setOption(xOption);

  yOption.series[0].data.push(y);
  yOption && chartY.setOption(yOption);

  zOption.series[0].data.push(z);
  zOption && chartZ.setOption(zOption);
}

// setInterval(() => {
//   const mockData = generateMockAccelerometerData();
//   accelerometerUpdate({ acceleration: mockData.acceleration });
//   updateGraphs(mockData.acceleration);
// }, 1000);

var xChart = document.getElementById("x-chart");
var chartX = echarts.init(xChart);

var yChart = document.getElementById("y-chart");
var chartY = echarts.init(yChart);

var zChart = document.getElementById("z-chart");
var chartZ = echarts.init(zChart);

var xOption, yOption, zOption;
let time = timeOut;

xOption = {
  xAxis: {
    type: "category",
    data: [],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [],
      type: "line",
    },
  ],
};

yOption = {
  xAxis: {
    type: "category",
    data: [],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [],
      type: "line",
    },
  ],
};

zOption = {
  xAxis: {
    type: "category",
    data: [],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [],
      type: "line",
    },
  ],
};

xOption && chartX.setOption(xOption);
yOption && chartY.setOption(yOption);
zOption && chartZ.setOption(zOption);

clearButton.addEventListener("click", function () {
  time = 0;
  xOption.xAxis.data = [];
  yOption.xAxis.data = [];
  zOption.xAxis.data = [];

  xOption.series[0].data = [];
  xOption && chartX.setOption(xOption);

  yOption.series[0].data = [];
  yOption && chartY.setOption(yOption);

  zOption.series[0].data = [];
  zOption && chartZ.setOption(zOption);
});
