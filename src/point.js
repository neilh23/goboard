class Point {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  moveNumber() {
    if (this.move === undefined) { return undefined; }
    return this.move.moveNumber;
  }
}

export default Point;
