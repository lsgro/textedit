var chai = require('chai'),
    expect = chai.expect;
var so = require('../screen_op').ops;

describe('Screen op', function() {
  describe('#pointerUp()', function() {
      it('should move pointer up', function() {
	  let b = ["line1","line2"],
	      p = [1, 1];
	  expect(so.pointerUp(p, b)).to.eql([0, 1]);
      });
      it('should not move pointer up', function() {
	  let b = ["line1","line2"],
	      p = [0, 1];
	  expect(so.pointerUp(p, b)).to.eql([0, 1]);
      });
      it('should move pointer up to end of line', function() {
	  let b = ["line1","line2isverylong"],
	      p = [1, 12];
	  expect(so.pointerUp(p, b)).to.eql([0, 5]);
      });
  });
  describe('#pointerDown()', function() {
      it('should move pointer down', function() {
	  let b = ["line1","line2"],
	      p = [0, 1];
	  expect(so.pointerDown(p, b)).to.eql([1, 1]);
      });
      it('should not move pointer down', function() {
	  let b = ["line1","line2"],
	      p = [1, 1];
	  expect(so.pointerDown(p, b)).to.eql([1, 1]);
      });
      it('should move pointer down to end of line', function() {
	  let b = ["line1isverylong","line2"],
	      p = [0, 12];
	  expect(so.pointerDown(p, b)).to.eql([1, 5]);
      });
  });
  describe('#pointerLeft()', function() {
      it('should move pointer left', function() {
	  let b = ["line1","line2"],
	      p = [0, 1];
	  expect(so.pointerLeft(p, b)).to.eql([0, 0]);
      });
      it('should not move pointer left', function() {
	  let b = ["line1","line2"],
	      p = [0, 0];
	  expect(so.pointerLeft(p, b)).to.eql([0, 0]);
      });
      it('should move pointer left to end of previous line', function() {
	  let b = ["line1","line2"],
	      p = [1, 0];
	  expect(so.pointerLeft(p, b)).to.eql([0, 5]);
      });
  });
  describe('#pointerRight()', function() {
      it('should move pointer right', function() {
	  let b = ["line1","line2"],
	      p = [0, 1];
	  expect(so.pointerRight(p, b)).to.eql([0, 2]);
      });
      it('should not move pointer right', function() {
	  let b = ["line1","line2"],
	      p = [1, 5];
	  expect(so.pointerRight(p, b)).to.eql([1, 5]);
      });
      it('should move pointer right to beginning of following line', function() {
	  let b = ["line1","line2"],
	      p = [0, 5];
	  expect(so.pointerRight(p, b)).to.eql([1, 0]);
      });
  });
  describe('#insertChars()', function() {
      it('should insert char at beginning of line', function() {
	  let b = [""],
	      p = [0, 0];
	  expect(so.insertChars('x', p, b)).to.eql([ ["ic", [0, 0], "x"], [0, 1] ]);
      });
      it('should insert char at the end of line', function() {
	  let b = ["aLine"],
	      p = [0, 5];
	  expect(so.insertChars('x', p, b)).to.eql([ ["ic", [0, 5], "x"], [0, 6] ]);
      });
      it('should insert char in the middle of line', function() {
	  let b = ["aLineIsALine"],
	      p = [0, 5];
	  expect(so.insertChars('x', p, b)).to.eql([ ["ic", [0, 5], "x"], [0, 6] ]);
      });
      it('should insert string at beginning of line', function() {
	  let b = [""],
	      p = [0, 0];
	  expect(so.insertChars('hello', p, b)).to.eql([ ["ic", [0, 0], "hello"], [0, 5] ]);
      });
      it('should insert string at the end of line', function() {
	  let b = ["aLine"],
	      p = [0, 5];
	  expect(so.insertChars('hello', p, b)).to.eql([ ["ic", [0, 5], "hello"], [0, 10] ]);
      });
      it('should insert string in the middle of line', function() {
	  let b = ["aLineIsALine"],
	      p = [0, 5];
	  expect(so.insertChars('hello', p, b)).to.eql([ ["ic", [0, 5], "hello"], [0, 10] ]);
      });
  });
  describe('#backSpace()', function() {
      it('should do nothing at beginning of first line', function() {
	  let b = ["line1"],
	      p = [0, 0];
	  expect(so.backSpace(p, b)).to.eql([ ["na", "Root position"],  [0, 0] ]);
      });
      it('should delete 1 char in the middle of line', function() {
	  let b = ["line1"],
	      p = [0, 3];
	  expect(so.backSpace(p, b)).to.eql([ ["dc", [0, 2] ],  [0, 2] ]);
      });
      it('should delete 1 char at the end of line', function() {
	  let b = ["line1"],
	      p = [0, 5];
	  expect(so.backSpace(p, b)).to.eql([ ["dc", [0, 4] ],  [0, 4] ]);
      });
      it('should join lines when at the beginning of line', function() {
	  let b = ["line1","line2"],
	      p = [1, 0];
	  expect(so.backSpace(p, b)).to.eql([ ["jl", 0 ],  [0, 5] ]);
      });
  });
  describe('#newLine()', function() {
      it('should add a new line after the end of current line', function() {
	  let b = ["line1"],
	      p = [0, 5];
	  expect(so.newLine(p, b)).to.eql([ ["il", 1],  [1, 0] ]);
      });
      it('should split line in the middle of current line', function() {
	  let b = ["line1Line1"],
	      p = [0, 5];
	  expect(so.newLine(p, b)).to.eql([ ["sl", [0, 5] ],  [1, 0] ]);
      });
      it('should split line at the beginning of current line', function() {
	  let b = ["line1"],
	      p = [0, 0];
	  expect(so.newLine(p, b)).to.eql([ ["sl", [0, 0] ],  [1, 0] ]);
      });
  });
});
