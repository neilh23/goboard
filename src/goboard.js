/* global window */
function drawStone(x, y, isBlack)
{
   var p = window.goParams;
   var ctx = window.goboardstones.getContext("2d");
   var mar = p.margin;

   ctx.beginPath();

   x = Math.floor(mar + (x * p.zw)) + 0.5;
   y = Math.floor(mar + (y * p.zw)) + 0.5;

   var grd = ctx.createRadialGradient(x + (p.stone / 3), y - (p.stone / 2), 1, x, y, p.stone * 0.8 );
   if (isBlack) {
      grd.addColorStop(0.2, "#777777");
      grd.addColorStop(1, "#222222");
   } else {
      grd.addColorStop(0.2, "#FFFFFF");
      grd.addColorStop(1, "#BBBBBB");
   }
   ctx.fillStyle = grd;

   ctx.arc(x, y, p.stone - 0.5, 0, 360);
   ctx.fill();
}

function deleteStone(x, y) {
   var p = window.goParams;
   var ctx = window.goboardstones.getContext("2d");
   var mar = p.margin;

   x = Math.floor(mar + (x * p.zw)) + 0.5;
   y = Math.floor(mar + (y * p.zw)) + 0.5;

   ctx.clearRect(x - p.stone, y - p.stone, p.stone * 2, p.stone * 2);
}

var lastX = -1;
var lastY = -1;
function mousey(evt) {
   var p = window.goParams;
   var rect = window.goboardstones.getBoundingClientRect();
   var x = evt.clientX - rect.left;
   var y = evt.clientY - rect.top;
   var lx = Math.floor((x - (p.margin - p.zw / 2)) / p.zw);
   var ly = Math.floor((y - (p.margin - p.zw / 2)) / p.zw);
   if (lastX === lx && lastY === ly) { return; }
   if (lastX >= 0 && lastY >= 0) { deleteStone(lastX, lastY); }
   if (lx < 0 || ly < 0 || lx >= p.dim || ly >= p.dim) { return; }

   drawStone(lx, ly, true);
   lastX = lx; lastY = ly;
}


function drawLine(idx, horizontal, highlight) {
   var p = window.goParams;
   var ctx = window.goboardbase.getContext("2d");
   var mar = p.margin;

    var v = Math.floor(mar + idx * p.zw) + 0.5;

   if (horizontal) {
      ctx.moveTo(v, p.mar1); ctx.lineTo(v, p.mar2);
   } else {
      ctx.moveTo(p.mar1, v); ctx.lineTo(p.mar2, v); ctx.stroke();
   }
   if (highlight) {
      ctx.strokeStyle = "#000000";
   } else {
      ctx.strokeStyle = "#333333";
   }
   ctx.stroke();
}

function dot(ctx, x, y, dw) {
   ctx.beginPath();
   ctx.arc(Math.floor(x) + 0.5, Math.floor(y) + 0.5, dw, 0, 360);
   ctx.fill();
}

function drawDots() {
   var p = window.goParams;
   var ctx = window.goboardbase.getContext("2d");

   dot(ctx, p.mid, p.mid, p.dr);

   if (p.dim >= 13) {
      var v1 = p.margin + 3 * p.zw;
      var v2 = p.margin + (p.dim - 4) * p.zw;

      dot(ctx, v1, v1, p.dr);
      dot(ctx, v2, v1, p.dr);
      dot(ctx, v1, v2, p.dr);
      dot(ctx, v2, v2, p.dr);
   }
}

function setupBoard(el) {
   var sz = Math.min(el.width, el.height);
   el.width = el.height = sz;

   // window.addEventListener('resize', function() { setupBoard(el) }, false);
   var ctx = el.getContext("2d");

   var dim = 19; // 19x19

   var mar = Math.floor(sz / 30);
   var zw = (sz - (mar * 2)) / (dim - 1);

   ctx.fillStyle = "#FFFF99";
   ctx.fillRect(0, 0, sz, sz);

   ctx.fillStyle = "#000000";
   ctx.lineWidth = 0.5;

   var mar1 = mar + 0.5;
   var mar2 = Math.floor(sz - mar) + 0.5;

   var mid = mar + (Math.floor(dim / 2)) * zw;
   var dr = Math.max((zw) / 8, 2);

   // FIXME - horrible, but this will be refactored away when we move to ES6 class ...
   window.goParams = { context: ctx, dim: dim, mid: mid, dr: dr, margin: mar, mar1: mar1, mar2: mar2, sz: sz, zw: zw, stone: Math.ceil(zw * 0.48) };

   for (var i = 0; i < dim; i++ ) {
      drawLine(i, true, false);
      drawLine(i, false, false);
   }
   drawDots();

   drawStone(3, 3, false);
   drawStone(16, 3, true);
   drawStone(3, 15, false);
   drawStone(15, 16, true);
   drawStone(15, 15, false);
   drawStone(16, 15, true);
   drawStone(16, 16, false);
   drawStone(17, 16, true);
   drawStone(14, 16, false);
   window.setTimeout(function() { deleteStone(15, 16); }, 2000);
   window.goboardstones.addEventListener("mousemove", mousey, false);
}

this.setupBoard = setupBoard;
