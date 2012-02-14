var App = {
    Views: {},
    Routers: {},
    Models: {},
    Collections: {},
    init: function() {
      console.log("init");
      this.router = new App.Routers.Main()
      Backbone.history.start();
    }
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

