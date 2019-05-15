var assert = require('assert');
var viewport = require('../viewport');

function mkString(vp) {
    return vp.reduce(function(acc, item) {
	return acc + ":" + item;
    }, "");
}

describe('Viewport', function() {
  describe('#create()', function() {
      it('should return an object', function() {
	  var o = viewport.create();
	  assert(o != null, "Null vieport");
      });
  });
  describe('#addChar()', function() {
      it('should add char to buffer', function() {
	  var o = viewport.create();
	  o.addChar("X");
	  assert.equal("X", mkString(o));
      });
  });
  describe('#home()', function() {
      it('should move pointer to home', function() {
	  var o = viewport.create();
	  o.addChar("X");
	  o.home();
	  o.addChar("Y");
	  assert.equal("YX", mkString(o));
      });
  });
  describe('#last()', function() {
      it('should move pointer to last position', function() {
	  var o = viewport.create();
	  o.addChar("X");
	  o.newLine();
	  o.addChar("Y");
	  o.home();
	  o.addChar("Z");
	  o.last();
	  o.addChar("Q");
	  assert.equal("ZX:YQ", mkString(o));
      });
  });
  describe('#newLine()', function() {
      it('should add empty line to buffer', function() {
	  var o = viewport.create();
	  o.addChar("X");
	  o.newLine();
	  assert.equal("X:", mkString(o));
      });
  });
  describe('#removeCharLeft()', function() {
      it('should remove char to the left', function() {
	  var o = viewport.create();
	  o.addChar("X");
	  o.removeCharLeft();
	  assert.equal("", mkString(o));
      });
  });
  describe('#moveLeft()', function() {
      it('should move pointer to the left', function() {
	  var o = viewport.create();
	  o.addChar("X");
	  o.addChar("X");
	  o.moveLeft();
	  o.addChar("Y");
	  assert.equal("XYX", mkString(o));
      });
      it('should not move pointer to the left when at beginning or row', function() {
	  var o = viewport.create();
	  o.addChar("X");
	  o.moveLeft();
	  assert.equal(0, o.pointCol);
	  o.moveLeft();
	  assert.equal(0, o.pointCol);
      });
  });
  describe('#moveRight()', function() {
      it('should move pointer to the right', function() {
	  var o = viewport.create();
	  o.addChar("X");
	  o.addChar("Y");
	  o.home();
	  o.addChar("Z");
	  o.moveRight();
	  o.addChar("Q");
	  assert.equal("ZXQY", mkString(o));
      });
  });
  describe('#moveUp()', function() {
      it('should move pointer up', function() {
	  var o = viewport.create();
	  o.addChar("X");
	  o.addChar("X");
	  o.addChar("X");
	  o.newLine();
	  o.moveUp();
	  o.addChar("Z");
	  assert.equal("ZXXX:", mkString(o));
      });
  });
  describe('#moveDown()', function() {
      it('should move pointer down', function() {
	  var o = viewport.create();
	  o.addChar("X");
	  o.newLine();
	  o.addChar("X");
	  o.home();
	  o.addChar("Z");
	  o.moveDown();
	  o.addChar("Z");
	  assert.equal("ZX:XZ", mkString(o));
      });
  });
});
