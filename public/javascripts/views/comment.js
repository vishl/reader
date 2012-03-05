/*global App Backbone _ JST*/
App.Views.Comment = Backbone.View.extend({
    postFrameEn:true,

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.model.bind("change", this.render);
      if(this.options && this.options.postFrame!==undefined) 
        this.postFrameEn = this.options.postFrame;
    },

    render: function(){
      console.log("render comment");
      $(this.el).html(JST['comments/show']({comment:this.model}));
      if(this.postFrameEn)this.postFrame(this.$el.find('.linkify a'));
      return this;
    },

    ////////////////////////////////// helpers /////////////////////////////////////
    postFrame : function(els){
      var self = this;
      els.each(function(){
          if(
            (!this.href.match(/postframe/))      //hack to prevent us from framing ourselves
            && (!this.href.match(/youtube\.com/)) //youtube does not allow framing
          ){
            //this.href ="/postframe/"+self.forum.id+"/"+self.id+"?content="+encodeURIComponent(this.href);
            this.href = "/postframe/?forum_id={0}&post_id={1}&content={2}".format(self.model.post.forum.id,self.model.post.id,encodeURIComponent(this.href));
            this.target="_self";
          }
      });
    }

});

App.Views.Comments = Backbone.View.extend({
    postFrame:true, //enable postframe
    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.model.bind("reset", this.render, this);
      this.model.bind("add", this.addComment, this);
      if(this.options && this.options.postFrame!==undefined) 
        this.postFrame = this.options.postFrame;
    },

    render: function(){
      console.log("render comments");
      var self = this;
      this.$el.html('');
      _.each(this.model.models, function(comment){
          var p = new App.Views.Comment({model:comment,postFrame:self.postFrame});
          p.render();
          self.$el.append(p.el);
      });
      return this;
    },


    addComment: function(model, collection, options){
      var i = options.index;
      console.log("insert comment "+model.id+" at "+i);
      var elt = this.$el.find('.comment')[i];
      var view = new App.Views.Comment({model:model,postFrame:this.postFrame}); //renders on creation
      view.render();
      view.$el.css('display','none');  //hack to get fade in to work
      if(elt!==undefined){
        $(elt).before(view.el);
      }else{
        this.$el.append(view.el);
      }
      view.$el.fadeIn('slow');
    },
});

App.Views.CommentCreate = Backbone.FormView.extend({
    post:null,

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.post = this.options.post;
      this.model = new App.Models.Comment(null, {post:this.post});
    },

    render:function(){
      console.log("render comment post");
      $(this.el).html(JST['comments/post']({comment:this.model}));
      //enable toggling
      var self=this;
      this.$el.find('.comment-post-form').collapse({toggle:false});
      this.$el.find('.comment-post-header').click(function(e){
          e.preventDefault();
          self.$el.removeModelErrors();
          $(this).siblings('.comment-post-form').collapse('toggle');
      });
      this.delegateEvents(); //have to call this explicity if the form gets rerendered
      return this;
    },

    beforePost:function(){
      //validate the user name
      if(!this.model.set('name',App.userCredentials.get('name'), {only:{'name':true}})){
        this.$el.trigger("promptName");
        return false;
      }
      return true;
    },

    afterSave: function(){
      console.log("reset");
      this.model = new App.Models.Comment(null, {post:this.post});
      this.render();
      App.notifier.notify("Comment posted");
      return this;
    }

});

