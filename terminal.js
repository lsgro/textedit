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

function buildHtml(pointRow, pointCol, caretClass) {
    return function(text, row, rowIndex) {
	var htmlRow = escapeHtml(row);
	return text + "<br>" + htmlRow;
    }
}

function setCursor(cursorType) {
    let pRow = buffer.pointRow,
	pCol = buffer.pointCol;
    
}

function redisplay() {
    console.log(buffer.pointRow, buffer.pointCol);
    var html = buffer.reduce(buildHtml(0, 0, null));
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


