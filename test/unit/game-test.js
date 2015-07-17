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
      //model.logPosition();
      expect(model.stoneAt(11, 1)).to.equal('b');
      expect(model.stoneAt(12, 1)).to.equal('w');
      expect(model.stoneAt(10, 1)).to.be.undefined;
      expect(model.blackCaptures).to.equal(3);
      expect(model.whiteCaptures).to.equal(4);
    });
    it(`should be correct up to move 112`, () => {
      model.nextMove();
      //model.logPosition();
      expect(model.stoneAt(11, 1)).to.equal('b');
      expect(model.stoneAt(12, 1)).to.equal('w');
      expect(model.stoneAt(10, 1)).to.equal('w');
      expect(model.blackCaptures).to.equal(3);
      expect(model.whiteCaptures).to.equal(4);
    });
    it(`should be correct up to move 208`, () => {
      model.goToMove(208);
      // model.logPosition();
      expect(model.stoneAt(15, 0)).to.be.undefined;
      expect(model.stoneAt(16, 0)).to.equal('w');
      expect(model.stoneAt(17, 0)).to.be.undefined;

      expect(model.blackCaptures).to.equal(5);
      expect(model.whiteCaptures).to.equal(5);
    });
    it(`should be correct up to move 209`, () => {
      model.nextMove();
      // model.logPosition();
      expect(model.stoneAt(15, 0)).to.be.undefined;
      expect(model.stoneAt(16, 0)).to.equal('w');
      expect(model.stoneAt(17, 0)).to.equal('b');

      expect(model.blackCaptures).to.equal(5);
      expect(model.whiteCaptures).to.equal(5);
    });
  });

});
