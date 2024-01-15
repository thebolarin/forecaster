import ForeCaster from './forecaster.js';
import Chart from './chart.js';
import Pagination from './paginate.js';

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('/assets/newfuel.csv');
        const csvData = await response.text();

        const lines = csvData.split('\n');
        const years = [...new Set(lines.slice(1).map(line => line.split(',')[0]))];

        new Pagination(years, years.length - 1);
        const forecaster = new ForeCaster(csvData);
        const chartInstance = new Chart(forecaster);
        let selectedMonth = "October";
        let selectedYear = years[years.length - 2];
        let mode = 'historical';

        document.getElementById("selectedMonth").value = selectedMonth;

        chartInstance.initializeChart(selectedYear, selectedMonth, mode);

        window.addEventListener('currentYear', (event) => {
            selectedYear = event.detail;
            chartInstance.initializeChart(selectedYear, selectedMonth, mode);
        });

        window.addEventListener('currentMonth', (event) => {
            selectedMonth = event.detail;
            chartInstance.initializeChart(selectedYear, selectedMonth, mode);
        });
        
        const toggleMode = (type) => {
            mode = type

            type == 'forcast'
            ?  document.getElementById("filter").classList.add("disabled-filter")
            :  document.getElementById("filter").classList.remove("disabled-filter")

            chartInstance.initializeChart(selectedYear, selectedMonth, mode);
        }
       
        document.getElementById("historical").addEventListener("click", () => toggleMode('historical'));
        document.getElementById("forcast").addEventListener("click", () => toggleMode('forcast'));
          
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

