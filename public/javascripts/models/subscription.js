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
/*global App Backbone _ Validator Utils*/

App.Models.Subscription = Backbone.Model.extend({
  _className:"Subscription",
  urlRoot:"/subscriptions",

  defaults:{
    user_id:null,
    forum_id:null,
    forum_title:"",
    subscribed:false,
  },

  initialize:function(){
    if(this.attributes.subscribed){
      this.set("id", this.attributes.forum_id);
      //otherwise destroy won't work
    }
  },

  subscribe:function(){
    this.save();
  },

  unsubscribe:function(){
    var self=this;
    this.destroy({
      success:function(model, resp){
        self.set({"subscribed":false, "id":null});
      }
    });
  },

  makeForum:function(){
    return new App.Models.Forum({id:this.attributes.forum_id, title:this.attributes.forum_title});
  },
});

App.Collections.Subscriptions = Backbone.Collection.extend({
  model:App.Models.Subscription,
});
