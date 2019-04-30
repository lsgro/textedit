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

var buffer = [""],
    tab = "\t",
    pointRow = 0,
    pointCol = 0,
    viewport;

function joinRows(total, currentValue) {
    return total + "<br>" + escapeHtml(currentValue);
}

function redisplay() {
    console.log(buffer, "row: ", pointRow, "col: ", pointCol);
    var html = buffer.reduce(joinRows);
    viewport.innerHTML = html;
}

function newLine() {
    if (pointCol == 0) {
        buffer.splice(pointRow, 0, "");
    } else {
        var line = buffer[pointRow],
            head,
	    tail;
        if (pointCol == line.length) {
	    head = line;
	    tail = "";
        } else {
	    head = line.substring(0, pointCol);
	    tail = line.substring(pointCol);
        }
        buffer.splice(pointRow, 1, head, tail);
    }
    pointRow += 1;
    pointCol = 0;
}

function addChar(c) {
    var line = buffer[pointRow],
        nextLine;
    if (pointCol == line.length) {
        nextLine = line.concat(c);
    } else {
        nextLine = line.substring(0, pointCol).concat(c).concat(line.substring(pointCol));
    }
    buffer[pointRow] = nextLine;
    pointCol += 1;
}

function removeCharLeft() {
    var line = buffer[pointRow];
    if (pointCol > 0) {
        var nextLine = line.substring(0, pointCol - 1).concat(line.substring(pointCol));
        buffer[pointRow] = nextLine;
        pointCol -= 1;
    } else {
        if (pointRow > 0) {
            buffer.splice(pointRow, 1);
            pointRow -= 1;
	    pointCol = buffer[pointRow].length;
            removeCharLeft();
        }
    }
}

function removeCharRight() {
    var line = buffer[pointRow];
    if (pointCol < line.length) {
	var nextLine = line.substring(0, pointCol).concat(line.substring(pointCol + 1));
	buffer[pointRow] = nextLine;
    } else {
	// TODO make it configurable
	removeCharLeft();
    }
}

function moveLeft() {
    if (pointCol > 0) {
	pointCol -= 1;
    } else if (pointRow > 0) {
	pointRow -= 1;
	pointCol = buffer[pointRow].length;
    }
}

function moveRight() {
    if (pointCol < buffer[pointRow].length) {
	pointCol += 1;
    } else if (pointRow < buffer.length - 1) {
	pointRow += 1;
	pointCol = 0;
    }
}

function moveUp() {
    if (pointRow > 0) {
	pointRow -= 1;
	pointCol = Math.min(pointCol, buffer[pointRow].length);
    }
}

function moveDown() {
    if (pointRow < buffer.length - 1) {
	pointRow += 1;
	pointCol = Math.min(pointCol, buffer[pointRow].length);
    }	
}

function handleKeys(e) {
    switch (e.key) {
    case "Shift":
    case "Escape":
        break;
    case "Backspace":
        removeCharLeft();
        break;
    case "Delete":
	removeCharRight();
	break;
    case "Enter":
        newLine();
        break;
    case "Tab":
        addChar(tab);
        break;
    case "ArrowLeft":
	moveLeft();
	break;
    case "ArrowRight":
	moveRight();
	break;
    case "ArrowUp":
	moveUp();
	break;
    case "ArrowDown":
	moveDown();
	break;
    default:
        addChar(e.key);
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


