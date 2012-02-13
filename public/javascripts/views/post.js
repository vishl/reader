App.Views.Post = Backbone.View.extend({
    post:null,

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.commentsView = new App.Views.Comments({model:this.model.comments});
      this.commentPostView = new App.Views.CommentPost({post:this.model});
      //this.commentPostView.bind("posted", this.postComment, this);
      this.model.bind("change", this.render)
      this.render();
    },

    render: function(){
      console.log("render post");
      $(this.el).html(JST['posts/show']({post:this.model}))
      this.$el.find('#comment-area').append(this.commentsView.render().el)
      this.$el.find('#comment-area').append(this.commentPostView.render().$el)
      return this;
    },

    postComment: function(comment){
      this.commentsView.model.add(comment);
    }
})

App.Views.Posts = Backbone.View.extend({
    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.postCreateView = new App.Views.PostCreate()
      this.model.bind("reset", this.render)
      //TODO bind things so new posts show up correctly
    },

    postViews:[],
    render: function(){
      console.log("render posts");
      this.$el.html(this.postCreateView.render().el)
      var self = this;
      _.each(this.model.models, function(post){
          var p = new App.Views.Post({model:post})
          self.postViews.push(p);
          self.$el.append(p.el)
      })
      return this;
    }
})

App.Views.PostCreate = Backbone.View.extend({
    events:{
      "form submit":"createPost"
    },

    initialize:function(){
      _.bindAll(this,'render');
      this.model = new App.Models.Post()
    },

    render:function(){
      console.log("render post create")
      this.$el.html(JST['posts/new']({post:this.model}))
      this.$el.find('#create-post-area').collapse({toggle:false})
      this.$el.find('#postheader').click(function(){
          $(this).siblings('#create-post-area').collapse('toggle')
      })
      return this;
    },

    createPost:function(){

    },

    reset:function(){
      this.model = new App.Models.Post()
      //TODO do we need to unbind the collapse stuff?
      return this.render()
    }
})

