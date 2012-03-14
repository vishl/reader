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
/*global App Backbone _ JST*/
App.Views.ForumInvite = Backbone.FormView.extend({

  initialize:function(){
    _.bindAll(this);
    this.forum = this.options.forum;
    this.model = new App.Models.Inviter({},{forum:this.forum});
  },

  render:function(){
    this.$el.html(JST['forums/invite']());
  },

  beforePost:function(attrs, errors){
    if(_.isUndefined(attrs.addresses)){
      return false;
    }else{
      var addrs = this.getEmails(attrs.addresses);
      console.log(addrs);
      if(addrs.invalid.length){
        //TODO prompt invalid addresses
        //App.notifier.notify("invalid addresses");
        errors["addresses"] = ["Invalid addresses"];
        return false;
      }else{
        if(!addrs.valid.length){
          errors["address"] = ["Please an email address"];
          return false;
        }else if(addrs.valid.length>20){
          errors["addresses"] = ["You can only invite 20 people at a time"];
          return false;
        }else{
          attrs["addresses"] = JSON.stringify(_.pluck(addrs.valid, "info"));
          console.log(attrs["addresses"]);
        }
      }
    }

    return true;
  },

  afterSave:function(){
    this.$('textarea').val("");
  },

  getEmails:function(text){
    var valid = [];
    var invalid=[];
    var i;
    var info;
    var arr = text.split(/[,;\n]+/);
    for (i in arr){
      info = this.parseInfo(arr[i]);
      if(info.valid){
        valid.push(info);
      }else{
        invalid.push(info);
      }
    }
    return {valid:valid, invalid:invalid};
  },

  parseInfo:function(str){
    //possible formats:
    //first last <email@site.com>
    //"first last" <email@site.com>
    //email@site.com
    var info={valid:false, name:"", email:""};
    var m = str.match(/\"\s*([^"]+)\"\s+<(.*)>\s*$/);
    if(m!==null){
      info.name=$.trim(m[1]);
      info.info=$.trim(m[2]);
      info.valid=true;
    }else if((m = str.match(/^\s*([^"]+)\s+<(.*)>\s*$/))!==null){
      info.name=$.trim(m[1]);
      info.info=$.trim(m[2]);
      info.valid=true;
    }else if((m = str.match(/^\s*(\S+)@(\S+)\s*$/))!==null){
      info.name=$.trim(m[1]);
      info.info=$.trim(m[0]);
      info.valid=true;
    }else{
    }
    return info;
  }
  
});
