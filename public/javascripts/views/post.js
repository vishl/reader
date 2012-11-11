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
/*global App Backbone _ JST Utils mpq JSON*/
App.Views.Post = Backbone.View.extend({
    post:null,  //TODO what is this..

    events:{
      "click .post .close":"deletePost",
      "click #mark-unread":"markUnread",
      "click":"markRead",
      "click #expand":"toggleExpand",
    },

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.controlsView = new App.Views.PostControls({model:this.model});
      this.commentsView = new App.Views.Comments({model:this.model.comments});
      this.commentCreateView = new App.Views.CommentCreate({post:this.model, subscription:this.options.subscription});
      this.postMeta = new App.Views.PostMeta({model:this.model});
      this.commentCreateView.bind("posted", this.createComment, this);
      this.model.bind("change:is_read", this.updateRead, this);
    },

    beforeClose:function(){
      this.controlsView.close();
      this.commentsView.close();
      this.postMeta.close();
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
      this.$('#meta-hook').html(this.postMeta.el);
      this.postMeta.render();
      //this.postFrame(this.$el.find('.linkify a'));
      //need to let the render go through first
      var self=this;
      setTimeout(function(){
        if(self.$('.post-internal2').height()>1000){
          self.$('.expand-area').show();
        }
      },0);
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

    toggleExpand:function(){
      if(this.expanded){
        this.$('.post-internal').css('max-height', '1000px');
        this.expanded=false;
        this.$('#expand').text("More..");
      }else{
        this.$('.post-internal').css('max-height', 'inherit');
        this.expanded=true;
        this.$('#expand').text("Less..");
      }
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
        if(false && App.user.get_setting("hide_read") && post.get("is_read")){
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

     events: _.extend({
       "paste #content":"analyze",
       "click .preview-image":"toggleImage",
       "click #allimages":function(){this.$('.preview-image').addClass('selected'); this.updateImgCount();},
       "click #noimages":function(){this.$('.preview-image').removeClass('selected'); this.updateImgCount();},
     }, Backbone.FormView.prototype.events),

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
//      this.$('#content').autoGrow();
      this.delegateEvents();
      this.analyze();
      return this;
    },

    beforePost:function(attrs,error){
      var meta = {};
      if(this.$('#titlecb').prop('checked')){
        meta.title = this.$('#title').text();
      }
      if(this.$('#textcb').prop('checked')){
        meta.text = this.$('#dbtext').val();
      }
      meta.images=[];
      this.$('.preview-image.selected').each(function(i, elt){
        meta.images.push($(elt).find('img').attr('src'));
      });
      meta.url = this.meta.url;
      //todo images
      attrs.meta = meta;
      return true;
    },

    afterSave : function(){
      this.model = new App.Models.Post(null, {forum:this.forum});
//      this.$el.find('#create-post-area').collapse('hide');
//      this.$el.find('#content').val("");
//      this.$el.find('#comment').val("");
      App.notifier.notify("Message posted");
      this.render();
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

    analyze:function(e){
      var self=this;
      setTimeout(function(){
        var val = $('#content').val();
        if(Utils.is_link(val)){
          if(Utils.embed(self.$('#preview')[0])){
            //can embed, don't diffbot
          }else{
            //diffbot
            //create a preview
            self.$('#preview').html(JST['posts/preview']({link:val}));
            $.ajax({
              url:'http://www.diffbot.com/api/article',
              dataType:'jsonp',
              data:{
                token:'c0934df60a197366df0cfdb1b0797b6f',
                url:val,
              },
              success:function(data){
                self.handleDiffbot(data);
              },
            });
          }
        }
      },0);
    },

    handleDiffbot:function(data)
    {
      console.log(data);
      this.meta = data;
      this.meta.images = _.filter(this.meta.media, function(m){
        return m.type==="image";
      });
      this.$('#preview').html(JST['posts/create_select']({db:data}));
      this.$('textarea').each(function(i,el){
        var $el = $(el);
        $el.height(el.scrollHeight);
      });
      $(this.$('.preview-image')[0]).addClass('selected');
      this.updateImgCount();
    },

    toggleImage:function(e)
    {
      $(e.currentTarget).toggleClass('selected');
      this.updateImgCount();
    },

    updateImgCount:function()
    {
      var c = this.$('.preview-image.selected').length;
      this.$('#imgcount').text(c);
    },
});

App.Views.PostMeta = Backbone.View.extend({

  render:function(){
    this.$el.html(JST['posts/meta']({model:this.model}));
  },
});
