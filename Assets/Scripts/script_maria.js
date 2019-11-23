/*
user types a city in the search bar
city gets prepended below the search bar
api.openweathermap.org/data/2.5/forecast?lat=35&lon=139
call api with info and display the weather for today in the first row on the right  and the weather for the next five days below
*/
var key = "8b03830118ea1502c8d1ce9605fe6485";
var latitude;
var longitude;

$(document).ready(function(event){
    console.log("doc ready")
    ///issue: if user presses enter key it only kinda work
    $('.ui.form').validate({
        rules: {
            destination: {
                required: true
            }
        },
        messages : {
            destination: {
                required: "Please enter a valid destiation"
            }
        },
        submitHandler: function() {
            //event.preventDefault();
            console.log("Submitted!")
            var cityTxt = $("#cityinput").val();
            $("#cityinput").val("");
            currentWeatherAPICall(cityTxt);  
            createContainer(cityTxt);
            getAirportCode(cityTxt);
            getPOIs(cityTxt);
        }
    });
    

})

function currentWeatherAPICall(city){
    var queryURLCurentWeather = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=Imperial&appid=" + key;
    ////add success: getPOIs()
    $.ajax({
        url: queryURLCurentWeather,
        method: "GET"
    }).then(function(resp){
        console.log("current weather api")
        console.log(resp)
        var cityName = resp.city.name=== null ? "" : resp.city.name;
        var cityNameNoSpace = cityName.split(' ').join('_')
        latitude = resp.city.coord.lat
        longitude = resp.city.coord.lon
        var response = buildWeatherList(resp.list)
        createWeatherContainer("#currentweather",response[0])
        for(var i = 1; i<=5; i++){   
            createWeatherContainer("#futureweather",response[i])                          
        }        
    })    
}

function buildWeatherList(JSONList){
    var arr = [];
    var arrDayZero = [];
    var arrDayOne = [];
    var arrDayTwo = [];
    var arrDayThree = [];
    var arrDayFour = [];
    var arrDayFive = [];
    var dayZero = moment().format("MM-DD-YYYY");
    var dayOne = moment().add(1, 'days').format("MM-DD-YYYY");
    var dayTwo = moment().add(2, 'days').format("MM-DD-YYYY");
    var dayThree = moment().add(3, 'days').format("MM-DD-YYYY");
    var dayFour = moment().add(4, 'days').format("MM-DD-YYYY");
    var dayFive = moment().add(5, 'days').format("MM-DD-YYYY");    
    var count = 0
    JSONList.forEach(obj => {
        var dateForcast = moment.unix(obj.dt).format("MM-DD-YYYY");
        
        if((dayOne) === dateForcast){
            arrDayOne.push(obj);    
        }
        else if((dayTwo) === dateForcast){
            arrDayTwo.push(obj);
        }
        else if((dayThree) === dateForcast){
            arrDayThree.push(obj)
        }
        else if((dayFour) === dateForcast){
            arrDayFour.push(obj)
        }
        else if((dayFive) === dateForcast){
            arrDayFive.push(obj)
        }    
        count ++
    });
    arr.push(JSONList[0]); 
    arr.push(arrDayOne[(Math.round(arrDayOne.length/2))-1])
    arr.push(arrDayTwo[(Math.round(arrDayTwo.length/2))-1])
    arr.push(arrDayThree[(Math.round(arrDayThree.length/2))-1])
    arr.push(arrDayFour[(Math.round(arrDayFour.length/2))-1])
    arr.push(arrDayFive[(Math.round(arrDayFive.length/2))-1])
    console.log(arr)
    return arr
}

