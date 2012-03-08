/*global App Backbone _ Validator Utils*/

App.Models.Subscription = Backbone.Model.extend({
  _className:"Subscription",
  urlRoot:"/subscriptions",

  defaults:{
    user_id:null,
    forum_id:null,
    forum_title:"",
    subscribed:false,
  },

  initialize:function(){
    if(this.attributes.subscribed){
      this.set("id", this.attributes.forum_id);
      //otherwise destroy won't work
    }
  },

  subscribe:function(){
    this.save();
  },

  unsubscribe:function(){
    var self=this;
    this.destroy({
      success:function(model, resp){
        self.set({"subscribed":false, "id":null});
      }
    });
  }



});
