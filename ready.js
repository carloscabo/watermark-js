var wm;

$(document).ready(function() {
  // La magia aquí

  wm = new Watermark();

  wm
    .setPicture('img/source-image.jpg', [400, 300])
    .addWatermark('img/wm-1.png', [0,0])
    .addWatermark('img/wm-2.png')
    .addWatermark('img/wm-3.png', [1,1], 2.0)
    .render();

  wm.onRenderDone = function() {
    console.log('All is done!');
    // $('body').append( this.data.results[0].canvas );
    // $('body').append( this.data.results[1].canvas );
    // $('body').append( this.data.results[2].canvas );
  };

});
