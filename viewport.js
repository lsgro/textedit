class Viewport {

    constructor() {
	this.clear();
    }

    clear() {
	this.buffer = [""];
	this.home();
    }

    reduce(f) {
	return this.buffer.reduce(f);
    }

    home() {
	this.pointRow = 0;
	this.pointCol = 0;
    }

    last() {
	this.pointRow = this.buffer.length - 1;
	this.pointCol = this.buffer[this.pointRow].length;
    }
    
    newLine() {
	if (this.pointCol == 0) {
            this.buffer.splice(this.pointRow, 0, "");
	} else {
            var line = this.buffer[this.pointRow],
		head,
		tail;
            if (this.pointCol == line.length) {
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
    }

    addChar(c) {
	var line = this.buffer[this.pointRow],
            nextLine;
	if (this.pointCol == line.length) {
            nextLine = line.concat(c);
	} else {
            nextLine = line.substring(0, this.pointCol).concat(c).concat(line.substring(this.pointCol));
	}
	this.buffer[this.pointRow] = nextLine;
	this.pointCol += 1;
    }

    removeCharLeft() {
	var line = this.buffer[this.pointRow];
	if (this.pointCol > 0) {
            var nextLine = line.substring(0, this.pointCol - 1).concat(line.substring(this.pointCol));
            this.buffer[this.pointRow] = nextLine;
            this.pointCol -= 1;
	} else {
            if (this.pointRow > 0) {
		this.buffer.splice(this.pointRow, 1);
		this.pointRow -= 1;
		this.pointCol = this.buffer[this.pointRow].length;
		this.removeCharLeft();
            }
	}
    }

    removeCharRight() {
	var line = this.buffer[this.pointRow];
	if (this.pointCol < line.length) {
	    var nextLine = line.substring(0, this.pointCol).concat(line.substring(this.pointCol + 1));
	    this.buffer[this.pointRow] = nextLine;
	} else {
	    // TODO make it configurable
	    this.removeCharLeft();
	}
    }

    moveLeft() {
	if (this.pointCol > 0) {
	    this.pointCol -= 1;
	} else if (this.pointRow > 0) {
	    this.pointRow -= 1;
	    this.pointCol = this.buffer[this.pointRow].length;
	}
    }

    moveRight() {
	if (this.pointCol < this.buffer[this.pointRow].length) {
	    this.pointCol += 1;
	} else if (this.pointRow < this.buffer.length - 1) {
	    this.pointRow += 1;
	    this.pointCol = 0;
	}
    }

    moveUp() {
	if (this.pointRow > 0) {
	    this.pointRow -= 1;
	    this.pointCol = Math.min(this.pointCol, this.buffer[this.pointRow].length);
	}
    }

    moveDown() {
	if (this.pointRow < this.buffer.length - 1) {
	    this.pointRow += 1;
	    this.pointCol = Math.min(this.pointCol, this.buffer[this.pointRow].length);
	}	
    }
}

exports.create = function() {
    return new Viewport();
}
