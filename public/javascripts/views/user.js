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

//This is a top level view to reset the users password with a token
App.Views.UserResetPage = Backbone.View.extend({
  _className:"UserResetPage",
  initialize:function(){
    this.headerView =  new App.Views.ForumHeader();
    $('#header').html(this.headerView.el);
    this.userView = new App.Views.UserReset({model:this.model});
    $('#main-window').html(this.userView.el);

    this.render();
  },
  beforeClose:function(){
    this.headerView.close();
    this.userView.close();
  },

  render:function(){
    console.log("render user reset page");
    this.headerView.render();
    this.userView.render();
  }
});

App.Views.UserReset = Backbone.FormView.extend({
  _className:"UserReset",
  initialize:function(){
    _.bindAll(this);
  },
  render:function(){
    this.$el.html(JST['users/reset']({model:this.model}));
  },
  onError:function(model, errors, response){
    if(errors.authorization){
      App.notifier.notify("Sorry, it looks like this reset link is not valid.  Please generate another one",
                          {type:'error', expire:0});
    }
  },
});

App.Views.Forgot = Backbone.FormView.extend({
  _className:"Forgot",
  render:function(){
    this.$el.html(JST['users/forgot']({model:this.model}));
  },
});
