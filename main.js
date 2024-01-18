const sheetId = '15Z8QwDJsiKrvaKCeAZHBsVVC3zWY_jwGxranMWje3VY';
const apiKey = 'AIzaSyAwgOcmfHtC3zBUL6J1Km86YNK-YhG84kA'; // Replace with your actual API key
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;

// Function to fetch data from the Google Sheets API
async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.values.filter(row => row.some(cell => cell.trim() !== '')); // Exclude empty rows
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Function to render table with data
async function renderTable() {
    const dataTable = document.getElementById('data-table');
    const searchInputTitle = document.getElementById('searchInputTitle');
    const searchInputAuthor = document.getElementById('searchInputAuthor');
    const filterSubjects = document.getElementById('filterSubjects');
    const filterStatus = document.getElementById('filterStatus');
    let originalData = await fetchData();
    let data = [...originalData]; // Create a copy of the original data

    // Build table header
    const headerRow = document.createElement('tr');
    originalData[0].forEach(label => {
        const th = document.createElement('th');
        th.textContent = label;
        headerRow.appendChild(th);
    });
    dataTable.appendChild(headerRow);

    // Build table rows
    for (let i = 1; i < originalData.length; i++) {
        const row = document.createElement('tr');
        originalData[i].forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        dataTable.appendChild(row);
    }


    // Search functionality for title on input
    searchInputTitle.addEventListener('input', () => {
        const searchTermTitle = searchInputTitle.value.toLowerCase();
        data = originalData.filter((row, index) => index !== 0 && row.some((cell, cellIndex) => cellIndex !== 0 && cell.toLowerCase().includes(searchTermTitle)));
        applyFilters();
    });

    // Search functionality for author on input
    searchInputAuthor.addEventListener('input', () => {
        const searchTermAuthor = searchInputAuthor.value.toLowerCase();
        data = originalData.filter((row, index) => index !== 0 && row.some((cell, cellIndex) => cellIndex !== 0 && cell.toLowerCase().includes(searchTermAuthor)));
        applyFilters();
    });

    //*********build the filter********** */
    // Build and populate the subjects filter
    const subjectsSet = new Set();
    originalData.slice(1).forEach(row => {
        const subjects = row[3].split(',').map(subject => subject.trim());
        subjects.forEach(subject => subjectsSet.add(subject));
    });
    subjectsSet.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        filterSubjects.appendChild(option);
    });

    // Build and populate the status filter
    const statusSet = new Set();
    originalData.slice(1).forEach(row => {
        statusSet.add(row[4]);
    });
    statusSet.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        filterStatus.appendChild(option);
    });
    //********************************* */


    // ******** Subject and status filter *************

    // Status filter functionality
    filterStatus.addEventListener('change', () => {
        const selectedStatus = filterStatus.value;
        const selectedSubject = filterSubjects.value.toLowerCase();
        filterDataAndApply(selectedStatus, selectedSubject);
    });

    // Subjects filter functionality
    filterSubjects.addEventListener('change', () => {
        const selectedStatus = filterStatus.value;
        const selectedSubject = filterSubjects.value.toLowerCase();
        filterDataAndApply(selectedStatus, selectedSubject);
    });

    // Function to filter data based on subject or status
    function filterDataAndApply(selectedStatus, selectedSubject) {
        data = originalData.slice(1).filter(row => {
            const status = row[4].toLowerCase(); // Assuming status is in the fifth column
            const subject = row[3].toLowerCase(); // Assuming subject is in the fourth column

            const statusMatch = selectedStatus === '' || status === selectedStatus.toLowerCase();
            const subjectMatch = selectedSubject === '' || subject.includes(selectedSubject);

            return statusMatch && subjectMatch;
        });

        applyFilters();
    }

    // *******************************

    // Function to apply filters and render the table
    function applyFilters() {
        // // Clear existing rows
        while (dataTable.rows.length > 1) {
            dataTable.deleteRow(1);
        }

        // Build new rows based on filtered data
        for (let i = 0; i < data.length; i++) {
            const row = document.createElement('tr');
            data[i].forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                row.appendChild(td);
            });
            dataTable.appendChild(row);
        }
    }


}

renderTable();
