class ForeCaster {
  fuelData = [];
  years = [];
  dynamicList = document.getElementById('pagination');
  chartSettings = {
    solid: true,
    liquid: true,
    gas: true,
    electricity: true
  }

  constructor(data) {
    this.getYears(data);
  }

  forcastChartData(fromDate, type) {
    const pastData = this.getFuelData(fromDate, type);

    // Calculate the slope and intercept using the straight-line method
    const n = pastData.length;
    const sumX = n * (n + 1) / 2;
    const sumY = pastData.reduce((acc, val) => acc + val, 0);
    const sumXY = pastData.map((val, i) => val * (i + 1)).reduce((acc, val) => acc + val, 0);
    const sumX2 = pastData.map((val, i) => (i + 1) ** 2).reduce((acc, val) => acc + val, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
    const intercept = (sumY - slope * sumX) / n;

    // Forecast data for the next 12 months
    const forecastedData = [];
    for (let i = 0; i < 12; i++) {
      forecastedData.push(slope * (n + i + 1) + intercept);
    }
    
    return [...pastData, ...forecastedData];
  }

  getYears(csv) {
    const lines = csv.split('\n');
    this.fuelData = lines.slice(1);
    this.years = this.fuelData.map(item => item.split(',')[0]);
  }

  filterFuelData(fromDate) {
    const rawData = this.fuelData;
    const fromIndex = rawData.findIndex(item => item.includes(fromDate));

    if (fromIndex == -1) return [];
    const endIndex = (fromIndex + 12 <= rawData.length) ? (fromIndex + 12) : rawData.length;

    return rawData.slice(fromIndex, endIndex);
}

  getFuelLabel(fromDate, mode) {
    let fuelLabel = []

    const filteredData = this.filterFuelData(fromDate);

    if (!filteredData.length) return [];

    const result = filteredData.map(item => `${(item.split(',')[1].slice(0, 3) + ', `' + item.split(',')[0].slice(2, 4))}`);

    fuelLabel.push(...result);

    if (mode == 'forcast') {
      fuelLabel.push(...['Sep, `22', 'Oct, `22', 'Nov, `22', 'Dec, `22', 'Jan, `23', 'Feb, `23', 'Mar, `23', 'Apr, `23', 'May, `23', 'Jun, `23', 'Jul, `23', 'Aug, `23'])
    }

    return fuelLabel
  }

  toggleNoData(type) {
    document.getElementById("noData").style.display = type;
  }

  getFuelData(fromDate, type) {
    const fuelMap = {
      'Solid fuels': 2,
      'Gas': 3,
      'Electricity': 4,
      'Liquid fuels': 5
    };

    let fuelData = [];

    const filteredData = this.filterFuelData(fromDate);

    if (!filteredData.length) {
      this.toggleNoData('flex')
      return [];
    }

    this.toggleNoData('none')

    // return filteredData.map(item => item.split(',')[fuelMap[type]]);

    for (let item of filteredData) {
      fuelData.push(item.split(',')[fuelMap[type]]);
  }
  return fuelData.map(item => +item);
  }

  organizeChartData(fromDate, mode) {
    let datasets = [];
    if (this.chartSettings.electricity) {
        datasets.push({
            label: "Electricity",
            data: this.getFuelData(fromDate, 'Electricity'),
            borderColor: this.getFuelColor('Electricity'),
            borderWidth: 2,
            fill: false,
            pointRadius: 1,
        })
        if (mode == 'forcast') {
            datasets.push({
                label: "Electricity - Forcast",
                data: this.forcastChartData(fromDate, 'Electricity'),
                borderColor: this.getFuelColor('Electricity'),
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 1,
            })
        }
    }
    if (this.chartSettings.gas) {
        datasets.push({
            label: "Gas",
            data: this.getFuelData(fromDate, 'Gas'),
            borderColor: this.getFuelColor('Gas'),
            borderWidth: 2,
            fill: false,
            pointRadius: 1,
        })
        if (mode == 'forcast') {
            datasets.push({
                label: "Gas - Forcast",
                data: this.forcastChartData(fromDate, 'Gas'),
                borderColor: this.getFuelColor('Gas'),
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 1,
            })
        }
    }
    if (this.chartSettings.solid) {
        datasets.push({
            label: "Solid fuels",
            data: this.getFuelData(fromDate, 'Solid fuels'),
            borderColor: this.getFuelColor('Solid fuels'),
            borderWidth: 2,
            fill: false,
            pointRadius: 1,
        })
        if (mode == 'forcast') {
            datasets.push({
                label: "Solid fuels - Forcast",
                data: this.forcastChartData(fromDate, 'Solid fuels'),
                borderColor:this.getFuelColor('Solid fuels'),
                borderWidth: 2,
                fill: false,
                pointRadius: 1,
                borderDash: [5, 5],
            })
        }
    }
    if (this.chartSettings.liquid) {
        datasets.push({
            label: "Liquid fuels",
            data: this.getFuelData(fromDate, 'Liquid fuels'),
            borderColor: this.getFuelColor('Liquid fuels'),
            borderWidth: 2,
            fill: false,
            pointRadius: 1,
        })
        if (mode == 'forcast') {
            datasets.push({
                label: "Liquid fuels - Forcast",
                data: this.forcastChartData(fromDate, 'Liquid fuels'),
                borderColor: this.getFuelColor('Liquid fuels'),
                borderWidth: 2,
                fill: false,
                pointRadius: 1,
                borderDash: [5, 5],
            })
        }
    }

    if (datasets.length == 0) this.toggleNoData('flex');

    return datasets;
}

  getFuelColor(fuelType) {
    const colorMap = {
      'Electricity': '#6366f1',
      'Gas': '#d97706',
      'Solid fuels': '#d946ef',
      'Liquid fuels': '#14b8a6',
    };

    return colorMap[fuelType] || 'red';
  }


  initializeChart(fromDate, mode) {
    const canvas = document.getElementById('myLineChart');

    // Store the current canvas dimensions
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Check if a chart instance is already using this canvas
    if (canvas) {
      // Get the chart instance by its ID, or you can use the variable where you stored the chart instance
      const chart = Chart.getChart(canvas);

      // Check if the chart exists and destroy it
      if (chart) {
        chart.destroy();
      }
    }

    const data = {
      labels: this.getFuelLabel(fromDate, mode),
      datasets: this.organizeChartData(fromDate, mode)
    };

    const options = {
      responsive: true,
      // maintainAspectRatio: false
    };

    // Restore the canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Create a new chart on the canvas
    const ctx = canvas.getContext('2d');
    new Chart(ctx, { type: 'line', data, options });
  }

  createDataset(label, data, borderColor) {
    return {
      label,
      data,
      borderColor,
      borderWidth: 1.5,
      fill: false
    };
  }
}

export default ForeCaster;