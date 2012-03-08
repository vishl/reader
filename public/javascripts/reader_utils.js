/*globals Utils getArg*/
//given a dom object, will put embed code in a sibling with class 'embed-hook'
//Huge XSS vulnerabilities here..
Utils.embed = function(elt){
  var a = $(elt).find('a');
  var t = a.length? a.attr('href') : "";
  var embedCode=null;
  var h=null;
  var m;
  //youtube
  m = t.match(/youtube.com\/watch[^?]*?([^#]*)/);
  if(m){
    var vid = getArg(m[1], 'v');
    if(vid){
      embedCode='<iframe width="560" height="315" src="http://www.youtube.com/embed/'+vid+'?wmode=transparent" frameborder="0" allowfullscreen></iframe>';
      h=315;
    }
  }
  //image
  if(!embedCode){
    m = t.match(/http:\/\/\S*(\.jpg|\.gif|\.png|\.jpeg)/);
    if(m){
      embedCode='<a href="'+m[0]+'"><img src="'+m[0]+'"></a>';
    }
  }
  //TODO more embeds!

  //TODO probably don't want to embed on mobile
  if(embedCode){
    var embedLoc = $(elt).siblings('.embed-hook');
    embedLoc.append(embedCode);
    if(h) embedLoc.css('height', h);
  }
};
