if (typeof console === "undefined" || typeof console.log === "undefined"){
  var console = { log: function() {} };
}


//fix placeholder
//only do this if "input" elements don't have a placeholder attribute, otherwise do the native thing
var input = document.createElement('input');
if(!('placeholder' in input)){ 
  $(function(){
      $('[placeholder]').focus(function() {
          var input = $(this);
          if (input.val() == input.attr('placeholder')) {
            if (this.originalType) {
              this.type = this.originalType;
              delete this.originalType;
            }
            input.val('');
            input.removeClass('placeholder');
          }
      }).blur(function() {
          var input = $(this);
          if (input.val() == '' || input.val() == input.attr('placeholder')) {
            if (this.type == 'password') {
              this.originalType = this.type;
              this.type = 'text';
            }
            input.addClass('placeholder');
            input.val(input.attr('placeholder'));
          }
      }).blur().parents('form').submit(function() {
          $(this).find('[placeholder]').each(function() {
              var input = $(this);
              if (input.val() == input.attr('placeholder')) {
                input.val('');
              }
          })
      });
  })
}
