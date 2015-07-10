class Move {
  constructor(previousMove, stones, comment) {
    this.previousMove = previousMove;
    this.stones = stones;
    this.comment = comment;
    this.nextMoves = new Set();
    if (previousMove === undefined) {
      this.branch = 0;
      this.moveNumber = 1;
    } else {
      this.branch = previousMove.branch;
      this.moveNumber = previousMove.moveNumber + 1;
      previousMove.nextMoves.add(this);
    }
  }
}
