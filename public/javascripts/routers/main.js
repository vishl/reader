/*global App Backbone _ GlobalSettings JST*/
App.Routers.Main = Backbone.Router.extend({
    //constants
    POLLINTERVAL:300000, //5 minutes

    routes:{
      "": "home",
      "forums/:sid":"forum",
      "commentview/:sid/:id":"commentView",
      "post":"postMini",
      "users/:id":"user",
    },

    initialize : function(options){
      App.notifier = new App.Views.Notifier();
      if(GlobalSettings.deployment==="development"){
        this.POLLINTERVAL=60000;  //1 minute
      }
      $('body').append(App.notifier.render().el);
    },

    ////////////////////////////////// Routes //////////////////////////////////////
    home:function(){
      console.log("route home");
      this.homeView = new App.Views.Home();
      this.forumHeaderView = new App.Views.ForumHeader(); //reuse forumHeader with null model
      $('#header').html(this.forumHeaderView.render().el);
      $('#main-window').html(this.homeView.el);
    },

    forum:function(sid){
      console.log("route forum "+sid);

      //create the views
      this.forumView = new App.Views.Forum({sid:sid});
      this.forum = this.forumView.model;  //the view instantiates the model
      this.forumHeaderView = new App.Views.ForumHeader({model:this.forum});

      //render header and main window
      $('#header').html(this.forumHeaderView.render().el);
      $('#main-window').html("loading");
      var self=this;
      this.forum.fetch({success:function(){
        $('#main-window').html(self.forumView.el);
        self.forumView.renderAll(true); //nothing is there yet so this just makes containers
      }});
      
      //launch poll, this sends state to the server and receives updates
      //periodically
      this.startPolling();
    },

    commentView:function(sid,id){
      console.log("comment view "+sid+" "+id);

      this.forum = new App.Models.Forum({id:sid});
      this.post = new App.Models.Post({id:id,forum:this.forum});
      this.postView = new App.Views.PostMini({model:this.post, forum:this.forum});
      $('#main-window').html(JST['layouts/loading']());
      var self=this;
      this.forum.fetch();
      this.post.fetch({success:function(){
        $('#main-window').html(self.postView.el);
        self.postView.render();
      }});
    },

    postMini:function(sid){
      if(App.user.signedIn()){
        this.postMiniView = new App.Views.PostMiniCreate();
      }else{
        $('#main-window').html("Please sign in and reload this page");
      }
    },

    user:function(id){
      var user;
      if(id==App.user.id){
        user = App.user;
      }else{
        user = new App.Models.User({id:id});
      }
      this.userView = new App.Views.UserPage({model:user});
      user.fetch();
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
