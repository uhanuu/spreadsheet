const spreadSheetContainer = document.getElementById("spreadsheet-container");
const ROWS = 10;
const COLS = 10;

class Cell {
    constructor(isHeader, disabled, data, row, column, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.active = active;
    }
}

const spreadsheet = initSpreadsheet();

function initSpreadsheet() {
    const spreadsheet = Array.from({ length: ROWS }, (_, i) =>
        Array.from({ length: COLS }, (_, j) => {
            return new Cell(false, false, `${i}-${j}`, i, j, false);
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
    return cellEl;
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

