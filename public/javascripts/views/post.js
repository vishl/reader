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
/*global App Backbone _ JST Utils mpq*/
App.Views.Post = Backbone.View.extend({
    post:null,  //TODO what is this..

    events:{
      "click .post .close":"deletePost",
      "click #mark-unread":"markUnread",
      "click":"markRead",
    },

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.controlsView = new App.Views.PostControls({model:this.model});
      this.commentsView = new App.Views.Comments({model:this.model.comments});
      this.commentCreateView = new App.Views.CommentCreate({post:this.model, subscription:this.options.subscription});
      this.commentCreateView.bind("posted", this.createComment, this);
      this.model.bind("change:is_read", this.updateRead, this);
    },

    beforeClose:function(){
      this.controlsView.close();
      this.commentsView.close();
      this.commentCreateView.unbind("posted", this.createComment, this);
      this.commentCreateView.close();
      this.model.bind("change:is_read", this.updateRead, this);
    },

    render: function(){
      console.log("render post");
      $(this.el).html(JST['posts/show']({post:this.model}));
      this.$('#controls-hook').html(this.controlsView.render().el);
      this.$el.find('.comment-area').append(this.commentsView.render().el);
      this.$el.find('.comment-area').append(this.commentCreateView.render().$el);
      Utils.embed(this.$el.find('.content .linkify').get(0));
      //this.postFrame(this.$el.find('.linkify a'));
      return this;
    },

    createComment: function(comment){
      this.commentsView.model.add(comment);
      mpq.track("comment", {source:"main"});
    },

    deletePost:function(e){
      e.preventDefault();
      var deleteIt = confirm("Delete this post and all of its comments?");
      if(deleteIt){
        this.model.destroy();
        this.close();
      }
    },

    markRead:function(e){
      if(!this.model.get("is_read")){
        this.model.setMarkers({is_read:true});
      }
    },

    markUnread:function(e){
      e.preventDefault();
      e.stopPropagation();
      if(this.model.get("is_read")){
        this.model.setMarkers({is_read:false});
      }
    },

    updateRead:function(){
      if(this.model.get("is_read")){
        this.$('.post-area').addClass("read");
      }else{
        this.$('.post-area').removeClass("read");
      }
      this.controlsView.render();
    },


    ////////////////////////////////// helpers /////////////////////////////////////
    postFrame : function(els){
      var self = this;
      els.each(function(){
          if(
            (!this.href.match(/postframe/))       //hack to prevent us from framing ourselves
            && (!this.href.match(/youtube\.com/)) //youtube does not allow framing
            && (!this.href.match(/^https/))       //don't frame https sites
          ){
            this.href = "/postframe/?forum_id={0}&post_id={1}&content={2}".format(self.model.forum.id,self.model.id,encodeURIComponent(this.href));
            this.target="_self";
          }
      });

    },
});

App.Views.PostControls = Backbone.View.extend({
  render:function(){
    this.$('#mark-unread').tooltip('hide');
    this.$el.html(JST['posts/controls']({post:this.model}));
    this.$('#mark-unread').tooltip({title:"Mark unread"});
    return this;
  },
});

App.Views.Posts = Backbone.View.extend({
    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.model.bind("reset", this.render, this);
      this.model.bind("add", this.addPost, this);
      this.model.bind("destroy", this.removePost, this);
      this.model.bind("remove", this.removePost, this);
      App.user.bind("change:settings", this.render, this);
    },

    beforeClose:function(){
      this.model.unbind("reset", this.render, this);
      this.model.unbind("add", this.addPost, this);
      this.model.unbind("destroy", this.removePost, this);
      this.model.unbind("remove", this.removePost, this);
      App.user.unbind("change:settings", this.render, this);
    },

    postViews:[],
    render: function(){
      console.log("render posts");
      this.$el.html('');
      var self = this;
      this.postViews=[];
      _.each(this.model.models, function(post){
        if(App.user.get_setting("hide_read") && post.get("is_read")){
          //don't display
        }else{
          var p = new App.Views.Post({model:post, subscription:self.options.subscription});
          self.postViews.push(p);
          p.render();
          self.$el.append(p.el);
        }
      });
      return this;
    },

    addPost: function(model, collection, options){
      var i = options.index;
      console.log("insert post "+model.id+" at "+i);
      var elt = this.$el.find('.post-area')[i];
      var view = new App.Views.Post({model:model, subscription:this.options.subscription}); 
      view.render();
      view.$el.css('display','none');
      if(elt!==undefined){
        $(elt).before(view.el);
      }else{
        this.$el.append(view.el);
      }
      view.$el.fadeIn('slow');
    },

    removePost:function(model, collection, options){

    },
});

App.Views.PostCreate = Backbone.FormView.extend({
    forum:null,

    initialize:function(){
      _.bindAll(this);  //all of my functions should be called with me as 'this'.. because javascript is retarded
      this.forum = this.options.forum;
      this.subscription = this.options.subscription;
      //if no subscription just assume we're subscribed and hope for the best
      if(!this.subscription)this.subscription = new App.Models.Subscription({subscribed:true});
      this.model = new App.Models.Post(this.options.attributes, {forum:this.options.forum});

      this.subscription.bind("change:subscribed", this.render, this);
      this.forum.bind("change:title", this.render, this);
    },

    beforeClose:function(){
      this.subscription.unbind("change:subscribed", this.render, this);
      this.forum.unbind("change:title", this.render, this);
    },

    render:function(){
      console.log("render post create");
      var self = this;
      var startOpen = this.options.startOpen || ((self.model.get("content")+self.model.get("comment")).length>0);
      self.$el.html(JST['posts/new']({post:this.model, signedIn:App.user.signedIn(), subscribed:this.subscription.get("subscribed"), title:this.forum.get("title")}));

      //toggle and clear errors
      self.$el.find('#create-post-area').collapse({toggle:false});
      if(startOpen) self.$el.find('#create-post-area').addClass("in");
      self.$el.find('#postheader').click(function(e){
          e.preventDefault();
          self.$el.removeModelErrors();
          $(this).siblings('#create-post-area').collapse('toggle');
      });
      this.$('#comment').autoGrow();
      this.delegateEvents(); 
      return this;
    },

    afterSave : function(){
      this.model = new App.Models.Post(null, {forum:this.forum});
//      this.$el.find('#create-post-area').collapse('hide');
      this.$el.find('#content').val("");
      this.$el.find('#comment').val("");
      App.notifier.notify("Message posted");
      return this;
    },

    onError:function(model, errors, response){
      if(errors && errors.authorization){
        App.notifier.notify(errors.authorization);
      }
    },

    getAttrs:function(){
      return {content:this.$('#content').val(), comment:this.$('#comment').val()};
    },
});

