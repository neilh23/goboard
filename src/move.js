export default class Move {
  constructor(previousMove, stones, comment) {
    this.previousMove = previousMove;

    // moves below 0 aren't real
    if (previousMove) {
      if (previousMove.moveNumber < 0) {
        this.nextPlayer = previousMove.nextPlayer; // last move wasn't real
      } else {
        if (previousMove.nextPlayer === 'b') {
          this.nextPlayer = 'w';
        } else {
          this.nextPlayer = 'b';
        }
      }
      // console.log(`move ${previousMove.moveNumber} -> ${previousMove.nextPlayer} -> ${this.nextPlayer}`);
    } else {
      // console.log('move 0 -> b');
      this.nextPlayer = 'b'; // default to 'b'
    }

    this.stones = stones;
    this.comment = comment;
    this.nextMoves = [];

    if (previousMove === undefined) {
      this.branch = 0;
      this.moveNumber = 0; // assume this is the initial position
    } else {
      // console.log(`Add move ${previousMove.branch}/${previousMove.nextMoves.length}`);
      if (previousMove.nextMoves.length > 0) {
        if (Move.maxBranch === undefined) {
          this.branch = 1;
          Move.maxBranch = 1;
        } else {
          Move.maxBranch++;
          this.branch = Move.maxBranch;
        }

        // console.log(`Adding new branch ${this.branch}`);
      } else {
        this.branch = previousMove.branch;
        previousMove.nextMoveChoice = this;
      }

      this.moveNumber = previousMove.moveNumber + 1;
      previousMove.nextMoves.push(this);
    }

    for (let stone of stones) { stone.move = this; }
  }

  addStone(stone) {
    if (this.stones === undefined) {
      this.stones = [stone];
    } else {
      this.stones.push(stone);
    }
  }
}
