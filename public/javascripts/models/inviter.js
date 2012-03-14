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
/*global App Backbone _ Validator*/
App.Models.Inviter= Backbone.Model.extend({
  _className:"Inviter",
  urlRoot:function(){return '/forums/'+this.forum.id+'/invite';},
  forum:null,

  defaults:{
    addresses:[],
    forum_id:"",
  },

  initialize:function(attrs, options){
    this.forum = options.forum;
    this.set("forum_id", this.forum.id);
  },

});
