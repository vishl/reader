/*global Backbone _*/
////////////////////////////////// Backbone Extensions /////////////////////////
//This overrides the toJSON function to always insert the authenticity token
Backbone.Model.prototype.toJSON = function() {
  if(this.objName){
    //attempt to pass data as an object, but it doesn't work because it's not 'form data'
    var ret={};
    var objName = this.objName;
    _.each(this.attributes, function(v,k){
        ret[objName+'['+k+']']=v;
    });
    ret['authenticity_token'] = $('meta[name="csrf-token"]').attr('content');
    return ret;
  }else{
    return _(_.clone(this.attributes)).extend({
        'authenticity_token' : $('meta[name="csrf-token"]').attr('content')
    });
  }
};

//inject server data as if we just finished a 'fetch' operation
//useful if the server sends additional data with another object
//(e.g. Retriving a post also sends comments for that post)
Backbone.Model.prototype.inject = function(resp, xhr, options){
  return this.set(this.parse(resp, xhr), options);
};

//models should be Backbone.Model objects or an attributes (post parse) object
Backbone.Collection.prototype.merge = function(models, options){
  var u = [];  //unique
  var n = [];  //non-unique
  var i,m;
  options = options || {};
  for(i in models){
    m = (models[i].id!==undefined)? this.get(models[i].id):null;
    if(m){
      n.push(models[i]);
      //merge values into existing model
      if(options.parse){
        m.inject(models[i], null, options); //TODO modify set to take the parse option
      }else{
        m.set(models[i], options);
      }
    }else{
      u.push(models[i]);
    }
  }
  this.add(u, options);//add the new stuff
  return {added:u, merged:n};
};

/*
 * jammit doesn't like this function and i'm not really using it
//add a getState function to models and collections which just summarizes all
//the id's
Backbone.Model.prototype.getState = function(){
  var ret = {class:this._class, id:this.id};
  if(this._members instanceof Array){
    for(var i in this._members){
      var m = this._members[i];
      if(this[m].getState instanceof Function){
        ret[m] = this[m].getState();
      }
    }
  }
  return ret;
};
*/

Backbone.Collection.prototype.getState = function(){
  return this.map(function(m){
      if (m.getState instanceof Function){
        return m.getState();
      }
  });
};

Backbone.View.prototype.close = function () {
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.remove();
    this.unbind();
};

Backbone.FormView = Backbone.View.extend({
    __postDisable:false,
    events:{
      "submit form":"__post"
    },
    /*to add events in your child class, do it like this:
     events: _.extend({
         "dblclick": "dblclick"
     }, Backbone.FormView.prototype.events),
     */
    

    __post: function(e){
      var self=this;
      if(!self._postDisable){  //prevent multiple submissions
        console.log("post");
        if(self.beforePost){
          if(!self.beforePost()){
            return false;
          }
        }

        self.$el.removeModelErrors();
        self.$el.addClass('loading');
        self._postDisable=true;
        var attrs = {};
        for(var k in this.model.attributes){
          var item = self.$el.find('form #'+k);
          if(item.length){
            if(item.attr("type")==="checkbox"){
              attrs[k] = item.is(":checked");
            //TODO radio buttons
            }else{
              attrs[k]=item.val();
            }
          }
        }
        var errorFn = function(model, errors){
          console.log("error");
          console.log(errors);
          if(errors.responseText){  //this is what a response from the server looks like
            errors=JSON.parse(errors.responseText);
          }
          self.$el.removeClass('loading');
          self._postDisable=false;
          self.$el.displayModelErrors(errors);
          //setTimeout(function(){self.$el.removeModelErrors();}, 2000);
        };
        var successFn = function(model, resp){
          console.log("success");
          console.log(resp);
          self.$el.removeClass('loading');
          self._postDisable=false;
          if(self.afterSave)self.afterSave(model, resp);
          self.trigger("posted", self.model);
        };

        if(this.options.noSave){
          if(this.model.set(attrs,{error:errorFn})){
            successFn.call(this, this.model,null);
          }
        }else{
          this.model.save(
            attrs,
            {
              success:successFn,
              error:errorFn
            }
          );
        }
      }
      return false;
    },
});

/*
 * Input
 * v = validator(
    { name:{presence:true},
      text:{presence:true,
            presence_message:"Please enter text",
            format:/[A-Za-z ]/,
            format_message:"Please only characters and spaces",
            message:"This message will be used in the absence of a specific *_message"
          },
    }
   )
   Output 
    { name:["name is blank"],
      text:["Please enter text", "Please only characters and spaces"]
    }
    Call as v({a:'val', b:'dont val'}, {a:true}) //second argument is optional
*/

function Validator(validations){
  return function(attrs, options){
    var errors={
      __count:0,
      __add : function(k, m){
        if(k in this)
          this[k].push(m);
        else
          this[k] = [m];
        this.__count++;
      }
    };
    var it = validations;
    if(options && options.only) it = options.only;
    for(var k in it){
      var val = validations[k];
      for(var trait in val){
        switch (trait){
          case 'presence':
            if(_.isEmpty(attrs[k])){
              errors.__add(k, val['presence_message'] || val['message'] || (k+ " must be present"));
            }
            break;
          case 'format':
            if(!String(attrs[k]).match(val[trait])){
              errors.__add(k, val['format_message'] || val['message'] || (k+ " is formatted incorrectly"));
            }
            break;

          //TODO more validators
        }
      }
    }
    if(errors.__count) return errors;
  };
}

$.fn.displayModelErrors = function (errors, options){
  var $this = $(this);
  for(var id in errors){
    var $inp = $this.find('#'+id);
    if($inp.length){
      $inp.tooltip({title:errors[id].join(), trigger:'manual'});
      $inp.tooltip('show');
      $inp.addClass('model-error');
    }
  }
  return this;
};

$.fn.removeModelErrors = function(form){
  $(this).find('.model-error').each(function(){
      $(this).removeClass('model-error')
             .tooltip('hide')
             .data('tooltip', null);
  });
};
