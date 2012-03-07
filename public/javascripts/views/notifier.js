/*global App Backbone _ JST*/
App.Views.Notifier = Backbone.View.extend({
    options:{
      autoHide:true,
      timeout:3500, //ms
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

    notify:function(message,type){
      if(this.shown){
        this.hide();
      }
      type = type || 'info';
      this.message = message;
      this.$el.find('#message').html(_.escape(message));
      this.$el.removeClass().addClass("alert alert-"+type);
      this.show();
    },

    show:function(){
      this.$el.slideDown('slow');
      this.shown=true;
      if(this.options.autoHide){
        var self=this;
        self.timeout = setTimeout(function(){
            self.hide();
        },self.options.timeout);
      }
    },

    hide:function(){
      this.$el.slideUp('slow');
      this.shown=false;
      if(this.timeout){
        clearTimeout(this.timeout);
      }
    },
});
