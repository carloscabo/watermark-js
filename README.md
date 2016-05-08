# watermark-js
Small JS library to watermarks pictures using JS and HTML5 Canvas element.

<img src="https://github.com/carloscabo/watermark-js/raw/master/result-screen-shot.png">

## Requirements

````
JQuery 1.5+
Web browser with HTML5 Canvas support (IE9+)
````

## Basic usage

````javascript
my_watermarked = new Watermark();     // Create new object instance

my_watermarked
  .setPicture('img/source-image.jpg') // Base picture, url or data-url
  .addWatermark('img/wm-1.png')       // Url or data-url
  .render( function(){
    // Do something when watermarking ends
  });
````

## IMPORTANT: the .render() callback
<mark> The **watermarking proccess is asyncronous**, so if you want to access / use the resulting watermarked images you must do it inside the `.render()` method, passing a _callback_ function that will be executed **once the watermarking is finished**. </mark>

## Creating several watermarked thumbnails
You can pass an optional array of `widths` to the `.setPicture()` method to create several sizes from the original base image, this eases the task of creating several sizes of the watermarked image automatically.

````javascript
my_watermarked
  .setPicture('img/source-image.jpg', [640, 320, 240]) // Array of thumbs widths
  //...
````

## Watermark images options
The watermark images can have several optional settings

````javascript
.addWatermark('img/wm-3.png', // Image url or data-url
  {
    position: [1,1], // Default is [0.5, 0.5]
    scale: 2.0,      // Default is 1.0
    opacity: 0.5     // Default is 1.0
  }
)
````

`position` indicates the position of the watermark **relative to the base image**, first component of the array is the horizontal position, and second one the vertical position, both in a range of [0-1]:

````javascript
// Positions
// left top      -> [0, 0]
// left center   -> [0, 0.5]
// left bottom   -> [0, 1]
// right top     -> [1, 0]
// right center  -> [1, 0.5]
// right bottom  -> [1, 1]
// center top    -> [0.5, 0]
// center center -> [0.5, 0.5]
// center bottom -> [0.5, 1]
````

`scale` sets an enlargement / reduction to the watermark. So if you want the watermark be **half the size the original image you must set this value `0.5`**. Remember that enlarging images can produce _blurry_ results.

## Accessing the resulting watermarked images

You have two methods to retrieve the resulting watermarked images, both return **an array of elements**:

````javascript
   my_watermarked.getImgs( format, quality );     // Returns array of <img>s
   my_watermarked.getDataUrls( format, quality ); // Returns array of data-urls
   // format: 'image/png' (default) / 'image/jpeg'
   // quality: float in range [ 0-1 ] ( 1 is best quality )
````

Sample usage:

````javascript
// Gets all the resulting images in PNG format
var resulting_imgs = my_watermarked.getImgs( 'image/png' );
// Loop add them to ths <body> element
$.each( resulting_imgs, function(idx, item) {
  $('body').append( $(item) );
});

// Get all the resuling data urls in Jpeg 90% quality
var resulting_data_urls = my_watermarked.getDataUrls( 'image/jpeg', 0.9 );
console.log(resulting_data_urls);
````

## Advanced usage
As both `.setPicture()` and `.addWatermark()` accept a data-url image as parameter you can build complex / dynamic watermarks passing a functión that return data-url as parameter. Take a look to the `procedural-watermark-sample.js` included in the repo to see a sample function.

````javascript
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
````

## TO-DO (or not ;)
- Add vertical constraints to the thumbnails widths
- Add a `fitWidth` to the watermark options...
