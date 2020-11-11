//I still need to:

//Icon for City Search Button

//Get unix to come up as readable dates.
    // $(document).ready(function() {
    //   var value = $("#unixtime").val(); //this retrieves the unix timestamp
    //   var dateString = moment(value).calendar(); 
    //   alert(dateString);
    // });


const forecastDays = $("#forecastDays")
//Populate Search History on page loading
let storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
if (storedHistory) {
  storedHistory.map((item) =>
    $("#cityList").prepend(`<li class="list-group-item cityBtn">${item}</li>`)
  );
}
//Search for city weather on input button click.
$("#cityName").on("click", function() {
  const cityInput = $("#cityInput").val();
  storedHistory.push(cityInput)
  localStorage.setItem("searchHistory", JSON.stringify(storedHistory));
  //Add searched cities to search history list
  $("#cityList").prepend(`<li class="list-group-item cityBtn">${cityInput}</li>`);
  searchCity(cityInput)
});
//Search for city data on click of city name from previous search in search history.
$(document).on("click", ".cityBtn", function(){
  console.log($(this).text())
  searchCity($(this).text())
})

//Pull weather data from openweathermap.org

function searchCity(cityInput) {

  //set input variable and API query
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=imperial&appid=2d589977b92f8d92891bc83cfda86d2c`;  

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    //Set today's date in today's weather container.
    let m = moment().format("MM/DD/YYYY");
    
    //Set variables for API data
    let location = response.name;
    let temperature = response.main.temp;
    let humidity = response.main.humidity;
    let windSpeed = response.wind.speed;

    // Clear data from previous searches in today's weather.
    $("h1").empty();
    $("#temp").empty();
    $("#humidity").empty();
    $("#wSpeed").empty();

    // Populate today's weather info
    $("h1").append(location + " (" + m + ")" + `<img id="day1Icon" src = "https://openweathermap.org/img/w/${response.weather[0].icon}.png">`);
    $("#temp").append("Temperature: " + JSON.stringify(temperature) + " °F");
    $("#humidity").append("Humidity: " + JSON.stringify(humidity) + "%");
    $("#wSpeed").append("Wind Speed: " + JSON.stringify(windSpeed) + "MPH");

    //set latitude and longitude for UV Index ajax call.
    let lat = response.coord.lat;
    let lon = response.coord.lon;

    //ajax call to get UV Index data from openweathermap.org
    let uvURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=2d589977b92f8d92891bc83cfda86d2c`;

    $.ajax({
      url: uvURL,
      method: "GET",
    }).then(function (uvData) {
      //set variable for UV Index data
      let uvIndex = uvData.value;
      //clear UV data from previous search.
      $("#uvI").empty()
      //Populate UV Index data to today's weather
      $("#uvI").append("UV Index: " + JSON.stringify(uvIndex));

      //Set color change according to UV Index.
      if (uvIndex < 3) {
        $(`#uvI`).removeClass("white");
        $(`#uvI`).removeClass("yellow");
        $(`#uvI`).removeClass("red");
        $(`#uvI`).addClass("green");
      } else if (uvIndex >= 3 && uvIndex < 8) {
        $(`#uvI`).removeClass("white");
        $(`#uvI`).removeClass("green");
        $(`#uvI`).removeClass("red");
        $(`#uvI`).addClass("yellow");
      } else {
        $(`#uvI`).removeClass("white");
        $(`#uvI`).removeClass("yellow");
        $(`#uvI`).removeClass("green");
        $(`#uvI`).addClass("red");
      }
    });

    //Ajax call for 5-day forecast from openweathermap.org
    let forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=2d589977b92f8d92891bc83cfda86d2c`;

    $.ajax({
      url: forecastURL,
      method: "GET",
    }).then(function (forecastData) {
      let forecast = forecastData.daily;

      //Clear 5-day forecast data from previous search.
      forecastDays.empty()

      //Populate weather data for next 5 days.
      for (i = 1; i < 6; i++) {
        console.log("Creating Card", i);
        const dayCard = 
            `<div class="col">  
             <div class="card-body days">
               <h6 id="day1">${forecast[i].dt}</h6>
               <img id="day1Icon" src = "https://openweathermap.org/img/w/${forecastData.daily[i].weather[0].icon}.png">
               <p class="dailyTemp">${forecast[i].temp.day}</p>
               <p class="dailyHumidity">${forecast[i].humidity}</p>
             </div>
             </div>`
        forecastDays.append(dayCard)
      }
    });
  });
}
