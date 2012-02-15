App.Views.Comment = Backbone.View.extend({

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.model.bind("change", this.render)
    },

    render: function(){
      console.log("render comment")
      $(this.el).html(JST['comments/show']({comment:this.model}))
      return this;
    }

})

App.Views.Comments = Backbone.View.extend({
    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.model.bind("reset", this.render)
      this.model.bind("add", this.render)
    },

    render: function(){
      console.log("render comments")
      var self = this;
      this.$el.html('');
      _.each(this.model.models, function(comment){
          var p = new App.Views.Comment({model:comment})
          p.render();
          self.$el.append(p.el)
      })
      return this;
    }
})

App.Views.CommentCreate = Backbone.View.extend({
    post:null,
    events:{
      "submit form":"postComment"
    },

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.post = this.options.post;
      this.model = new App.Models.Comment(null, {post:this.post})
    },

    render:function(){
      console.log("render comment post")
      $(this.el).html(JST['comments/post']({comment:this.model}));
      //enable toggling
      var self=this;
      this.$el.find('.comment-post-form').collapse({toggle:false})
      this.$el.find('.comment-post-header').click(function(){
          self.$el.removeModelErrors()
          $(this).siblings('.comment-post-form').collapse('toggle')
      })
      return this;
    },

    postComment: function(e){
      console.log("post");
      var self=this;
      self.$el.removeModelErrors()
      this.model.save(
        {
          name:    App.userCredentials.get('name'),
          content: this.$el.find('#content').val(),
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
              //TODO success notification
            }
          },
          error: function(model, errors){
            console.log("error")
            console.log(errors)
            self.$el.displayModelErrors(errors)
            setTimeout(function(){self.$el.removeModelErrors()}, 2000);
            if(errors.name){
              self.$el.trigger("promptName");
            }
          }
        }
      )
      //e.preventDefault();
      return false;
    },

    reset: function(){
      console.log("reset");
      //don't delete the model, it was probably posted somewhere else
      this.model = new App.Models.Comment(null, {post:this.post})
      //TODO do we need to unbind the collapse stuff?
      return this.render()
    }

})
