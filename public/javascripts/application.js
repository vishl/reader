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

////////////////////////////////// Backbone Extensions /////////////////////////
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

//inject server data as if we just finished a 'fetch' operation
//useful if the server sends additional data with another object
//(e.g. Retriving a post also sends comments for that post)
Backbone.Model.prototype.inject = function(resp, xhr, options){
  return this.set(this.parse(resp, xhr), options)
}

//models should be Backbone.Model objects or an attributes (post parse) object
Backbone.Collection.prototype.merge = function(models, options){
  var u = [];  //unique
  var n = [];  //non-unique
  var i,m;
  options = options || {};
  for(i in models){
    if(m = this.get(models[i].id)){
      n.push(models[i])
      //merge values into existing model
      if(options.parse){
        m.inject(models[i], null, options) //TODO modify set to take the parse option
      }else{
        m.set(models[i], options) 
      }
    }else{
      u.push(models[i])
    }
  }
  this.add(u, options);//add the new stuff
  return {added:u, merged:n};
}

//add a getState function to models and collections which just summarizes all
//the id's
Backbone.Model.prototype.getState = function(){
  var ret = {class:this._class, id:this.id};
  if(this._members instanceof Array){
    for(var i in this._members){
      var m = this._members[i]
      if(this[m].getState instanceof Function){
        ret[m] = this[m].getState()
      }
    }
  }
  return ret;
}

Backbone.Collection.prototype.getState = function(){
  return this.map(function(m){
      if (m.getState instanceof Function){
        return m.getState();
      }
  })
}
