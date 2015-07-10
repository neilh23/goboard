// import { Stone } from "stone";
// import { Move } from "move";
//
// external Stone
// external Move

class GameModel {
  constructor() {
    this.firstMove = undefined;
    this.lastMove = undefined;
    this.currentMove = undefined;
    this.gameInfo = new GameInfo();
    this.moveListeners = new Set();
  }
  addMove(x, y, color, comment) {
    var stone = new Stone(x, y, color);
    var move = new Move(this.lastMove, [ stone ], comment);
    if (this.firstMove === undefined) {
      this.firstMove = move;
    }
    this.lastMove = move;
    return move;
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
  }

  goToMove(moveNum) {
    this.resetPosition();
    if ((moveNum || 0) === 0 || this.lastMove === undefined) {
      // console.log("goToMove - no doing anything move " + moveNum + " lm " + this.lastMove);
      this.informListeners();
      return;
    }

    // if moveNum is < 0, then '-1' is the last move, -2 is the last-but-one move
    if (moveNum < 0) {
      moveNum = Math.max(0, this.lastMove.moveNumber + (1 + moveNum));
    }
    // console.log("Going to move " + moveNum);
    for (let i = 0; i < moveNum; i++) {
      this.nextMoveInternal();
    }
    this.informListeners();
  }
  nextMove() {
    this.nextMoveInternal();
    this.informListeners();
  }
  nextMoveInternal() {
    if (this.position === undefined) { return undefined; }
    if (this.currentMove === undefined) {
      this.currentMove = this.firstMove;
    } else {
      let nm = this.currentMove.nextMoves;
      if (nm === undefined || nm.size === 0) {
        return this.currentMove;
      }

      let branch = this.currentMove.branch;
      for (let move of nm) {
        if (move.branch === branch) {
          this.currentMove = move;
          break;
        }
      }
    }
    for (let stone of this.currentMove.stones) {
      // console.log("setting stone at " + stone.x + "/" + stone.y);
      // console.log("Was: " + this.position[stone.x][stone.y]);
      this.position[stone.x][stone.y] = stone.stoneType;
    }
    return this.currentMove;
  }
  registerMoveListener(listener) {
    this.moveListeners.add(listener);
  }
  allowStoneAt() {
    return false;
  }
  stoneAt(x, y) {
    if (this.position === undefined) {
      return this.undefined;
    }
    if (this.dimension === undefined) {
      return undefined;
    }
    if (x < 0 || y < 0 || x >= this.dimension || y >= this.dimension) {
      return undefined;
    }

    return this.position[x][y];
  }
}
