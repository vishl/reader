/*global App Backbone _ JST*/
App.Views.ForumList = Backbone.View.extend({
  _className:"ForumList",

  initialize:function(){
    _.bindAll(this,'render'); 
    this.model.bind("sync change", this.render, this);
  },

  render: function(){
    var sub = this.model.get("subscriptions");
    if(sub && sub.length){
      this.$el.html(JST['forums/list']({list:sub}));
    }
  },
});
