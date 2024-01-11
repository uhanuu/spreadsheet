const spreadSheetContainer = document.getElementById("spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");
const ROWS = 10;
const COLS = 10;
const ALPHABETS = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const HEADER_INDEX = 0;

class Cell {
    constructor(
        isHeader, disabled, data, row, column,
        rowName, columnName, active = false) {

        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.columnName = columnName;
        this.active = active;
    }
}

exportBtn.onclick = function (e) {
    const csv = spreadsheet.map(rowCsvFormat).join("\r\n").trim();

    const csvObj = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObj);

    const aEl = document.createElement("a");
    aEl.href = csvUrl;
    aEl.download = `${crypto.randomUUID()}.csv`;
    aEl.click();
}

function rowCsvFormat(row) {
    return row.filter(item => !item.isHeader)
        .map(item => item.data)
        .join(",");
}

const spreadsheet = initSpreadsheet();

function initSpreadsheet() {
    const spreadsheet = Array.from({ length: ROWS }, (_, i) =>
        Array.from({ length: COLS }, (_, j) => {
            let cellDate = '';
            let isHeaderAndDisabled = false;

            if (j === 0) {
                cellDate = i;
                isHeaderAndDisabled = true;
            }
            if (i === 0) {
                cellDate = ALPHABETS[j];
                isHeaderAndDisabled = true;
            }
            const rowName = i;
            const columnName = ALPHABETS[j];

            return new Cell(
                isHeaderAndDisabled, isHeaderAndDisabled, cellDate,
                i, j, rowName, columnName, false
            );
        })
    );
    drawSheet(spreadsheet);
    return spreadsheet;
}

function createCellEl(cell) {
    const cellEl = document.createElement("input");
    cellEl.className = "cell";
    cellEl.id = `cell_${cell.row}${cell.column}`;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if (cell.isHeader) {
        cellEl.classList.add("header");
    }

    cellEl.onclick = () => handleCellClick(cell);
    cellEl.onchange = (e) => handleOnChange(e.target.value, cell);

    return cellEl;
}

function handleOnChange(data, cell) {
    cell.data = data;
}

function handleCellClick(cell) {
    clearHeaderActiveStates();
    const columnHeader = spreadsheet[HEADER_INDEX][cell.column];
    const rowHeader = spreadsheet[cell.row][HEADER_INDEX];
    const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);

    columnHeaderEl.classList.add("active");
    rowHeaderEl.classList.add("active");
}

function clearHeaderActiveStates() {
    const headers = document.querySelectorAll(".header");

    headers.forEach((header) => {
        header.classList.remove("active");
    })
}

function getElFromRowCol(row, column) {
    return document.getElementById(`cell_${row}${column}`);
}

function drawSheet(spreadsheet) {
    spreadsheet.forEach(row => {
        spreadSheetContainer.append(
            createRowContainer(row.map(createCellEl))
        )
    });
}

function createRowContainer(cell) {
    const rowContainerEl = document.createElement("div");
    rowContainerEl.className = "cell-row";
    rowContainerEl.append(...cell);
    return rowContainerEl;
}