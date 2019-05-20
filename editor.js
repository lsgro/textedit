const op = require("./screen_op.js").ops,
      textArea = require("./textarea.js").ta,
      ignoredKeys = new Set([
	  "Shift",
	  "Escape",
	  "Delete",
	  "Control",
	  "Meta",
	  "Alt"
      ]);

function handleKeys(e) {
    if (e.altKey && '0123456789'.indexOf(e.key) !== -1 || ignoredKeys.has(e.key)) {
	return;
    }

    var cmdPtr;
    
    switch (e.key) {
    case "Backspace":
        cmdPtr = op.backSpace(textArea.pointer, textArea.buffer);
        break;
    case "Enter":
        cmdPtr = op.newLine(textArea.pointer, textArea.buffer);
        break;
    case "Tab":
        cmdPtr = op.insertChars(tab, textArea.pointer, textArea.buffer);
        break;
    case "ArrowLeft": 
        cmdPtr = [["na"], op.pointerLeft(textArea.pointer, textArea.buffer)];
	break;
    case "ArrowRight":
        cmdPtr = [["na"], op.pointerRight(textArea.pointer, textArea.buffer)];
	break;
    case "ArrowUp":
        cmdPtr = [["na"], op.pointerUp(textArea.pointer, textArea.buffer)];
	break;
    case "ArrowDown":
        cmdPtr = [["na"], op.pointerDown(textArea.pointer, textArea.buffer)];
	break;
    default:
        cmdPtr = op.insertChars(e.key, textArea.pointer, textArea.buffer);
    }
    const command = cmdPtr[0],
	  nextPointer = cmdPtr[1],
	  nextBuffer = op.updateBuffer(command, textArea.buffer);
    textArea.update(command, nextPointer, nextBuffer);
}

document.addEventListener('keydown', function (event) { 
    event.preventDefault();
});

document.addEventListener('keyup', function (event) {
    event.preventDefault();
    handleKeys(event);
});

function init() {
    const viewport = document.getElementById("edit");
    textArea.init(viewport);
}

document.addEventListener('DOMContentLoaded', init, false);
