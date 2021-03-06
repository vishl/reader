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

/*global Backbone _ User mpq*/
var App = {
  Views:       {},
  Routers:     {},
  Models:      {},
  Collections: {},
  Singletons:  {},
  init: function() {
    console.log("init");
    this.user= new App.Models.User();
    if((typeof User!=="undefined") && (User !== null)){
      this.user.inject(User, null, {silent:true});
      mpq.identify(this.user.id);
    }
    this.router = new App.Routers.Main();
    Backbone.history.start();
  },

  Singleton: function(className, obj, method){
    if(method === "destroy"){
      delete App.Singletons[className];
    }else{
      if(App.Singletons[className]){
        throw className+" object already exists";
      }else{
        if(obj){
          App.Singletons[className] = obj;
        }else{
          throw "Object must evaluate to true, got:" + obj;
        }
      }
    }
  },
};

//set the min height of the main window so the footer doesn't get shoved up
$(function(){
  var setHeight=function(){
    var height = $(window).height()-40-75;
    $('#main-window').css("min-height", height+"px");
  };
  setHeight.call(this);
  $(window).bind("resize", setHeight);
  $(window).bind("resize", function(){$('.auto-height').setHeight();});
});
