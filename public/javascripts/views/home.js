/*global App Backbone _ JST*/
App.Views.Home = Backbone.View.extend({
    model: new App.Models.Forum(),

    events: {
      "submit form#create": "create",
    },

    initialize: function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.signInView = new App.Views.SignIn({model:App.user});
      this.signUpView = new App.Views.SignIn({model:App.user, signUp:true});
      this.forumListView = new App.Views.ForumList({model:App.user});
      App.user.bind("sync", this.render, this);
      this.render(); //render on init
    },

    create: function(e){
      this.model.save(
        {
          title: $('#title').val(),
        },
        {
          success:function(model, resp){
            console.log(resp);
            if(resp.has_error){
              //TODO create notice
            }else{
              //navigate to forum
              //trigger causes the router to route
              App.router.navigate('forums/'+resp.forum.sid, {trigger:true});
            }
          },
          error: function(){
            console.log("error");
            //TODO something went wrong
          }
        }
      );
      //e.preventDefault();
      return false;
    },

    render: function(){
      console.log("render home");
      if(App.user.signedIn()){
        $(this.el).html(JST['pages/home']());
        this.$el.append(this.forumListView.el);
        this.forumListView.render();
      }else{
        $(this.el).html(JST['pages/home_login']());
        this.$('#sign-in-area').html(this.signInView.el);
        this.$('#sign-up-area').html(this.signUpView.el);
        this.signInView.render();
        this.signUpView.render();
      }
      return this;
    }

});
