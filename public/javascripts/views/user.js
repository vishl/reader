/*global App Backbone _ JST embed*/
App.Views.UserCredentials = Backbone.View.extend({

    initialize:function(){
      _.bindAll(this);
      this.model.bind("sync", this.render);
    },

    render: function(){
      console.log("render user credentials");
      this.$el.html(JST['sessions/show']({model:this.model}));
      return this;
    },

});

App.Views.UserPage = Backbone.View.extend({
  _className:"UserPage",

  initialize:function(){
    this.headerView =  new App.Views.ForumHeader();
    $('#header').html(this.headerView.el);

    this.userView = new App.Views.User({model:this.model});
    $('#main-window').html(this.userView.el);

    this.render();
  },

  render:function(){
    console.log("render user page");
    this.headerView.render();
    this.userView.render();
  },

});

App.Views.User = Backbone.View.extend({
  _className:"User",
  className:"container",

  initialize:function(){
    if(this.model.id === App.user.id){
      //our profile page
      this.userView = new App.Views.UserEdit({model:this.model});
      this.userPasswordView = new App.Views.UserEditPassword({model:this.model});
      this.forumListView = new App.Views.ForumList({model:this.model});
      this.$el.append(this.userView.el);
      this.$el.append(this.userPasswordView.el);
      this.$el.append(this.forumListView.el);
    }else{
      //viewing someone elses page
      //this.userView = new App.Views.UserShow({model:this.model});
      this.userView = new App.Views.UserEdit({model:this.model});
      this.$el.append(this.userView.el);
      //TODO public posts
    }
  },

  render:function(){
    console.log("render user");
    this.userView.render();
    if(this.userPasswordView) this.userPasswordView.render();
    if(this.forumListView) this.forumListView.render();
    if(this.postsView) this.postsView.render();
  },
});

App.Views.UserEdit = Backbone.FormView.extend({
  _className:"UserEdit",
  initialize:function(){
    this.model.bind("change", this.render, this);
  },

  beforeClose:function(){
    this.model.unbind("change", this.render, this);
  },

  render:function(){
    console.log("render user edit");
    this.$el.html(JST['users/edit']({model:this.model}));
  },

});

App.Views.UserEditPassword = Backbone.FormView.extend({
  _className:"UserEditPassword",
  initialize:function(){
    _.bindAll(this);
    this.model.bind("change", this.render, this);
  },

  beforeClose:function(){
    this.model.unbind("change", this.render, this);
  },

  render:function(){
    console.log("render user edit password");
    this.$el.html(JST['users/edit_password']({model:this.model}));
  },

  afterSave:function(){
    this.model.clearPasswords();
  }
});
