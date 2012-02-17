/*global App Backbone _ JST embed*/
App.Views.Post = Backbone.View.extend({
    post:null,
    className:'post-area', //the class of the containing <div>

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.commentsView = new App.Views.Comments({model:this.model.comments});
      this.commentCreateView = new App.Views.CommentCreate({post:this.model});
      this.commentCreateView.bind("posted", this.createComment, this);
      this.model.bind("change", this.render);
    },

    render: function(){
      console.log("render post");
      $(this.el).html(JST['posts/show']({post:this.model}));
      this.$el.find('#comment-area').append(this.commentsView.render().el);
      this.$el.find('#comment-area').append(this.commentCreateView.render().$el);
      embed(this.$el.find('.content .linkify').get(0));
      //TODO insert postframe
      return this;
    },

    createComment: function(comment){
      this.commentsView.model.add(comment);
    }
});

App.Views.Posts = Backbone.View.extend({
    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.model.bind("reset", this.render, this);
      this.model.bind("add", this.addPost, this);
      //TODO bind things so new posts show up correctly
    },

    postViews:[],
    render: function(){
      console.log("render posts");
      this.$el.html('');
      var self = this;
      this.postViews=[];
      _.each(this.model.models, function(post){
          var p = new App.Views.Post({model:post});
          self.postViews.push(p);
          p.render();
          self.$el.append(p.el);
      });
      return this;
    },

    addPost: function(model, collection, options){
      var i = options.index;
      console.log("insert post "+model.id+" at "+i);
      var elt = this.$el.find('.post-area')[i];
      var view = new App.Views.Post({model:model}); //renders on creation
      view.render();
      view.$el.css('display','none');
      if(elt!==undefined){
        $(elt).before(view.el);
      }else{
        this.$el.append(view.el);
      }
      view.$el.fadeIn('slow');
    }
});

App.Views.PostCreate = Backbone.FormView.extend({
    forum:null,

    initialize:function(){
      _.bindAll(this);  //all of my functions should be called with me as 'this'.. because javascript is retarded
      this.forum = this.options.forum;
      this.model = new App.Models.Post(null, {forum:this.options.forum});
    },

    render:function(){
      console.log("render post create");
      var self = this;
      self.$el.html(JST['posts/new']({post:this.model}));
      self.$el.find('#create-post-area').collapse({toggle:false});
      self.$el.find('#postheader').click(function(){
          self.$el.removeModelErrors();
          $(this).siblings('#create-post-area').collapse('toggle');
      });
      this.delegateEvents(); //have to call this explicity if the form gets rerendered
      return this;
    },

    beforePost:function(){
      //validate the user name
      if(!this.model.set('name',App.userCredentials.get('name'), {only:{'name':true}})){
        this.$el.trigger("promptName");
        return false;
      }
      return true;
    },

    afterSave : function(){
      this.model = new App.Models.Post(null, {forum:this.forum});
      this.$el.find('#create-post-area').collapse('hide');
      this.$el.find('#content').val("");
      this.$el.find('#comment').val("");
      return this;
    }
});

