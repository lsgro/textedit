let model = require("./viewport.js");
let buffer = model.create();
let tab = "\t";
let ignoredKeys = new Set(["Shift", "Escape", "Control", "Meta", "Alt"]);

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
	if (rowIndex == pointRow) {
	    if (row.length == pointCol) {
		htmlRow = escapeHtml(row) + `<span id='pointer' class='${pointerClass}'>&nbsp;</span>`;
	    } else {
		let segment1 = row.substring(0, pointCol),
		    pointed = row.charAt(pointCol);
		segment2 = row.substring(pointCol+1);
		htmlRow = escapeHtml(segment1) + `<span id='pointer' class='${pointerClass}'>` + escapeHtml(pointed) + "</span>" + escapeHtml(segment2);
	    }
	} else {
	    htmlRow = row === "" ? '&nbsp;' : escapeHtml(row);
	}
	return htmlRow;
    }
}

function placeCaret() {
    let pointerRect = document.getElementById('pointer').getBoundingClientRect(),
	caret = document.getElementById('caret'),
	pointerTop = pointerRect.top + 'px',
	pointerLeft = pointerRect.left + 'px';
    caret.style.top = pointerTop;
    caret.style.left = pointerLeft;
}

function updateScreen(updates) {
    for (var i = 0; i < updates.length; i++) {
	
	toDelete = updates[i].to_delete;
	toChange = updates[i].to_change;
	toInsert = updates[i].to_insert;
	
	if (toDelete !== undefined) {
	    let rows = document.getElementsByClassName('row');
	    if (Array.isArray(toDelete)) {
		for (var j = 0; j < toDelete.length; j++) {		  
		    let row = rows[rowIndex],
			rowIndex = toDelete[j];
		    row.parentElement.removeChild(row);
		}
	    } else {
		let row = rows[toDelete];
		row.parentElement.removeChild(row);
	    }
	}
	if (toChange !== undefined) {
	    let rows = document.getElementsByClassName('row');
	    if (Array.isArray(toChange)) {
		for (var j = 0; j < toChange.length; j++) {
		    let rowIndex = toChange[j],
			row = rows[rowIndex];
		    row.innerHTML = makeHtmlRow(buffer.pointRow, buffer.pointCol, "none")(buffer.get(rowIndex), rowIndex);
		}
	    } else {
		let rowIndex = toChange,
		    row = rows[rowIndex],
		    html = makeHtmlRow(buffer.pointRow, buffer.pointCol, "none")(buffer.get(rowIndex), rowIndex);
		row.innerHTML = html;
	    }		
	}
	if (toInsert !== undefined) {
	    let rows = document.getElementsByClassName('row');
	    if (Array.isArray(toInsert)) {
		for (var j = 0; j < toInsert; j++) {
		    let rowIndex = toInsert[j],
			row = document.createElement("div");
		    row.classList.add('row');
		    row.innerHTML = makeHtmlRow(buffer.pointRow, buffer.pointCol, "none")(buffer.get(rowIndex), rowIndex);
		    if (rowIndex >= rows.length) {
			rows[0].parentElement.appendChild(row);
		    } else {
			let sibling = rows[rowIndex];
			sibling.parentElement.insertBefore(row, sibling);
		    }
		}
	    } else {
		let rowIndex = toInsert,
		    row = document.createElement("div");
		row.classList.add('row');
		let html = makeHtmlRow(buffer.pointRow, buffer.pointCol, "none")(buffer.get(rowIndex), rowIndex);
		row.innerHTML = html;
		if (rowIndex >= rows.length) {
		    document.getElementById('edit').appendChild(row);
		} else {
		    let sibling = rows[rowIndex];
		    sibling.parentElement.insertBefore(row, sibling);
		}		
	    }
	}
    }
    placeCaret();
}

function handleKeys(e) {
    if (e.altKey && '0123456789'.indexOf(e.key) !== -1 || ignoredKeys.has(e.key)) {
	return;
    }

    console.log(e);
    
    var updates;
    
    switch (e.key) {
    case "Backspace":
        updates = buffer.removeCharLeft();
        break;
    case "Delete":
	updates = buffer.removeCharRight();
	break;
    case "Enter":
        updates = buffer.newLine();
        break;
    case "Tab":
        updates = buffer.addChar(tab);
        break;
    case "ArrowLeft":
	updates = buffer.moveLeft();
	break;
    case "ArrowRight":
	updates = buffer.moveRight();
	break;
    case "ArrowUp":
	updates = buffer.moveUp();
	break;
    case "ArrowDown":
	updates = buffer.moveDown();
	break;
    default:
        updates = buffer.addChar(e.key);
    }
    updateScreen(updates);
}

document.addEventListener('keydown', function (event) { 
    event.preventDefault();
});

document.addEventListener('keyup', function (event) {
    event.preventDefault();
    handleKeys(event);
});

function init() {
    viewport = document.getElementById("edit");
    updateScreen([{ "to_insert": 0 }]);
}

document.addEventListener('DOMContentLoaded', init, false);
