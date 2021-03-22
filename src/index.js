//document variables
const locationLabel = document.querySelector(".location");
const dateLabel = document.querySelector(".date");
const getLocationButton = document.querySelector(".get-location-button");
const currentWeatherImg = document.querySelector(".current-weather-img")
const currentTempLabel = document.querySelector(".current-temp");
const weatherDescriptionLabel = document.querySelector(".weather-description");
const lowTempLabel = document.querySelector(".low-temp");
const highTempLabel = document.querySelector(".high-temp");
const windSpeedLabel = document.querySelector(".wind-speed");

//functionality variables
const apiKey = "8d030da1fb95c3588ed90416bc6b659f";
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
    } else if (code >= 210 && code <= 221) {
        return isDayTime ? "src/weather_icons/lightning.png" : "src/weather_icons/night_lightning.png";
    } else if (code >= 611 && code <= 622) {
        return "src/weather_icons/sleet.png";
    } else if (code == 800) {
        return isDayTime ? "src/weather_icons/clear.png" : "src/weather_icons/night_clear.png";
    } else if (code == 801 || code == 802) {
        return isDayTime ? "src/weather_icons/scattered_clouds.png" : "src/weather_icons/night_cloudy.png";
    } else if (code == 803) {
        return "src/weather_icons/cloudy.png";
    } else if (code == 804) {
        return "src/weather_icons/night_lightning.png";
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
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    console.log(url)
    axios.get(url).then(updateUI);
};

//update data on screen with get location button clicked
function updateUI(response) {
    const JSON = response.data;
    const currentLocation = `${JSON.name}, ${JSON.sys.country}`;
    const currentTemp = `${Math.floor(JSON.main.temp)}`;
    const weatherImg = `${weatherCodeToImg(JSON.weather[0].id, isDayTime)}`
    const weatherDescription = `${JSON.weather[0].description}`;
    const lowTemp = `${Math.floor(JSON.main.temp_min)}°`;
    const highTemp = `${Math.floor(JSON.main.temp_max)}°`;
    const windSpeed = `${Math.floor(JSON.wind.speed)}km/h ${windDirectionConversion(JSON.wind.deg)}`;
    locationLabel.innerHTML = currentLocation;
    dateLabel.innerHTML = getDate();
    currentTempLabel.innerHTML = currentTemp;
    currentWeatherImg.src = weatherImg;
    weatherDescriptionLabel.innerHTML = weatherDescription;
    lowTempLabel.innerHTML = lowTemp;
    highTempLabel.innerHTML = highTemp;
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


getLocationButton.addEventListener("click", getLocation);
window.onload = getLocation;

