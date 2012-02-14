App.Models.Comment = Backbone.Model.extend({
    //objName:'comment',  //causes saves to pass attributes as 'comment[attr]' instead of 'attr'
    urlRoot:function(){return '/forums/'+this.post.forum.id+'/posts/'+this.post.id+'/comments';},
    post:null,
    initialize:function(attrs, options){
      if(options) this.post = options.post;
    },
    parse:function(resp){
      return resp.comment;
    }

})

App.Collections.Comments = Backbone.Collection.extend({
    model:App.Models.Comment,
    comparator:function(x,y){return x.get("timestamp")-y.get("timestamp");},
    post:null,
    urlRoot:function(){return '/forums/'+this.forumSid+'/posts';},
    initialize:function(models,options){
      _.bindAll(this, 'initModel');
      console.log("init comments with post id " + options.post.id);
      this.post = options.post;
    },

    initModel:function(model, context, options){
      console.log("init comment model "+model.id);
      model.post = this.post;
    },

    initAll:function(){
      var self=this;
      this.each(this.initModel)
    }
})
