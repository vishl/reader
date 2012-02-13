App.Views.Comment = Backbone.View.extend({

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.model.bind("change", this.render)
      this.render();
    },

    render: function(){
      console.log("render comment")
      $(this.el).html(JST['comments/show']({a:"fdsa",n:this.model.get("created_at"),comment:this.model}))
      return this;
    }

})

App.Views.Comments = Backbone.View.extend({
    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.model.bind("reset", this.render)
      this.render();
    },

    render: function(){
      console.log("render comments")
      var self = this;
      this.$el.html('');
      _.each(this.model.models, function(comment){
          var p = new App.Views.Comment({model:comment})
          self.$el.append(p.el)
      })
      return this;
    }
})

App.Views.CommentPost = Backbone.View.extend({
    post:null,
    events:{
      "submit form":"postComment"
    },

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.post = this.options.post;
      this.model = new App.Models.Comment(null, {post:this.post})
      this.render();
    },

    render:function(){
      console.log("render comment post")
      $(this.el).html(JST['comments/post']({comment:this.model}));
      //enable toggling
      this.$el.find('.comment-post-form').collapse({toggle:false})
      this.$el.find('.comment-post-header').click(function(){
          $(this).siblings('.comment-post-form').collapse('toggle')
      })
      return this;
    },

    postComment: function(e){
      console.log("post");
      var self=this;
      this.model.save(
        {
          name: this.$el.find('#comment_name').val(),
          content: this.$el.find('#comment_content').val(),
        },
        {
          success:function(model, resp){
            console.log("success")
            console.log(resp)
            if(resp.has_error){
              //TODO create notice
            }else{
              //the parent will handle posting the comment
              self.trigger("posted", self.model)
              self.reset();
            }
          },
          error: function(){
            console.log("error")
            //TODO something went wrong
          }
        }
      )
      //e.preventDefault();
      return false;
    },

    reset: function(){
      console.log("reset");
      //don't delete the model, it was probably posted somewhere else
      this.model = new App.Models.Comment()
      //TODO do we need to unbind the collapse stuff?
      return this.render()
    }

})
