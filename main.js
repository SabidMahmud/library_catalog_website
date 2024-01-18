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
        data = originalData.filter((row, index) => index === 0 || row[2].toLowerCase().includes(searchTermTitle)); // Assuming Title is in the third column
        applyFilters();
    });

    // Search functionality for author on input
    searchInputAuthor.addEventListener('input', () => {
        const searchTermAuthor = searchInputAuthor.value.toLowerCase();
        data = originalData.filter((row, index) => index === 0 || row[3].toLowerCase().includes(searchTermAuthor)); // Assuming Author is in the fourth column
        applyFilters();
    });


    //*********build the filter********** */
    // Build and populate the subjects filter
    const subjectsSet = new Set();
    originalData.slice(1).forEach(row => {
        const subjects = row[4].split(',').map(subject => subject.trim());
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
        statusSet.add(row[5]);
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

    // Function to filter data based on subject, status, and additional filter
    // Function to filter data based on subject, status, and additional filter
    function filterDataAndApply(selectedStatus, selectedSubject) {
        data = originalData.filter(row => {
            const status = row[5].toLowerCase(); // Assuming status is in the sixth column
            const subject = row[4].toLowerCase(); // Assuming subject is in the fifth column

            const statusMatch = selectedStatus === '' || status === selectedStatus.toLowerCase();
            const subjectMatch = selectedSubject === '' || subject.includes(selectedSubject);

            return statusMatch && subjectMatch;
        });

        applyFilters();
    }

    // *******************************


    // Function to apply filters and render the table
    function applyFilters() {
        // Clear existing rows
        const dataTable = document.getElementById('data-table');
        while (dataTable.rows.length > 1) {
            dataTable.deleteRow(1);
        }

        // Build new rows based on filtered data, starting from index 1 to skip the header row
        for (let i = 1; i < data.length; i++) {
            const row = document.createElement('tr');

            // Render the first column (ID column)
            const idCell = document.createElement('td');
            idCell.textContent = data[i][0]; // Assuming ID is in the first column
            row.appendChild(idCell);

            // Assuming the image URL is in the second column (index 1)
            const imgCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = data[i][1]; // Assuming image URL is in the second column
            img.alt = 'Book Cover';
            img.style.maxWidth = '100px'; // Adjust the width as needed
            imgCell.appendChild(img);
            row.appendChild(imgCell);

            // Render other columns, starting from the third column (index 2)
            for (let j = 2; j < data[i].length; j++) {
                const td = document.createElement('td');
                td.textContent = data[i][j];
                row.appendChild(td);
            }

            dataTable.appendChild(row);
        }
    }



    // Add this line to call the function initially
    applyFilters();

}

renderTable();