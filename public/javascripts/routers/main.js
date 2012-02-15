App.Routers.Main = Backbone.Router.extend({
    routes:{
      "": "home",
      "forums/:sid":"forum",
    },

    initialize : function(options){
      this.userCredentialsView = new App.Views.UserCredentials({model:App.userCredentials})
      $('#user-credentials').html(this.userCredentialsView.el)
    },

    ////////////////////////////////// Routes //////////////////////////////////////
    home:function(){
      console.log("route home");
      this.homeView = new App.Views.Home();
      //attach it to the main window
      $('#main-window').html(this.homeView.el);
    },

    forum:function(sid){
      console.log("route forum "+sid)
      //some housekeeping stuff to keep track of when to update

      //create the view and attach it to the main window
      this.forumView = new App.Views.Forum({sid:sid});
      this.forum = this.forumView.model;
      $('#main-window').html(this.forumView.el);
      
      //launch poll, this sends state to the server and receives updates
      //periodically
      this.startPolling();
    },

    ////////////////////////////////// Helpers /////////////////////////////////////
    startPolling:function(){
      var state = this.forum.getState();
    },
});
