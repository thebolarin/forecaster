class MyClass {
    constructor(forecaster) {
      this.forecaster = forecaster;
    }

    async initializeChart(selectedYear, selectedMonth, mode) {
        // await this.forecaster.fetchForeCastData();
      // Access and interact with the ForeCaster class, e.g., call its methods
      this.forecaster.initializeChart(`${selectedYear},${selectedMonth}`, mode);
    }
  }
  
  // Export the MyClass so that it can be used in other files
  export default MyClass;
  