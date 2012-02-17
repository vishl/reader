/*globals _ */
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
$(function(){
    $(".date-delta").each(function(){
        var datestr = $(this).html();
        $(this).html(convDate(datestr));
    });
});

var _linkExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
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
//also escapes html
function linkify(t){
  return text_to_link(
    String(t).replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#x27;")
    .replace(/"/g, "&quot;")
  );
}

//given a dom object, will put embed code in a sibling with class 'embed-hook'
//Huge XSS vulnerabilities here..
function embed(elt){
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
}

/*
 * Input
 * v = validator(
    { name:{presence:true},
      text:{presence:true,
            presence_message:"Please enter text",
            format:/[A-Za-z ]/,
            format_message:"Please only characters and spaces",
            message:"This message will be used in the absence of a specific *_message"
          },
    }
   )
   Output 
    { name:["name is blank"],
      text:["Please enter text", "Please only characters and spaces"]
    }
    Call as v({a:'val', b:'dont val'}, {a:true}) //second argument is optional
*/

function Validator(validations){
  return function(attrs, options){
    var errors={
      __count:0,
      __add : function(k, m){
        if(k in this)
          this[k].push(m);
        else
          this[k] = [m];
        this.__count++;
      }
    };
    var it = validations;
    if(options && options.only) it = options.only;
    for(var k in it){
      var val = validations[k];
      for(var trait in val){
        switch (trait){
          case 'presence':
            if(_.isEmpty(attrs[k])){
              errors.__add(k, val['presence_message'] || val['message'] || (k+ " must be present"));
            }
            break;
          case 'format':
            if(!String(attrs[k]).match(val[trait])){
              errors.__add(k, val['format_message'] || val['message'] || (k+ " is formatted incorrectly"));
            }
            break;

          //TODO more validators
        }
      }
    }
    if(errors.__count) return errors;
  };
}

$.fn.displayModelErrors = function (errors, options){
  var $this = $(this);
  for(var id in errors){
    var $inp = $this.find('#'+id);
    if($inp.length){
      $inp.tooltip({title:errors[id].join(), trigger:'manual'});
      $inp.tooltip('show');
      $inp.addClass('model-error');
    }
  }
  return this;
};

$.fn.removeModelErrors = function(form){
  $(this).find('.model-error').each(function(){
      $(this).removeClass('model-error')
             .tooltip('hide')
             .data('tooltip', null);
  });
};
