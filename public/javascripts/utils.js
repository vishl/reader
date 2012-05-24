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
/*globals _ */
var Utils={}; //Utils global namespace object

String.prototype.format = function() {
  var args = arguments;
  return this.replace(/{(\d+)}/g, function(match, number) { 
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
    ;
  });
};

String.prototype.initialCap = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Utils.clearSelection = function() {
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
    }
};

Utils.genId = function(){
  return Math.floor(Math.random()*1000000000);
};

Utils.slice = function(obj){
  var ret = {};
  for(var i=1; i<arguments.length; i++){
    if(arguments[i] in obj){
      ret[arguments[i]] = obj[arguments[i]];
    }
  }
  return ret;
};

Utils.aToO = function(k,v){
  var ret={};
  if(v===undefined) v=[];
  for(var i=0; i<k.length; i++){
    ret[k[i]] = v[i];
  }
  return ret;
};


//returns a function that will execute f after delay, but resets the count every
//time the function is called.  Useful for loading on keyup events when you
//don't want to load during typing.  f can be a function or a string.  If it is
//a string we examine the context when the function is called for a member f
Utils.keyupTimeout = function(f, delay){
  var timeout;
  var ev;
  var self;
  var execAndClear = function(){
    timeout=null;
    f.call(self, ev);
  };
  return function(e){
    ev=e;
    self=this;
    if(_.isString(f)){  //look for it in the current context
      f = this[f];
    }
    if(timeout){
      clearTimeout(timeout);
    }
    timeout = setTimeout(execAndClear, delay);
  };
};

function url_parse(url){
  if(url===undefined){
    url = document.location.href;
  }
  var m = url.match(/(\w+):\/\/([^\/]+)([^?#]+)(\?[^#]*)?#?(.*)/);
  var ret={};
  ret.url = m[0];
  ret.protocol = m[1];
  ret.domain_full = m[2];
  ret.path = m[3];
  ret.args_full = m[4];
  ret.anchor=decodeURIComponent(m[5]);

  var s = ret.domain_full.split(".");
  ret.tld=s[s.length-1];
  ret.domain = s.slice(s.length-2, s.length).join('.');
  if(s.length>2)
    ret.subdomain = s.slice(0,s.length-2).join('.');
  ret.args={};
  if(ret.args_full){
    var args = ret.args_full.slice(1,ret.args_full.length).split("&");
    args.forEach(function(e){
        var a = e.split("=");
        ret.args[decodeURIComponent(a[0])]=decodeURIComponent(a[1]);
    });
  }

  return ret;
}

function getArg(a, s){
  var args = a.split("&");
  for(var i=0; i<args.length; i++){
    var m = args[i].match(/([^=])=(.*)/);
    if(m){
      if(m[1]===s){
        return m[2];
      }
    }
  }
}

var ONE_WEEK = 1000*60*60*24*7; //milliseconds
var HALF_YEAR = 1000*60*60*24*180; //milliseconds
var Days = ["Sun","Mon","Tue","Wed","Thurs","Fri","Sat"];
var Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function convDate(datestr){
  var date= new Date(datestr); //not sure why Date(datestr) doesn't work
  var today = new Date();
  var newdate = "";
  var h = date.getHours();
  var m = date.getMinutes();
  var ampm = h>=12?"PM":"AM";
  if(h>12)
    h-=12;
  if(h===0)
    h=12;

  if((date.getFullYear() === today.getFullYear()) &&
    (date.getMonth() === today.getMonth()) &&
    (date.getDate() === today.getDate())){
    newdate = h+":"+(m<10?"0":"")+m+" "+ampm;
  }else if(today-date < ONE_WEEK){
    newdate = Days[date.getDay()]+" "+h+" "+ampm;
  }else if(today-date < HALF_YEAR){
    newdate = Months[date.getMonth()]+" "+date.getDate();
  }else{
    newdate = Months[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear();
  }
  return newdate;
}

$.fn.convDate = function(){
  var $this = $(this);
  var datestr;
  if($this.data("orig-date")){
    datestr = $this.data("orig-date");
  }else{
    datestr = $this.html();
    $this.data("orig-date", datestr);
  }
  $this.html(convDate(datestr));
};

var _linkExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;()*%]*[-A-Z0-9+&@#\/%=~_|()*])/ig;
function is_link(text){
  if(text.match(_linkExp)){
    return true;
  }else{
    return false;
  }
}
function text_to_link(text) {
  if(text){
    return text.replace(_linkExp,"<a href='$1' target='_blank'>$1</a>");
  }else{
    return "";
  }
}

//given text will replace any text that looks like a link with html for a link
//also escapes html and turns \n into <br>
function linkify(t){
  return text_to_link(
    String(t).replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#x27;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>")
  );
}


//Singleton helper object
var Singleton = function(){
};
Singleton.prototype = {
  _singletons:{},
  destroy:function(className){
    delete this._singletons[className];
  },

  create:function(className, obj){
    if(this._singletons[className]){
      throw className+" object already exists";
    }else{
      if(obj){
        this._singletons[className] = obj;
      }else{
        throw "Object must evaluate to true, got:" + obj;
      }
    }
  },

  get:function(className){
    return this._singletons[className];
  },
};

