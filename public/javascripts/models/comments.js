App.Models.Comment = Backbone.Model.extend({
    //introspection
    _class:'Comment',
    _members:[],

    urlRoot:function(){return '/forums/'+this.post.forum.id+'/posts/'+this.post.id+'/comments';},
    post:null,

    initialize:function(attrs, options){
      if(options) this.post = options.post;
    },
    parse:function(resp){
      return resp.comment;
    },
    validate:Validator(
      { name:{presence:true, message:"Please enter your name"},
        content:{presence:true, message:"Please enter a comment"}
      }),

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

//this is really just to keep track of the newest comment that we have
App.Collections.AllComments = Backbone.Collection.extend({
    model:App.Models.Comment,
    comparator:function(x,y){return x.get("timestamp")-y.get("timestamp");},
    //no urlroot because this model should never request anything from the
    //server
    initialize:function(models,options){
    },

    addList:function(collection){
      //any time a collection is added, listen to its add and remove events
      //TODO merge with collection
      collection.bind("add", this.add);
    },


})

