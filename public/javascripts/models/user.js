/*global App Backbone _ Validator*/
App.Models.User= Backbone.Model.extend({
    _className: "User",
    subscriptions:{},
    defaults:{
      name:"",
      email:"",
      password:"",
      current_password:"", //for change password
      remember:"",
      reminder:"",
      reminder_day:"",
      reminder_time:"",
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
          if(this.subscriptions[fId]){
            //update
            this.subscription[fId].set({
              user_id:this.id, 
              forum_id:fId,
              forum_title:sub[i].title,
              subscribed:true,
            });
          }else{
            //new
            this.subscriptions[fId] = new App.Models.Subscription({
              user_id:this.id, 
              forum_id:fId,
              forum_title:sub[i].title,
              subscribed:true,
            });
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
      if(this.subscriptions[fId]){
        return this.subscriptions[fId];
      }
      return null;
    }

});
