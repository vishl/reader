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
/*global App Backbone _ JST*/

App.Views.ForumHeader = Backbone.View.extend({

  events:{
    "click #post-create":"launchPostCreate",
  },

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.userCredentialsView = new App.Views.UserCredentials({model:App.user});
      this.postMini = new App.Views.PostMiniCreate({forumId:(this.model?this.model.id:null)});

      this.postMini.bind("posted", this.handlePost, this);
      if(this.model){
        this.model.bind("change:id", this.render);
      }
      App.user.bind("change:id", this.render, this);
      App.user.subscriptions().bind("add remove reset", this.render, this);
    },

    beforeClose:function(){
      this.userCredentialsView.close();
      this.postMini.close();
      if(this.model){
        this.model.unbind("change:id", this.render);
      }
      App.user.unbind("change:id", this.render, this);
      App.user.subscriptions().unbind("add remove reset", this.render, this);
    },

    render: function(){
      console.log("render forum header");
      if(this.model){
        this.$el.html(JST['layouts/forum_header'](
            { title:this.model.escape("title"),
              id:this.model.id,
              subscriptions:App.user.subscriptions(),
              origin:window.location.origin,
            }
        ));
      }else{
        this.$el.html(JST['layouts/forum_header'](
            { title:null,
              id:null,
              subscriptions:App.user.subscriptions(),
              origin:window.location.origin,
            }
        ));
      }
      this.$el.find('#user-credentials').html(this.userCredentialsView.el);
      this.userCredentialsView.render();
      this.$('#post-create-hook').html(this.postMini.el);
      this.postMini.render();
      return this;
    },

    launchPostCreate:function(){
      this.$('#post-modal').modal('show');
    },

    handlePost:function(models, id){
      if(id === this.model.id){
        this.model.posts().add(models);
      }
      this.$('#post-modal').modal('hide');
    },
});
