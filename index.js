//I need help with:  
//How do I get the weather icons to pop up on forecast?
//How do I get the for loop to work on the 5 day forecast?  (Or do I have to have each day populate separately?)
//Am I using .toFixed() correctly?

//Populate Search History on page loading
let storedHistory = JSON.parse(localStorage.getItem("searchHistory"))
if (storedHistory) {
storedHistory.map(item => $("#cityList").append(`<li class="list-group-item">${item}</li>`))
}


$("#cityName").on("click", searchCity)

function searchCity(){
    //set input variable and API query
    let cityInput = $("#cityInput").val()
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=imperial&appid=2d589977b92f8d92891bc83cfda86d2c`;
 
    let storedHistory = JSON.parse(localStorage.getItem("searchHistory"))
    console.log(storedHistory)
    //set local storage for city search history list
    let array = []
    // console.log(storedHistory)
    if (storedHistory) {
    storedHistory.map(item => array.push(item))
    array.push(cityInput)
    localStorage.setItem("searchHistory", JSON.stringify(array))
    } else {
        console.log(cityInput)
        array.push(cityInput)
        localStorage.setItem("searchHistory", JSON.stringify(array))  
        console.log(storedHistory)
    }
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
            //forecast URL is returning 401 (Unauthorized) error.
            let forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=2d589977b92f8d92891bc83cfda86d2c`

            $.ajax({
                url: forecastURL,
                method: 'GET'
            }).then(function(forecastData){
                console.log(forecastData)
                console.log(forecastData.daily[1])
                let forecast = forecastData.daily
                
                

            for (i=1; i<6; i++) {
                console.log(forecast)
                // let icon = forecast[i].weather[0].icon
                // console.log(icon)
                // $('img').append(icon)

                let dailyTemp = forecast[i].temp.day
                let dailyHumidity = forecast[i].humidity
                console.log(dailyHumidity)
                
                $('.dailyTemp').append('Temp: ' + dailyTemp + `<br>` + 'Humidity: ' + dailyHumidity).tofixed(2);
            
            
            }
    
            })

            //set 5-day forecast date variables.
            let day1 = moment().add(1, 'days').calendar('MM/DD/YYYY')
            let day2 = moment().add(2, 'days').calendar('MM/DD/YYYY')
            let day3 = moment().add(3, 'days').calendar('MM/DD/YYYY')
            let day4 = moment().add(4, 'days').calendar('MM/DD/YYYY')
            let day5 = moment().add(5, 'days').calendar('MM/DD/YYYY')

            //append 5-day forecast date variables to forecast containers.
            $("#day1").append(" (" + day1 + ")")
            $("#day2").append(" (" + day2 + ")")
            $("#day3").append(" (" + day3 + ")")
            $("#day4").append(" (" + day4 + ")")
            $("#day5").append(" (" + day5 + ")")
                            

    })
}