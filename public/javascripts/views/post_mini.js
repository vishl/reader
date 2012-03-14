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
/*global App Backbone _ JST url_parse*/
//create and select
App.Views.PostMiniCreate = Backbone.View.extend({
  _className:"PostMiniCreate",
  initialize:function(){
    /*
       this.forum = new App.Models.Forum({id:sid});
       this.forumHeaderView = new App.Views.ForumHeader({model:this.forum});
       $('#header').html(this.forumHeaderView.render().el);
       this.forum.fetch(); 
       */

    this.forumSelectView = new App.Views.ForumSelect();

    this.postCreateView = new App.Views.PostCreate({
      attributes:{content:url_parse().args['content']},
      forum:this.forumSelectView.forum,
      startOpen:true,
    });

    this.forumSelectView.bind("change", this.changeForum, this);

    $('#main-window').html(this.el);
    this.render();
  },

  render:function(){
    this.$el.html(JST['posts/mini_create']());
    this.$('#forum-select-container').html(this.forumSelectView.el);
    this.forumSelectView.render();
    this.renderPostCreateView();
  },

  renderPostCreateView:function(){
    this.$('#post-create-container').html(this.postCreateView.el);
    this.postCreateView.render();
  },

  changeForum:function(){
    var attrs = this.postCreateView.getAttrs();
    this.postCreateView.close();
    this.postCreateView = new App.Views.PostCreate({
      attributes:attrs,
      forum:this.forumSelectView.forum,
      startOpen:true,
    });
    this.renderPostCreateView();
  },
});

//only the comments
App.Views.PostMini = Backbone.View.extend({
    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.forum = this.options.forum;
      this.commentsView = new App.Views.Comments({model:this.model.comments,postFrame:false});
      this.commentCreateView = new App.Views.CommentCreate({post:this.model});
      this.commentCreateView.bind("posted", this.createComment, this);

      this.model.bind("change", this.render);
      this.forum.bind("change:title", function(){this.$('.forum-title').html(this.forum.escape("title"));}, this);
    },

    render: function(){
      console.log("render post mini");
      this.$el.html(JST['posts/mini']({model:this.model, forum:this.options.forum}));
      this.$el.append(this.commentsView.render().el);
      this.$el.append(this.commentCreateView.render().$el);
      return this;
    },

    createComment: function(comment){
      this.commentsView.model.add(comment);
    }
});

