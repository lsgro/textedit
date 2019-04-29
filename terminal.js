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
    viewport;

function accumulateRows(total, currentValue) {
    return total + "<br>" + escapeHtml(currentValue);
}

function redisplay() {
    var html = buffer.reduce(accumulateRows, "");
    viewport.innerHTML = html;
}

function newLine() {
    buffer.push("");
    pointRow += 1;
}

function addChar(c) {
    buffer[pointRow] = buffer[pointRow].concat(c);
}

function removeChar() {
    if (buffer[pointRow].length > 0) {
        buffer[pointRow] = buffer[pointRow].slice(0, -1);
    } else if (buffer.length > 0) {
        buffer.splice(pointRow, 1);
        pointRow -= 1;
        removeChar();
    } else {
        alert("Empty buffer");
    }
}

function handleKeys(e) {
    switch (e.key) {
    case "Shift":
    case "Escape":
        break;
    case "Backspace":
        removeChar();
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


