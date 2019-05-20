// textarea state
const ta = {};
ta.buffer = [""];
ta.pointer = [0, 0];
ta.update = updateTextArea;
ta.init = initTextArea;

exports.ta = ta;

const tab = "\t",
      quotedChars = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#039;'
      };

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

function updateTextArea(command, nextPointer, nextBuffer) {
    const verb = command[0],
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
	      currentPointerRow = ta.pointer[0];
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
	      currentPointerRow = ta.pointer[0],
	      row = rows[rowIndex];
	row.parentElement.removeChild(row);
	if (currentPointerRow == rowIndex) {
	    const nextPointerRow = nextPointer[0];
	    updateRow(rows, nextPointerRow, nextBuffer, nextPointer); // restore pointer if it was on the deleted line
	}
	break;
    }
    case "na": {
	const currentPointerRow = ta.pointer[0],
	      currentPointerCol = ta.pointer[1],
	      nextPointerRow = nextPointer[0],
	      nextPointerCol = nextPointer[1];
	if (nextPointerRow != currentPointerRow || nextPointerCol != currentPointerCol) {
	    updateRow(rows, currentPointerRow, ta.buffer, nextPointer);
	    if (nextPointerRow != currentPointerRow) {
		updateRow(rows, nextPointerRow, ta.buffer, nextPointer);		
	    }
	}
	break;
    }
    default:
	console.log("Didn't process:", commandAndPointer);
    }
    ta.pointer = nextPointer;
    ta.buffer = nextBuffer;
    placeCaret();
}

function initTextArea(viewport) {
    const rows = document.getElementsByClassName('row'),
	  html = makeRowHtml("", 0, 0, 0),
	  rowEl = document.createElement("div");
    
    for (i = 0; i < rows.length; i++) {
	const parent = rows[i].parentElement.removeChild(rows[i]);
    }
    rowEl.classList.add('row');
    rowEl.innerHTML = html;
    viewport.appendChild(rowEl);
    updateTextArea(["na"], [0, 0], [""]);
}

