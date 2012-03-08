function handleErrors(message, url, line){
  alert("Something has gone wrong, you probably need to reload the page");
}
window.onerror = handleErrors;
