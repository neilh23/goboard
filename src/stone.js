class Stone {
  constructor(x, y, stoneType) {
    this.x = x;
    this.y = y;
    this.stoneType = stoneType;
  }

  moveNumber() {
    if (this.move === undefined) { return undefined; }
    return this.move.moveNumber;
  }
}

export default Stone;
