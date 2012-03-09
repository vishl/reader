/*global App Backbone _ JST*/
App.Views.ForumUsers = Backbone.View.extend({

  initialize:function(){
    _.bindAll(this, 'render');
    this.forum = this.options.forum;
  },

  render:function(){
    if(!this.model){
      this.model = new App.Collections.Users();
      this.model.fetch({url:'/forums/'+this.forum.id+'/users', success:this.render});
      this.$el.html(JST['layouts/loading']());
    }else{
      this.$el.html(JST['forums/users']({model:this.model}));
    }
  },
});
