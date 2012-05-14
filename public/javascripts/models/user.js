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
/*global App Backbone _ Validator*/
App.Models.User= Backbone.Model.extend({
    _className: "User",
    defaults:{
      name:"",
      email:"",
      password:"",
      current_password:"", //for change password
      remember:"",
      reminder:"",
      reminder_day:"Daily",
      reminder_time:"2",
      signup:false, //this is a hack
    },

    urlRoot:'users',
    url:function(){
      if(this.isNew()){
        if(this.attributes.signup){
          return this.urlRoot;
        }else{
          return 'signin';
        }
      }
      return this.urlRoot+'/'+this.id;
    },

    validate:Validator({ 
        name:{presence:true, 
              presence_message:"Please enter your name",
              length:[0,30],
              format:/^[a-zA-Z\u00C0-\u00FF \-]*$/,   //the unicode range matches special chars such as é
              format_message:"Letters, spaces and hyphens only"
        },
        email:{presence:true,
               presence_message:"Please enter your email",
               format:"email",
        },
        password:{length:[6,40], message:"At least 6 characters"},
    }),

    initialize:function(){
    },

    parse:function(resp,xhr){
      this.subscriptions().merge(resp.subscriptions, {parse:true});
      return resp;
    },

    toJSON:function(){
      var ret = _(_.clone(this.attributes)).extend({
          'authenticity_token' : $('meta[name="csrf-token"]').attr('content')
      });
      ret.settings = JSON.stringify(ret.settings);

      return  ret;
    },

    get_setting:function(k){
      if(this.attributes.settings){
        return this.attributes.settings[k];
      }
    },

    set_setting:function(k,v,f){
      this.attributes.settings[k] = v;
      this.trigger("change:settings");
      this.save(null,{success:f, only:[]});
    },

    subscriptions:function(){
      if(!this._subscriptions){this._subscriptions = new App.Collections.Forums();}
      return this._subscriptions;
    },

    signedIn:function(){
      //TODO this is a dumb way to detect sign in
      if(this.id && this.id.length){
        return true;
      }
      return false;
    },

    subscribedTo:function(fId){
      return this.subscriptions().get(fId);
//      var sub = this.attributes.subscriptions;
//      if(!sub || !sub.length){
//        return false;
//      }
//      for(var i=0; i<sub.length; i++){
//        if(sub[i].id==fId){
//          return true;
//        }
//      }
//      return false;
    },

//    subscription:function(fId){
//      if(this.subscriptions.get(fId)){
//        return this.subscriptions.get(fId);
//      }
//      return null;
//    },

    clearPasswords:function(){
      this.attributes.password="";
      this.attributes.current_password="";
    },

});

App.Collections.Users = Backbone.Collection.extend({
  model:App.Models.User,
});
