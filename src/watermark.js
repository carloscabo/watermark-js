
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
        _t = this;
        $img = $('<img>');

      $img.on('load', function() {
        // console.log('Source picture loaded');
        _t.calculatePositions( this.width, this.height );
        _t.data.picture = _t.createCanvas( this );

        $('body').append( $(_t.data.picture.canvas) );
      }).attr('src', url_or_data);


    }, // setPicture

    addWatermark: function( img, position ) {
      if (typeof postion === 'undefined') position = 'CC';


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

      console.log(_t);
    } // calculatePositions

  };

  return Constructor;
})();
