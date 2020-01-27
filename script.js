

$(document).ready(function () {

    var city = $("#searchTerm").val();
    var apiKey = "&APPID=49b107df79df951ca90870bc8b2042c1";
    var date = new Date();

    $("#searchBtn").on("click", function (event) {
        event.preventDefault();

        $('#forecastH5').addClass('show');

        // get the value of the input from user
        city = $("#searchTerm").val();

        // clear input box
        $("#searchTerm").val("");

        // full url to call api
        var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + apiKey;

        $.ajax({
            url: queryUrl,
            method: "GET"
        })
            .then(function (response) {

                console.log(response)

                console.log(response.name)
                console.log(response.weather[0].icon)

                var tempF = (response.main.temp);
                console.log(Math.round(tempF));

                console.log(response.main.humidity)

                console.log(response.wind.speed)

                getCurrentConditions(response);
                getCurrentForecast(response);
                makeList();

            })
    });

    function makeList() {
        let listItem = $("<li>").addClass("list-group-item").text(city);
        $(".list").append(listItem);
    }

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
        cardBody.append(city, temperature, tempFeel, humidity, wind);
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
            // startDate = 20
            //have end date, endDate = startDate + 5

            for (var i = 0; i < results.length; i++) {

                var day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
                var hour = results[i].dt_txt.split('-')[2].split(' ')[1];
                console.log(day);
                console.log(hour);

                if (results[i].dt_txt.indexOf("12:00:00") !== -1) {

                    // get the temperature round to next whole number
                    var temp = (results[i].main.temp);
                    var tempF = Math.round(temp);

                    var card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
                    var cardBody = $("<div>").addClass("card-body p-3 forecastBody")
                    var cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
                    var temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempF + "° F");
                    var humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");

                    var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")

                    cardBody.append(cityDate, image, temperature, humidity);
                    card.append(cardBody);
                    $("#forecast").append(card);

                }
            }
        });

    }

    // function getUVIndex()

});

//     $("#submitWeather").on('click',function(event){
//         event.preventDefault();

//         var city = $('#city').val();
//         var queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=imperial" + "&APPID=49b107df79df951ca90870bc8b2042c1"
//         var forecast = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + ',us&mode=xml' + "&APPID=49b107df79df951ca90870bc8b2042c1"
//         if (city !== ''){
//             $.ajax({

//                 url: queryURL,
//                 method: "GET",
//                 datatype: "json",
//                 success: function(data){
//                 console.log(data);
//                 console.log(data.main.temp); 

//                 var cityName = (data.name);
//                 $("#cityName").html(cityName + " " + data.sys.country);


//                 var icon = (data.weather[0].icon);
//                 $("#icon").html("<img src='http://openweathermap.org/img/w/" + icon + ".png' alt='Icon depicting current weather.'>");

//                 var temp = Math.round(data.main.temp);  
//                 $("#temp-row").html("Temp:  " + temp + "&deg; F");

//                 var feelsLike =  Math.round(data.main.feels_like);
//                 $("#feelsLike-row").html("Feels like:  " + feelsLike + "&deg; F");

//                 var sky = (data.weather[0].main);
//                 $("#sky-row").html("Condition:  " + sky);

//                 var humidity = Math.round(data.main.humidity);
//                 $("#humidity-row").html("Humidity: " + humidity + "%");

//                 var windSpeed = Math.round(data.wind.speed);
//                 $("#windSpeed-row").html("Wind Speed:  " + windSpeed + " MPH");

//              $.ajax({

//                 url: forecast,
//                 method:"GET",
//                 datatype: "json",
//                 success: function(data){
//                     console.log(data);

//                 }
//              })

//   }  
//             });
//         } else{
//             console.log("error");
//             alert("You must put in a city!");
//         }

//     });


// });
