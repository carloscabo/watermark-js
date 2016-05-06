var wm;

$(document).ready(function() {
  // La magia aquí

  wm = new Watermark();

  wm
    .setPicture('img/source-image.jpg')
    // .addWatermark('img/wm-1.png', [0,0])
    // .addWatermark('img/wm-2.png')
    .addWatermark('img/wm-3.png', [1,1], 2.0);
    // .render();

  wm.done = function() {
    $('body').append( $(wm.getImg()) );
  };

});
