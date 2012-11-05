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
App.Views.SignIn = Backbone.FormView.extend({
  initialize:function(){
    _.bindAll(this);
  },

  render:function(){
    if(this.options.signUp){
      this.$el.html(JST['users/new']({model:this.model}));
    }else{
      this.$el.html(JST['sessions/signin']({model:this.model}));
    }
  },

  beforePost:function(){
    this.trigger("submitting");
    return true;
  },

  afterSave:function(){
    this.model.clearPasswords();
    this.model.attributes.signup=false;
    var last = App.user.get_setting("last_forum");
    if(last){
      App.router.navigate('forums/'+last, {trigger:true});
    }else{
      App.router.navigate('new');
    }
  },

  onError:function(){
    this.model.attributes.signup=false;
  },

});
