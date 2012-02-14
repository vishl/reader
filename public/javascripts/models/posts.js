App.Models.Post = Backbone.Model.extend({
    urlRoot:function(){return '/forums/'+this.forum.get("sid")+'/posts';},
    forum:null,

    //TODO override parse/constructor to include comments
    //right now it only works if we create a new model
    initialize: function(attrs, options){
      if(options) this.forum = options.forum;
      var c = this.get("comments")
      this.comments=new App.Collections.Comments(null,{post:this})
      if(c){
        this.comments.add(c, {silent:true});
        this.comments.initAll();
        this.unset("comments");
      }else{
      }
    },

    parse: function(resp){
      var ret = resp.post;
      if(ret.comments){
        this.comments.add(ret.comments, {silent:true});
        this.comments.initAll();
        delete ret.comments;
      }
      return ret;
    }
})

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
      this.each(this.initModel)
    }
})
