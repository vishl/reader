/*
Copyright 2012 Vishal Parikh                                             
This file is part of Freader.                                            
Freader is free software: you can redistribute it and/or modify          
it under the terms of the GNU General Public License as published by     
the Free Software Foundation, either version 3 of the License, or        
(at your option) any later version.                                      
                                                                         
Freader is distributed in the hope that it will be useful,               
but WITHOUT ANY WARRANTY; without even the implied warranty of           
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the            
GNU General Public License for more details.                             
                                                                         
You should have received a copy of the GNU General Public License        
along with Freader.  If not, see <http://www.gnu.org/licenses/>.         
*/
/*globals Utils getArg*/
//given a dom object, will put embed code in a sibling with class 'embed-hook'
//Huge XSS vulnerabilities here..
Utils.embed = function(elt){
  var a = $(elt).find('a');
  var t = a.length? a.attr('href') : "";
  var embedCode=null;
  var h=null;
  var m;
  var embedLoc = $(elt).siblings('.embed-hook');
  //youtube
  m = t.match(/youtube.com\/watch[^?]*?([^#]*)/);
  if(m){
    var vid = getArg(m[1], 'v');
    if(vid){
      /*
      embedCode='<iframe width="560" height="315" src="http://www.youtube.com/embed/'+vid+'?wmode=transparent" frameborder="0" allowfullscreen></iframe>';
      h=315;
      */
     $(a).ytEmbed({target:embedLoc});
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
    embedLoc.append(embedCode);
    if(h) embedLoc.css('height', h);
  }
};
