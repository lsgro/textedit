
function adaptPointerColumn(pointer, buffer) {
    let row = pointer[0],
	col = pointer[1],
	bufRow = buffer[row];
    if (col > bufRow.length) {
	return [row, bufRow.length];
    } else {
	return pointer;
    }
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
	let row = pointer[0];
	if (row == 0) {
	    return pointer;
	} else {
	    let newRow = row - 1,
		col = pointer[1],
		newPointer = [newRow, col];
	    return adaptPointerColumn(newPointer, buffer);
	}
    },
    pointerDown: function(pointer, buffer) {	    
	let row = pointer[0];
	if (row >= buffer.length - 1) {
	    return pointer;
	} else {
	    let newRow = row + 1,
		col = pointer[1],
		newPointer = [newRow, col];
	    return adaptPointerColumn(newPointer, buffer);
	}
    },
    pointerLeft: function(pointer, buffer) {
	let row = pointer[0],
	    col = pointer[1];
	if (col == 0) {
	    if (row == 0) {
		return pointer;
	    } else { // move to end of previous line
		let newRow = row - 1;
		return [newRow, buffer[newRow].length];
	    }
	} else {
	    return [row, col - 1];
	}
    },
    pointerRight: function(pointer, buffer) {
	let row = pointer[0],
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
	let row = pointer[0],
	    col = pointer[1],
	    newCol = col + str.length;
	return [
	    insertCharsCmd(pointer, str),
	    [row, newCol]
	];
    },
    backSpace: function(pointer, buffer) {
	let row = pointer[0],
	    col = pointer[1];
	if (col == 0) {
	    if (row == 0) {
		return [
		    nullCmd("Root position"),
		    pointer
		];
	    } else { // join lines
		let newRow = row - 1,
		    newCol = buffer[newRow].length;
		return [
		    joinLinesCmd(newRow),
		    [newRow, newCol]
		];
	    }
	} else {
	    let newPointer = [row, col - 1];
	    return [
		deleteCharCmd(newPointer),
		newPointer
	    ];
	}
    },
    newLine: function(pointer, buffer) {
	let row = pointer[0],
	    col = pointer[1],
	    bufRow = buffer[row];
	if (col >= bufRow.length) {
	    let newRow = row + 1;
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
    }
}
