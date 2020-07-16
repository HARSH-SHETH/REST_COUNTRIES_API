var regions = document.body.querySelectorAll(".filter_regions li");
var countryDiv = document.body.querySelector(".countries > div");
var filterDiv = document.querySelector(".filter_regions");
var theme = document.querySelector(".theme");
var filterForm = document.querySelectorAll(".filter");
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
      // PREVENT FORM FROM SUBMITTING
      const element = document.querySelector("form").addEventListener("submit", function(e){
        e.preventDefault();
      });
      if(this.value == "")
        showCountries("all");
      else
        showCountries("name/" + this.value.toLowerCase());
      this.value = "";
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
  getXmlData(keyString, function(data){
    countryDiv.innerHTML = "";
    for(var i = 0; i < data.length; i++)
      countryDiv.innerHTML +=
      "<div><img src=\"" + data[i].flag + "\"><div class=\"info\">" +
      "<h1 data-name=\"" + data[i].name.toLowerCase() + "\">" + data[i].name + "</h1>" + 
        "<p>Population: <span>" + 
      Intl.NumberFormat().format(data[i].population) + 
        "</span></p>" +
        "<p>Region: <span>" + data[i].region + "</span></p>" +
        "<p>Capital: <span>" + data[i].capital + "</span></p>" +
        "</div></div>";
    showCountryDetail();
  });
}

// ADD EVENT HANDLER TO EACH COUNTRY DIV
function showCountryDetail(){
  var country = document.querySelectorAll(".countries > div > div");
  country.forEach(function(c){
    c.addEventListener("click", function(){
      toggleDisplay(filterForm, "none");  // SET DISPLAY TO NONE
      toggleDisplay(country, "none"); // SET DISPLAY TO NONE;
      var keyString = "name/" + this.querySelector("h1").getAttribute("data-name") + "?fullText=true";
      var borderString = "";
      getXmlData(keyString, function(data){
        document.querySelector(".countryFlag").innerHTML = 
          "<img src=\"" + data[0].flag + "\">";
        document.querySelector(".countryDetail").innerHTML = "<h1>" + data[0].name + "</h1>" + 
          "<div>" +
          "<div>"+
          "<p>" + "Native Name: <span>" + data[0].nativeName + "</span></p>" + 
          "<p>" + "Population: <span>" + Intl.NumberFormat().format(data[0].population) + "</span></p>" + 
          "<p>" + "Region: <span>" + data[0].region + "</span></p>" + 
          "<p>" + "Sub Region: <span>" + data[0].subregion + "</span></p>" + 
          "<p>" + "Capital: <span>" + data[0].capital + "</span></p>" + 
          "</div>" + 
          "<div>" + 
          "<p>" + "Top Level Domain: <span>" + data[0].topLevelDomain[0] + "</span></p>" + 
          "<p>" + "Currencies: <span>" + data[0].currencies[0].name + "</span></p>" + 
          "<p>" + "Languages: <span>"  + getLanguages(data[0].languages)     + "</span></p>" +
          "</div>" + 
          "</div>" +
          "<div class=\"border_countries\">" + 
          "<span>Border Countries: </span>" +
          "<div class=\"buttons\"></div>" +
          "</div>";
        var array = data[0].borders;
        for(var i = 0; i < array.length; i++){
          borderString += array[i].toLowerCase() + ";";
        }
        console.log(borderString);
        keyString = "alpha?codes=" + borderString;
        borderString = getXmlData(keyString, function(data){
          for(var i = 0; i < data.length; i++){
            document.querySelector(".buttons").innerHTML += "<button>" + data[i].name.split(" ")[0] + "</button>";
          }
        });
        toggleDisplay(document.querySelectorAll(".country"), "block");
      });
    });
  });
}

// return language string
function getLanguages(array){
  var langString = "";
  for(var i = 0; i < array.length; i++){
    if(i == array.length-1)
      langString += array[i].name;
    else
      langString += array[i].name + ", ";
  }; 
  return langString;
}

// set display to none 
function toggleDisplay(element, display){
  element.forEach(function(e){
    e.style.display = display;
  });
}
// MAKE A API REQUEST AND EXECUTE CALLBACK
function getXmlData(keyString, callback){
  var request = new XMLHttpRequest();
  request.open("GET", "https://restcountries.eu/rest/v2/"+ keyString, true);
  request.responseType = 'json';
  request.onload = function(){
    callback(request.response);
  }
  request.send();
}
