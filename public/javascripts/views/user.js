App.Views.UserCredentials = Backbone.View.extend({
    events:{
      "keyup input":"update",
    },

    initialize:function(){
      _.bindAll(this);
      this.model.bind("sync", this.changed)
      this.render();
    },

    render: function(){
      console.log("render user")
      this.$el.html(JST['sessions/show']({name:this.model.get("name")}))
      return this;
    },

    changed: function(){
      //only change if we're not up to date
      if(this.$el.find('input').val()!=this.model.name){
        this.$el.find('input').val(this.model.name);
      }
      return this;
    },

    update:function(e){
      console.log("updating name")
      this.model.save({
          name:this.$el.find('input').val(),
      })
    },

})

