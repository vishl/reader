App.Views.Forum = Backbone.View.extend({

    initialize:function(){
      _.bindAll(this,'render'); //this statement ensures that whenever 'render' is called 'this' is the current value of 'this'
      this.model = new App.Models.Forum({id:this.options.sid})
      this.model.bind("change", this.render)
      this.model.fetch();
      this.render();
    },

    render: function(){
      console.log("render forum")
      $(this.el).html(JST['forums/show']({title:this.model.get("title")}))
      return this;
    }

})
