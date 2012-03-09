/*global App Backbone _ JST*/

App.Views.ForumHeader = Backbone.View.extend({

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.userCredentialsView = new App.Views.UserCredentials({model:App.user});
      if(this.model){
        this.model.bind("change", this.render);
      }
      App.user.bind("change:subscriptions", this.render, this);
    },

    render: function(){
      console.log("render forum header");
      if(this.model){
        this.$el.html(JST['layouts/forum_header'](
            { title:this.model.escape("title"),
              id:this.model.id,
              subscriptions:App.user.get("subscriptions"),
              origin:window.location.origin,
            }
        ));
      }else{
        this.$el.html(JST['layouts/forum_header'](
            { title:null,
              id:null,
              subscriptions:App.user.get("subscriptions"),
              origin:window.location.origin,
            }
        ));
      }
      this.$el.find('#user-credentials').html(this.userCredentialsView.el);
      this.userCredentialsView.render();
      return this;
    },
});
