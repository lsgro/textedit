var chai = require('chai'),
    expect = chai.expect;
var so = require('../screen_op').ops;

describe('Screen op', function() {
  describe('#pointerUp()', function() {
      it('should move pointer up', function() {
	  const b = ["line1","line2"],
	      p = [1, 1];
	  expect(so.pointerUp(p, b)).to.eql([0, 1]);
      });
      it('should not move pointer up', function() {
	  const b = ["line1","line2"],
	      p = [0, 1];
	  expect(so.pointerUp(p, b)).to.eql([0, 1]);
      });
      it('should move pointer up to end of line', function() {
	  const b = ["line1","line2isverylong"],
	      p = [1, 12];
	  expect(so.pointerUp(p, b)).to.eql([0, 5]);
      });
  });
  describe('#pointerDown()', function() {
      it('should move pointer down', function() {
	  const b = ["line1","line2"],
	      p = [0, 1];
	  expect(so.pointerDown(p, b)).to.eql([1, 1]);
      });
      it('should not move pointer down', function() {
	  const b = ["line1","line2"],
	      p = [1, 1];
	  expect(so.pointerDown(p, b)).to.eql([1, 1]);
      });
      it('should move pointer down to end of line', function() {
	  const b = ["line1isverylong","line2"],
	      p = [0, 12];
	  expect(so.pointerDown(p, b)).to.eql([1, 5]);
      });
  });
  describe('#pointerLeft()', function() {
      it('should move pointer left', function() {
	  const b = ["line1","line2"],
	      p = [0, 1];
	  expect(so.pointerLeft(p, b)).to.eql([0, 0]);
      });
      it('should not move pointer left', function() {
	  const b = ["line1","line2"],
	      p = [0, 0];
	  expect(so.pointerLeft(p, b)).to.eql([0, 0]);
      });
      it('should move pointer left to end of previous line', function() {
	  const b = ["line1","line2"],
	      p = [1, 0];
	  expect(so.pointerLeft(p, b)).to.eql([0, 5]);
      });
  });
  describe('#pointerRight()', function() {
      it('should move pointer right', function() {
	  const b = ["line1","line2"],
	      p = [0, 1];
	  expect(so.pointerRight(p, b)).to.eql([0, 2]);
      });
      it('should not move pointer right', function() {
	  const b = ["line1","line2"],
	      p = [1, 5];
	  expect(so.pointerRight(p, b)).to.eql([1, 5]);
      });
      it('should move pointer right to beginning of following line', function() {
	  const b = ["line1","line2"],
	      p = [0, 5];
	  expect(so.pointerRight(p, b)).to.eql([1, 0]);
      });
  });
  describe('#insertChars()', function() {
      it('should insert char at beginning of line', function() {
	  const b = [""],
	      p = [0, 0];
	  expect(so.insertChars('x', p, b)).to.eql([ ["ic", [0, 0], "x"], [0, 1] ]);
      });
      it('should insert char at the end of line', function() {
	  const b = ["aLine"],
	      p = [0, 5];
	  expect(so.insertChars('x', p, b)).to.eql([ ["ic", [0, 5], "x"], [0, 6] ]);
      });
      it('should insert char in the middle of line', function() {
	  const b = ["aLineIsALine"],
	      p = [0, 5];
	  expect(so.insertChars('x', p, b)).to.eql([ ["ic", [0, 5], "x"], [0, 6] ]);
      });
      it('should insert string at beginning of line', function() {
	  const b = [""],
	      p = [0, 0];
	  expect(so.insertChars('hello', p, b)).to.eql([ ["ic", [0, 0], "hello"], [0, 5] ]);
      });
      it('should insert string at the end of line', function() {
	  const b = ["aLine"],
	      p = [0, 5];
	  expect(so.insertChars('hello', p, b)).to.eql([ ["ic", [0, 5], "hello"], [0, 10] ]);
      });
      it('should insert string in the middle of line', function() {
	  const b = ["aLineIsALine"],
	      p = [0, 5];
	  expect(so.insertChars('hello', p, b)).to.eql([ ["ic", [0, 5], "hello"], [0, 10] ]);
      });
  });
  describe('#backSpace()', function() {
      it('should do nothing at beginning of first line', function() {
	  const b = ["line1"],
	      p = [0, 0];
	  expect(so.backSpace(p, b)).to.eql([ ["na", "Root position"],  [0, 0] ]);
      });
      it('should delete 1 char in the middle of line', function() {
	  const b = ["line1"],
	      p = [0, 3];
	  expect(so.backSpace(p, b)).to.eql([ ["dc", [0, 2] ],  [0, 2] ]);
      });
      it('should delete 1 char at the end of line', function() {
	  const b = ["line1"],
	      p = [0, 5];
	  expect(so.backSpace(p, b)).to.eql([ ["dc", [0, 4] ],  [0, 4] ]);
      });
      it('should join lines when at the beginning of line', function() {
	  const b = ["line1","line2"],
	      p = [1, 0];
	  expect(so.backSpace(p, b)).to.eql([ ["jl", 0 ],  [0, 5] ]);
      });
  });
  describe('#newLine()', function() {
      it('should add a new line after the end of current line', function() {
	  const b = ["line1"],
	      p = [0, 5];
	  expect(so.newLine(p, b)).to.eql([ ["il", 1],  [1, 0] ]);
      });
      it('should split line in the middle of current line', function() {
	  const b = ["line1Line1"],
	      p = [0, 5];
	  expect(so.newLine(p, b)).to.eql([ ["sl", [0, 5] ],  [1, 0] ]);
      });
      it('should split line at the beginning of current line', function() {
	  const b = ["line1"],
	      p = [0, 0];
	  expect(so.newLine(p, b)).to.eql([ ["sl", [0, 0] ],  [1, 0] ]);
      });
  });
  describe('#updateBuffer()', function() {
      it('should do nothing', function() {
	  const b = ["line1"],
	      command = [ "na", "Hello!" ];
	  expect(so.updateBuffer([command], b)).to.eql(["line1"]);
      });
      it('should insert a character in the middle of line', function() {
	  const b = ["line1"],
	      command = [ "ic", [ 0, 4 ], "0" ];
	  expect(so.updateBuffer([command], b)).to.eql(["line01"]);
      });
      it('should append a character to the end of line', function() {
	  const b = ["line1"],
	      command = [ "ic", [ 0, 5 ], "0" ];
	  expect(so.updateBuffer([command], b)).to.eql(["line10"]);
      });
      it('should insert a string in the middle of line', function() {
	  const b = ["line1"],
	      command = [ "ic", [ 0, 4 ], "0000" ];
	  expect(so.updateBuffer([command], b)).to.eql(["line00001"]);
      });

      it('should append a string to the end of line', function() {
	  const b = ["line1"],
	      command = [ "ic", [ 0, 5 ], "0000" ];
	  expect(so.updateBuffer([command], b)).to.eql(["line10000"]);
      });
      it('should delete a character', function() {
	  const b = ["line1"],
	      command = [ "dc", [ 0, 3 ] ];
	  expect(so.updateBuffer([command], b)).to.eql(["lin1"]);
      });
      it('should insert a line', function() {
	  const b = ["line1", "line3"],
	      command = [ "il", 1 ];
	  expect(so.updateBuffer([command], b)).to.eql(["line1", "", "line3"]);
      });
      it('should append a line', function() {
	  const b = ["line1", "line2"],
	      command = [ "il", 2 ];
	  expect(so.updateBuffer([command], b)).to.eql(["line1", "line2", ""]);
      });
      it('should delete a line', function() {
	  const b = ["line1", "line2"],
	      command = [ "dl", 0 ];
	  expect(so.updateBuffer([command], b)).to.eql(["line2"]);
      });
      it('should split a line', function() {
	  const b = ["line1", "line2"],
	      command = [ "sl", [0, 2] ];
	  expect(so.updateBuffer([command], b)).to.eql(["li", "ne1", "line2"]);
      });
      it('should insert a line (using split)', function() {
	  const b = ["line1", "line2"],
	      command = [ "sl", [0, 0] ];
	  expect(so.updateBuffer([command], b)).to.eql(["", "line1", "line2"]);
      });
      it('should join non-empty lines', function() {
	  const b = ["line1", "line2", "line3"],
	      command = [ "jl", 1 ];
	  expect(so.updateBuffer([command], b)).to.eql(["line1", "line2line3"]);
      });
      it('should join empty and non-empty lines', function() {
	  const b = ["", "line2"],
	      command = [ "jl", 0 ];
	  expect(so.updateBuffer([command], b)).to.eql(["line2"]);
      });
      it('should join non-empty and empty lines', function() {
	  const b = ["line1", ""],
	      command = [ "jl", 0 ];
	  expect(so.updateBuffer([command], b)).to.eql(["line1"]);
      });
      it('should apply commands in sequence', function() {
	  const b = ["line1"],
	      commands = [
		  [ "il", 1],
		  [ "ic", [1, 0], "a new happy line!!" ],
		  [ "dl", 0 ],
		  [ "il", 1 ],
		  [ "ic", [1, 0], "another happy line??" ],
		  [ "sl", [0, 16 ]],
		  [ "sl", [2, 18 ]],
		  [ "jl", 1 ]
	      ];
	  expect(so.updateBuffer(commands, b)).to.eql(["a new happy line", "!!another happy line", "??"]);
      });
  });
});
