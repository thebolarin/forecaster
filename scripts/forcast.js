class ForeCaster {
  fuelData = [];
  years = [];
  dynamicList = document.getElementById('pagination');
  fuelMap = {
    'Solid fuels': 2,
    'Gas': 3,
    'Electricity': 4,
    'Liquid fuels': 5
  };

  constructor(data) {
    this.getYears(data);
  }

  getYears(csv) {
    const lines = csv.split('\n');
    this.fuelData = lines.slice(1);
    this.years = this.fuelData.map(item => item.split(',')[0]);
  }

  filterFuelData(fromDate) {
    const fromIndex = this.fuelData.findIndex(item => item.includes(fromDate));

    if (fromIndex === -1) return [];

    const endIndex = Math.min(fromIndex + 12, this.fuelData.length);
    return this.fuelData.slice(fromIndex, endIndex);
  }

  getFuelLabel(fromDate) {
    const filteredData = this.filterFuelData(fromDate);

    if (!filteredData.length) return [];

    return filteredData.map(item => `${item.split(',')[0]}, ${item.split(',')[1]}`);
  }

  getFuelData(fromDate, type) {
    const filteredData = this.filterFuelData(fromDate);

    if (!filteredData.length) return [];

    return filteredData.map(item => item.split(',')[this.fuelMap[type]]);
  }

  initializeChart(fromDate) {

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
      labels: this.getFuelLabel(fromDate),
      datasets: [
        this.createDataset("Solid fuels", this.getFuelData(fromDate, 'Solid fuels'), "#d946ef"),
        this.createDataset("Gas", this.getFuelData(fromDate, 'Gas'), "#d97706"),
        this.createDataset("Electricity", this.getFuelData(fromDate, 'Electricity'), "#6366f1"),
        this.createDataset("Liquid fuels", this.getFuelData(fromDate, 'Liquid fuels'), "#14b8a6"),
      ]
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