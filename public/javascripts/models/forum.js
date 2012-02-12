App.Models.Forum = Backbone.Model.extend({
    urlRoot: 'forums',
    initialize:function(){
      this.posts=new App.Collections.Posts()
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
      console.log("got "+p.length+"posts");
      this.posts.reset(p);
      return f;
    }
})

