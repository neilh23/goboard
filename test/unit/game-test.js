import GameModel from '../../src/gamemodel';
import SGFParser from '../../src/sgfparser';

var fs = require('fs');

/* eslint-disable no-unused-expressions,no-loop-func */

describe('Ear-reddening game', () => {
  var model = new GameModel();
  var parser = new SGFParser(model);

  before(done => {
    fs.readFile('./sgf/ShusakuvsInseki.sgf', 'utf-8', (err, data) => {
      if (err) {
        throw `Error opening file ${err}`;
      }
      parser.parse(data);
      done();
    });
  });

  describe('Ear-reddening game tests', () => {
    // regression tests - was seeing some odd captures when there shouldn't
    // have been any.
    it(`should be correct up to move 111`, () => {
      model.goToMove(111);
      expect(model.currentMoveNumber()).to.equal(111);
      //model.logPosition();
      expect(model.stoneAt(11, 1)).to.equal('b');
      expect(model.stoneAt(12, 1)).to.equal('w');
      expect(model.stoneAt(10, 1)).to.be.undefined;
      expect(model.blackCaptures).to.equal(3);
      expect(model.whiteCaptures).to.equal(4);
      expect(model.getComment()).to.equal('');
    });
    it(`should be correct up to move 112`, () => {
      model.nextMove();
      expect(model.currentMoveNumber()).to.equal(112);
      //model.logPosition();
      expect(model.stoneAt(11, 1)).to.equal('b');
      expect(model.stoneAt(12, 1)).to.equal('w');
      expect(model.stoneAt(10, 1)).to.equal('w');
      expect(model.blackCaptures).to.equal(3);
      expect(model.whiteCaptures).to.equal(4);
      expect(model.getComment()).to.equal('');
    });
    it(`should be correct up to move 127`, () => {
      model.goToMove(127);
      expect(model.currentMoveNumber()).to.equal(127);
      expect(model.stoneAt(9, 8)).to.equal('b'); // the ear-reddening move :-)
      expect(model.getComment()).to.equal('The ear-reddening move.');
    });
    it(`should be correct up to move 208`, () => {
      model.goToMove(208);
      // model.logPosition();
      expect(model.currentMoveNumber()).to.equal(208);
      expect(model.stoneAt(15, 0)).to.be.undefined;
      expect(model.stoneAt(16, 0)).to.equal('w');
      expect(model.stoneAt(17, 0)).to.be.undefined;

      expect(model.blackCaptures).to.equal(5);
      expect(model.whiteCaptures).to.equal(5);
    });
    it(`should be correct up to move 209`, () => {
      model.nextMove();
      // model.logPosition();
      expect(model.currentMoveNumber()).to.equal(209);
      expect(model.stoneAt(15, 0)).to.be.undefined;
      expect(model.stoneAt(16, 0)).to.equal('w');
      expect(model.stoneAt(17, 0)).to.equal('b');

      expect(model.blackCaptures).to.equal(5);
      expect(model.whiteCaptures).to.equal(5);
    });
    it(`should be correct up to move 127`, () => {
      model.goToMove(325);
      expect(model.currentMoveNumber()).to.equal(325);
      expect(model.getComment()).to.equal('Result = Shusaku by 2 points.');
    });
  });

});
