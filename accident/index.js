let chart = echarts.init(document.getElementById('main'));

// Initialize x-axis data up to 5 seconds
let initialXAxisData = [];
for (let i = 0; i <= 5000; i += 100) {
    initialXAxisData.push(i);
}

let option = {
    xAxis: {
        type: 'category',
        data: initialXAxisData
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 50 // Maximum value for Y-axis
    },
    series: [{
        data: [],
        type: 'line'
    }]
};

let timeCounter, speed, isStopping, isUpdating, timeoutId;

function resetData() {
    timeCounter = 0; // Reset time to 0
    speed = 0;
    isStopping = false;
    isUpdating = false;
    option.xAxis.data = initialXAxisData.slice(0);
    option.series[0].data = [];
    chart.setOption(option, true);
}

resetData();

document.getElementById('startButton').addEventListener('click', function() {
    resetData();
    isUpdating = true;
    updateChart();
});

document.getElementById('stopButton').addEventListener('click', function() {
    isStopping = true;
});

document.getElementById('accidentButton').addEventListener('click', function() {
    speed = 0;
    isUpdating = false; // Stop updating the chart
    if (timeoutId) {
        clearTimeout(timeoutId); // Clear the timeout when an accident occurs
    }
    if (option.series[0].data.length > 0) {
        option.series[0].data[option.series[0].data.length - 1] = 0;
        chart.setOption(option);
    }
});

function updateChart() {
    if (!isUpdating) return;

    timeoutId = setTimeout(function() {
        timeCounter += 100;

        if (isStopping) {
            if (speed > 5) {
                speed -= Math.random() * 2 + 1;
            } else {
                speed = 0;
                isUpdating = false;
            }
        } else {
            // Increase speed gradually until it reaches 40, then fluctuate between 40 and 60
            if (speed < 40) {
                speed += Math.random() * 3 + 1;
            } else {
                speed = 40 + Math.random() * 5;
            }
        }

        option.xAxis.data.push(timeCounter);
        option.series[0].data.push(speed);
        chart.setOption(option);

        if (isUpdating) {
            updateChart();
        }
    }, 100);
}
