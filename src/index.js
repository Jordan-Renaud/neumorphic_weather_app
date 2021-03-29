//document variables
const locationLabel = document.querySelector(".location");
const dateLabel = document.querySelector(".date");
const getLocationButton = document.querySelector(".get-location-button");
const searchCityInput = document.querySelector(".search-city-input");

const currentWeatherImg = document.querySelector(".current-weather-img");
const currentTempLabel = document.querySelector(".current-temp");
const weatherDescriptionLabel = document.querySelector(".weather-description");
const convertTempButton = document.querySelector(".celius-to-farenheit");
const lowTempLabel = document.querySelector(".low-temp");
const highTempLabel = document.querySelector(".high-temp");
const rainPercentageLabel = document.querySelector(".rain-percentage");
const windSpeedLabel = document.querySelector(".wind-speed");
const individualForecasts = document.querySelectorAll(".individual-forecast");

//functionality variables
const openWeatherMapAPIkey = "8d030da1fb95c3588ed90416bc6b659f";
const accuWeatherAPIkey = "PeqNwlVzmYXTRnHfn14Juel2uZejZeRS";
let isCelsius = true;
let celsiusObj = 
    {currentTemp: 0,
    lowTemp: 0,
    highTemp: 0, 
    windSpeed: 0,
    windDirection: "", 
    highArray: []};

let isDayTime = true;

//conversions -windspeed to compass points
function windDirectionConversion(degree) {
    if (degree < 22.5 || degree > 337.5) {
        return "N";
    } else if (degree < 67.5) {
        return "NE";
    } else if (degree < 112.5) {
        return "E";
    } else if (degree < 157.5) {
        return "SE";
    } else if (degree < 202.5) {
        return "S";
    } else if (degree < 247.5) {
        return "SW";
    } else if (degree < 292.5) {
        return "W";
    } else if (degree < 337.5) {
        return "NW";
    } else {
        return "Error";
    };
};

//conversions -weathercode to img
function weatherCodeToImg(code, isDayTime) {
    if ((code >= 200 && code <= 202) || (code >= 230 && code <= 232)) {
        return isDayTime ? "src/weather_icons/rain_lightning.png" : "src/weather_icons/night_rain_lightning.png";
    } else if (code >= 210 && code <= 221) {
        return isDayTime ? "src/weather_icons/lightning.png" : "src/weather_icons/night_lightning.png";
    } else if (code >= 300 && code <= 531) {
        return isDayTime ? "src/weather_icons/rain.png" : "src/weather_icons/night_rain.png";
    } else if (code >= 600 && code <= 602) {
        return isDayTime ? "src/weather_icons/snow.png" : "src/weather_icons/night_snow.png";
    } else if (code >= 611 && code <= 622) {
        return "src/weather_icons/sleet.png";
    } else if (code == 800) {
        return isDayTime ? "src/weather_icons/clear.png" : "src/weather_icons/night_clear.png";
    } else if (code == 801 || code == 802) {
        return isDayTime ? "src/weather_icons/scattered_clouds.png" : "src/weather_icons/night_cloudy.png";
    } else if (code == 803) {
        return "src/weather_icons/cloudy.png";
    } else if (code == 804) {
        return "src/weather_icons/very_cloudy.png";
    } else {
        return "error";
    }
};


//gets current location and triggers handlePostion function
function getLocation(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(handlePosition);
};

//gets latitude and longitude, then calls apis
function handlePosition(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    apiCall(lat, lon);
};

//call apis
function apiCall(lat, lon){
    Promise.all([
        getOpenWeatherJSON(lat, lon),
        getLocationKey(lat, lon)
    ]).then(updateUI)
}

//deals with the openweathermap api
function getOpenWeatherJSON(lat, lon){
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherMapAPIkey}&units=metric`
    console.log(`open weather map url = ${url}`)
    return axios.get(url);
}

//gets the location key to allow accuweather api to call
function getLocationKey(lat, lon){
    const url = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${accuWeatherAPIkey}&q=${lat}%2C${lon}&details=true`;
    console.log(`geoposition search url = ${url}`)
    return axios.get(url).then(getAccuweatherJSON);
}

