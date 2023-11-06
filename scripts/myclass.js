class MyClass {
    constructor(forecaster) {
      this.forecaster = forecaster;
    }
  
    async initializePagination(){

    }

    async initializeChart(selectedYear, selectedMonth) {
        // await this.forecaster.fetchForeCastData();
      // Access and interact with the ForeCaster class, e.g., call its methods
      this.forecaster.initializeChart(`${selectedYear},${selectedMonth}`);
    }
  }
  
  // Export the MyClass so that it can be used in other files
  export default MyClass;
  