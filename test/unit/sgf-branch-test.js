import GameModel from '../../src/gamemodel';
import SGFParser from '../../src/sgfparser';

/* eslint-disable no-unused-expressions,no-loop-func */

describe('Branch tests', () => {
  describe('Basic branch test', () => {
    var model = new GameModel();

    var parser = new SGFParser(model);
    parser.parse('(;GM[1]FF[4]KM[5.5];B[pd];W[qf](;B[nc];W[rd];B[qh];W[qc];B[qe];W[re];B[pf])(;B[nd];W[qc];B[qd];W[rd];B[pc]))');
    it(`should parse move 1 correctly`, () => {
      model.goToMove(1);
      expect(model.stoneAt(15, 3)).to.equal('b');
      expect(model.currentMoveNumber()).to.equal(1);
      expect(model.currentBranchNumber()).to.equal(0); // main branch
      expect(model.currentBranchNumber()).to.equal(0); // main branch
      expect(model.canChangeBranch(true)).to.be.false;
      expect(model.canChangeBranch(false)).to.be.false;
      // expect(model.getBranches().length).to.equal(1);
    });

    it(`should parse move 3 correctly as branch 0`, () => {
      model.goToMove(3);
      expect(model.stoneAt(15, 3)).to.equal('b');
      expect(model.stoneAt(16, 5)).to.equal('w');
      expect(model.stoneAt(13, 2)).to.equal('b');
      expect(model.currentMoveNumber()).to.equal(3);
      expect(model.currentBranchNumber()).to.equal(0); // main branch
      expect(model.canChangeBranch(true)).to.be.false;
      expect(model.canChangeBranch(false)).to.be.true;
      // expect(model.getBranches().length).to.equal(2);
    });

    it(`should maintain branch 0 correctly`, () => {
      model.goToMove(9);
      expect(model.stoneAt(15, 3)).to.equal('b');
      expect(model.stoneAt(16, 5)).to.equal('w');
      expect(model.stoneAt(13, 2)).to.equal('b');
      expect(model.stoneAt(16, 2)).to.equal('w');
      expect(model.stoneAt(16, 4)).to.equal('b');
      expect(model.stoneAt(16, 5)).to.equal('w');
      expect(model.stoneAt(16, 7)).to.equal('b');

      expect(model.currentMoveNumber()).to.equal(9);
      expect(model.currentBranchNumber()).to.equal(0); // main branch
      // expect(model.getBranches().length).to.equal(2);
    });

    it(`should go to move 3 on branch 1 correctly`, () => {
      model.goToMove(3, 1);
      expect(model.stoneAt(15, 3)).to.equal('b');
      expect(model.stoneAt(16, 5)).to.equal('w');
      expect(model.stoneAt(13, 3)).to.equal('b');
      expect(model.currentMoveNumber()).to.equal(3);
      expect(model.currentBranchNumber()).to.equal(1); // alt branch
      expect(model.canChangeBranch(true)).to.be.true;
      expect(model.canChangeBranch(false)).to.be.false;

      // expect(model.getBranches().length).to.equal(2);
    });

    it(`should go to switch branch up from branch 1 to branch 0 correctly`, () => {
      model.changeBranch(true);
      expect(model.stoneAt(13, 3)).to.be.undefined;
      expect(model.stoneAt(13, 2)).to.equal('b');
    });

    it(`should go to switch branch down from branch 0 to branch 1 correctly`, () => {
      model.changeBranch(false);
      expect(model.stoneAt(13, 3)).to.equal('b');
      expect(model.stoneAt(13, 2)).to.be.undefined;
    });

    it(`should maintain branch 1 correctly`, () => {
      model.goToMove(-1);
      // model.logPosition();
      expect(model.stoneAt(15, 3)).to.equal('b');
      expect(model.stoneAt(16, 5)).to.equal('w');
      expect(model.stoneAt(13, 3)).to.equal('b');
      expect(model.stoneAt(16, 2)).to.equal('w');
      expect(model.stoneAt(13, 3)).to.equal('b');

      expect(model.currentMoveNumber()).to.equal(7);
      expect(model.currentBranchNumber()).to.equal(1); // alt branch
      expect(model.canChangeBranch(true)).to.be.false;
      expect(model.canChangeBranch(false)).to.be.false;
      // expect(model.getBranches().length).to.equal(2);
    });
  });

  describe('Advanced branch test 1', () => {
    var model = new GameModel();

    var parser = new SGFParser(model);
    parser.parse('(;FF[4]KM[6.5]DT[2015-07-30](;B[pd](;W[qf](;B[nd])(;B[nc]))(;W[qg]))(;B[qd](;W[oc](;B[pf])(;B[mc]))(;W[od](;B[oc];W[nc];B[pc];W[md];B[pf])(;B[mc];W[qc];B[qg];W[pd];B[rd]))))');

    it(`should parse root move correctly`, () => {
      expect(model.currentMoveNumber()).to.equal(0);
      expect(model.currentBranchNumber()).to.equal(0); // main branch
      expect(model.canChangeBranch(true)).to.be.false;
      expect(model.canChangeBranch(false)).to.be.false;
    });

    it(`should parse move 1, branch 0 correctly`, () => {
      model.goToMove(1);
      // model.logPosition();
      expect(model.stoneAt(15, 3)).to.equal('b');
      expect(model.stoneAt(16, 3)).to.be.undefined;
      expect(model.currentMoveNumber()).to.equal(1);
      expect(model.currentBranchNumber()).to.equal(0); // main branch
      expect(model.canChangeBranch(true)).to.be.false;
      expect(model.canChangeBranch(false)).to.be.true;
    });

    it(`should parse move 1, branch 1 correctly`, () => {
      model.changeBranch(false);
      expect(model.stoneAt(15, 3)).to.be.undefined;
      expect(model.stoneAt(16, 3)).to.equal('b');
      expect(model.currentMoveNumber()).to.equal(1);
      expect(model.currentBranchNumber()).to.not.equal(0); // not the main branch
      expect(model.canChangeBranch(true)).to.be.true;
      expect(model.canChangeBranch(false)).to.be.false;
    });

    it(`should go back to move 1, branch 0 correctly`, () => {
      model.changeBranch(true);
      expect(model.stoneAt(15, 3)).to.equal('b');
      expect(model.stoneAt(16, 3)).to.be.undefined;
      expect(model.currentMoveNumber()).to.equal(1);
      expect(model.currentBranchNumber()).to.equal(0); // main branch
      expect(model.canChangeBranch(true)).to.be.false;
      expect(model.canChangeBranch(false)).to.be.true;
    });
  });

});
