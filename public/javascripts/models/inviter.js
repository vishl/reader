/*global App Backbone _ Validator*/
App.Models.Inviter= Backbone.Model.extend({
  _className:"Inviter",
  urlRoot:function(){return '/forums/'+this.forum.id+'/invite';},
  forum:null,

  defaults:{
    addresses:[],
    forum_id:"",
  },

  initialize:function(attrs, options){
    this.forum = options.forum;
    this.set("forum_id", this.forum.id);
  },

});
