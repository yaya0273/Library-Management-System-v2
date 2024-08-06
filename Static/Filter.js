document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.getElementById('filterForm');
    const removeFiltersBtn = document.getElementById('removeFilters');
    
    filterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const keyword = document.getElementById('keyword').value.toLowerCase();
        
        const rows = document.querySelectorAll('tr#obj');
        
        rows.forEach(row => {
            if (row.textContent.toLowerCase().includes(keyword)) {
            } else {
                row.remove();
            }
        });
    });
    
    removeFiltersBtn.addEventListener('click', function() {
        location.reload();
    });
});
