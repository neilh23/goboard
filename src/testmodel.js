class TestModel {
   constructor() {
      this.toPlay = "b";
   }
   dimension() {
      return 19;
   }
   toPlay() { return this.toPlay; }
   stoneAt(x, y) {
      if (x < 0 || x >= this.dimension()) { return undefined; }
      if (y < 0 || y >= this.dimension()) { return undefined; }
      /*
      if ((x + y) % 2 === 1) { return undefined; }
      return (((x + y) / 2) % 2 === 1) ? "b" : "w";
     */
      if (Math.random() < 0.7) { return undefined; }
      return Math.random() < 0.5 ? "b" : "w";
   }
   allowStoneAt(x, y) {
      if (x < 0 || x >= this.dimension()) { return false; }
      if (y < 0 || y >= this.dimension()) { return false; }
      return true;
      // return ((x + y) % 2 === 1);
   }
}
