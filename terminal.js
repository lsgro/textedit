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
    var html = buffer.reduce(joinRows);
    viewport.innerHTML = html;
}

function newLine() {
    if (pointCol == 0) {
        buffer = buffer.splice(pointRow, 0, "");
    } else {
        var line = buffer[pointRow],
            segments;
        if (pointCol == line.length) {
            segments = [line, ""];
        } else {
            segments = line.split(pointCol);
        }
        buffer = buffer.splice(pointRow, 1, segments[0], segments[1]);
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
            removeCharLeft();
        }
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
    case "Enter":
        newLine();
        break;
    case "Tab":
        addChar(tab);
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


