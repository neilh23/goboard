import GameModel from '../../src/gamemodel';
import SGFParser from '../../src/sgfparser';

/* eslint-disable no-unused-expressions,no-loop-func */

describe('Handicap stones tests', () => {
  describe('Basic handicap stones', () => {
    var model = new GameModel();

    var parser = new SGFParser(model);
    parser.parse('(;KM[6.5]DT[2015-07-13]HA[5]AB[dd][pd][dp][pp]PL[W];W[qf])');

    it('should be at move 0', () => {
      expect(model.currentMoveNumber()).to.equal(0);
    });

    for (let [x, y] of [[3, 3], [3, 15], [3, 15], [15, 15]]) {
      it(`should have a black stone at ${x},${y}`, () => {
        expect(model.stoneAt(x, y)).to.equal('b');
      });
    }

    it('should not place first move yet', () => {
      expect(model.stoneAt(16, 5)).to.be.undefined;
    });

    it('should expect a white move first', () => {
      expect(model.nextPlayer()).to.equal('w');
    });

    it('should be at move 1', () => {
      model.nextMove();
      expect(model.currentMoveNumber()).to.equal(1);
    });

    it('should have placed the first move', () => {
      expect(model.stoneAt(16, 5)).to.equal('w');
    });

    it('should expect a black move next', () => {
      expect(model.nextPlayer()).to.equal('b');
    });
  });
});
