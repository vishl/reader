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
App.Views.Home = Backbone.View.extend({
    model: new App.Models.Forum(),

    events: {
      "submit form#create": "create",
    },

    initialize: function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.signInView = new App.Views.SignIn({model:App.user});
      this.signUpView = new App.Views.SignIn({model:App.user, signUp:true});
      this.forgotView = new App.Views.Forgot({model:new App.Models.User()});
      //this.forumListView = new App.Views.ForumList({model:App.user});

      App.user.bind("sync", this.render, this);
      this.signInView.bind("submitting", this.removeErrors, this);
      this.signUpView.bind("submitting", this.removeErrors, this);
      this.render(); //render on init
    },

    create: function(e){
      this.model.save(
        {
          title: $('#title').val(),
        },
        {
          success:function(model, resp){
            console.log(resp);
            if(resp.has_error){
              //TODO create notice
            }else{
              //navigate to forum
              //trigger causes the router to route
              App.router.navigate('forums/'+resp.forum.id, {trigger:true});
            }
          },
          error: function(){
            console.log("error");
            //TODO something went wrong
          }
        }
      );
      //e.preventDefault();
      return false;
    },

    render: function(){
      console.log("render home");
      if(App.user.signedIn()){
        $(this.el).html(JST['pages/home']());
        //this.$el.append(this.forumListView.el);
        //this.forumListView.render();
      }else{
        $(this.el).html(JST['pages/home_login']());
        this.$('#sign-in-area').html(this.signInView.el);
        this.$('#sign-up-area').html(this.signUpView.el);
        this.$('#forgot-area').html(this.forgotView.el);
        this.signInView.render();
        this.signUpView.render();
        this.forgotView.render();
      }
      this.delegateEvents();
      return this;
    },

    removeErrors:function(){
      this.signInView.$el.removeModelErrors();
      this.signUpView.$el.removeModelErrors();
    },
});