//call accuweather api to get the high and low temperature.
function getAccuweatherJSON(locationJSON) {
    const locationKey = locationJSON.data.Key;
    const url = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${accuWeatherAPIkey}&metric=true`
    console.log(`accuweather url = ${url}`)
    return axios.get(url);
}

//update data on screen with get location button clicked
function updateUI(JSONarray) {
    const openWeatherJSON = JSONarray[0].data;
    const accuweatherJSON = JSONarray[1].data;

    const currentLocation = `${openWeatherJSON.city.name}, ${openWeatherJSON.city.country}`;
    const date = getDate();
    const currentTemp = `${Math.floor(openWeatherJSON.list[0].main.temp)}`;
    const weatherImg = `${weatherCodeToImg(openWeatherJSON.list[0].weather[0].id, isDayTime)}`
    const weatherDescription = `${openWeatherJSON.list[0].weather[0].description}`;
    const lowTemp = Math.floor(accuweatherJSON.DailyForecasts[0].Temperature.Minimum.Value);
    const highTemp = Math.floor(accuweatherJSON.DailyForecasts[0].Temperature.Maximum.Value);
    const rainPercentage = `${openWeatherJSON.list[0].pop * 100}%`;
    const windSpeed = `${Math.floor(openWeatherJSON.list[0].wind.speed)}km/h ${windDirectionConversion(openWeatherJSON.list[0].wind.deg)}`;
    const futureForecastDays = getFutureDays(date.split(" ")[0]);

    //variable to change between celius and farenheit
    celsiusObj.currentTemp = currentTemp;
    celsiusObj.lowTemp = lowTemp;
    celsiusObj.highTemp = highTemp;
    celsiusObj.windSpeed = Math.floor(openWeatherJSON.list[0].wind.speed);
    celsiusObj.windDirection = windDirectionConversion(openWeatherJSON.list[0].wind.deg);


    locationLabel.innerHTML = currentLocation;
    dateLabel.innerHTML = date;
    currentTempLabel.innerHTML = currentTemp;
    currentWeatherImg.src = weatherImg;
    weatherDescriptionLabel.innerHTML = weatherDescription;
    lowTempLabel.innerHTML = `${lowTemp}°`;
    highTempLabel.innerHTML = `${highTemp}°`;
    rainPercentageLabel.innerHTML = rainPercentage;
    windSpeedLabel.innerHTML = windSpeed;

    individualForecasts.forEach((forecast, index) => {
        forecast.querySelectorAll(".forecast-day")[0].innerHTML = futureForecastDays[index];

        let weatherIDs = getWeatherIDs(openWeatherJSON);
        forecast.querySelectorAll(".forecast-img")[0].src = weatherCodeToImg(weatherIDs[index], isDayTime);

        let highArray = getHighs(openWeatherJSON);
        celsiusObj.highArray = highArray;
        forecast.querySelectorAll(".forecast-temp")[0].innerHTML = `${highArray[index]}°`;
    });
};

//get the date for current location
function getDate() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const now = new Date();
    const day = `${days[now.getDay()]}`;
    const month = `${months[now.getMonth()]}`;
    const date = `${now.getDate()}`
    
    return `${day} ${date}<sup>th</sup>, ${month}`;
}

//gets abbreviated array of days for future forecasts
function getFutureDays(currentDay){
    const abbrDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const abbrCurrentDay = currentDay.substr(0, 3);
    const currentDayIndex = abbrDays.indexOf(abbrCurrentDay);
    const futureDays = abbrDays.slice(currentDayIndex + 1).concat(abbrDays.slice(0, currentDayIndex+1));
    return futureDays.slice(0, 5);
};

//takes openweather JSON to get the weatherIDs for 5 days, returns array.
function getWeatherIDs(weatherJSON) {

    //get days and all ids added to the day, returns an obj of .
    function getDateIdObj(weatherJSON) {
        let dateObj = {};

        weatherJSON.list.forEach(collection => {
            let currentDate = collection.dt_txt.split(" ")[0];
            if (!dateObj.hasOwnProperty(currentDate)) {
                dateObj[currentDate] = [0];
            };
            dateObj[currentDate].push(collection.weather[0].id);
        });

        return dateObj;
    };

    //count repetitions of weatherIDs, return a obj of ids and the amount they repeat.
    function getWeatherIdCountObj(dateIdObj) {
        let dateWeatherIdObj = {};
        
        for (const date in dateIdObj) {
            let idArray = dateIdObj[date];
            dateWeatherIdObj[date] = {};

            idArray.forEach(id => {
                if (!id == 0) {
                    if (dateWeatherIdObj[date].hasOwnProperty(id)) {
                        dateWeatherIdObj[date][id]++;
                    } else {
                        dateWeatherIdObj[date][id] = 1;
                    }
                }
            });
        };
        return dateWeatherIdObj;
    };

    //finds most common id and returns an array
    function findMostCommonID(dateIDCount) {
        let idArray = [];
        let mostCommonID = 0;
        let highestNum = 0;

        for (const date in dateIDCount) {
            let idCountObj = dateIDCount[date];

            for (const id in idCountObj) {
                if (idCountObj[id] > highestNum) {
                    highestNum = idCountObj[id];
                    mostCommonID = id;
                }
            }

            idArray.push(mostCommonID);
            mostCommonID = 0;
            highestNum = 0;
        };

        idArray.shift();
        return idArray;
    };

    const dateIdObj = getDateIdObj(weatherJSON);
    const dateIDCount = getWeatherIdCountObj(dateIdObj);
    const idArray = findMostCommonID(dateIDCount);
    return idArray;
    };


//takes openweather JSON to get the highs for 5 days, returns array.
function getHighs(weatherJSON) {
    let dateDict = {};
    let highArray = [];

    //get days and all temps added to the day.
    weatherJSON.list.forEach(collection => {
        let currentDate = collection.dt_txt.split(" ")[0];
        if (!dateDict.hasOwnProperty(currentDate)) {
        dateDict[currentDate] = [0];
        }
        dateDict[currentDate].push(collection.main.temp);
    });
    
    //iterates through dictionary and adds and rounds the highest temp to highArray
    for (const day in dateDict) {
        highArray.push(Math.floor(Math.max(...dateDict[day])));
    }
    
    //removes first element of highArray as it is the current day.
    highArray.shift();
    return highArray;
};

//checks the passed in city to see if it is an actual city
function checkCitySearched(city) {
    console.log(city)
    const openWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${openWeatherMapAPIkey}&units=metric`
    console.log(`city url = ${openWeatherURL}`)
    axios.get(openWeatherURL).then(getCoordsFromCity).catch(incorrectCityName)
}

