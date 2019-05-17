const op = require("./screen_op.js").ops;
const tab = "\t";
const ignoredKeys = new Set(["Shift", "Escape", "Delete", "Control", "Meta", "Alt"]);

var buffer = [""],
    pointer = [0, 0];

function escapeHtml(text) {
    var map = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; }).replace(/\ /g, function() { return '&nbsp;' });
}

function makeRowHtml(rowText, rowIndex, pointerRow, pointerCol) {
    var rowHtml;
    if (rowIndex == pointerRow) {
	if (rowText.length == pointerCol) {
	    rowHtml = escapeHtml(rowText) + `<span id='pointer'>&nbsp;</span>`;
	} else {
	    let segment1 = rowText.substring(0, pointerCol),
		pointed = rowText.charAt(pointerCol);
	    segment2 = rowText.substring(pointerCol+1);
	    rowHtml = escapeHtml(segment1) + `<span id='pointer'>` + escapeHtml(pointed) + "</span>" + escapeHtml(segment2);
	}
    } else {
	rowHtml = rowText === "" ? '&nbsp;' : escapeHtml(rowText);
    }
    return rowHtml;
}

function placeCaret() {
    let pointerRect = document.getElementById('pointer').getBoundingClientRect(),
	caret = document.getElementById('caret'),
	pointerTop = pointerRect.top + 'px',
	pointerLeft = pointerRect.left + 'px';
    caret.style.top = pointerTop;
    caret.style.left = pointerLeft;
}

function updateRow(rows, rowIndex, buffer, pointer) {
    const row = rows[rowIndex],
	  pointerRow = pointer[0],
	  pointerCol = pointer[1],
	  html = makeRowHtml(buffer[rowIndex], rowIndex, pointerRow, pointerCol);
    row.innerHTML = html;
}

function updateScreen(cmdPtr) {
    const command = cmdPtr[0],
	  verb = command[0],
	  nextPointer = cmdPtr[1],
	  nextBuffer = op.updateBuffer1Cmd(command, buffer),
	  rows = document.getElementsByClassName('row');

    switch(verb) {
    case "ic":
    case "dc": {
	const ptr = command[1],
	      rowIndex = ptr[0];
	updateRow(rows, rowIndex, nextBuffer, nextPointer);
	break;
    }
    case "sl": {
	const splitPointer = command[1],
	      rowIndex = splitPointer[0],
	      nextRowIndex = rowIndex + 1;
	let row = document.createElement("div");
	row.classList.add('row');
	if (rowIndex >= rows.length) {
	    document.getElementById('edit').appendChild(row);
	} else {
	    let sibling = rows[rowIndex];
	    sibling.parentElement.insertBefore(row, sibling);
	}
	updateRow(rows, rowIndex, nextBuffer, nextPointer);
	updateRow(rows, nextRowIndex, nextBuffer, nextPointer);
	break;
    }
    case "il": {
	const rowIndex = command[1],
	      currentPointerRow = pointer[0];
	let row = document.createElement("div");
	row.classList.add('row');
	if (rowIndex >= rows.length) {
	    document.getElementById('edit').appendChild(row);
	} else {
	    let sibling = rows[rowIndex];
	    sibling.parentElement.insertBefore(row, sibling);
	}
	updateRow(rows, rowIndex, nextBuffer, nextPointer);
	if (currentPointerRow != rowIndex) {
	    updateRow(rows, currentPointerRow, nextBuffer, nextPointer);
	}
	break;
    }
    case "jl": {
	const rowIndex = command[1],
	      row = rows[rowIndex];
	row.parentElement.removeChild(row);
	updateRow(rows, rowIndex, nextBuffer, nextPointer);
	break;
    }
    case "dl": {
	const rowIndex = command[1],
	      currentPointerRow = pointer[0],
	      row = rows[rowIndex];
	row.parentElement.removeChild(row);
	if (currentPointerRow == rowIndex) {
	    const nextPointerRow = nextPointer[0];
	    updateRow(rows, nextPointerRow, nextBuffer, nextPointer); // restore pointer if it was on the deleted line
	}
	break;
    }
    case "na": {
	const currentPointerRow = pointer[0],
	      currentPointerCol = pointer[1],
	      nextPointerRow = nextPointer[0],
	      nextPointerCol = nextPointer[1];
	if (nextPointerRow != currentPointerRow || nextPointerCol != currentPointerCol) {
	    updateRow(rows, currentPointerRow, buffer, nextPointer);
	    if (nextPointerRow != currentPointerRow) {
		updateRow(rows, nextPointerRow, buffer, nextPointer);		
	    }
	}
	break;
    }
    default:
	console.log("Didn't process:", cmdPtr);
    }
    pointer = nextPointer;
    buffer = nextBuffer;
    placeCaret();
}

function handleKeys(e) {
    if (e.altKey && '0123456789'.indexOf(e.key) !== -1 || ignoredKeys.has(e.key)) {
	return;
    }

    var cmdPtr;
    
    switch (e.key) {
    case "Backspace":
        cmdPtr = op.backSpace(pointer, buffer);
        break;
    case "Enter":
        cmdPtr = op.newLine(pointer, buffer);
        break;
    case "Tab":
        cmdPtr = op.insertChars(tab, pointer, buffer);
        break;
    case "ArrowLeft": 
        cmdPtr = [["na"], op.pointerLeft(pointer, buffer)];
	break;
    case "ArrowRight":
        cmdPtr = [["na"], op.pointerRight(pointer, buffer)];
	break;
    case "ArrowUp":
        cmdPtr = [["na"], op.pointerUp(pointer, buffer)];
	break;
    case "ArrowDown":
        cmdPtr = [["na"], op.pointerDown(pointer, buffer)];
	break;
    default:
        cmdPtr = op.insertChars(e.key, pointer, buffer);
    }
    updateScreen(cmdPtr);
}

document.addEventListener('keydown', function (event) { 
    event.preventDefault();
});

document.addEventListener('keyup', function (event) {
    event.preventDefault();
    handleKeys(event);
});

function init() {
    pointer = [0, 0];
    buffer = [""];
    const html = makeRowHtml("", 0, 0, 0),
    	  rowEl = document.createElement("div");
    rowEl.classList.add('row');
    rowEl.innerHTML = html;
    viewport = document.getElementById("edit");
    let child = viewport.lastElementChild;
    while (child) {
	viewport.removeChild(child);
	child = viewport.lastElementChild;
    }
    viewport.appendChild(rowEl);
    placeCaret();
}

document.addEventListener('DOMContentLoaded', init, false);
