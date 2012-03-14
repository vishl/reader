/*global App Backbone _ Validator*/
App.Models.User= Backbone.Model.extend({
    _className: "User",
    subscriptions:new App.Collections.Subscriptions(),
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
      this.updateSubscriptions(this.attributes.subscriptions);
    },

    parse:function(resp,xhr){
      this.updateSubscriptions(resp.subscriptions);
      return resp;
    },

    updateSubscriptions:function(sub){
      if(sub){
        for(var i=0; i<sub.length; i++){
          var fId = sub[i].id;
          if(this.subscriptions.get(fId)){
            //update
            this.subscriptions.get(fId).set({
              user_id:this.id, 
              forum_id:fId,
              forum_title:sub[i].title,
              subscribed:true,
            });
          }else{
            //new
            this.subscriptions.add(new App.Models.Subscription({
              user_id:this.id, 
              forum_id:fId,
              forum_title:sub[i].title,
              subscribed:true,
            }));
          }
        }
      }
    },

    signedIn:function(){
      //TODO this is a dumb way to detect sign in
      if(this.id && this.id.length){
        return true;
      }
      return false;
    },

    subscribedTo:function(fId){
      var sub = this.attributes.subscriptions;
      if(!sub || !sub.length){
        return false;
      }
      for(var i=0; i<sub.length; i++){
        if(sub[i].id==fId){
          return true;
        }
      }
      return false;
    },

    subscription:function(fId){
      if(this.subscriptions.get(fId)){
        return this.subscriptions.get(fId);
      }
      return null;
    },

    clearPasswords:function(){
      this.attributes.password="";
      this.attributes.current_password="";
    },

});

App.Collections.Users = Backbone.Collection.extend({
  model:App.Models.User,
});
