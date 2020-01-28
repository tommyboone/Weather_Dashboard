

$(document).ready(function () {

    var city = $("#searchTerm").val();
    var apiKey = "&APPID=49b107df79df951ca90870bc8b2042c1";
    var date = new Date();
    var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");

    var searchedCities = JSON.parse(localStorage.getItem("city-list"))
    if (searchedCities) {
        for (var i = 0; i < searchedCities.length; i++) {
            makeList(searchedCities[i]);
        }
    }


    $("#searchBtn").on("click", function (event) {
        event.preventDefault();

        $('#forecastH5').addClass('show');

        // get the value of the input from user
        city = $("#searchTerm").val();

        // clear input box
        $("#searchTerm").val("");
        makeList(city);
        saveLocalStorage(city);
        // full url to call api
        getWeather(city);


    });
    function getWeather(city) {
        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + apiKey;

        $.ajax({
            url: queryUrl,
            method: "GET"
        })
            .then(function (response) {

                console.log(response);

                var tempF = (response.main.temp);
                console.log(Math.round(tempF));



                getCurrentConditions(response);
                getCurrentForecast(response);


            })
    }

    function makeList(city) {
        let listItem = $("<li>").addClass("list-group-item").text(city);
        $(".list").append(listItem);



    }

    function saveLocalStorage(newCity) {
        var oldCityList = JSON.parse(localStorage.getItem("city-list"))
        if (!oldCityList) {
            var cityList = [];
            cityList.push(newCity);
            var strList = JSON.stringify(cityList);
            localStorage.setItem("city-list", strList);
        } else {
            oldCityList.push(newCity);
            var strList = JSON.stringify(oldCityList);
            localStorage.setItem("city-list", strList);
        }



    }

    $(document).on('click', '.list-group-item', function () {
        console.log("You got clicked!", $(this).text());
        getWeather($(this).text());
    })


    function getCurrentConditions(response) {

        // get the temperature round to the next whole number
        var tempF = Math.round(response.main.temp);
        var feelsLike = Math.round(response.main.feels_like)
        var windSpeed = Math.round(response.wind.speed);

        $('#currentCity').empty();

        // get and set the content 
        var card = $("<div>").addClass("card");
        var cardBody = $("<div>").addClass("card-body");
        var city = $("<h4>").addClass("card-title").text(response.name);
        var cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
        var temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + " °F");
        var tempFeel = $("<p>").addClass("card-text").text("Feels Like: " + feelsLike + " °F");
        var humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
        var wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + windSpeed + " MPH");
        var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")


        // add to page
        city.append(cityDate, image)
        cardBody.append(city, temperature, tempFeel, humidity, wind, uvIndex);
        card.append(cardBody);
        $("#currentCity").append(card)

    }

    function getCurrentForecast() {

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + apiKey,
            method: "GET"
        }).then(function (response) {

            console.log(response)
            console.log(response.dt)
            $('#forecast').empty();

            var results = response.list;
            console.log(results)

            //declare start date to check against
            //have end date, endDate = startDate + 5

            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/uvi?lat=" + response.city.coord.lat + "&lon=" + response.city.coord.lon + apiKey,
                method: "GET"
            }).then(function (data) {

                uvIndex.text("UV Index:  " + data.value);

                var dayIndex = 0;

                for (var i = 0; i < results.length; i++) {

                    var day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
                    var hour = results[i].dt_txt.split('-')[2].split(' ')[1];
                    console.log(day);
                    console.log(hour);

                    if (results[i].dt_txt.indexOf("12:00:00") !== -1) {

                        const today = new Date()
                        const tomorrow = new Date(today)
                        tomorrow.setDate(tomorrow.getDate() + dayIndex)
                        // get the temperature round to next whole number
                        var temp = (results[i].main.temp);
                        var tempF = Math.round(temp);

                        var card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
                        var cardBody = $("<div>").addClass("card-body p-3 forecastBody")
                        var cityDate = $("<h4>").addClass("card-title").text(tomorrow.toLocaleDateString("en-US"));
                        var temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempF + "° F");
                        var humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");

                        var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")

                        cardBody.append(cityDate, image, temperature, humidity);
                        card.append(cardBody);
                        $("#forecast").append(card);
                        dayIndex++;
                    }
                }
            })
        });

    }


});


