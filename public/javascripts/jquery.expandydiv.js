
$.fn.expandyDiv = function (options){
  var $this = $(this);
  $this.css("position", "relative");
  $this.css("max-height", options.height);
  $this.css("overflow-y", "hidden");
  //var ctrl = $('<div class="expandy-control" style="position:absolute;top:5px;left:-15px;cursor:pointer">[+]</div>');
  var ctrl = $('<div class="expandy-control" style="cursor:pointer">[+]</div>');
  var open=false;
  $this.append(ctrl);
  ctrl.click(function(){
    if(open){
      open=false;
      ctrl.html('[+]');
      $this.css("max-height", options.height);
    }else{
      open=true;
      ctrl.html('[-]');
      $this.css("max-height", "inherit");
    }
  });
};
