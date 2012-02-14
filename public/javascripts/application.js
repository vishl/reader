var App = {
  Views:       {},
  Routers:     {},
  Models:      {},
  Collections: {},
  Singletons:  {},
  init: function() {
    console.log("init");
    this.userCredentials = new App.Models.UserCredentials()
    this.userCredentials.fetch();
    this.router = new App.Routers.Main()
    Backbone.history.start();
  },

  Singleton: function(className, obj, method){
    if(method == "destroy"){
      delete App.Singletons[className]
    }else{
      if(App.Singletons[className]){
        throw className+" object already exists";
      }else{
        if(obj){
          App.Singletons[className] = obj;
        }else{
          throw "Object must evaluate to true, got:" + obj
        }
      }
    }
  },
};

//This overrides the toJSON function to always insert the authenticity token
Backbone.Model.prototype.toJSON = function() {
  if(this.objName){
    //attempt to pass data as an object, but it doesn't work because it's not 'form data'
    var ret={}
    var objName = this.objName;
    _.each(this.attributes, function(v,k){
        ret[objName+'['+k+']']=v;
    })
    ret['authenticity_token'] = $('meta[name="csrf-token"]').attr('content')
    return ret;
  }else{
    return _(_.clone(this.attributes)).extend({
        'authenticity_token' : $('meta[name="csrf-token"]').attr('content')
    });
  }
}

