var blackToPlay = true;
function dot(ctx, x, y, dw) {
   ctx.beginPath();
   ctx.arc(Math.floor(x)+0.5, Math.floor(y)+0.5, dw, 0, 360);
   ctx.fill();
}

function drawStone(x, y, isBlack)
{
   var p = window.goParams;
   var ctx = window.stones.getContext("2d");
   var mar = p.margin;

   ctx.beginPath();

   x = Math.floor(mar + (x*p.zw))+0.5;
   y = Math.floor(mar + (y*p.zw))+0.5;

   var grd=ctx.createRadialGradient(x+p.stone/3, y-p.stone/2, 1, x, y, p.stone*0.8 );
   if (isBlack) {
      grd.addColorStop(0.2,"#777777");
      grd.addColorStop(1,"#222222");
   } else {
      grd.addColorStop(0.2,"#FFFFFF");
      grd.addColorStop(1,"#BBBBBB");
   }
   ctx.fillStyle=grd;

   ctx.arc(x, y, p.stone - 0.5, 0, 360);
   ctx.fill();
}

function deleteStone(x, y) {
   var p = window.goParams;
   var ctx = window.stones.getContext("2d");
   var mar = p.margin;

   x = Math.floor(mar + (x*p.zw))+0.5;
   y = Math.floor(mar + (y*p.zw))+0.5;

   ctx.clearRect(x - p.stone,y - p.stone,p.stone*2,p.stone*2);
}

function setupBoard(el) {
   'use strict';
   var sz = Math.min(el.width, el.height);
   el.width = el.height = sz;

   // window.addEventListener('resize', function() { setupBoard(el) }, false);
   var ctx = el.getContext("2d");

   var dim = 19; // 19x19

   var mar = Math.floor(sz/30);
   var zw = (sz - (mar*2))/(dim-1);

   ctx.fillStyle = '#FFFF99';
   ctx.fillRect(0,0,sz,sz);

   ctx.fillStyle = '#000000';
   ctx.lineWidth = 1/2;

   var mar1 = mar + 0.5;
   var mar2 = Math.floor(sz - mar) + 0.5;

   for (var i = 0; i < dim; i++ ) {
      var v = Math.floor(mar + i*zw)+0.5;

      ctx.moveTo(v, mar1); ctx.lineTo(v, mar2); ctx.stroke();
      ctx.moveTo(mar1, v); ctx.lineTo(mar2, v); ctx.stroke();
   }

   var mid = mar + (Math.floor(dim/2))*zw;
   var dr = Math.max((zw)/8, 2);
 
   dot(ctx, mid, mid, dr);

   if (dim >= 13) {
      var v1 = mar + 3*zw;
      var v2 = mar + (dim - 4)*zw;

      dot(ctx, v1, v1, dr);
      dot(ctx, v2, v1, dr);
      dot(ctx, v1, v2, dr);
      dot(ctx, v2, v2, dr);
   }

   window.goParams = { context: ctx, dim: dim, margin: mar, sz: sz, zw: zw, stone: Math.ceil(zw*0.48) };

   drawStone(3, 3, false);
   drawStone(16, 3, true);
   drawStone(3, 15, false);
   drawStone(15, 16, true);
   drawStone(15, 15, false);
   drawStone(16, 15, true);
   drawStone(16, 16, false);
   drawStone(17, 16, true);
   drawStone(14, 16, false);
   setTimeout(function() { deleteStone(15, 16); }, 2000);
   blackToPlay = true;
}
