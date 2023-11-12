var xChart = echarts.init(document.getElementById("x-chart"));
var yChart = echarts.init(document.getElementById("y-chart"));
var zChart = echarts.init(document.getElementById("z-chart"));

const clearButton = document.getElementById("clear");
const timeOut = 100;

if (window.DeviceMotionEvent == undefined) {
  //No accelerometer is present. Use buttons.
  document.querySelector("#acc").textContent = "NO";
  document.querySelector("#acc").className = "no";
} else {
  document.querySelector("#acc").textContent = "YES";
  document.querySelector("#acc").className = "yes";

  window.addEventListener(
    "devicemotion",
    _.throttle(accelerometerUpdate, timeOut),
    true
  );
}

function accelerometerUpdate(event) {
  console.log({ x: event.acceleration.x, y: event.acceleration.y });

  var aX = handleAccle(event.acceleration.x);
  var aY = handleAccle(event.acceleration.y);
  var aZ = handleAccle(event.acceleration.z);

  updateGraphs({ x: aX, y: aY, z: aZ });
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

function handleAccle(value) {
  if (value < 0.2 && value > -0.2) {
    return 0;
  }
  return value;
}

function updateGraphs(data) {
  time = time + timeOut;
  xOption.xAxis.data.push(time);
  yOption.xAxis.data.push(time);
  zOption.xAxis.data.push(time);

  xOption.series[0].data.push(data.x);
  xOption && chartX.setOption(xOption);

  yOption.series[0].data.push(data.y);
  yOption && chartY.setOption(yOption);

  zOption.series[0].data.push(data.z);
  zOption && chartZ.setOption(zOption);
}

// setInterval(() => {
//   const mockData = generateMockAccelerometerData();
//   accelerometerUpdate({ acceleration: mockData.acceleration });
//   console.log({ mockData });
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
