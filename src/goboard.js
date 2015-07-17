export default class GoBoard {
  constructor(el, model) {
    this.element = el;
    this.model = model;
    this.lastX = -1;
    this.lastY = -1;
    this.boardIsSetup = false;
  }

  drawStone(x, y, isBlack) {
    var p = this.goParams;
    var ctx = window.goboardstones.getContext('2d');
    var mar = p.margin;

    ctx.beginPath();

    x = Math.floor(mar + (x * p.zw)) + 0.5;
    y = Math.floor(mar + (y * p.zw)) + 0.5;

    var grd = ctx.createRadialGradient(x + (p.stone / 3), y - (p.stone / 2), 1, x, y, p.stone * 0.85);
    if (isBlack) {
      grd.addColorStop(0.2, '#444444');
      grd.addColorStop(1, '#000000');
    } else {
      grd.addColorStop(0.2, '#FFFFFF');
      grd.addColorStop(1, '#AAAAAA');
    }
    ctx.fillStyle = grd;

    ctx.arc(x, y, p.stone - 0.5, 0, 360);
    ctx.shadowOffsetX = -(p.stone / 10);
    ctx.shadowOffsetY = (p.stone / 10);
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 2;
    ctx.fill();
  }

  deleteStone(x, y) {
    var p = this.goParams;
    var ctx = window.goboardstones.getContext('2d');
    var mar = p.margin;

    x = Math.floor(mar + (x * p.zw)) + 0.5;
    y = Math.floor(mar + (y * p.zw)) + 0.5;

    ctx.clearRect(x - p.stone, y - p.stone, p.stone * 2, p.stone * 2);
  }

  mousey(evt) {
    var p = this.goParams;

    var rect = window.goboardstones.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    var lx = Math.floor((x - (p.margin - p.zw / 2)) / p.zw);
    var ly = Math.floor((y - (p.margin - p.zw / 2)) / p.zw);
    if (this.lastX === lx && this.lastY === ly) { return; }
    if (this.lastX >= 0 && this.lastY >= 0) {
      let stone = this.model.stoneAt(this.lastX, this.lastY);
      if (stone === 'b') {
        this.drawStone(this.lastX, this.lastY, true);
      } else if (stone === 'w') {
        this.drawStone(this.lastX, this.lastY, false);
      } else {
        this.deleteStone(this.lastX, this.lastY);
      }
    }

    this.clearDecr();
    this.drawLine(lx, true, true);
    this.drawLine(ly, false, true);
    this.writeCoords(lx, ly);

    if (this.model.allowStoneAt(lx, ly)) {
      this.drawStone(lx, ly, true);
      return;
    }
    this.lastX = lx; this.lastY = ly;
  }

  clearDecr() {
    var el = window.goboarddecr;
    var ctx = el.getContext('2d');

    ctx.clearRect(0, 0, el.width, el.height);
  }

  drawLine(idx, horizontal, highlight) {
    var p = this.goParams;
    var ctx;

    var dim = this.model.dimension;

    if (idx < 0 || idx >= dim) { return; }

    if (highlight) {
      ctx = window.goboarddecr.getContext('2d');
    } else {
      ctx = window.goboardbase.getContext('2d');

    }
    var mar = p.margin;

    var v = Math.floor(mar + idx * p.zw) + 0.5;

    ctx.beginPath();

    if (horizontal) {
      ctx.moveTo(v, p.mar1); ctx.lineTo(v, p.mar2);
    } else {
      ctx.moveTo(p.mar1, v); ctx.lineTo(p.mar2, v); ctx.stroke();
    }
    if (highlight) {
      ctx.strokeStyle = '#664422';
    } else {
      ctx.strokeStyle = '#444422';
    }
    if (highlight) {
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowColor = 'rgba(15,2,0,0.5)';
      ctx.shadowBlur = 4;
    }
    ctx.stroke();
    ctx.closePath();
  }

  dot(ctx, x, y, dw) {
    ctx.beginPath();
    ctx.arc(Math.floor(x) + 0.5, Math.floor(y) + 0.5, dw, 0, 360);
    ctx.fill();
  }

  drawDots() {
    var p = this.goParams;
    var ctx = window.goboardbase.getContext('2d');
    var dim = this.model.dimension;

    this.dot(ctx, p.mid, p.mid, p.dr);

    if (dim >= 13) {
      var v1 = p.margin + 3 * p.zw;
      var v2 = p.margin + (dim - 4) * p.zw;

      this.dot(ctx, v1, v1, p.dr);
      this.dot(ctx, v2, v1, p.dr);
      this.dot(ctx, v1, v2, p.dr);
      this.dot(ctx, v2, v2, p.dr);
    }
  }

  writeCoords(highX, highY) {
    var alpha = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
    var dim = this.model.dimension;
    var el = window.goboarddecr;
    var ctx = el.getContext('2d');
    var p = this.goParams;

    ctx.beginPath();

    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = 'rgba(15,2,0,0.5)';
    ctx.shadowBlur = 0;
    for (let i = 0; i < dim; i++) {
      let v = Math.floor(p.margin + i * p.zw) + 0.5;
      if (i === highX) {
        ctx.fillStyle = '#000000';
        ctx.shadowBlur = 2;
      } else {
        ctx.fillStyle = '#444444';
      }
      ctx.fillText(alpha[i], Math.floor(v - p.zw / 8) + 0.5, 10);
      if (i === highY) {
        ctx.fillStyle = '#000000';
        ctx.shadowBlur = 2;
      } else {
        ctx.fillStyle = '#444444';
      }
      ctx.fillText(`${i + 1}`, 2, Math.floor(v + p.zw / 12) + 0.5);
    }
    ctx.closePath();
  }

  setupBoard() {
    if (this.model === undefined) { return; }

    this.boardIsSetup = true;
    var el = this.element;
    var sz = Math.min(el.width, el.height);
    el.width = el.height = sz;

    var ctx = el.getContext('2d');

    var dim = this.model.dimension;

    // var mar = Math.floor(sz / 30);
    var mar = Math.floor(sz / 20);

    var zw = (sz - (mar * 2)) / (dim - 1);

    ctx.fillStyle = '#DDDD88';
    ctx.fillRect(0, 0, sz, sz);

    ctx.fillStyle = '#000000';
    ctx.lineWidth = 0.5;

    var mar1 = mar + 0.5;
    var mar2 = Math.floor(sz - mar) + 0.5;

    var mid = mar + (Math.floor(dim / 2)) * zw;
    var dr = Math.max((zw) / 8, 2);

    this.goParams = {context: ctx, mid: mid, dr: dr, margin: mar, mar1: mar1, mar2: mar2, sz: sz, zw: zw, stone: Math.ceil(zw * 0.48)};

    for (var i = 0; i < dim; i++) {
      this.drawLine(i, true, false);
      this.drawLine(i, false, false);
    }
    this.drawDots();
    this.writeCoords();

    window.goboardstones.addEventListener('mousemove', e => this.mousey(e), false);
  }

  resetStones() {
    if (!this.boardIsSetup) { this.setupBoard(); }
    var el = window.goboardstones;
    var ctx = el.getContext('2d');
    var dim = this.model.dimension;

    ctx.clearRect(0, 0, el.width, el.height);

    for (let x = 0; x < dim; x++) {
      for (let y = 0; y < dim; y++) {
        let stone = this.model.stoneAt(x, y);
        if (stone === 'b') {
          this.drawStone(x, y, true);
        } else if (stone === 'w') {
          this.drawStone(x, y, false);
        }
      }
    }
  }
}
