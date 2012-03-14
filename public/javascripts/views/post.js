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
/*global App Backbone _ JST Utils*/
App.Views.Post = Backbone.View.extend({
    post:null,  //TODO what is this..
    className:'post-area', //the class of the containing <div>

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.commentsView = new App.Views.Comments({model:this.model.comments});
      this.commentCreateView = new App.Views.CommentCreate({post:this.model, subscription:this.options.subscription});
      this.commentCreateView.bind("posted", this.createComment, this);
      this.model.bind("change", this.render);
    },

    render: function(){
      console.log("render post");
      $(this.el).html(JST['posts/show']({post:this.model}));
      this.$el.find('.comment-area').append(this.commentsView.render().el);
      this.$el.find('.comment-area').append(this.commentCreateView.render().$el);
      Utils.embed(this.$el.find('.content .linkify').get(0));
      this.postFrame(this.$el.find('.linkify a'));
      return this;
    },

    createComment: function(comment){
      this.commentsView.model.add(comment);
    },

    ////////////////////////////////// helpers /////////////////////////////////////
    postFrame : function(els){
      var self = this;
      els.each(function(){
          if(
            (!this.href.match(/postframe/))      //hack to prevent us from framing ourselves
            && (!this.href.match(/youtube\.com/)) //youtube does not allow framing
          ){
            //this.href ="/postframe/"+self.forum.id+"/"+self.id+"?content="+encodeURIComponent(this.href);
            this.href = "/postframe/?forum_id={0}&post_id={1}&content={2}".format(self.model.forum.id,self.model.id,encodeURIComponent(this.href));
            this.target="_self";
          }
      });

    },
});

App.Views.Posts = Backbone.View.extend({
    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.model.bind("reset", this.render, this);
      this.model.bind("add", this.addPost, this);
    },

    postViews:[],
    render: function(){
      console.log("render posts");
      this.$el.html('');
      var self = this;
      this.postViews=[];
      _.each(this.model.models, function(post){
          var p = new App.Views.Post({model:post, subscription:self.options.subscription});
          self.postViews.push(p);
          p.render();
          self.$el.append(p.el);
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
    }
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
      this.delegateEvents(); //have to call this explicity if the form gets rerendered
      return this;
    },

    beforePost:function(){
      //validate the user name
      return true;
    },

    afterSave : function(){
      this.model = new App.Models.Post(null, {forum:this.forum});
      this.$el.find('#create-post-area').collapse('hide');
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

