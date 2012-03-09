/*global GlobalSettings */
function handleErrors(message, url, line){
  if(GlobalSettings && GlobalSettings.deployment==="development"){
  }else{
    alert("Something has gone wrong, you probably need to reload the page");
  }
}
window.onerror = handleErrors;
