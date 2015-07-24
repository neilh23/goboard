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
    this.nextMoves = new Set();
    if (previousMove === undefined) {
      this.branch = 0;
      this.moveNumber = 0; // assume this is the initial position
    } else {
      this.branch = previousMove.branch;
      this.moveNumber = previousMove.moveNumber + 1;
      previousMove.nextMoves.add(this);
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
