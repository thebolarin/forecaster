class ForeCaster {
  fuelData = [];
  years = [];
  dynamicList = document.getElementById("pagination");
  chartSettings = {
    solid: true,
    liquid: true,
    gas: true,
    electricity: true,
  };

  constructor(data) {
    this.getYears(data);
  }

  forcastChartData(fromDate, type) {
    const pastData = this.getLatest(type);


    // Calculate the slope and intercept using the straight-line method
    const maxValue = Math.max(...pastData);
    const minValue = Math.min(...pastData);
    const differenceInPercentage = ((maxValue - minValue) / maxValue) + 1;
    // Forecast data for the next 12 months
    const forecastedData = [];
    for (let i = 0; i < pastData.length; i++) {
      forecastedData.push(pastData[i] * differenceInPercentage);
    }

    return [...forecastedData];
  }

  getYears(csv) {
    const lines = csv.split("\n");
    this.fuelData = lines.slice(1);
    this.years = this.fuelData.map((item) => item.split(",")[0]);
  }

  filterFuelData(fromDate) {
    const rawData = this.fuelData;
    const fromIndex = rawData.findIndex((item) => item.includes(fromDate));

    if (fromIndex == -1) return [];
    const endIndex =
      fromIndex + 12 <= rawData.length ? fromIndex + 12 : rawData.length;

    return rawData.slice(fromIndex, endIndex);
  }

  getFuelLabel(fromDate, mode) {
    if (mode == "forcast") {
      return [
        "Oct, `23",
        "Nov, `23",
        "Dec, `23",
        "Jan, `24",
        "Feb, `24",
        "Mar, `24",
        "Apr, `24",
        "May, `24",
        "Jun, `24",
        "Jul, `24",
        "Aug, `24",
        "Sep, `24",
      ];
    }
    let fuelLabel = [];

    const filteredData = this.filterFuelData(fromDate);

    if (!filteredData.length) return [];

    const result = filteredData.map(
      (item) =>
        `${
          item.split(",")[1].slice(0, 3) +
          ", `" +
          item.split(",")[0].slice(2, 4)
        }`
    );

    fuelLabel.push(...result);

    return fuelLabel;
  }

  toggleNoData(type) {
    document.getElementById("noData").style.display = type;
  }

  getFuelData(fromDate, type) {
    const fuelMap = {
      "Solid fuels": 2,
      Gas: 3,
      Electricity: 4,
      "Liquid fuels": 5,
    };

    let fuelData = [];

    const filteredData = this.filterFuelData(fromDate);

    if (!filteredData.length) {
      this.toggleNoData("flex");
      return [];
    }

    this.toggleNoData("none");

    // return filteredData.map(item => item.split(',')[fuelMap[type]]);

    for (let item of filteredData) {
      fuelData.push(item.split(",")[fuelMap[type]]);
    }
    return fuelData.map((item) => +item);
  }

  getLatest(type) {
    this.toggleNoData("none");
    const fuelMap = {
      "Solid fuels": 2,
      "Gas": 3,
      "Electricity": 4,
      "Liquid fuels": 5,
    };
    const endIndex = this.fuelData.length;
    const filteredData = this.fuelData.slice((endIndex - 12), endIndex);
    let fuelData = [];
    for (let item of filteredData) {
      fuelData.push(item.split(",")[fuelMap[type]]);
    }
    return fuelData.map((item) => +item);
  }

  organizeChartData(fromDate, mode) {
    let datasets = [];
    if (this.chartSettings.electricity) {
      if (mode == "forcast") {
        datasets.push({
          label: "Electricity - Forcast",
          data: this.forcastChartData(fromDate, "Electricity"),
          borderColor: this.getFuelColor("Electricity"),
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 1,
        });
      } else {
        datasets.push({
          label: "Electricity",
          data: this.getFuelData(fromDate, "Electricity"),
          borderColor: this.getFuelColor("Electricity"),
          borderWidth: 2,
          fill: false,
          pointRadius: 1,
        });
      }
    }
    if (this.chartSettings.gas) {
      if (mode == "forcast") {
        datasets.push({
          label: "Gas - Forcast",
          data: this.forcastChartData(fromDate, "Gas"),
          borderColor: this.getFuelColor("Gas"),
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 1,
        });
      } else {
        datasets.push({
          label: "Gas",
          data: this.getFuelData(fromDate, "Gas"),
          borderColor: this.getFuelColor("Gas"),
          borderWidth: 2,
          fill: false,
          pointRadius: 1,
        });
      }
    }
    if (this.chartSettings.solid) {
      if (mode == "forcast") {
        datasets.push({
          label: "Solid fuels - Forcast",
          data: this.forcastChartData(fromDate, "Solid fuels"),
          borderColor: this.getFuelColor("Solid fuels"),
          borderWidth: 2,
          fill: false,
          pointRadius: 1,
          borderDash: [5, 5],
        });
      }
      else {
        datasets.push({
          label: "Solid fuels",
          data: this.getFuelData(fromDate, "Solid fuels"),
          borderColor: this.getFuelColor("Solid fuels"),
          borderWidth: 2,
          fill: false,
          pointRadius: 1,
        });
      }
    }
    if (this.chartSettings.liquid) {
      
      if (mode == "forcast") {
        datasets.push({
          label: "Liquid fuels - Forcast",
          data: this.forcastChartData(fromDate, "Liquid fuels"),
          borderColor: this.getFuelColor("Liquid fuels"),
          borderWidth: 2,
          fill: false,
          pointRadius: 1,
          borderDash: [5, 5],
        });
      }
      else {
        datasets.push({
          label: "Liquid fuels",
          data: this.getFuelData(fromDate, "Liquid fuels"),
          borderColor: this.getFuelColor("Liquid fuels"),
          borderWidth: 2,
          fill: false,
          pointRadius: 1,
        });
      }
    }

    if (datasets.length == 0) this.toggleNoData("flex");

    return datasets;
  }

  getFuelColor(fuelType) {
    const colorMap = {
      Electricity: "#6366f1",
      Gas: "#d97706",
      "Solid fuels": "#d946ef",
      "Liquid fuels": "#14b8a6",
    };

    return colorMap[fuelType] || "red";
  }

  initializeChart(fromDate, mode) {
    const canvas = document.getElementById("myLineChart");

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
      datasets: this.organizeChartData(fromDate, mode),
    };

    const options = {
      responsive: true,
      // maintainAspectRatio: false
    };

    // Restore the canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Create a new chart on the canvas
    const ctx = canvas.getContext("2d");
    new Chart(ctx, { type: "line", data, options });
  }

  setupEventListeners() {
    document
      .getElementById("solid")
      .addEventListener("click", () => this.togglefuel("solid"));
    document
      .getElementById("liquid")
      .addEventListener("click", () => this.togglefuel("liquid"));
    document
      .getElementById("gas")
      .addEventListener("click", () => this.togglefuel("gas"));
    document
      .getElementById("electricity")
      .addEventListener("click", () => this.togglefuel("electricity"));

    document
      .getElementById("historical")
      .addEventListener("click", () => this.toggleMode("historical"));
    document
      .getElementById("forcast")
      .addEventListener("click", () => this.toggleMode("forcast"));
  }

  createDataset(label, data, borderColor) {
    return {
      label,
      data,
      borderColor,
      borderWidth: 1.5,
      fill: false,
    };
  }
}

export default ForeCaster;
