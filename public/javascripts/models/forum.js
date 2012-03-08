/*global App Backbone _ GlobalSettings*/
App.Models.Forum = Backbone.Model.extend({
    //introspection
    _class:'Forum',
    _members:['posts'],

    urlRoot: 'forums',
    //override url function to include 'prefetch' option
    url: function() {
      var base = this.urlRoot;
      if (this.isNew()) return base;
      var u =  base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
      if(this.prefetch){
        return u + '?prefetch=true';
      }else{
        return u;
      }
    },
    prefetch:'false', //if this is true, when we fetch, we also fetch the posts
    initialize:function(){
      _.bindAll(this, 'url');
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
      var v = resp.version;
      if(v!==GlobalSettings.version){
        App.notifier.notify("A new version is available, please reload the page", {type:'success', expire:0});
      }

      if(p){
        console.log("got "+p.length+"posts");
      }

      var merged = this.posts.merge(p, {parse:true});

      return f;
    }

});

