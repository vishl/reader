App.Routers.Main = Backbone.Router.extend({
    routes:{
      "": "home",
      "forums/:sid":"forum",
    },

    home:function(){
      console.log("route home");
      this.homeView = new App.Views.Home();
      //attach it to the main window
      $('#main-window').html(this.homeView.el);
    },

    forum:function(sid){
      console.log("route forum "+sid)
      this.forumView = new App.Views.Forum({sid:sid})
      //attach it to the main window
      $('#main-window').html(this.forumView.el);
    }
});
