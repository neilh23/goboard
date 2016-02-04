export default class GoBoard {
  constructor(el, model) {
    this.element = el;
    this.model = model;
    this.lastX = -1;
    this.lastY = -1;
    this.boardIsSetup = false;
  }

  drawStone(x, y, isBlack, isCurrent=false) {
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

    ctx.closePath();

    if (isCurrent) {
      ctx.beginPath();
      if (isBlack) {
        ctx.strokeStyle = '#AAAAAA';
      } else {
        ctx.strokeStyle = '#666666';
      }

      var x1 = x - (p.zw / 6);
      var x2 = x + (p.zw / 6);
      var y1 = y - (p.zw / 6);
      var y2 = y + (p.zw / 6);

      // console.log(`isCurrent ${x},${y} , ${x1}-${x2}, ${y1}-${y2} `);

      ctx.moveTo(x1, y); ctx.lineTo(x2, y);
      ctx.moveTo(x, y1); ctx.lineTo(x, y2);

      ctx.stroke();
      ctx.closePath();
    }
  }

  drawLabel(x, y, label) {
    console.log(`Drawing label ${label} at ${x}, ${y}`);
    var el = window.goboardlabels;
    var ctx = el.getContext('2d');
    var p = this.goParams;

    if (this.model.stoneAt(x, y) === undefined) {
      ctx.beginPath();
      let a = Math.floor(p.margin + (x * p.zw) - (p.zw / 2)) + 0.5;
      let b = Math.floor(p.margin + (y * p.zw) - (p.zw / 2)) + 0.5;

      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      //ctx.fillStyle = '#DDDD88'; // FIXME: these should be configuration values
      ctx.fillStyle = 'rgba(221,221,136,0.7)';
      ctx.fillRect(a, b, p.zw, p.zw);
      ctx.closePath();
    }

    ctx.beginPath();
    ctx.font = '18px bold Arial';
    ctx.shadowOffsetX = -(p.stone / 10);
    ctx.shadowOffsetY = (p.stone / 10);
    ctx.shadowBlur = 0;

    if (this.model.stoneAt(x, y) === 'b') {
      ctx.fillStyle = '#AAAAAA';
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
    } else {
      ctx.fillStyle = '#444444';
      ctx.shadowColor = 'rgba(1,1,1,0.25)';
    }

    let xv = Math.floor(p.margin + (x * p.zw) - (p.zw / 4)) + 0.5;
    let yv = Math.floor(p.margin + (y * p.zw) + (p.zw / 4)) + 0.5;

    ctx.fillText(label, xv, yv);
    ctx.closePath();
  }

  deleteStone(x, y) {
    var p = this.goParams;
    var ctx = window.goboardstones.getContext('2d');
    var mar = p.margin;

    x = Math.floor(mar + (x * p.zw)) + 0.5;
    y = Math.floor(mar + (y * p.zw)) + 0.5;

    ctx.clearRect(x - p.stone, y - p.stone, p.stone * 2, p.stone * 2);
  }

  setComment(comment) {
    var target = window.gocomments;
    if (target === undefined) { return; }

    if ((comment || '') === '') {
      target.innerHTML = '&nbsp;';
    } else {
      // use innerText most of the time to stop inject attacks from sgf
      target.innerText = comment;
    }
  }

  mousey(evt) {
    var p = this.goParams;

    var rect = window.goboardstones.getBoundingClientRect();
    var x = -1;
    var y = -1;

    if (evt !== undefined) {
      x = evt.clientX - rect.left;
      y = evt.clientY - rect.top;
    }

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
      ctx.moveTo(p.mar1, v); ctx.lineTo(p.mar2, v);
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
      ctx.fillText(`${dim - i}`, 2, Math.floor(v + p.zw / 12) + 0.5);
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
    window.goboardstones.addEventListener('mouseleave', () => this.mousey(), false);
    window.buttonstart.addEventListener('click', () => this.model.goToMove(0));
    window.buttonfback.addEventListener('click', () => this.model.back(10));
    window.buttonback.addEventListener('click', () => this.model.back(1));
    window.buttonforward.addEventListener('click', () => this.model.forward(1));
    window.buttonfforward.addEventListener('click', () => this.model.forward(10));
    window.buttonend.addEventListener('click', () => this.model.goToMove(-1));
    window.addEventListener('keydown', e => {
      switch (e.keyCode) {
        case 35: this.model.goToMove(-1); break; // end
        case 36: this.model.goToMove(0); break; // home
        case 37: this.model.back(1); break; // left
        case 38: this.model.changeBranch(true); break; // up
        case 39: this.model.forward(1); break; // right
        case 40: this.model.changeBranch(false); break; // down
      }
    });
  }

  clearBoard() {
    var el = window.goboardstones;
    var ctx = el.getContext('2d');
    ctx.clearRect(0, 0, el.width, el.height);
  }

  clearLabels() {
    var el = window.goboardlabels;
    var ctx = el.getContext('2d');

    ctx.clearRect(0, 0, el.width, el.height);
  }

  resetStones() {
    if (!this.boardIsSetup) { this.setupBoard(); }
    this.clearBoard();
    this.clearLabels();

    var dim = this.model.dimension;

    var lastMove = this.model.currentMoveNumber();
    for (let x = 0; x < dim; x++) {
      for (let y = 0; y < dim; y++) {
        let stone = this.model.stoneAt(x, y, true);
        if (stone !== undefined) {
          let isLast = (stone.moveNumber() === lastMove);
          if (stone.type === 'b') {
            this.drawStone(x, y, true, isLast);
          } else if (stone.type === 'w') {
            this.drawStone(x, y, false, isLast);
          }
        }

        let label = this.model.labelAt(x, y);
        if (label !== undefined) {
          console.log(`Drawing label ${label} at ${x}, ${y}`);
          this.drawLabel(x, y, label);
        }
      }
    }

    window.gocounter.innerText = '' + this.model.currentMoveNumber();

    this.setComment(this.model.getComment());

    if (this.model.canChangeBranch(true)) {
      window.buttonbdown.style.color = '#000000';
    } else {
      window.buttonbdown.style.color = '#555555';
    }

    if (this.model.canChangeBranch(false)) {
      window.buttonbup.style.color = '#000000';
    } else {
      window.buttonbup.style.color = '#555555';
    }
  }
}
