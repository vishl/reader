/*global Backbone _ User*/
var App = {
  Views:       {},
  Routers:     {},
  Models:      {},
  Collections: {},
  Singletons:  {},
  init: function() {
    console.log("init");
    this.user= new App.Models.User();
    if((typeof User!=="undefined") && (User !== null)){
      this.user.inject(User);
    }
    this.router = new App.Routers.Main();
    Backbone.history.start();
  },

  Singleton: function(className, obj, method){
    if(method === "destroy"){
      delete App.Singletons[className];
    }else{
      if(App.Singletons[className]){
        throw className+" object already exists";
      }else{
        if(obj){
          App.Singletons[className] = obj;
        }else{
          throw "Object must evaluate to true, got:" + obj;
        }
      }
    }
  },
};

