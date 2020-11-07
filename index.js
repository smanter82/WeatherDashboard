let storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || "[]"
// if (storedHistory !== null) {
storedHistory.map(item => $("#cityList").append(`<li class="list-group-item">${item}</li>`))
// } else {
//     searchCity
// }


$("#cityName").on("click", searchCity)

function searchCity(){
    //set input variable and API query
    
    let cityInput = $("#cityInput").val()
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=imperial&appid=2d589977b92f8d92891bc83cfda86d2c`;
    //set local storage for city search history list
    let array = []
    storedHistory.map(item => array.push(item))
    array.push(cityInput)
    console.log(array)
    console.log(storedHistory)
    localStorage.setItem("searchHistory", JSON.stringify(array))
    //Add searched cities to search history list
    $("#cityList").append(`<li class="list-group-item">${cityInput}</li>`)

    $.ajax({
        url:queryURL,
        method: 'GET'
    }).then(function(response){
        
        let m = moment().format('MM/DD/YYYY') 
        //Set variables for API data
        let location = response.name
        let temperature = response.main.temp
        let humidity = response.main.humidity
        let windSpeed = response.wind.speed

        // $("#weatherToday").empty() <--Why does this make it so the box won't populate also on the button click.
        // Populate today's weather info
        $("h1").append(location + " (" + m + ")")
        $("#temp").append("Temperature: " + JSON.stringify(temperature) + " °F")
        $("#humidity").append("Humidity: " + JSON.stringify(humidity) + "%")
        $("#wSpeed").append("Wind Speed: " + JSON.stringify(windSpeed) + "MPH")
        
        // console.log(response)

        //set latitude and longitude for UV Index ajax call.
        let lat = response.coord.lat
        let lon = response.coord.lon
        let uvURL = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=2d589977b92f8d92891bc83cfda86d2c`
   
        $.ajax({
            url: uvURL,
            method: 'GET'
        }).then(function(uvData){
            // console.log(uvData)
            // console.log(uvData.value)
            //set variable for UV Index data
            let uvIndex = uvData.value
            //Populate UV Index data to today's weather
            $("#uvI").append("UV Index: " + JSON.stringify(uvIndex))

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
        })

    
    })

    //forecast URL is returning 401 (Unauthorized) error.
    // let forecastURL = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${cityInput}&cnt=5&units=imperial&appid=2d589977b92f8d92891bc83cfda86d2c`
    // $.ajax({
    //     url: forecastURL,
    //     method: 'GET'
    // }).then(function(forecastData){
    //     console.log(forecastData)
    // //     console.log(forecastData.list[5])
    // // let forecast = forecastData.list
    // // for (i=0; i<forecastData.list.length; i++) {
    // //     console.log(forecastData.list[i])
    // })
    // $("#uvI").append("UV Index: " + JSON.stringify(uvIndex))


    
    
}
// function searchPlants() {
//     var plantName = $(this).attr("data-name");
//     console.log(plantName)
// }