function createWeatherContainer(id,obj){
    var date = obj.dt=== null ? "" : moment.unix(obj.dt).format("MM-DD-YYYY"); 
    var weathersign = obj.weather[0].main=== null ? "" : obj.weather[0].main;
    var iconcode = obj.weather[0].icon;
    var iconurl = weatherconditions(iconcode);
    var temperature = obj.main.temp=== null ? "" : obj.main.temp;
    var humidity = obj.main.humidity=== null ? "" : obj.main.humidity;
    var windSpeed = obj.wind.speed=== null ? "" : obj.wind.speed;
    if(id === "#currentweather"){
        $(id).append(`
            <div class="ui centered card fluid" style="text-align: center; box-shadow: none;">
                <div class="content">
                    <div class="header" style="font-size: 40px; border: none; box-shadow: none; text-align: left;">Weather</div>
                </div>
                <div class="content">
                    <div class="header" style="font-size: 30px; border: none; box-shadow: none;">Now</div>
                </div>
                <div class="content" style="border: none; margin-top:-10px;">
                    <h4 class="ui sub header"><img id="wicon" src="${iconurl}" alt="Weather icon" style="font-size: 50px;"></h4>
                    <div class="ui small feed">
                        <div class="event">
                            <div class="content" style="text-align: center;">
                                <div class="summary" style="font-size: 50px;">
                                ${Math.round(temperature)+" "+String.fromCharCode(8457)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }
    else{
        $(id).append(`
            <div class="column">
                <div class="ui centered card fluid" style="text-align: center; border: none; box-shadow: none;">
                    <div class="content">
                        <div class="header" style="font-size: 30px; border: none; box-shadow: none;">${date}</div>
                    </div>
                    <div class="content" style="border: none;">
                        <h4 class="ui sub header"><img id="wicon" src="${iconurl}" alt="Weather icon" style="font-size: 50px;"></h4>
                        <div class="ui small feed">
                            <div class="event">
                                <div class="content" style="text-align: center;">
                                    <div class="summary" style="font-size: 20px;">
                                    ${Math.round(temperature)+" "+String.fromCharCode(8457)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `)  
    }
}

function createContainer(city,airport){
    var cityNoSpace = city.split(' ').join('_')
    $("#resultstxt").prepend(`
    <div class="ui segments" >
        <div class="ui segment" id="airporttxt" style="color: black; font-size: 30px;">
            <p id="airportcodestring" style="color: black; font-size: 40px; font-weight:bold;">${city}</p>
            <p id="airportcodetxt" style="color: black; font-size: 20px;"></p>
        </div>
        <div class="ui segment">
            <div class="ui five column grid">
                <div class="row" id="currentweather" style="border: none; box-shadow: none;">
                </div>
                <div class="row" id="futureweather">
                </div>
            </div>
        </div>
        <div class="ui segment" id="misc">
            <p style="color: black; text-align: left; font-size: 40px; font-weight:bold; ">Points of Interest</p>
            <p style="color: black; text-align: center; font-size: 20px;"></p>
            <div class="ui cards" id="pois">
            </div>
        </div>
    </div>
    `)
}

function getAirportCode(city){
    var airportlist = ""
    console.log(city)
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
        console.log(response)     
        if(response.length === 0){
            $("#airportcodetxt").text("No airport found near "+city)
        }
        else if(response.length === 1){
            airportlist = response[0].code   
            $("#airportcodetxt").text("Nearest airport: "+airportlist)         
        }
        else{
            response.forEach(element => {
                if(airportlist === ""){
                    airportlist = element.code
                }
                else{
                    airportlist = airportlist +", " +element.code
                }
            });
            console.log("Nearest airports: "+airportlist) 
            $("#airportcodetxt").text("Nearest airports: "+airportlist)
        }
    });
}

function weatherconditions(iconcode){
    var srcLink;
    if(iconcode === "01d"){
        //clear
        srcLink = "Assets/Img/iconfinder_sun_2995005.png"
    }
    else if(iconcode === "01n" || iconcode === "02n" ){
        //clear
        srcLink = "Assets/Img/iconfinder_moon_2995009.png"
    }
    else if(iconcode === "02d" ){
        //partly cloudy
        srcLink = "Assets/Img/iconfinder_cloudy_2995001.png"
    }
    else if(iconcode === "03d" || iconcode === "03n" || iconcode === "04d" || iconcode === "04n" ){
        //cloudy
        srcLink = "Assets/Img/iconfinder_cloud_2995000.png"
    }
    else if(iconcode === "09d" || iconcode === "09n" || iconcode === "10d" || iconcode === "10n"){
        //rain
        srcLink = "Assets/Img/iconfinder_rain-cloud_2995003.png"
    }
    else if(iconcode === "11d" || iconcode === "11n" ){
        //thunder
        srcLink = "Assets/Img/iconfinder_flash-cloud_2995010.png"
    }
    else if(iconcode === "13d" || iconcode === "13n" ){
        //snow
        srcLink = "Assets/Img/iconfinder_snow-cloud_2995007.png"
    }
    else if(iconcode === "50d" || iconcode === "50n" ){
        //mist
        srcLink = "Assets/Img/iconfinder_rain_2995004.png"
    }
    return srcLink
}

function getPOIs(cityTxt){

    console.log('in getPOIs()');
    console.log(cityTxt);

    if (cityTxt == 'Barcelona') {
        console.log('cityTxt == Barcelona');

        var token = 'xViW87Kfb69uLcAUSANFwIqw6Ad6';
        var pois = [];
    
        $.ajax({
            url: 'https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=41.397158&longitude=2.160873&radius=3&categories=SIGHTS,NIGHTLIFE,RESTAURANT,SHOPPING',
            type: 'GET',
            beforeSend: function(POIresponse) {
                POIresponse.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            data: {},
            success: function(POIresponse) {
                console.log('POI call successful.')
                pois = POIresponse.data;
                for (i = 0; i < pois.length; i++) {
    
                    $('#pois').append(`
                        <div class="card">
                            <div class="content">
                            <div class="header">${pois[i].name.toString()}</div>
                            <div class="meta">${pois[i].category.toString()}</div>
                            <div class="description" style="font-size: .9rem">
                            Tags: ${pois[i].tags.toString().replace(/,/g, ', ')}
                            </div>
                            </div>
                        </div>
                    `);        
    
                // <h4 class="ui sub header"><img id="wicon" src="${iconurl}" alt="Weather icon" style="font-size: 50px;"></h4>
    
                } 
            },
            error: function() {
                console.log('Perhaps the auth token expired...')
            },
        });

    } else {
        $('#pois').append(`
        <div class="card">
            <div class="content">
            <div class="header">Lame commercial API</div>
            <div class="meta"></div>
            <div class="description" style="font-size: .9rem">
            The Amadeus POI API requires cash to return data outside of Barcelona. :(
            </div>
            </div>
        </div>
    `);        

    }

}