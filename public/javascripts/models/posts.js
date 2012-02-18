/*global App Backbone _ Validator*/
App.Models.Post = Backbone.Model.extend({
    //introspection
    _class:'Post',
    _members:['comments'],

    urlRoot:function(){return '/forums/'+this.forum.id+'/posts';},
    forum:null,
    comments:null,
    latest_post:null,
    latest_comment:null,
    defaults:{
      name:"",
      content:"",
      comment:"",
    },

    //TODO override parse/constructor to include comments
    //right now it only works if we create a new model
    initialize: function(attrs, options){
      if(options && options.forum) this.forum = options.forum;
      if(attrs.forum){
        this.forum = attrs.forum;
        this.unset("forum");
      }
      var c = this.get("comments");
      this.comments=new App.Collections.Comments(null,{post:this});
      if(c){
        this.comments.add(c, {silent:true});
        this.comments.initAll();
        this.unset("comments");
      }else{
      }
    },

    validate:Validator(
      { name:{presence:true, message:"Please enter your name"},
        content:{presence:true, message:"Please put your post here, comments are optional"}
      }),

    parse: function(resp, xhr){
      console.log("parsing post");
      var ret = resp;
      if(ret.post) ret = ret.post;  //possibly inside a container
      if(ret.comments && this.comments){
        //if there is already a comment object, add the comments; otherwise do it in the constructor
        this.comments.merge(ret.comments); 
        delete ret.comments;
      }
      return ret;
    },

});

App.Collections.Posts = Backbone.Collection.extend({
    model:App.Models.Post,
    comparator:function(x,y){return y.get("timestamp")-x.get("timestamp");},
    forum:null,
    urlRoot:function(){return '/forums/'+this.forumSid+'/posts';},

    initialize:function(models, options){
      _.bindAll(this, 'initModel');
      this.forum = options.forum;
      this.bind('add', this.initModel, this);
    },

    initModel:function(model, context, options){
      console.log("init model "+model.id);
      model.forum = this.forum;
    },

    initAll:function(){
      var self=this;
      this.each(this.initModel);
    }
});