//deals with incorrect city names and alerts.
function incorrectCityName(error){
    alert("Error finding city, please try again");
}

//gets the coords for a correct city
function getCoordsFromCity(JSON) {
    const lat = `${JSON.data.city.coord.lat}`;
    const lon = `${JSON.data.city.coord.lon}`;
    apiCall(lat, lon);
}


function updateMeasurementType() {
    if (isCelsius) {
        isCelsius = false;
        setToFarenheit(celsiusObj);
        convertTempButton.innerHTML = "°F";
    } else {
        isCelsius = true;
        setToCelsius(celsiusObj);
        convertTempButton.innerHTML = "°C";
    }
};

function setToCelsius(tempObj){
    currentTempLabel.innerHTML = tempObj.currentTemp;
    lowTempLabel.innerHTML = `${tempObj.lowTemp}°`;
    highTempLabel.innerHTML = `${tempObj.highTemp}°`;
    windSpeedLabel.innerHTML = `${tempObj.windSpeed}km/h ${tempObj.windDirection}`;

    individualForecasts.forEach((forecast, index) => {
        forecast.querySelectorAll(".forecast-temp")[0].innerHTML = `${tempObj.highArray[index]}°`;
    });
};

function setToFarenheit(tempObj){
    let currentTemp = celsiusToFarenheit(tempObj.currentTemp);
    let lowTemp = celsiusToFarenheit(tempObj.lowTemp);
    let highTemp = celsiusToFarenheit(tempObj.highTemp);
    let windSpeed = kmToMiles(tempObj.windSpeed);
    let highArray = [];
    tempObj.highArray.forEach(temp => highArray.push(celsiusToFarenheit(temp)));
    
    currentTempLabel.innerHTML = currentTemp;
    lowTempLabel.innerHTML = `${lowTemp}°`;
    highTempLabel.innerHTML = `${highTemp}°`;
    windSpeedLabel.innerHTML = `${windSpeed}mph ${tempObj.windDirection}`;

    individualForecasts.forEach((forecast, index) => {
        forecast.querySelectorAll(".forecast-temp")[0].innerHTML = `${highArray[index]}°`;
    });
}

function celsiusToFarenheit(num) {
    return Math.floor((num * 9/5) + 32);
}

function kmToMiles(num) {
    return Math.floor(num/1.609);
}



window.onload = getLocation;
getLocationButton.addEventListener("click", getLocation);
searchCityInput.addEventListener('keyup',  function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        let city = searchCityInput.value;
        checkCitySearched(city);
        searchCityInput.value = "";
      }
    });
convertTempButton.addEventListener("click", updateMeasurementType);
