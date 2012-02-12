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
  return _(_.clone(this.attributes)).extend({
      'authenticity_token' : $('meta[name="csrf-token"]').attr('content')
  });
}

