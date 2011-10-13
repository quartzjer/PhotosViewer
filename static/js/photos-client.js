/* Generic log function for debugging. */
var log = function(msg) { if (console && console.log) console.debug(msg); };
var baseUrl = '';//'http://localhost:8042';

function photoApp() {
    // set the params if not specified
    var offset = 0;
    var limit = 200;
    var $photosList = $("#main");

    var HTMLFromPhotoJSON = function(photos) {
        var p, title, photoHTML = "";
        for (var i in photos) {
      p = photos[i];
      if(!p.photos) continue;
      title = p.name ? p.name : "";
      for (var j in p.photos)
      {
          if(p.photos[j].indexOf("blank_") > 0) continue;
          if(p.photos[j].indexOf("default_profile") > 0) continue;
          photoHTML += '<div class="box"><div id="' + p._id + j + '" class="photo"><img src="' + p.photos[j] + '" style="max-width:100px" /><div class="basic-data">'+title+'</div></div></div>';
      }
  }
        return photoHTML;
    };

    var getPhotosCB = function(photos) {
        var p, title, photoHTML = "";

  // clear the list
  $photosList.html('');

  // populate the list with our photos
  if (photos.length == 0) $photosList.append("<div>Sorry, no friend photos found!</div>");

  $photosList.append(HTMLFromPhotoJSON(photos));

        $photosList.imagesLoaded(
            function(){
                $photosList.masonry(
                    {
                        itemSelector : '.photo'
                    });
            });
        offset += photos.length;
    };

    var getMorePhotosCB = function(photos) {
        var $newElems;
        if (photos.length == 0) return;

  $newElems = $(HTMLFromPhotoJSON(photos));
        $photosList.append($newElems);

        // ensure that images load before adding to masonry layout
        $newElems.imagesLoaded(
            function(){
                $photosList.masonry( 'appended', $newElems, true );
            });
        offset += limit;
    };

    var sort = '\'{"timestamp":-1}\'';

    var loadMorePhotosHandler = function() {
        $.getJSON( baseUrl + '/Me/contacts/',
        {
            'offset':offset,
            'limit':limit,
            'fields':'{"name":1,"photos":1}'
        }, getMorePhotosCB);
    };

    // init
    $.getJSON( baseUrl + '/Me/contacts/',
    {
        'offset':offset,
        'limit':limit,
        'fields':'{"name":1,"photos":1}'
    }, getPhotosCB);

    $("#moarphotos").click( loadMorePhotosHandler );

    // TODO: make this keep in sync!
}

/* jQuery syntactic sugar for onDomReady */
$(function() {
      var photos = photoApp();
});
