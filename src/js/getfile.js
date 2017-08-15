export function get(file) {
  return new Promise(function(resolve, reject) {
    var xhttp = new XMLHttpRequest();
    console.log("Test");
    xhttp.onreadystatechange = function() {
      if(xhttp.readyState === XMLHttpRequest.DONE) {
        if(xhttp.status === 200) {
          resolve(xhttp.responseText);
        } else {
          reject(xhttp.status);
        }
      }
    }
    xhttp.open('GET',file,true);
    xhttp.send();
  });
};
