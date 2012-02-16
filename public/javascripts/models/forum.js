/*global App Backbone _*/
App.Models.Forum = Backbone.Model.extend({
    //introspection
    _class:'Forum',
    _members:['posts'],

    urlRoot: 'forums',
    initialize:function(){
      this.posts=new App.Collections.Posts(null,{forum:this});
    },

    //override parse so we can handle a response that includes posts
    //the resp objection should structured as follows 
    //forum=><forum attributes>
    //posts=>[{post=><post attributes>, comments=>[{comment=>{comment attributes}}, ...]},
    //        {post=><post attributes>, comments=>[{comment=>{comment attributes}}, ...]},
    //        ...
    //       ]
    parse:function(resp){
      var f = resp.forum;
      var p = resp.posts;
      if(p){
        console.log("got "+p.length+"posts");
      }

      var merged = this.posts.merge(p, {parse:true});
      //TODO for nonunique posts, examine comments

      //TODO get rid of this shit
      //keep track of latest post/comment (only from fetch)
      if(resp.latest_post && (!this.latest_post || resp.latest_post.timestamp>this.latest_post.timestamp)){
        this.latest_post = resp.latest_post;
      }
      if(resp.latest_comment && (!this.latest_comment || resp.latest_comment.timestamp>this.latest_comment.timestamp)){
        this.latest_comment = resp.latest_comment;
      }



      return f;
    }

});

