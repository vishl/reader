/*global App Backbone _ Validator*/
App.Models.User= Backbone.Model.extend({
    _className: "User",
    defaults:{
      name:"",
      email:"",
      password:"",
      current_password:"", //for change password
      remember:"",
      remind:"",
      when:"",
      signup:false, //this is a hack
    },

    urlRoot:'users',
    url:function(){
      if(this.isNew()){
        if(this.attributes.signup){
          return this.urlRoot;
        }else{
          return 'signin';
        }
      }
      return this.urlRoot+'/'+this.id;
    },
    initialize:function(){
      //only one user credentials object should exist
      //App.Singleton(this._class, this);
    },

    signedIn:function(){
      //TODO this is a dumb way to detect sign in
      if(this.id && this.id.length){
        return true;
      }
      return false;
    },

});
