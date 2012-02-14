App.Views.Home = Backbone.View.extend({
    model: new App.Models.Forum(),

    events: {
      "submit form": "create"
    },

    initialize: function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      //no model bindings here
      this.render(); //render on init
    },

    create: function(e){
      //TODO add the forum to the list
      this.model.save(
        {
          title: $('#title').val(),
        },
        {
          success:function(model, resp){
            console.log(resp)
            if(resp.has_error){
              //TODO create notice
            }else{
              //navigate to forum
              //trigger causes the router to route
              //TODO create notice
              App.router.navigate('forums/'+resp.forum.sid, {trigger:true})
            }
          },
          error: function(){
            console.log("error")
            //TODO something went wrong
          }
        }
      )
      //e.preventDefault();
      return false;
    },

    render: function(){
      $(this.el).html(JST['pages/home']());
      return this;
    }

})
