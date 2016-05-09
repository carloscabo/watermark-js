function proceduralWatermark( top_text, price_int, price_float ) {

  var
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    cx = 0,
    cy = 0;

  canvas.width = 100;
  canvas.height = 100;
  cx = canvas.width / 2;
  cy = canvas.height / 2;

  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, 2 * Math.PI, false);
  ctx.fillStyle = '#ee0000';
  ctx.fill();

  ctx.font = 'Bold 12px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.fillText(top_text, cx, 32);

  ctx.font = 'Bold 30px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'alphabetic';
  var tm = ctx.measureText(price_int); // TextMetrics
  ctx.fillText(price_int, (cx - tm.width) - 4 , 64);

  ctx.font = 'Bold 20px Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'alphabetic';
  var tm = ctx.measureText( price_float); // TextMetrics
  ctx.fillText( price_float, (cx + tm.width) - 6 , 64);

  return canvas.toDataURL();
}
