let model = require("./viewport.js");
let buffer = model.create();
let tab = "\t";

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

function makeHtmlRow(pointRow, pointCol, pointerClass) {
    return function(row, rowIndex) {
	var htmlRow;
	console.log("Row index:", rowIndex, "pointRow:", pointRow);
	if (rowIndex == pointRow) {
	    console.log("Row length:", row.length, "point col:", pointCol);
	    if (row.length == pointCol) {
		htmlRow = escapeHtml(row) + `<span id='pointer' class='${pointerClass}'>&nbsp;</span>`;
	    } else {
		let segment1 = row.substring(0, pointCol),
		    pointed = row.charAt(pointCol);
		segment2 = row.substring(pointCol+1);
		htmlRow = escapeHtml(segment1) + `<span id='pointer' class='${pointerClass}'>` + escapeHtml(pointed) + "</span>" + escapeHtml(segment2);
	    }
	} else {
	    htmlRow = escapeHtml(row);
	}
	return htmlRow;
    }
}

function id(x) {
    return x;
}

function setCursor(cursorType) {
    let pRow = buffer.pointRow,
	pCol = buffer.pointCol;
    
}

function joinRows(acc, row) {
    return acc + "<br>" + row;
}

function redisplay() {
    let html = buffer.map(makeHtmlRow(buffer.pointRow, buffer.pointCol, "caretInsert")).reduce(joinRows);
    viewport.innerHTML = html;
    let pointerRect = document.getElementById('pointer').getBoundingClientRect(),
	caret = document.getElementById('caret'),
	pointerTop = pointerRect.top + 'px',
	pointerLeft = pointerRect.left + 'px';
    caret.style.top = pointerTop;
    caret.style.left = pointerLeft;
}

function handleKeys(e) {
    switch (e.key) {
    case "Shift":
    case "Escape":
        break;
    case "Backspace":
        buffer.removeCharLeft();
        break;
    case "Delete":
	buffer.removeCharRight();
	break;
    case "Enter":
        buffer.newLine();
        break;
    case "Tab":
        buffer.addChar(tab);
        break;
    case "ArrowLeft":
	buffer.moveLeft();
	break;
    case "ArrowRight":
	buffer.moveRight();
	break;
    case "ArrowUp":
	buffer.moveUp();
	break;
    case "ArrowDown":
	buffer.moveDown();
	break;
    default:
        buffer.addChar(e.key);
    }
    redisplay();
}

document.addEventListener('keydown', function (event) { 
    event.preventDefault();
});

document.addEventListener('keyup', function (event) {
    console.log(event);
    event.preventDefault();
    handleKeys(event);
});

function init() {
    viewport = document.getElementById("edit");
    redisplay();
}

document.addEventListener('DOMContentLoaded', init, false);


