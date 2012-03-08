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

  beforePost:function(){
    this.trigger("submitting");
    return true;
  }, 

  afterSave:function(){
    this.model.clearPasswords();
    this.model.attributes.signup=false;
  },

  onError:function(){
    this.model.attributes.signup=false;
  },

});
