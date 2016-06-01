/**
 * watermark-js V0.2 by Carlos Cabo 2016
 * https://github.com/carloscabo/watermark-js
 */

// data URI - MDN https://developer.mozilla.org/en-US/docs/data_URIs
// The "data" URL scheme: http://tools.ietf.org/html/rfc2397
// Valid URL Characters: http://tools.ietf.org/html/rfc2396#section2

// Positions
// left top -> 0, 0
// left center -> 0, 0.5
// left bottom -> 0, 1
// right top -> 1, 0
// right center -> 1, 0.5
// right bottom -> 1, 1
// center top -> 0.5, 0
// center center -> 0.5, 0.5
// center bottom -> 0.5, 1

var Watermark = (function() {

  function Constructor( user_settings ) {
    this.version = 0.1;

    // Internal data
    this.data = {
      picture: {
        sizes: null
      }, // Source picture
      results: [], // Resulting watermarker images
      watermarks: [], // Watermarks to be applied
      pending_watermarks: 0,
      callback: null
    };

    // Default settings
    this.settings = {};
    $.extend(true, this.settings, user_settings);

  }

  Constructor.prototype = {

    // Sets base pìcture to work with
    setPicture: function( url_or_data, sizes ) {
      var
        _t = this.data;
      _t.picture.url = this.addAntiCacheParam( url_or_data );
      if (typeof sizes !== 'undefined') _t.picture.sizes = sizes;
      return this; // Chainning
    }, // setPicture

    // Adds a watermark element that will be rendered ove the base picture
    // when the .render() methos is called
    addWatermark: function( url_or_data, user_options ) {
      var
        _t = this,
        wm = {},
        default_options = {
          position: [0.5, 0.5],
          scale: 1.0,
          opacity: 1.0
        };

      _t.data.pending_watermarks++;

      wm.url = _t.addAntiCacheParam( url_or_data );
      wm.options = $.extend(default_options, user_options);

      _t.data.watermarks.push( wm );

      return this;
    },

    // Clear watermark configurations and results
    // in case you want to make a fresh watermark
    clearWatermarks: function() {
      var _t = this;
      _t.data.pending_watermarks = 0;
      _t.data.watermarks.length = 0; // faster than = []
      _t.data.results.length = 0; // faster than = []
    },

    // Creates a canvas an return an object with
    // .canvas and .ctx (context)
    createCanvas: function( img, sx, sy, sw, sh, dx, dy, dw, dh ) {
      var
        objs = {};
      objs.canvas = document.createElement('canvas');
      objs.canvas.width = dw;
      objs.canvas.height = dh;
      objs.ctx = objs.canvas.getContext('2d');
      objs.ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      return objs;
    }, // createCanvas

    // Starts the process of creating the base picture canvas and thumbs
    // Once done it renders the watermarks over the pictures
    // Finally launches the callback function
    render: function( callback ) {
      var
        _t = this,
        $img = $('<img>');

      _t.data.callback = callback;

      // The crossOrigin attribute is a CORS settings attribute.
      // Its purpose is to allow images from third-party sites that allow
      // cross-origin access to be used with canvas.
      // Remember enabled cross-origin access in the third-party site,
      // for example if you are using amazon S3 for storage:
      // http://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html#how-do-i-enable-cors
      $img[0].crossOrigin = "Anonymous";
      $img.on('load', function() {
        console.log('Source picture loaded');
        var
          img = this,
          // Exact copy of picture
          picture = _t.createCanvas( img, 0, 0, img.width, img.height, 0, 0, img.width, img.height );
        // picture.pos = _t.calculatePositions( img.width, img.height );
        _t.data.results.push( picture );

        // $('body').append( picture.canvas );

        // Create thumbs
        if ( _t.data.picture.sizes !== null) {
          for (var i = 0; i < _t.data.picture.sizes.length; i++) {
            var
              w = _t.data.picture.sizes[i],
              h = parseInt( (img.height / img.width) * w, 10 );
              picture = _t.createCanvas( img, 0, 0, img.width, img.height, 0, 0, w, h );
            _t.data.results.push( picture );
            // $('body').append( picture.canvas );
            // console.log(_t.data.watermarks);
            // console.log(w, h);
          }
        }
        _t.renderWatermarks();
      }).attr('src', _t.data.picture.url);
    },

    renderWatermarks: function () {
      var
        _t = this;

      for (var i = 0; i < _t.data.watermarks.length; i++) {
        var
          wm = _t.data.watermarks[i],
          $img = $('<img>');

        // The crossOrigin attribute is a CORS settings attribute.
        // Its purpose is to allow images from third-party sites that allow
        // cross-origin access to be used with canvas.
        // Remember enabled cross-origin access in the third-party site,
        // for example if you are using amazon S3 for storage:
        // http://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html#how-do-i-enable-cors
        $img[0].crossOrigin = "Anonymous";
        $img.on('load', function() {

          var
            wm_img = this,
            wm_obj = _t.createCanvas( wm_img, 0, 0, wm_img.width, wm_img.height, 0, 0, wm_img.width, wm_img.height ),
            options= $(this).data('options'),
            scale = options.scale,
            position = options.position,
            w = wm_img.width  * scale,
            h = wm_img.height * scale;

          // $('body').append( wm_obj.canvas );
          for (var j = 0; j < _t.data.results.length; j++) {
            // _t.data.results[j];
            _t.data.results[j].ctx.globalAlpha = options.opacity;
            _t.data.results[j].ctx.drawImage(
              wm_obj.canvas,
              ( _t.data.results[j].canvas.width - w ) * position[0],
              ( _t.data.results[j].canvas.height - h ) * position[1],
              w,
              h
            );
            // $('body').append( _t.data.results[j].canvas );
          }
          _t.data.pending_watermarks--;
          if (_t.data.pending_watermarks === 0) {
            _t.data.callback();
          }
        }).data( 'options', wm.options ).attr('src', wm.url);
      }
    },

    // Returns array of <canvas> elements
    getCanvas: function () {
      var
        _t = this.data.results,
        canvas = [];
      for (var i = 0; i < _t.length; i++) {
        canvas.push(_t[i].canvas);
      }
      return canvas;
    },

    // Returns array of data_urls
    getDataUrls: function ( filetype, quality ) {
      if ( typeof filetype === 'undefined') filetype = 'image/png';
      if ( typeof quality === 'undefined') quality = 1.0;
      var
        data_urls = [],
        canvas = this.getCanvas();
      for (var i = 0; i < canvas.length; i++) {
        data_urls.push(
          canvas[i].toDataURL( filetype, quality)
        );
      }
      return data_urls;
    },

    // Returns array of <img> elements
    getImgs: function ( filetype, quality ) {
      if ( typeof filetype === 'undefined') filetype = 'image/png';
      if ( typeof quality === 'undefined') quality = 1.0;
      var
        imgs = [],
        canvas = this.getCanvas();
      for (var i = 0; i < canvas.length; i++) {
        var
          $img = $('<img>');
        imgs.push(
          $img.attr('src', canvas[i].toDataURL( filetype, quality))
        );
      }
      return imgs;
    },

    // Utils
    getDataUrlFromImg: function ( img ) {
      var
        canvas = document.createElement('canvas');
      // If is JQuery object get DOM element
      if (img instanceof jQuery) img = img[0];
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      return canvas.toDataURL('image/png');
    },

    // Seems that in some situations loading images from cross-domain resources
    // like S3, even setting CORS correctly gives troubles with the web browser
    // cache. To avoid this will add a timestamp to all the images urls to
    // avoid cache issues
    addAntiCacheParam: function( url_or_data ) {
      var
        is_dataurl_regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
      // Is DataURL, we do nothing
      if ( url_or_data.match( is_dataurl_regex ) ) return url_or_data;
      // Is a regualar URL, we add a timestamp
      url_or_data += url_or_data.match( /[\?]/g ) ? '&' : '?' + 't=' + Date.now();
      return url_or_data;
    }

  };

  return Constructor;
})();
