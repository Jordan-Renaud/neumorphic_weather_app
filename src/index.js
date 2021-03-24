//document variables
const locationLabel = document.querySelector(".location");
const dateLabel = document.querySelector(".date");
const getLocationButton = document.querySelector(".get-location-button");
const currentWeatherImg = document.querySelector(".current-weather-img")
const currentTempLabel = document.querySelector(".current-temp");
const weatherDescriptionLabel = document.querySelector(".weather-description");
const lowTempLabel = document.querySelector(".low-temp");
const highTempLabel = document.querySelector(".high-temp");
const rainPercentageLabel = document.querySelector(".rain-percentage");
const windSpeedLabel = document.querySelector(".wind-speed");

//functionality variables
const openWeatherMapAPIkey = "8d030da1fb95c3588ed90416bc6b659f";
const accuWeatherAPIkey = "PeqNwlVzmYXTRnHfn14Juel2uZejZeRS";
let isCelius = true;
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

//gets latitude and longitude
function handlePosition(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    Promise.all([
        getOpenWeatherJSON(lat, lon),
        getLocationKey(lat, lon)
    ]).then(updateUI)
};

function getOpenWeatherJSON(lat, lon){
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherMapAPIkey}&units=metric`
    console.log(`open weather map url = ${url}`)
    return axios.get(url);
}

function getLocationKey(lat, lon){
    const url = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${accuWeatherAPIkey}&q=${lat}%2C${lon}&details=true`;
    console.log(`geoposition search url = ${url}`)
    return axios.get(url).then(getAccuweatherJSON);
}

function getAccuweatherJSON(locationJSON) {
    const locationKey = locationJSON.data.Key;
    const url = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${accuWeatherAPIkey}&metric=true`
    console.log(`accuweather url = ${url}`)
    return axios.get(url);
}

//update data on screen with get location button clicked
function updateUI(JSONarray) {
    console.log(JSONarray)
    const openWeatherJSON = JSONarray[0].data;
    const accuweatherJSON = JSONarray[1].data;
    const currentLocation = `${openWeatherJSON.city.name}, ${openWeatherJSON.city.country}`;
    const currentTemp = `${Math.floor(openWeatherJSON.list[0].main.temp)}`;
    const weatherImg = `${weatherCodeToImg(openWeatherJSON.list[0].weather[0].id, isDayTime)}`
    const weatherDescription = `${openWeatherJSON.list[0].weather[0].description}`;
    const lowTemp = `${Math.floor(accuweatherJSON.DailyForecasts[0].Temperature.Minimum.Value)}°`;
    const highTemp = `${Math.floor(accuweatherJSON.DailyForecasts[0].Temperature.Maximum.Value)}°`;
    const rainPercentage = `${openWeatherJSON.list[0].pop * 100}%`;
    const windSpeed = `${Math.floor(openWeatherJSON.list[0].wind.speed)}km/h ${windDirectionConversion(openWeatherJSON.list[0].wind.deg)}`;

    locationLabel.innerHTML = currentLocation;
    dateLabel.innerHTML = getDate();
    currentTempLabel.innerHTML = currentTemp;
    currentWeatherImg.src = weatherImg;
    weatherDescriptionLabel.innerHTML = weatherDescription;
    lowTempLabel.innerHTML = lowTemp;
    highTempLabel.innerHTML = highTemp;
    rainPercentageLabel.innerHTML = rainPercentage;
    windSpeedLabel.innerHTML = windSpeed;
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



window.onload = getLocation;
getLocationButton.addEventListener("click", getLocation);


