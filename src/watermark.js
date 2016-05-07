
// data URI - MDN https://developer.mozilla.org/en-US/docs/data_URIs
// The "data" URL scheme: http://tools.ietf.org/html/rfc2397
// Valid URL Characters: http://tools.ietf.org/html/rfc2396#section2

// Positions
// LT -> left top
// LC -> left center
// LB -> left bottom
// RT -> right top
// RC -> right center
// RB -> right bottom
// CT -> center top
// CC -> center center
// CB -> center bottom

var Watermark = (function() {

  function Constructor(user_settings) {
    // Internal data
    this.data = {
      picture: {
        sizes: null
      }, // Source picture
      results: [], // Resulting watermarker images
      watermarks: [], // Watermarks to be applied
      pending_watermarks: 0
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
      _t.picture.url = url_or_data;
      if (typeof sizes !== 'undefined') _t.picture.sizes = sizes;
      return this; // Chainning
    }, // setPicture

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

      wm.url = url_or_data;
      wm.options = $.extend(default_options, user_options);

      _t.data.watermarks.push( wm );

      return this;
    },

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

    getCanvas: function () {
      return this.data.picture.canvas;
    },

    getDataUrl: function ( filetype ) {
      if ( typeof filetype === 'undefined') filetype = 'image/png';
      // return this.data.picture.canvas.toDataURL( filetype, 1.0);
    },

    getImg: function ( filetype, quality ) {
      var
        img = document.createElement('img');
      img.src = this.getDataUrl( filetype, quality );
      return img;
    },

    render: function() {
      var
        _t = this,
        $img = $('<img>');

      $img.on('load', function() {
        console.log('Source picture loaded');
        var
          img = this,
          // Exact copy of picture
          picture = _t.createCanvas( img, 0, 0, img.width, img.height, 0, 0, img.width, img.height );
        // picture.pos = _t.calculatePositions( img.width, img.height );
        _t.data.results.push( picture );

        $('body').append( picture.canvas );

        // Create thumbs
        if ( _t.data.picture.sizes !== null) {
          for (var i = 0; i < _t.data.picture.sizes.length; i++) {
            var
              w = _t.data.picture.sizes[i],
              h = parseInt( (img.height / img.width) * w, 10 );
              picture = _t.createCanvas( img, 0, 0, img.width, img.height, 0, 0, w, h );
            // picture.pos = _t.calculatePositions( w, h );
            _t.data.results.push( picture );

            // $('body').append( picture.canvas );
            // console.log(_t.data.watermarks);
            // console.log(w, h);
          }
        }
        _t.renderWatermarks();
      }).attr('src', _t.data.picture.url);
    },

    renderWatermarks() {
      var
        _t = this;

      for (var i = 0; i < _t.data.watermarks.length; i++) {
        var
          wm = _t.data.watermarks[i],
          $img = $('<img>');

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
          // console.log( $(this).data('scale') );

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
            $('body').append( _t.data.results[j].canvas );
          }
          _t.data.pending_watermarks--;
          if (_t.data.pending_watermarks === 0) {
            _t.onRenderDone();
          }
        }).data( 'options', wm.options ).attr('src', wm.url);
      }

      // for (var i = 0; i < _t.data.results.length; i++) {
      //   _t.data.results[i]
      // }

      /*$img.on('load', function() {
        wm = _t.createCanvas( this );
        var
          w = wm.canvas.width * scale,
          h = wm.canvas.height * scale;

        _t.data.picture.ctx.drawImage(
          wm.canvas,
          ( _t.data.picture.canvas.width - w ) * position[0],
          ( _t.data.picture.canvas.height - h ) * position[1],
          w,
          h
        );

        _t.data.pending_wm--;
        if (_t.data.pending_wm === 0) {
          _t.done();
        }
      }).attr('src', url_or_data);*/
    },

    onRenderDone: function() {
      console.log('All watermarking done!');
    }

  };

  return Constructor;
})();
