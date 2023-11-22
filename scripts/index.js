import ForeCaster from './forcast.js';
import MyClass from './myclass.js';
import Pagination from './paginate.js';

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch('/assets/fuel.csv');
        const csvData = await response.text();

        const lines = csvData.split('\n');
        const years = [...new Set(lines.slice(1).map(line => line.split(',')[0]))];

        new Pagination(years, 26);
        const forecaster = new ForeCaster(csvData);
        const myInstance = new MyClass(forecaster);
        let selectedMonth = "September"
        let selectedYear = years[26] - 1
        let mode = 'historical'

        myInstance.initializeChart(selectedYear, selectedMonth, mode);

        window.addEventListener('currentYear', (event) => {
            selectedYear = event.detail;
            myInstance.initializeChart(selectedYear, selectedMonth, mode);
        });

        window.addEventListener('currentMonth', (event) => {
            selectedMonth = event.detail;
            myInstance.initializeChart(selectedYear, selectedMonth, mode);
        });
        
        const toggleMode = (type) => {
            mode = type

            type == 'forcast'
            ?  document.getElementById("filter").classList.add("disabled-filter")
            :  document.getElementById("filter").classList.remove("disabled-filter")

            myInstance.initializeChart(selectedYear, selectedMonth, mode);
        }
       
        document.getElementById("historical").addEventListener("click", () => toggleMode('historical'));
        document.getElementById("forcast").addEventListener("click", () => toggleMode('forcast'));
          
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

