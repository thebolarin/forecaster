export default class Pagination {
    element = document.querySelector(".pagination ul");
    selectedMonthEl = document.getElementById("selectedMonth");

    constructor(years, page) {
        this.years = years;
        this.totalPages = years.length;
        this.page = page;

        this.initialize();
    }

    createPageItem(year, active) {
        return `
        <li class="numb paginate-btn ${active}" data-number="${year}" data-index="${this.years.indexOf(year) + 1}">
          <span>${year}</span>
        </li>`;
    }

    createPagesInRange(start, end, currentPage) {

        let pageItems = '';
        for (let i = start; i <= end; i++) {
            const year = this.years[i - 1];
            const active = currentPage == i ? "active" : "";
            pageItems += this.createPageItem(year, active);
        }
        return pageItems;
    }

    createPagination(page) {
        this.currentYear = this.years[page - 1]

        const customEvent = new CustomEvent('currentYear', { detail: this.currentYear});

        dispatchEvent(customEvent);

        const liTag = this.generatePaginationHTML(page);
        this.element.innerHTML = liTag;

        this.setupEventListeners();
    }

    generatePaginationHTML(page) {
        const showFirstDots = page > 2;
        const showLastDots = page < this.totalPages - 1;

        const prevButton = page > 1 ? this.createPageButton("&lt; Prev", page - 1) : '';
        const nextButton = page < this.totalPages ? this.createPageButton("Next &gt;", parseInt(page) + 1) : '';
        const firstPageItem = showFirstDots ? this.createPageItem(this.years[0]) : '';
        const lastPageItem = showLastDots ? this.createPageItem(this.years[this.totalPages - 1]) : '';
        const middlePageItems = this.createMiddlePageItems(page);

        return `${prevButton}${firstPageItem}${showFirstDots && page > 3 ? '<li class="dots"><span>...</span></li>' : ''}${middlePageItems}${showLastDots && page < this.totalPages - 2 ? '<li class="dots"><span>...</span></li>' : ''}${lastPageItem}${nextButton}`;
    }

    createPageButton(label, targetPage) {
        return `<li class="btn paginate-btn" data-index="${targetPage}" data-number="${this.years[targetPage - 1]}"><span> ${label}</span></li>`;
    }

    setupEventListeners() {
        document.querySelectorAll(".paginate-btn").forEach((item) => {
            let number = item.getAttribute("data-number");
            let index = item.getAttribute("data-index");

            item.addEventListener('click', () => {
                this.createPagination(index)
                console.log("Event has been listened to", number)
            })
        })

        this.selectedMonthEl.addEventListener("change", () => {
            const customEvent = new CustomEvent('currentMonth', { detail: this.selectedMonthEl.value});
            dispatchEvent(customEvent);
        });
    
    }

    createMiddlePageItems(page) {
        const beforePage = Math.max(1, page - 1);
        const afterPage = Math.min(this.totalPages, +page + 1);
        return this.createPagesInRange(beforePage, afterPage, page);
    }

    // Initialize pagination
    initialize() {
        this.createPagination(this.page);
    }
}