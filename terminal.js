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

function makeHtmlRow(pointRow, pointCol, pointerType) {
    return function(row, rowIndex) {
	var htmlRow;
	console.log("Row index:", rowIndex, "pointRow:", pointRow);
	if (rowIndex == pointRow) {
	    console.log("Row length:", row.length, "point col:", pointCol);
	    if (pointerType == "change") {
		let segment1 = row.substring(0, pointCol-1),
		    pointed = row.charAt(pointCol-1);
		segment2 = row.substring(pointCol);
		htmlRow = escapeHtml(segment1) + "<span class='caretChange'>" + escapeHtml(pointed) + "</span>" + escapeHtml(segment2);		
	    } else {
		if (row.length == pointCol) {
		    htmlRow = escapeHtml(row) + "<span class='caretAppend'>&nbsp;</span>";
		} else {
		    let segment1 = row.substring(0, pointCol),
			pointed = row.charAt(pointCol);
		    segment2 = row.substring(pointCol+1);
		    htmlRow = escapeHtml(segment1) + "<span class='caretAppend'>" + escapeHtml(pointed) + "</span>" + escapeHtml(segment2);
		}
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
    let html = buffer.map(makeHtmlRow(buffer.pointRow, buffer.pointCol, "change")).reduce(joinRows);
    viewport.innerHTML = html;
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


