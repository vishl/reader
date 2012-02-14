App.Views.Forum = Backbone.View.extend({

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.model = new App.Models.Forum({id:this.options.sid})
      this.postsView = new App.Views.Posts({model:this.model.posts});
      this.postCreateView = new App.Views.PostCreate({forum:this.model})

      this.postCreateView.bind("posted", this.newPost, this)
      this.model.bind("change", this.render)
      this.model.fetch();
      this.render();
    },

    render: function(){
      console.log("render forum")
      $(this.el).html(JST['forums/show']({title:this.model.get("title")}))
      this.$el.append(this.postCreateView.render().el)
      this.$el.append(this.postsView.render().el)
      return this;
    },

    newPost: function(posts){
      this.postsView.model.add(posts);
    }

})

