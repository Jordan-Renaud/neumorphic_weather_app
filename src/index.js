//document variables
const locationLabel = document.querySelector(".location");
const dateLabel = document.querySelector(".date");
const getLocationButton = document.querySelector(".get-location-button");

//functionality variables
const apiKey = "8d030da1fb95c3588ed90416bc6b659f";
const celiusTemp = 0;
const farenheitTemp = 0;


//gets current location and triggers handlePostion function
function getLocation(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(handlePosition);
};

//gets latitude and longitude
function handlePosition(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    axios.get(url).then(updateUI);
};

//update data on screen with get location button clicked
function updateUI(response) {
    let currentLocation = `${response.data.name}, ${response.data.sys.country}`;
    locationLabel.innerHTML = currentLocation;
};


getLocationButton.addEventListener("click", getLocation);
