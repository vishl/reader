App.Views.UserCredentials = Backbone.View.extend({
    events:{
      "keyup input":"update",
    },

    initialize:function(){
      _.bindAll(this);
      this.model.bind("sync", this.changed)
      $(document).on("promptName", this.showPrompt)
      this.render();
    },

    render: function(){
      console.log("render user")
      this.$el.html(JST['sessions/show']({name:this.model.get("name")}))
      this.$el.find('input').tooltip({title:"Please enter your name", placement:'bottom', trigger:'manual'})
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

    showPrompt: function(e){
      console.log("show prompt")
      var self=this;
      self.$el.find('input').tooltip('show')
      setTimeout(function(){
        self.$el.find('input').tooltip('hide')
      }, 2000)
    }


})

