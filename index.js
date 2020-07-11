var regions = document.body.querySelectorAll(".filter_regions li");
var countryDiv = document.body.querySelector(".countries > div");
var filterDiv = document.querySelector(".filter_regions");
var theme = document.querySelector(".theme");
initiate();
function initiate(){
  showCountries("all");
  toggleFilterLists();
  filterByRegion();
  findCountry();
  toggleTheme();
}
// TOGGLE THE DISPLAY OF FILTER LIST
function toggleFilterLists(){
  var arrow = document.querySelector(".fa-angle-down");
  arrow.addEventListener("click", function(){
    if(filterDiv.style.display == "none"){
      filterDiv.style.display = "block";
    }else{
      filterDiv.style.display = "none";
    }
  });
}
// FILTER LIST BY REGION
function filterByRegion(){
  for(var i = 0; i < regions.length; i++){
    regions[i].addEventListener("click", function(){showCountries("region/" + this.getAttribute("data-region"));
      filterDiv.style.display = "none";
    });
  }
}

// EXTRACT TEXT FROM INPUT AND DISPLAY THE COUNTRY
function findCountry(){
  document.querySelector("input").addEventListener("keypress", function(){
    if(event.which == 13){
      if(this.value == "")
        showCountries("all");
      else
        showCountries("name/" + this.value.toLowerCase());
    }
  });
}
// TOGGLE THEME BY CHANGING THE CSS VARIABLES
function toggleTheme(){
  theme.addEventListener("click", function(){
    root = document.documentElement;
    if(getComputedStyle(root, null).getPropertyValue("--header_bg") == "hsl(0, 0%, 100%)"){
      root.style.setProperty("--header_bg", "hsl(209, 23%, 22%)");
      root.style.setProperty("--body_bg", "hsl(207, 26%, 17%)");
      root.style.setProperty("--text_col", "hsl(0, 0%, 100%)");
      root.style.setProperty("--shadow", "hsl(210,17%,15%)");
      root.style.setProperty("--info_text_col", "hsl(209, 9%, 91%)");
      this.parentElement.innerHTML = "<i class=\"fas fa-sun theme\"></i> White Mode";
    }else{
      root.style.setProperty("--header_bg", "hsl(0, 0%, 100%)");
      root.style.setProperty("--body_bg", "hsl(0, 0%, 98%)");
      root.style.setProperty("--text_col", "hsl(200, 15%, 8%)");
      root.style.setProperty("--shadow", "#f3f3f3");
      root.style.setProperty("--info_text_col", "hsl(205, 23%, 22%)");
      this.parentElement.innerHTML = "<i class=\"far fa-moon theme\"></i> Dark Mode";
    }
    theme = document.querySelector(".theme");
    toggleTheme();
  });
}

// DISPLAY COUNTRIES WITH THE GIVEN KEYWORD
function showCountries(keyString){
  var request = new XMLHttpRequest();
  request.open("GET", "https://restcountries.eu/rest/v2/"+ keyString, true);
  request.responseType = 'json';
  request.onload = function(){
    var data = request.response;
    countryDiv.innerHTML = "";
    for(var i = 0; i < data.length; i++)
      countryDiv.innerHTML +=
      "<div><img src=\"" + data[i].flag + "\"><div class=\"info\">" +
      "<h1>" + data[i].name + "</h1>" + 
        "<p>Population: <span>" + 
      Intl.NumberFormat().format(data[i].population) + 
        "</span></p>" +
        "<p>Region: <span>" + data[i].region + "</span></p>" +
        "<p>Capital: <span>" + data[i].capital + "</span></p>"
      "</div></div>";
  }
  request.send();
}
