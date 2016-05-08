var wm;

$(document).ready(function() {
  // La magia aquí

  $('<img>')
    .attr('src', proceduralWatermark( 'DESDE', '99', ',99€'))
    .appendTo( $('body') );

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
    .addWatermark(
      proceduralWatermark( 'DESDE', '99', ',99€')
    ,{
      position: [1,0]
    })
    .render(function(){

      // var resulting_canvas = wm.getCanvases();
      // $.each( resulting_canvas, function(idx, item) {
      //   $('body').append( $(item) );
      // });

      var resulting_imgs = wm.getImgs( 'image/png' );
      $.each( resulting_imgs, function(idx, item) {
        $('body').append( $(item) );
      });

      var resulting_data_urls = wm.getDataUrls( 'image/jpeg', 0.2 );
      console.log(resulting_data_urls);

    }); // render

});
