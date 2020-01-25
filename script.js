

$(document).ready(function(){

    $("#submitWeather").on('click',function(event){
        event.preventDefault();

        var city = $('#city').val();
        var queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=imperial" + "&APPID=49b107df79df951ca90870bc8b2042c1"
        var forecast = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + ',us&mode=xml' + "&APPID=49b107df79df951ca90870bc8b2042c1"
        if (city !== ''){
            $.ajax({

                url: queryURL,
                method: "GET",
                datatype: "jsonp",
                success: function(data){
                console.log(data);
                console.log(data.main.temp); 

                var cityName = (data.name);
                $("#cityName").html(cityName + " " + data.sys.country);
                

                var icon = (data.weather[0].icon);
                $("#icon").html("<img src='http://openweathermap.org/img/w/" + icon + ".png' alt='Icon depicting current weather.'>");

                var temp = Math.round(data.main.temp);  
                $("#temp-row").html("Temp:  " + temp + "&deg; F");
              
                var feelsLike =  Math.round(data.main.feels_like);
                $("#feelsLike-row").html("Feels like:  " + feelsLike + "&deg; F");

                var sky = (data.weather[0].main);
                $("#sky-row").html("Condition:  " + sky);

                var humidity = Math.round(data.main.humidity);
                $("#humidity-row").html("Humidity: " + humidity + "%");

                var windSpeed = Math.round(data.wind.speed);
                $("#windSpeed-row").html("Wind Speed:  " + windSpeed + " MPH");

             $.ajax({

                url: forecast,
                method:"GET",
                datatype: "jsonp",
                success: function(data){
                    console.log(data);

                }
             })
                
  }
            });
        } else{
            console.log("error");
            alert("You must put in a city!");
        }

    });

  
});
