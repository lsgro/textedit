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

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function joinRows(total, currentValue) {
    console.log(currentValue);
    return total + "<br>" + escapeHtml(currentValue);
}

function redisplay() {
    var html = buffer.reduce(joinRows);
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


