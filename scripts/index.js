import ForeCaster from './forcast.js';
import MyClass from './myclass.js';
import Pagination from './paginate.js';

function index(currentYear, selectedMonth){
    console.log(currentYear, selectedMonth)
}

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('/assets/fuel.csv');
        const csvData = await response.text();

        const lines = csvData.split('\n');
        const years = [...new Set(lines.slice(1).map(line => line.split(',')[0]))];

        new Pagination(years, 10);
        const forecaster = new ForeCaster(csvData);
        const myInstance = new MyClass(forecaster);
        let selectedMonth = "January"
        let selectedYear = years[10] - 1

        myInstance.initializeChart(selectedYear, selectedMonth);

        window.addEventListener('currentYear', (event) => {
            selectedYear = event.detail;
            console.log("currentYear", selectedYear);
            myInstance.initializeChart(selectedYear, selectedMonth);
        });

        window.addEventListener('currentMonth', (event) => {
            selectedMonth = event.detail;
            console.log("currentMonth", selectedMonth);
            console.log("currentYear", selectedYear);

            myInstance.initializeChart(selectedYear, selectedMonth);
        });
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

