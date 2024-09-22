let excelData = [];
let filteredData = [];

// Load the Excel file directly (this assumes file is already available server-side)
window.onload = function() {
    fetch('/path/to/your/excel/file.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            // Optionally, display the entire dataset or part of it
        });
};

// Function to display the table data
function displayTable(data) {
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    if (data.length > 0) {
        // Create headers
        const headers = data[0];
        headers.forEach(header => {
            const th = document.createElement('th');
            th.innerText = header;
            tableHeader.appendChild(th);
        });

        // Populate rows with student data
        data.slice(1).forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.innerText = cell;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }
}

// Handle search by PRN
document.getElementById('searchInput').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    filteredData = excelData.filter((row, index) => {
        if (index === 0) return false;  // Skip the header row
        return String(row[1]).toLowerCase().includes(searchValue); // Assuming PRN is in column 1
    });
    displayTable(filteredData.length ? [excelData[0], ...filteredData] : []);
    document.getElementById('downloadButton').disabled = filteredData.length === 0;
});

// Handle PDF download
document.getElementById('downloadButton').addEventListener('click', function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add filtered data to the PDF
    if (filteredData.length > 0) {
        filteredData.forEach((row, index) => {
            doc.text(`${row.join(' | ')}`, 10, 10 + (index * 10));
        });
    }

    // Save the PDF
    doc.save('student_results.pdf');
});
