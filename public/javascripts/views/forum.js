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
/*global App Backbone _ JST mpq*/
App.Views.Forum = Backbone.View.extend({
  events:{
    "click #subscribe":"subscribe",
    "click #unsubscribe":"unsubscribe",
    "click #launch-users":function(){this.forumUsersView.render();}
  },
  className:"container",

  initialize:function(){
    _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
    this.model = new App.Models.Forum({id:this.options.sid});
    this.model.prefetch=true; //prefetch posts when we fetch the forum
    this.forumUsersView = new App.Views.ForumUsers({forum:this.model});
    this.forumInviteView = new App.Views.ForumInvite({forum:this.model});
    this.subscription = new App.Models.Subscription({
      user_id:App.user.id, 
      forum_id:this.model.id, 
      forum_title:this.model.get("title")
    });
    this.subscription.set(this.model.get("subscription"));
    //TODO update user with this?
    this.postsView = new App.Views.Posts({model:this.model.posts, subscription:this.subscription});
    this.postCreateView = new App.Views.PostCreate({forum:this.model,subscription:this.subscription});

    this.postCreateView.bind("posted", this.newPost, this);
    this.model.bind("change:subscription", function(){this.subscription.set(this.model.get("subscription"));}, this);
    this.model.bind("change", this.render);
    this.subscription.bind("change:subscribed", this.render, this);
  },

  render:function(){
    this.$el.find('.forum-title').html(this.model.escape("title"));
    this.$el.find('.subscribe-area').html(JST['forums/subscribe']({subscribed:this.subscription.get("subscribed")}));
    //$('#bookmarklet-modal').html(JST['layouts/bookmarklet']({title:this.model.escape("title"),sid:this.model.id,origin:window.location.origin}));
  },

  renderAll: function(){
    console.log("render forum");
    this.$el.html(JST['forums/show']({title:this.model.get("title")}));
    this.render();
    this.$el.append(this.postCreateView.render().el);
    this.$el.append(this.postsView.render().el);
    this.$el.find('#users-modal .modal-body').html(this.forumUsersView.el);
    this.$el.find('#invite-modal .modal-body').html(this.forumInviteView.el);
    this.forumInviteView.render();
    return this;
  },

  newPost: function(posts){
    this.postsView.model.add(posts);
    mpq.track("post", {source:"forum"});
  },

  subscribe:function(e){
    console.log("subscribing to "+this.model.id);
    e.preventDefault();
    this.subscription.subscribe();
    App.notifier.notify("You are now subscribed to "+this.model.escape("title"));
  },

  unsubscribe:function(e){
    console.log("unsubscribing from "+this.model.id);
    e.preventDefault();
    this.subscription.unsubscribe();
    App.notifier.notify("You are now unsubscribed from "+this.model.escape("title"));
  },

});

App.Views.ForumSelect = Backbone.View.extend({
  _className:"ForumSelect",
  events:{
    "change #forum-select":"changeForum",
  },

  initialize:function(){
    //TODO pick one to select
    this.forum = App.user.subscriptions.first().makeForum();
  },

  render:function(){
    this.$el.html(JST["forums/select"]({subscriptions:App.user.subscriptions, selected:this.forum.id}));
  },

  changeForum:function(){
    var id = this.$('#forum-select').val();
    this.forum = App.user.subscriptions.get(id).makeForum();
    this.trigger("change");
  },

});
