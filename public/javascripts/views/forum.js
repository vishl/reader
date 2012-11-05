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
    "click #launch-users":function(){this.forumUsersView.render();},
    "click #hide-read":"handleUnread",
    "click #mark-all-read":"markAllRead",
  },

  initialize:function(){
    _.bindAll(this, 'render', 'handleScroll'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
    this.forumUsersView = new App.Views.ForumUsers({forum:this.model});
    this.forumInviteView = new App.Views.ForumInvite({forum:this.model});
    this.forumTitleView = new App.Views.ForumTitle({model:this.model});
    this.subscription = new App.Models.Subscription({
      user_id:App.user.id, 
      forum_id:this.model.id, 
      forum_title:this.model.get("title")
    });
    this.subscription.set(this.model.get("subscription"));
    this.postsView = new App.Views.Posts({model:this.model.posts(), subscription:this.subscription});
    this.postCreateView = new App.Views.PostCreate({forum:this.model,subscription:this.subscription});

    this.postCreateView.bind("posted", this.newPost, this);
    this.model.bind("change:subscription", function(){this.subscription.set(this.model.get("subscription"));}, this);
    this.model.bind("change", this.render);
    this.model.posts().bind("change:is_read", this.handleRead, this);
    this.subscription.bind("change:subscribed", this.render, this);
    $(window).on('scroll', this.handleScroll);
  },

  beforeClose:function(){
    this.forumUsersView.close();
    this.forumInviteView.close();
    this.forumTitleView.close();

    this.postCreateView.unbind("posted", this.newPost, this);
    this.model.unbind("change:subscription", function(){this.subscription.set(this.model.get("subscription"));}, this);
    this.model.unbind("change", this.render);
    this.model.posts().unbind("change:is_read", this.handleRead, this);
    this.subscription.unbind("change:subscribed", this.render, this);
  },

  render:function(){
    this.$el.find('#title-hook').html(this.forumTitleView.el);
    this.forumTitleView.render();
    this.$el.find('.subscribe-area').html(JST['forums/subscribe']({subscribed:this.subscription.get("subscribed")}));
    this.$('#hide-read').tooltip({trigger:'hover', title:'Hide read items', placement:'left'});
    this.$('#mark-all-read').tooltip({trigger:'hover', title:'Mark all as read', placement:'left'});
    //$('#bookmarklet-modal').html(JST['layouts/bookmarklet']({title:this.model.escape("title"),sid:this.model.id,origin:window.location.origin}));
  },

  renderAll: function(){
    console.log("render forum");
    this.$el.html(JST['forums/show']({title:this.model.get("title")}));
    this.render();
//    this.$('#post-create-hook').html(this.postCreateView.render().el);
    this.$('#posts-hook').html(this.postsView.render().el);
    this.$el.find('#users-modal .modal-body').html(this.forumUsersView.el);
    this.$el.find('#invite-modal .modal-body').html(this.forumInviteView.el);
    this.forumInviteView.render();
    return this;
  },

  handleUnread:function(e){
    var hr = !App.user.get_setting("hide_read");
    var self = this;
    App.user.set_setting("hide_read", hr, function(){console.log("fetch!");self.model.fetch();});
    if(hr){
      this.$('#hide-read').addClass('active');
    }else{
      this.$('#hide-read').removeClass('active');
    }
  },

  markAllRead:function(){
    this.model.markAllRead();
  },

  handleRead:function(m){
    if(m.get("is_read")){
      if(this.model.get("unread_count")>0){
        this.model.set("unread_count", this.model.get("unread_count")-1);
      }
    }else{
      this.model.set("unread_count", this.model.get("unread_count")+1);
    }
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

  //when we scroll to the bottom, try to load more
  handleScroll:function(){
    var self=this;
    if(($(window).scrollTop()+$(window).height())>=$(document).height()){
      if(!this.disableMore){
        console.log("loading more");
        this.disableMore=true;
        this.$('#load-bottom').show();
        this.model.getMore(20, function(){self.disableMore=false;self.$('#load-bottom').hide();});
      }
    }
  },

});

App.Views.ForumTitle = Backbone.View.extend({
  _className:"ForumTitle",

  events:{
    "click #edit":function(){this.mode='edit'; this.render();},
    "click #cancel":function(){this.mode='view'; this.render();},
    "submit form":"saveTitle"
  },

  initialize:function(){
    this.mode='view';
    this.model.bind("change:title", this.render, this);
  },

  beforeClose:function(){
    this.model.unbind("change:title", this.render, this);
  },

  render:function(){
    console.log("render title");
    this.$el.html(JST['forums/title']({mode:this.mode, model:this.model, owner:App.user.id==this.model.get('owner')}));
    this.delegateEvents();
    return this;
  },

  saveTitle:function(e){
    e.preventDefault();
    var t = this.$('#title').val();
    if(t.length){
      this.mode='view';
      this.model.save({title:t});
    }
  },
});

App.Views.ForumSelect = Backbone.View.extend({
  _className:"ForumSelect",
  events:{
    "change #forum-select":"changeForum",
  },

  initialize:function(){
    //TODO pick one to select
    var forumId;
    var init;
    if(this.options.forumId){
      forumId = this.options.forumId;
    }else{
      forumId = App.user.get_setting("last_forum");
    }
    if(forumId){
      init = App.user.subscriptions().get(forumId);
    }else{
      init = App.user.subscriptions().first();
    }
    this.forum = init;
  },

  render:function(){
    this.$el.html(JST["forums/select"]({subscriptions:App.user.subscriptions(), selected:this.forum.id}));
    this.delegateEvents();
  },

  changeForum:function(){
    var id = this.$('#forum-select').val();
    this.forum = App.user.subscriptions().get(id);
    this.trigger("change");
  },

});
