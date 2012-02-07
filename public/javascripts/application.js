var ONE_WEEK = 1000*60*60*24*7; //milliseconds
var Days = ["Sun","Mon","Tue","Wed","Thurs","Fri","Sat"];
var Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
$(function(){
    $(".date-delta").each(function(){
        var datestr = $(this).html();
        var date= new Date(datestr); //not sure why Date(datestr) doesn't work
        var today = new Date();
        var newdate = ""
        var h = date.getHours();
        var m = date.getMinutes();
        var ampm = h>=12?"PM":"AM"
        if(h>12)
          h-=12;
        if(h==0)
          h=12;

        if((date.getFullYear() == today.getFullYear()) &&
          (date.getMonth() == today.getMonth()) &&
          (date.getDate() == today.getDate())){
          newdate = h+":"+(m<10?"0":"")+m+" "+ampm;
        }else if(today-date < ONE_WEEK){
          newdate = Days[date.getDay()]+" "+h+" "+ampm
        }else{
          newdate = Months[date.getMonth()]+" "+date.getDate();
        }
        $(this).html(newdate)
    })
})

