/*global App Backbone _ */
App.Routers.Main = Backbone.Router.extend({
    //constants
    POLLINTERVAL:60000, //60 seconds

    routes:{
      "": "home",
      "forums/:sid":"forum",
    },

    initialize : function(options){
      this.userCredentialsView = new App.Views.UserCredentials({model:App.userCredentials});
      $('#user-credentials').html(this.userCredentialsView.el);
      this.userCredentialsView.render();
    },

    ////////////////////////////////// Routes //////////////////////////////////////
    home:function(){
      console.log("route home");
      this.homeView = new App.Views.Home();
      //attach it to the main window
      $('#main-window').html(this.homeView.el);
    },

    forum:function(sid){
      console.log("route forum "+sid);
      //some housekeeping stuff to keep track of when to update

      //create the view and attach it to the main window
      this.forumView = new App.Views.Forum({sid:sid});
      this.forum = this.forumView.model;
      this.forumView.renderAll(); //nothing is there yet so this just makes containers
      $('#main-window').html(this.forumView.el);
      this.forum.fetch(); //this should populate the data dynamically
      
      //launch poll, this sends state to the server and receives updates
      //periodically
      this.startPolling();
    },

    ////////////////////////////////// Helpers /////////////////////////////////////
    startPolling:function(){
      //TODO fancy way is to send our state to the server, for now we just
      //refetch
      //var state = this.forum.getState();
      if(this.pollId){
        clearInterval(this.pollId);
      }
      var self=this;
      self.pollId = setInterval(function(){
          self.forum.fetch();
        },self.POLLINTERVAL);
    },
});
