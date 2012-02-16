/*global App Backbone _ Validator*/
App.Models.UserCredentials = Backbone.Model.extend({
    _class: "UserCredentials",
    defaults:{
    },

    initialize:function(){
      //only one user credentials object should exist
      App.Singleton(this._class, this);
    },

    //store in local storage
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

});
