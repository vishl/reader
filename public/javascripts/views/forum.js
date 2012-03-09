/*global App Backbone _ JST*/
App.Views.Forum = Backbone.View.extend({
  events:{
    "click #subscribe":"subscribe",
    "click #unsubscribe":"unsubscribe",
    "click #launch-users":function(){this.forumUsersView.render();}
  },

  initialize:function(){
    _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
    this.model = new App.Models.Forum({id:this.options.sid});
    this.model.prefetch=true; //prefetch posts when we fetch the forum
    this.forumUsersView = new App.Views.ForumUsers({forum:this.model});
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
    this.$el.find('.forum-title').html(this.model.escape("title")+"&nbsp;");
    this.$el.find('.subscribe-area').html(JST['forums/subscribe']({subscribed:this.subscription.get("subscribed")}));
    //$('#bookmarklet-modal').html(JST['layouts/bookmarklet']({title:this.model.escape("title"),sid:this.model.id,origin:window.location.origin}));
  },

  renderAll: function(){
    console.log("render forum");
    this.$el.html(JST['forums/show']({title:this.model.get("title")}));
    this.render();
    this.$el.append(this.postCreateView.render().el);
    this.$el.append(this.postsView.render().el);
    this.$el.find('.modal-body').html(this.forumUsersView.el);
    return this;
  },

  newPost: function(posts){
    this.postsView.model.add(posts);
  },

  subscribe:function(e){
    console.log("subscribing to "+this.model.id);
    e.preventDefault();
    this.subscription.subscribe();
  },

  unsubscribe:function(e){
    console.log("unsubscribing from "+this.model.id);
    e.preventDefault();
    this.subscription.unsubscribe();
  },

});

