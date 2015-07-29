export default class Move {
  constructor(previousMove, stones, comment) {
    this.previousMove = previousMove;

    if (previousMove && previousMove.nextPlayer === 'b') {
      this.nextPlayer = 'w';
    } else {
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
