/*
Copyright 2012 Vishal Parikh                                             
This file is part of Freader.                                            
Freader is free software: you can redistribute it and/or modify          
it under the terms of the GNU General Public License as published by     
the Free Software Foundation, either version 3 of the License, or        
(at your option) any later version.                                      
                                                                         
Freader is distributed in the hope that it will be useful,               
but WITHOUT ANY WARRANTY; without even the implied warranty of           
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the            
GNU General Public License for more details.                             
                                                                         
You should have received a copy of the GNU General Public License        
along with Freader.  If not, see <http://www.gnu.org/licenses/>.         
*/
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
      "users/:id/reset/:token":"userReset",
      "about":"about",
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
      $('#main-window').html(JST['layouts/loading']());
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
        $('#main-window').html('Please <a target="_blank" href="http://'+GlobalSettings.app_domain+'">sign in</a> and reload this page');
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

    userReset:function(id, token){
      console.log("route user reset");
      var self=this;
      var user = new App.Models.User({id:id, token:token});
      $('#main-window').html(JST['layouts/loading']());
      user.fetch({success:function(){
        self.userView = new App.Views.UserResetPage({model:user});
      },
      silent:true,  //no validation on user
      });
    },

    about:function(){
      console.log("route about");
      this.forumHeaderView = new App.Views.ForumHeader(); //reuse forumHeader with null model
      $('#header').html(this.forumHeaderView.render().el);
      $('#main-window').html(JST['pages/about']());
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
