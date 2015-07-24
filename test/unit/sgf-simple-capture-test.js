import GameModel from '../../src/gamemodel';
import SGFParser from '../../src/sgfparser';

/* eslint-disable no-unused-expressions,no-loop-func */

describe('Capturing tests', () => {
  describe('Basic capturing test', () => {
    var model = new GameModel();

    var parser = new SGFParser(model);
    parser.parse('(;KM[6.5]DT[2015-07-13];B[pd];W[qd];B[pp];W[pe];B[dp];W[od];B[dd];W[pc])');
    model.goToMove(-1);

    it('should have correct date', () => {
      expect(model.gameInfo.date).to.equal('2015-07-13');
    });

    for (let [x, y] of [[3, 3], [3, 15], [15, 15]]) {
      it(`should have a black stone at ${x},${y}`, () => {
        expect(model.stoneAt(x, y)).to.equal('b');
      });
    }

    for (let [x, y] of [[14, 3], [15, 2], [15, 4], [16, 3]]) {
      it(`should have a white stone at ${x},${y}`, () => {
        expect(model.stoneAt(x, y)).to.equal('w');
      });
    }

    it(`should have captured black's stone`, () => {
      expect(model.stoneAt(15, 3)).to.be.undefined;
    });

    it(`should have recorded black's captured stone`, () => {
      expect(model.blackCaptures).to.equal(1);
    });

    it(`should have not recorded any white captured stones`, () => {
      expect(model.whiteCaptures).to.equal(0);
    });
  });

  describe('Ladder capturing test', () => {
    beforeEach(() => {});
    var model = new GameModel();

    var parser = new SGFParser(model);
    parser.parse('(;KM[6.5]DT[2015-07-13];B[pd];W[pe];B[qd];W[od];B[dp];W[qe];B[pp];W[pc];B[pq];W[rd];B[qc];W[qb];B[rc];W[rb];B[sc];W[sd];B[sb];W[sa])');
    model.goToMove(-1);

    it('should have correct komi', () => {
      expect(model.gameInfo.komi).to.equal('6.5');
    });

    // model.logPosition();

    for (let [x, y] of [[3, 15], [15, 15], [15, 16]]) {
      it(`should have a black stone at ${x},${y}`, () => {
        expect(model.stoneAt(x, y)).to.equal('b');
      });
    }

    for (let [x, y] of [[18, 0], [16, 1], [17, 1], [15, 2], [14, 3], [17, 3], [18, 3], [15, 4], [16, 4]]) {
      it(`should have a white stone at ${x},${y}`, () => {
        expect(model.stoneAt(x, y)).to.equal('w');
      });
    }

    for (let [x, y] of [[18, 1], [16, 2], [17, 2], [18, 2], [15, 3], [16, 3]]) {
      it(`should have captured black's stone at ${x},${y}`, () => {
        expect(model.stoneAt(x, y)).to.be.undefined;
      });
    }

    it(`should have recorded black's captured stone`, () => {
      expect(model.blackCaptures).to.equal(6);
    });

    it(`should have not recorded any white captured stones`, () => {
      expect(model.whiteCaptures).to.equal(0);
    });
  });
});
