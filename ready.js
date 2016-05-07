var wm;

$(document).ready(function() {
  // La magia aquí

  wm = new Watermark();

  wm
    .setPicture('img/source-image.jpg', [400, 250])
    .addWatermark('img/wm-1.png', {
      position: [0,0]
    })
    .addWatermark('img/wm-2.png')
    .addWatermark('img/wm-3.png', {
      position: [1,1],
      scale: 2.0,
      opacity: 0.5
    })
    .render();

  wm.onRenderDone = function() {
    console.log('All is done!');
    // $('body').append( this.data.results[0].canvas );
    // $('body').append( this.data.results[1].canvas );
    // $('body').append( this.data.results[2].canvas );
  };

});
