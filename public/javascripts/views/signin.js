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

  afterSave:function(){
    this.model.clearPasswords();
  }

});
