export default class Chart {
    constructor(forecaster) {
      this.forecaster = forecaster; 
    }

    async initializeChart(selectedYear, selectedMonth, mode) {
      this.forecaster.initializeChart(`${selectedYear},${selectedMonth}`, mode);
    }
  }
  