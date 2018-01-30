function applyFilter(ele) {
    let rows = document.querySelectorAll('.tableRow');
    for (let row of rows) {
        if (!row.id.toLowerCase().startsWith(ele.value.toLowerCase())) {
            row.style.display = "none";
        }
        else {
            row.style.display = "";
        }
    }
}