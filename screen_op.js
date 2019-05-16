
function adaptPointerColumn(pointer, buffer) {
    const row = pointer[0],
	  col = pointer[1],
	  bufRow = buffer[row];
    if (col > bufRow.length) {
	return [row, bufRow.length];
    } else {
	return pointer;
    }
}

function applyCommand(buffer, command) {
    const verb = command[0];
    switch(verb) {
    case "ic": {
	const pointer = command[1],
	      row = pointer[0],
	      col = pointer[1],
	      chars = command[2],
	      bufRow = buffer[row],
	      newBufRow = bufRow.substr(0, col) + chars + bufRow.substr(col),
	      newBuffer = buffer.slice(0);
	newBuffer[row] = newBufRow;
	return newBuffer;
    }
    case "dc": {
	const pointer = command[1],
	      row = pointer[0],
	      col = pointer[1],
	      chars = command[2],
	      bufRow = buffer[row],
	      newBufRow = bufRow.substr(0, col) + bufRow.substr(col + 1),
	      newBuffer = buffer.slice(0);
	newBuffer[row] = newBufRow;
	return newBuffer;
    }
    case "il": {
	const lineNo = command[1],
	      newBuffer = buffer.slice(0);
	newBuffer.splice(lineNo, 0, "");
	return newBuffer;
    }
    case "dl": {
	const lineNo = command[1],
	      newBuffer = buffer.slice(0);
	newBuffer.splice(lineNo, 1);
	return newBuffer;
    }
    case "sl": {
	const pointer = command[1],
	      row = pointer[0],
	      col = pointer[1],
	      newBuffer = buffer.slice(0),
	      line = buffer[row];
	newBuffer.splice(row, 1, line.slice(0, col), line.slice(col));
	return newBuffer;
    }
    case "jl": {
	const lineNo = command[1],
	      line1 = buffer[lineNo],
	      line2 = buffer[lineNo + 1],
	      compoundLine = line1 + line2,
	      newBuffer = buffer.slice(0);
	newBuffer.splice(lineNo, 2, compoundLine);
	return newBuffer;
    }
    case "na":
	if (command.length > 1) {
	    console.log("No change to buffer: " + command[1]);
	}
	return buffer;
    default:
	console.error("Unkown verb: " + verb);
	return buffer;
    }
}

function applyCommandAndAccumulate(buffers, command) {
    let buffer = buffers[buffers.length - 1],
	nextBuffer = applyCommand(buffer, command);
    buffers.push(nextBuffer);
    return buffers;
}

// elementary screen edit commands
function nullCmd(message) {
    if (message === undefined) {
	return ["na"];
    } else {
	return ["na", message];
    }
}
function insertCharsCmd(pointer, chars) {
    return ["ic", pointer, chars];
}
function deleteCharCmd(pointer) {
    return ["dc", pointer];
}
function insertLineCmd(lineNo) {
    return ["il", lineNo];
}
function deleteLineCmd(lineNo) {
    return ["dl", lineNo];
}
function splitLineCmd(pointer) {
    return ["sl", pointer];
}
function joinLinesCmd(lineNo) {
    return ["jl", lineNo];
}

exports.ops = {
    // definition of pointer
    pointer: function(row, col) {
	return [row, col];
    },

    // pointer moves
    pointerUp: function(pointer, buffer) {
	const row = pointer[0];
	if (row == 0) {
	    return pointer;
	} else {
	    const newRow = row - 1,
		  col = pointer[1],
		  newPointer = [newRow, col];
	    return adaptPointerColumn(newPointer, buffer);
	}
    },
    pointerDown: function(pointer, buffer) {	    
	const row = pointer[0];
	if (row >= buffer.length - 1) {
	    return pointer;
	} else {
	    const newRow = row + 1,
		  col = pointer[1],
		  newPointer = [newRow, col];
	    return adaptPointerColumn(newPointer, buffer);
	}
    },
    pointerLeft: function(pointer, buffer) {
	const row = pointer[0],
	      col = pointer[1];
	if (col == 0) {
	    if (row == 0) {
		return pointer;
	    } else { // move to end of previous line
		const newRow = row - 1;
		return [newRow, buffer[newRow].length];
	    }
	} else {
	    return [row, col - 1];
	}
    },
    pointerRight: function(pointer, buffer) {
	const row = pointer[0],
	      col = pointer[1],
	      bufRow = buffer[row];
	if (col >= bufRow.length) {
	    if (row >= buffer.length - 1) {
		return pointer;
	    } else { // move to the beginning of following line
		return [row + 1, 0];
	    }
	} else {
	    return [row, col + 1];
	}
    },


    // from edit actions to elementary command and new pointer
    insertChars: function(str, pointer, buffer) {
	const row = pointer[0],
	      col = pointer[1],
	      newCol = col + str.length;
	return [
	    insertCharsCmd(pointer, str),
	    [row, newCol]
	];
    },
    backSpace: function(pointer, buffer) {
	const row = pointer[0],
	      col = pointer[1];
	if (col == 0) {
	    if (row == 0) {
		return [
		    nullCmd("Root position"),
		    pointer
		];
	    } else { // join lines
		const newRow = row - 1,
		      newCol = buffer[newRow].length;
		return [
		    joinLinesCmd(newRow),
		    [newRow, newCol]
		];
	    }
	} else {
	    const newPointer = [row, col - 1];
	    return [
		deleteCharCmd(newPointer),
		newPointer
	    ];
	}
    },
    newLine: function(pointer, buffer) {
	const row = pointer[0],
	      col = pointer[1],
	      bufRow = buffer[row];
	if (col >= bufRow.length) {
	    const newRow = row + 1;
	    return [
		insertLineCmd(newRow),
		[newRow, 0]
	    ];
	} else { // split line
	    return [
		splitLineCmd(pointer),
		[row + 1, 0]
	    ];
	}
    },
    updateBuffer1Cmd: function(command, buffer) {
	return applyCommand(buffer, command);
    },
    updateBuffer: function(commands, buffer) {
	return commands.reduce(applyCommand, buffer);
    },
    updateBufferAndAccumulate: function(commands, buffer) {
	return commands.reduce(applyCommandAndAccumulate, [buffer]);
    }
}
