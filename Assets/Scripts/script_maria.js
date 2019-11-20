/*
user types a city in the search bar
city gets prepended below the search bar
api.openweathermap.org/data/2.5/forecast?lat=35&lon=139
call api with info and display the weather for today in the first row on the right  and the weather for the next five days below
*/
var key = "8b03830118ea1502c8d1ce9605fe6485";

$(document).ready(function(event){
    console.log("doc ready")
    ///issue: if user presses enter key it doesnt work
    $("#searchbtn").on("click", function(event){
        event.preventDefault();
        console.log("button pressed");
        var cityTxt = $("#cityinput").val();
        $("#cityinput").val("");
        currentWeatherAPICall(cityTxt);   
        createContainer(cityTxt); 
        getAirportCode(cityTxt);
    });

})

function currentWeatherAPICall(city){
    var queryURLCurentWeather = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=Imperial&appid=" + key;
    $.ajax({
        url: queryURLCurentWeather,
        method: "GET"
    }).then(function(resp){
        console.log("current weather api")
        var cityName = resp.city.name=== null ? "" : resp.city.name;
        var cityNameNoSpace = cityName.split(' ').join('_')
        var response = buildWeatherList(resp.list)
        for(var i = 0; i<5; i++){            
            var date = response[i].dt=== null ? "" : moment.unix(response[i].dt).format("MM-DD-YYYY"); 
            var weathersign = response[i].weather[0].main=== null ? "" : response[i].weather[0].main;
            var iconcode = response[i].weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + iconcode + "@2x.png";
            var temperature = response[i].main.temp=== null ? "" : response[i].main.temp;
            var humidity = response[i].main.humidity=== null ? "" : response[i].main.humidity;
            var windSpeed = response[i].wind.speed=== null ? "" : response[i].wind.speed;
            var weatherID="#weatherfivedays"+cityNameNoSpace
            $(weatherID).append(`
            <div class="column">
                <div class="ui card fluid">
                    <div class="content">
                        <div class="header">${date}</div>
                    </div>
                    <div class="content">
                        <h4 class="ui sub header"><img id="wicon" src="${iconurl}" alt="Weather icon"></h4>
                        <div class="ui small feed">
                            <div class="event">
                                <div class="content">
                                    <div class="summary">
                                    ${"Temperature: "+Math.round(temperature)+" "+String.fromCharCode(8457)}
                                    </div>
                                </div>
                            </div>
                            <div class="event">
                                <div class="content">
                                    <div class="summary">
                                        ${"Humidity: "+humidity+" %"}
                                    </div>
                                </div>
                            </div>
                            <div class="event">
                                <div class="content">
                                    <div class="summary">
                                        ${"Wind Speed: "+Math.round(windSpeed)+" MPH"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `)                
            
        }
        
    })
    
    
}

function buildWeatherList(JSONList){
    var arr = [];
    var dayZero = moment().format("MM-DD-YYYY");
    var dayOne = moment().add(1, 'days').format("MM-DD-YYYY");
    var dayTwo = moment().add(2, 'days').format("MM-DD-YYYY");
    var dayThree = moment().add(3, 'days').format("MM-DD-YYYY");
    var dayFour = moment().add(4, 'days').format("MM-DD-YYYY");
    var dayFive = moment().add(5, 'days').format("MM-DD-YYYY");
    JSONList.forEach(obj => {
        var dateForcast = moment.unix(obj.dt).format("MM-DD-YYYY HH");
        if(dayZero === moment.unix(obj.dt).format("MM-DD-YYYY")){
            arr.push(obj);
            
        }
        else if((dayOne + " 12") === dateForcast){
            arr.push(obj);
            
        }
        else if((dayTwo + " 12") === dateForcast){
            arr.push(obj);
        }
        else if((dayThree + " 12") === dateForcast){
            arr.push(obj)
        }
        else if((dayFour + " 12") === dateForcast){
            arr.push(obj)
        }
        else if((dayFive + " 12") === dateForcast){
            arr.push(obj)
        }

        
    });
    console.log(arr)
    return arr
}

function createContainer(city,airport){
    var cityNoSpace = city.split(' ').join('_')
    var weatherID="weatherfivedays"+cityNoSpace
    $("#resultstxt").prepend(`
    <div class="ui segments" >
        <div class="ui segment" id="airporttxt">
            <p id="airportcodestring">Nearest airports in ${city}:</p>
            <p id="airportcodetxt"></p>
        </div>
        <div class="ui segment">
            <div class="ui five column grid" id=${weatherID}>
            </div>
        </div>
        <div class="ui segment" id="misc">
            <p>What to pack</p>
            <p></p>
        </div>
    </div>
    `)
}

function getAirportCode(city){
    var airportlist = ""
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://cometari-airportsfinder-v1.p.rapidapi.com/api/airports/by-text?text="+city,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "cometari-airportsfinder-v1.p.rapidapi.com",
            "x-rapidapi-key": "71b4c678fdmsh03d589cc0b0037ap1bf26bjsn01231eb45922"
        }
    }
    
    $.ajax(settings).then(function (response) {
        
        if(response.length === 0){
            $("#airportcodestring").text("No airport found near "+city)
        }
        else if(response.length === 1){
            airportlist = response.code
        }
        else{
            response.forEach(element => {
                console.log(element)
                if(airportlist === ""){
                    airportlist = element.code
                }
                else{
                    airportlist = airportlist +", " +element.code
                }
            });
            console.log(airportlist)
            $("#airportcodetxt").text(airportlist)
        }

    });
}