import Stone from './stone';
import Move from './move';
import GameInfo from './gameinfo';

export default class GameModel {
  constructor() {
    this.initialBoardPosition = new Move(undefined, []);
    this.firstMove = undefined;
    this.lastMove = undefined;
    this.currentMove = undefined;
    this.gameInfo = new GameInfo();
    this.moveListeners = new Set();
    this.dimension = 19; // default
    this.blackCaptures = 0;
    this.whiteCaptures = 0;
    this.branchPoints = {};
    this.branchStack = [];
    this.currentBranch = 0;
  }

  // handy little function ...
  logPosition() {
    console.log(`Move: ${this.currentMoveNumber()} Branch ${this.currentBranchNumber()}`);
    if (this.dimension !== 19) {
      console.log(`ERROR: position logging currently only for 19x19 (${this.dimension})`);
      return;
    }
    if (this.position === undefined) {
      console.log('=== NULL ===');
      return;
    }
    console.log('   ' + '0123456789012345678'.split('').join(' '));
    for (let y = 0; y < 19; y++) {
      let foo = new Array(19);

      for (let x = 0; x < 19; x++) {
        foo[x] = this.stoneAt(x, y) || '.';
      }
      let lead = ((y < 10) ? ' ' : '') + y + ' ';
      console.log(lead + foo.join(' '));
    }
  }

  addMove(x, y, color, comment, addToCurrent) {
    var stone = new Stone(x, y, color);
    var move;
    if (addToCurrent) {
      move = this.lastMove || this.initialBoardPosition;
      move.addStone(stone);
    } else {
      let lm = (this.lastMove || this.initialBoardPosition);
      move = new Move(lm, [stone], comment);
      if (this.firstMove === undefined) {
        this.firstMove = move;
      }
      if (move.branch !== lm.branch) {
        this.branchPoints[move.branch] = move;
      }
    }
    this.lastMove = move;
    return move;
  }

  pushBranch() {
    this.branchStack.push({lastMove: this.lastMove});
  }

  popBranch() {
    var c = this.branchStack.pop();
    if (c === undefined) { return; }
    this.lastMove = c.lastMove;
  }

  addComment(comment) {
    var move = this.lastMove || this.initialBoardPosition;

    move.comment = comment;
  }

  informListeners() {
    for (let listener of this.moveListeners) {
      listener.resetStones();
    }
  }

  setDimension(dim) {
    this.dimension = dim;
    this.resetPosition();
  }

  resetPosition() {
    let dim = this.dimension;
    if (dim === undefined) { return; }
    this.position = new Array(dim);
    for (let i = 0; i < dim; i++) { this.position[i] = new Array(dim); }
    this.currentMove = undefined;
    this.blackCaptures = 0;
    this.whiteCaptures = 0;

    for (let stone of this.initialBoardPosition.stones) {
      this.position[stone.x][stone.y] = stone;
    }

    // console.log(`ResetPosition, movenumber now: ${this.currentMoveNumber()}`);
  }

  libertyLoop(colour, x, y) {
    let dim = this.dimension;
    // console.log('ll - ' + x +'/' + y +' - ' + dim);
    if (x < 0 || y < 0 || x >= dim || y >= dim) {
      // console.log('ll - oob edge');
      return true;
    }

    if (this.libertyCheck[x][y] === true) {
      // console.log('ll - already');
      return true;
    }
    let c = this.stoneAt(x, y);
    if (c === undefined) {
      // console.log('ll - empty, giving up');
      return false;
    }
    this.libertyCheck[x][y] = true;

    if (c !== colour) {
      // console.log('ll - edge');
      return true;
    } // edge of the shape

    // console.log('ll - recursing');
    return (this.libertyLoop(colour, x - 1, y) &&
            this.libertyLoop(colour, x + 1, y) &&
            this.libertyLoop(colour, x, y - 1) &&
            this.libertyLoop(colour, x, y + 1));
  }

  checkLiberties(x, y, removeStones) {
    let dim = this.dimension;
    if (x < 0 || y < 0 || x >= dim || y >= dim) { return false; }
    let c = this.stoneAt(x, y);
    if (c === undefined) { return false; }

    this.libertyCheck = new Array(dim);
    for (let i = 0; i < dim; i++) { this.libertyCheck[i] = new Array(dim); }
    if (this.libertyLoop(c, x, y)) {
      // console.log('Stone has no liberties ' + x + '/' + y);
      if (removeStones) {
        let captures = 0;
        for (x = 0; x < dim; x++) {
          for (y = 0; y < dim; y++) {
            if (this.libertyCheck[x][y] === true && this.stoneAt(x, y) === c) {
              // console.log('Removing ' + x + '/' + y);
              this.position[x][y] = undefined;
              captures++;
            }
          }

        }
        if (c === 'b') {
          this.blackCaptures += captures;
        } else if (c === 'w') {
          this.whiteCaptures += captures;
        }
      }
      return true;
    }
    return false;
  }

