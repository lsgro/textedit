class Viewport {

    constructor() {
	this.buffer = [];
	this.clear();
    }

    clear() {
	let deletedRows = [];
	for (var i = this.buffer.length - 1; i >= 0; i--) {
	    deleterRows.push(i);
	}
	this.buffer = [""];
	this.home();
	return [{ "to_delete": deletedRows }, { "to_change": 0 }];
    }

    size() {
	return this.buffer.length;
    }
    
    reduce(f) {
	return this.buffer.reduce(f);
    }

    map(f) {
	return this.buffer.map(f);
    }

    get(i) {
	if (i >= 0 && i < this.buffer.length) {
	    return this.buffer[i];
	}
    }
    
    home() {
	let previousPointRow = this.pointRow;
	this.pointRow = 0;
	this.pointCol = 0;
	return [{ "to_change": [previousPointRow,  this.pointRow] }];
    }

    last() {
	let previousPointRow = this.pointRow;
	this.pointRow = this.buffer.length - 1;
	this.pointCol = this.buffer[this.pointRow].length;
	return [{ "to_change": [previousPointRow, this.pointRow] }];
    }
    
    newLine() {
	if (this.pointCol === 0) {
            this.buffer.splice(this.pointRow, 0, "");
	} else {
            var line = this.buffer[this.pointRow],
		head,
		tail;
            if (this.pointCol === line.length) {
		head = line;
		tail = "";
            } else {
		head = line.substring(0, this.pointCol);
		tail = line.substring(this.pointCol);
            }
            this.buffer.splice(this.pointRow, 1, head, tail);
	}
	this.pointRow += 1;
	this.pointCol = 0;
	return [{ "to_change": this.pointRow - 1 }, { "to_insert": this.pointRow }];
    }

    addChar(c) {
	var line = this.buffer[this.pointRow],
            nextLine;
	if (this.pointCol === line.length) {
            nextLine = line.concat(c);
	} else {
            nextLine = line.substring(0, this.pointCol).concat(c).concat(line.substring(this.pointCol));
	}
	this.buffer[this.pointRow] = nextLine;
	this.pointCol += 1;
	return [{ "to_change": this.pointRow }];
    }

    removeCharLeft() {
	var line = this.buffer[this.pointRow];
	if (this.pointCol > 0) {
            var nextLine = line.substring(0, this.pointCol - 1).concat(line.substring(this.pointCol));
            this.buffer[this.pointRow] = nextLine;
            this.pointCol -= 1;
	    return [{ "to_change": this.pointRow }];
	} else {
            if (this.pointRow > 0) {
		this.buffer.splice(this.pointRow, 1);
		this.pointRow -= 1;
		this.pointCol = this.buffer[this.pointRow].length;
		return [{ "to_delete": this.pointRow + 1}, { "to_change": this.pointRow }];
	    } else {
		return [];
	    }
	}
    }

    removeCharRight() {
	var line = this.buffer[this.pointRow];
	if (this.pointCol < line.length) {
	    var nextLine = line.substring(0, this.pointCol).concat(line.substring(this.pointCol + 1));
	    this.buffer[this.pointRow] = nextLine;
	    return [{ "to_change": this.pointRow }];
	} else {
	    // TODO make it configurable
	    return this.removeCharLeft();
	}
    }

    moveLeft() {
	if (this.pointCol > 0) {
	    this.pointCol -= 1;
	    return [{ "to_change": this.pointRow }];
	} else if (this.pointRow > 0) {
	    this.pointRow -= 1;
	    this.pointCol = this.buffer[this.pointRow].length;
	    return [{ "to_change": [this.pointRow, this.pointRow + 1] }];
	} else {
	    return [];
	}
    }

    moveRight() {
	if (this.pointCol < this.buffer[this.pointRow].length) {
	    this.pointCol += 1;
	    return [{ "to_change": this.pointRow }];
	} else if (this.pointRow < this.buffer.length - 1) {
	    this.pointRow += 1;
	    this.pointCol = 0;
	    return [{ "to_change": [this.pointRow, this.pointRow - 1] }];
	} else {
	    return [];
	}
    }

    moveUp() {
	if (this.pointRow > 0) {
	    this.pointRow -= 1;
	    this.pointCol = Math.min(this.pointCol, this.buffer[this.pointRow].length);
	    return [{ "to_change": [this.pointRow, this.pointRow + 1] }];
	} else {
	    return [];
	}
    }

    moveDown() {
	if (this.pointRow < this.buffer.length - 1) {
	    this.pointRow += 1;
	    this.pointCol = Math.min(this.pointCol, this.buffer[this.pointRow].length);
	    return [{ "to_change": [this.pointRow, this.pointRow - 1] }];
	} else {
	    return [];
	}
    }
}

exports.create = function() {
    return new Viewport();
}
