
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
      picture: {},
      watermarks: [],
      pending_wm: 0,
      pos: {}
    };
    // Default settings
    this.settings = {};
    $.extend(true, this.settings, user_settings);

  }

  Constructor.prototype = {

    // Sets base pìcture to work with
    setPicture: function( url_or_data ) {
      var
        _t = this,
        $img = $('<img>');

      $img.on('load', function() {
        // console.log('Source picture loaded');
        _t.calculatePositions( this.width, this.height );
        _t.data.picture = _t.createCanvas( this );
        // $('body').append( $(_t.data.picture.canvas) );
      }).attr('src', url_or_data);

      return _t;
    }, // setPicture

    addWatermark: function( url_or_data, position, scale ) {
      var
        _t = this,
        $img = $('<img>'),
        wm;

      _t.data.pending_wm++;

      if (typeof position === 'undefined') position = [0.5, 0.5];
      if (typeof scale === 'undefined') scale = 1;

      $img.on('load', function() {
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

        // $('body').append( $(wm.canvas) );
        // $('body').append( $(_t.data.picture.canvas) );
      }).attr('src', url_or_data);
      return _t;
    },

    createCanvas: function( img ) {
      var
        objs = {};
      objs.canvas = document.createElement('canvas');
      objs.canvas.width = img.width;
      objs.canvas.height = img.height;
      objs.ctx = objs.canvas.getContext('2d');
      objs.ctx.drawImage(img, 0, 0, img.width, img.height);
      return objs;
    }, // createCanvas

    calculatePositions: function( w, h ) {
      var _t = this.data.pos;
      _t.LT = {}; _t.LT.x = 0;   _t.LT.y = 0;
      _t.CT = {}; _t.CT.x = w/2; _t.CT.y = 0;
      _t.RT = {}; _t.RT.x = w;   _t.RT.y = 0;

      _t.LC = {}; _t.LC.x = 0;   _t.LC.y = h/2;
      _t.CC = {}; _t.CC.x = w/2; _t.CC.y = h/2;
      _t.RC = {}; _t.RC.x = w;   _t.RC.y = h/2;

      _t.LB = {}; _t.LB.x = 0;   _t.LB.y = h;
      _t.CB = {}; _t.CB.x = w/2; _t.CB.y = h;
      _t.RB = {}; _t.RB.x = w;   _t.RB.y = h;
    }, // calculatePositions

    getCanvas: function () {
      return this.data.picture.canvas;
    },

    getDataUrl: function ( filetype ) {
      if ( typeof filetype === 'undefined') filetype = 'image/png';
      return this.data.picture.canvas.toDataURL( filetype, 1.0);
    },

    getImg: function ( filetype, quality ) {
      var
        img = document.createElement('img');
      img.src = this.getDataUrl( filetype, quality );
      return img;
    },

    done: function() {
      console.log('All watermarking done!');
    }

  };

  return Constructor;
})();
