// Define global variables for pagination
var currentPage = 1;
var rowsPerPage = 5;
var csvData = [];

document.getElementById('csvFileInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (file) {
        parseCSV(file);
    }
});

function parseCSV(file) {
    var progressWrapper = document.getElementById('progressWrapper');
    var uploadProgress = document.getElementById('uploadProgress');
    var uploadPercentage = document.getElementById('uploadPercentage');
    
    progressWrapper.style.display = 'block'; // Show progress bar

    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        worker: true,
        step: function(results, parser) {
            csvData.push(results.data);
            var progress = (csvData.length / file.size) * 100;
            uploadProgress.value = progress;
            uploadPercentage.textContent = progress.toFixed(2) + '%';
        },
        complete: function() {
            currentPage = 1; // Reset to first page on new upload
            renderTable();
            uploadProgress.value = 100;
            uploadPercentage.textContent = '100%';
            setTimeout(() => {
                progressWrapper.style.display = 'none'; // Hide progress bar after completion
            }, 2000);
        }
    });
}


function renderTable() {
    var table = document.getElementById('dataTable');
    var start = (currentPage - 1) * rowsPerPage;
    var end = start + rowsPerPage;
    var paginatedData = csvData.slice(start, end);
    
    // Clear table
    table.innerHTML = '';

    // Add table header
    if (paginatedData.length > 0) {
        var headerRow = table.insertRow();
        for (var key in paginatedData[0]) {
            var th = document.createElement('th');
            th.textContent = key;
            headerRow.appendChild(th);
        }

        // Add table rows
        paginatedData.forEach(function(rowData) {
            var row = table.insertRow();
            for (var key in rowData) {
                var cell = row.insertCell();
                cell.textContent = rowData[key];
            }
        });
    }

    // Render pagination
    renderPagination();
}

function renderPagination() {
    var pagination = document.getElementById('pagination');
    var totalPages = Math.ceil(csvData.length / rowsPerPage);
    pagination.innerHTML = '';

    // Create previous page button
    var prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
    pagination.appendChild(prevButton);

    // Create next page button
    var nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });
    pagination.appendChild(nextButton);
}

// Add event listener to the calculate button
document.getElementById('calculateButton').addEventListener('click', calculatePrice);

function calculatePrice() {
    var creditScore = parseInt(document.getElementById('creditScore').value);
    var creditLines = parseInt(document.getElementById('creditLines').value);

    // Perform a basic calculation for demonstration purposes
    var price = (creditScore * 0.1) + (creditLines * 10);

    // Display the calculated price
    document.getElementById('subscriptionPrice').textContent = 'Subscription Price: $' + price.toFixed(2);
}

// Initial rendering
renderTable();
