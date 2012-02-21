/*global App Backbone _ JST*/

App.Views.ForumHeader = Backbone.View.extend({

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.userCredentialsView = new App.Views.UserCredentials({model:App.userCredentials});
      if(this.model){
        this.model.bind("change", this.render);
      }
    },

    render: function(){
      console.log("render forum header");
      if(this.model){
        this.$el.html(JST['layouts/forum_header'](
            { title:this.model.escape("title"),
              sid:this.model.escape("sid"),
              origin:window.location.origin,
            }
        ));
      }else{
        this.$el.html(JST['layouts/forum_header'](
            { title:null,
              sid:null,
              origin:window.location.origin,
            }
        ));
      }
      this.$el.find('#user-credentials').html(this.userCredentialsView.el);
      this.userCredentialsView.render();
      return this;
    },
});
