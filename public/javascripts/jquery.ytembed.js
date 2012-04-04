(function(){
  var callbacks = {};

  $.fn.ytEmbed = function (options){
    if(options.callback){
      if(callbacks[options.callback]){
        callbacks[options.callback].call(this, options.data);
      }
    }else{
      var $this = $(this);
      var href = $this.attr('href') || "";
      var target = options.target;

      var m = href.match(/youtube.com\/watch[^?]*?([^#]*)/);
      if(m){
        var vid = getArg(m[1], 'v');
        if(vid){
          //insert image
          var container = $('<div>');
          var img = $('\
                      <div style="position:relative;cursor:pointer;display:inline-block;">\
                      <img src="http://img.youtube.com/vi/'+vid+'/0.jpg">\
                      <img src="/images/play.png" style="position:absolute;margin:auto;top:0;bottom:0;left:0;right:0;opacity:.7;">\
                      </div>\
                      ');
          //TODO mobile
          var embed=$('\
                        <div style="position:relative; display:inline-block">\
                          <div class="ytembed-close" style="position:absolute;right:-20px;top:0px;cursor:pointer;">&times;</div>\
                          <iframe width="560" height="315" src="http://www.youtube.com/embed/'+vid+'?wmode=transparent&autoplay=1" frameborder="0" allowfullscreen></iframe>\
                        </div>\
                      ');
          var title = $('<div class="ytembed-title">');
          var desc = $('<div class="ytembed-desc">');
          if(target){
            target.html(container);
          }else{
            $this.after(container);
          }
          container.append(title)
            .append(img)
            .append(desc);

          desc.expandyDiv({height:"100px"});

          callbacks[vid] = function(data){
            title.html(data.entry.title.$t);
            desc.append(linkify(data.entry.media$group.media$description.$t));
          };

          container.on("click", ".ytembed-close", function(){
            //replace iframe with image
            embed.remove();
            img.show();
          });
          //replace image with iframe
          img.click(function(){
            img.hide();
            img.after(embed);
          });

          //dynamically retrieve data
          var s = document.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.src = 'https://gdata.youtube.com/feeds/api/videos/'+vid+'?v=2&alt=json-in-script&callback=YtEmbedCallback&format=5';
          var x = document.getElementsByTagName('script')[0];
          x.parentNode.insertBefore(s, x);



          //TODO set height
          //h=315;
        }
      }
    }
  };
}());

function YtEmbedCallback(data){
  $().ytEmbed({callback:data.entry.media$group.yt$videoid.$t, data:data});
}