  goToMove(moveNum, branch = undefined) {
    this.resetPosition();
    if (branch !== undefined) {
      // force the move chain to come to this branch
      let x = this.branchPoints[branch];
      if (x === undefined) { throw `no such branch: ${branch}`; }

      let y;
      while ((y = x.previousMove) !== undefined) {
        y.nextMoveChoice = x;
        x = y;
      }
    }
    if ((moveNum || 0) === 0 || this.firstMove === undefined) {
      // console.log('goToMove - no doing anything move ' + moveNum + ' lm ' + this.lastMove);
      this.informListeners();
      return;
    }

    // if moveNum is < 0, then '-1' is the last move, -2 is the last-but-one move
    if (moveNum < 0) {
      moveNum = Math.max(0, this.lastMoveNumber() + (1 + moveNum));
    }
    // moveNum = Math.min(moveNum, this.lastMove.moveNumber);
    moveNum = Math.min(moveNum, 1000); // limit to 1000 moves, don't think there's any game above that ...
    // console.log('Going to move ' + moveNum);
    for (let i = 0; i < moveNum; i++) {
      this.nextMoveInternal();
    }
    this.informListeners();
  }

  nextPlayer() {
    return (this.currentMove || this.initialBoardPosition).nextPlayer;
  }

  setNextPlayer(val) {
    let m = (this.currentMove || this.initialBoardPosition);
    m.nextPlayer = val;
  }

  nextMove(branch = undefined) {
    this.nextMoveInternal(branch);
    this.informListeners();
  }

  back(num) {
    var lm = this.lastMoveNumber();
    var cm = this.currentMoveNumber();
    this.goToMove(Math.max(0, Math.min(cm - num, lm)));
  }
  forward(num) {
    for (let i = 0; i < num; i++) {
      this.nextMove();
    }
  }
  nextMoveInternal(branch = undefined) {
    if (this.position === undefined) { return undefined; }
    if (this.currentMove === undefined) {
      if (this.firstMove === undefined) { return undefined; }
      this.currentMove = this.firstMove;
    } else {
      let nm = this.currentMove.nextMoveChoice;

      if (branch !== undefined) {
        for (let mv of this.currentMove.nextMoves) {
          if (mv.branch === branch) { nm = mv; }
        }
      }

      if (nm === undefined) {
        return this.currentMove;
      }

      this.currentMove = nm;
    }
    for (let stone of this.currentMove.stones) {
      if (stone.stoneType === 'x') {
        this.position[stone.x][stone.y] = undefined;
      } else {
        // console.log('setting stone at ' + stone.x + '/' + stone.y);
        // console.log('Was: ' + this.position[stone.x][stone.y]);

        this.position[stone.x][stone.y] = stone;
        this.checkLiberties(stone.x - 1, stone.y, true);
        this.checkLiberties(stone.x + 1, stone.y, true);
        this.checkLiberties(stone.x, stone.y - 1, true);
        this.checkLiberties(stone.x, stone.y + 1, true);
      }
    }
    return this.currentMove;
  }
  registerMoveListener(listener) {
    this.moveListeners.add(listener);
  }
  allowStoneAt() {
    return false;
  }
  stoneAt(x, y, stoneObj = false) {
    if (this.position === undefined) {
      return this.undefined;
    }
    if (this.dimension === undefined) {
      return undefined;
    }
    if (x < 0 || y < 0 || x >= this.dimension || y >= this.dimension) {
      return undefined;
    }

    if (stoneObj) {
      return this.position[x][y] && this.position[x][y];
    } else {
      return this.position[x][y] && this.position[x][y].stoneType;
    }
  }

  currentMoveNumber() {
    if (this.currentMove === undefined) { return 0; }
    return this.currentMove.moveNumber;
  }

  currentBranchNumber() {
    if (this.currentMove === undefined) { return 0; }
    return this.currentMove.branch;
  }

  lastMoveNumber() {
    let c = this.firstMove;
    if (c === undefined) { return 0; }
    let rv = 0;
    while ((c = c.nextMoveChoice) !== undefined) {
      rv = c.moveNumber;
    }

    return rv;
  }
}
