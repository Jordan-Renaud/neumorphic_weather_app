//document variables
const locationLabel = document.querySelector(".location");
const dateLabel = document.querySelector(".date");
const getLocationButton = document.querySelector(".get-location-button");
const currentTempLabel = document.querySelector(".current-temp");
const weatherDescriptionLabel = document.querySelector(".weather-description");
const lowTempLabel = document.querySelector(".low-temp");
const highTempLabel = document.querySelector(".high-temp");
const windSpeedLabel = document.querySelector(".wind-speed");

//functionality variables
const apiKey = "8d030da1fb95c3588ed90416bc6b659f";
const celiusTemp = 0;
const farenheitTemp = 0;

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
    axios.get(url).then(updateUI);
};

//update data on screen with get location button clicked
function updateUI(response) {
    const JSON = response.data;
    const currentLocation = `${JSON.name}, ${JSON.sys.country}`;
    const currentTemp = `${Math.floor(JSON.main.temp)}`;
    const weatherDescription = `${JSON.weather[0].description}`;
    const lowTemp = `${Math.floor(JSON.main.temp_min)}°`;
    const highTemp = `${Math.floor(JSON.main.temp_max)}°`;
    const windSpeed = `${Math.floor(JSON.wind.speed)}km/h ${windDirectionConversion(JSON.wind.deg)}`;
    locationLabel.innerHTML = currentLocation;
    currentTempLabel.innerHTML = currentTemp;
    weatherDescriptionLabel.innerHTML = weatherDescription;
    lowTempLabel.innerHTML = lowTemp;
    highTempLabel.innerHTML = highTemp;
    windSpeedLabel.innerHTML = windSpeed;
};


getLocationButton.addEventListener("click", getLocation);
