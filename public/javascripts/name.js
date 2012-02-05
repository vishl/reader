$(function(){
    //store the name locally
    if(localStorage.name){
      setName(localStorage.name)
      $('input#name').val(localStorage.name);
    }else{
      alert("Enter your name in the top right")
    }

    $('input#name').keyup(function(){
        setName($(this).val())
    })

})

function setName(n){
  localStorage.name = n;
  $('input.name').val(n);
  $('#username').html(n);
  $('#username-uri').html(encodeURIComponent(n));
}

