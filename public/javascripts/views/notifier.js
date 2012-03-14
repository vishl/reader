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
App.Views.Notifier = Backbone.View.extend({
    options:{
      type:'info',
      expire:3500,
      animate:'slow',
    },

    id:'notifier',
    className:'alert alert-info',
    shown:false,
    timeout:null,

    initialize:function(){
      _.bindAll(this, 'render');
      this.message="";
    },

    render:function(){
      console.log("render notifier");
      this.$el.html(JST['layouts/notifier']);
      var self=this;
      this.$el.click(function(){
          self.hide(); return false;
      });
      return this;
    },

    notify:function(message,options){
      options = $.extend({}, this.options, options);
      if(this.shown){
        this.hide({animate:false});
      }
      this.message = message;
      this.$el.find('#message').html(_.escape(message));
      this.$el.removeClass().addClass("alert alert-"+options.type);
      this.show(options);
    },

    show:function(options){
      options = $.extend({}, this.options, options);
      this.$el.slideDown('slow');
      this.shown=true;
      if(options.expire>0){
        var self=this;
        self.timeout = setTimeout(function(){
            self.hide();
        },options.expire);
      }
    },

    hide:function(options){
      options = $.extend({}, this.options, options);
      if(options.animate){
        this.$el.slideUp(options.animate);
      }else{
        this.$el.hide();
      }
      this.shown=false;
      if(this.timeout){
        clearTimeout(this.timeout);
      }
    },
});
