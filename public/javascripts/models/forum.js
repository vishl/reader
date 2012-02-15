App.Models.Forum = Backbone.Model.extend({
    //introspection
    _class:'Forum',
    _members:['posts'],

    urlRoot: 'forums',
    initialize:function(){
      this.posts=new App.Collections.Posts(null,{forum:this})
    },

    //override parse so we can handle a response that includes posts
    //the resp objection should structured as follows (in json)
    //forum=><forum attributes>
    //posts=>[{post=><post attributes>, comments=>[{comment=>{comment attributes}}, ...]},
    //        {post=><post attributes>, comments=>[{comment=>{comment attributes}}, ...]},
    //        ...
    //       ]
    parse:function(resp){
      //var robj = $.parseJSON(resp)
      var f = resp.forum;
      var p = resp.posts;
      //convert back to json to send to posts collection, a little inefficient, but so modular!
      //var postsJson = $.toJSON(postsobj); 
      if(p) console.log("got "+p.length+"posts");
      //silently reset because we're about to call render on the forum anyways
      this.posts.reset(p, {silent:true});
      this.posts.initAll();
      return f;
    }

})

