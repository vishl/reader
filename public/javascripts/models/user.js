/*global App Backbone _ Validator*/
App.Models.User= Backbone.Model.extend({
    _className: "User",
    defaults:{
      name:"",
      email:"",
      password:"",
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
      App.Singleton(this._class, this);
    },

    //store in local storage
    /*
    sync : function(method, model, options) {
      var resp;
      switch (method) {
        case "read":    
          resp = JSON.parse(localStorage.getItem("user"));
          break;
        case "create":  
        case "update":  
          resp = localStorage.setItem("user", JSON.stringify(model.attributes)) ;
          break;
        case "delete":  
          resp = localStorage.removeItem("user");                           
          break;
      }

      if (resp) {
        options.success(resp);
      } else {
        options.error("Something went wrong");
      }
    },
    */

    signedIn:function(){
      if(this.id && this.id.length)
        return true;
      return false;
    },

});
