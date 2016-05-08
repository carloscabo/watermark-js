var my_watermarked;

$(document).ready(function() {
  // La magia aquí

  $('<img>')
    .attr('src', proceduralWatermark( 'DESDE', '99', ',99€'))
    .appendTo( $('body') );

  my_watermarked = new Watermark();

  my_watermarked
    .setPicture('img/source-image.jpg', [400, 250])
    .addWatermark('img/wm-1.png',
      {
        position: [0,0]
      }
    )
    .addWatermark('img/wm-2.png')
    .addWatermark('img/wm-3.png',
      {
        position: [1,1],
        scale: 2.0,
        opacity: 0.5
      }
    )
    .addWatermark(
      proceduralWatermark( 'DESDE', '99', ',99€'),
      {
        position: [1,0]
      }
    )
    .render( function(){

      // var resulting_canvas = wm.getCanvases();
      // $.each( resulting_canvas, function(idx, item) {
      //   $('body').append( $(item) );
      // });

      var resulting_imgs = my_watermarked.getImgs( 'image/png' );
      $.each( resulting_imgs, function(idx, item) {
        $('body').append( $(item) );
      });

      var resulting_data_urls = my_watermarked.getDataUrls( 'image/jpeg', 0.9 );
      console.log(resulting_data_urls);

    }); // render callback

});
