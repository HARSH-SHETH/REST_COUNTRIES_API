window.onload = function(){
  var request = new XMLHttpRequest();
  request.open("GET", "https://restcountries.eu/rest/v2/all");
  request.responseType = 'json';
  request.onload = function(){
    var data = request.response;
    for(var i = 0; i < data.length; i++)
      document.body.querySelector(".countries div").innerHTML += "<div><img src=\"" + data[i].flag + "\"></div>";
  }
  request.send();
}
