/*global App Backbone _ JST*/
App.Views.SignIn = Backbone.FormView.extend({
  initialize:function(){
  },

  render:function(){
    if(this.options.signUp){
      this.$el.html(JST['users/new']({model:App.user}));
    }else{
      this.$el.html(JST['sessions/signin']({model:App.user}));
    }
  },

});
