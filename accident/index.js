var xChart = echarts.init(document.getElementById("x-chart"));
var yChart = echarts.init(document.getElementById("y-chart"));
var zChart = echarts.init(document.getElementById("z-chart"));

if (window.DeviceMotionEvent == undefined) {
  //No accelerometer is present. Use buttons.
  document.querySelector("#acc").textContent = "NO";
  document.querySelector("#acc").className = "no";
} else {
  document.querySelector("#acc").textContent = "YES";
  document.querySelector("#acc").className = "yes";

  window.addEventListener(
    "devicemotion",
    _.throttle(accelerometerUpdate, 1000),
    true
  );
}

function accelerometerUpdate(event) {
  console.log({ x: event.acceleration.x, y: event.acceleration.y });

  var aX = event.acceleration.x;
  var aY = event.acceleration.y;
  var aZ = event.acceleration.z;

  document.querySelector("#x").value = aX;
  document.querySelector("#y").value = aY;
  document.querySelector("#z").value = aZ;

  updateGraphs(event.acceleration);

  // If aY is negative, switch rotation
  if (aY < 0) {
    aX = -aX - 180;
  }
  document.querySelector("#block").style.transform = "rotate(" + aX + "deg)";
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

function updateGraphs(data) {
  time = time + 1000;
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
//   updateGraphs(mockData.acceleration);
// }, 1000); // Update every 1000 ms (1 second)

var xChart = document.getElementById("x-chart");
var chartX = echarts.init(xChart);

var yChart = document.getElementById("y-chart");
var chartY = echarts.init(yChart);

var zChart = document.getElementById("z-chart");
var chartZ = echarts.init(zChart);

var xOption, yOption, zOption;
let time = 0;

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
