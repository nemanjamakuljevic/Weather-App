//******* https://www.timeanddate.com/  reference for local time of sunrise and sunset 
//********* https://www.timeanddate.com/time/map/ using following web page for checking time
const apiKey = "8fea8bdd58feccca5a783a2028dd9b9d"
const baseApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric"
const inputCityEl = document.getElementById('inputCity');
const inputBtn = document.getElementById('inputBtn');
const weatherDisplayEl = document.getElementById('weather');
const errorDisplayEl = document.getElementById('error');

const card = document.getElementById('card');

function init() {
    inputBtn.addEventListener('click', () => {
        fetchDataFromApi(inputCityEl.value.toLocaleLowerCase());
    })

    inputCityEl.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            fetchDataFromApi(inputCityEl.value.toLocaleLowerCase());
        }
    })
}
document.addEventListener('DOMContentLoaded', init);


// Declaring function in order to fetch data from API and check for response 
async function fetchDataFromApi(cityName) {
    try {
        const fullApiURL = `${baseApiUrl}&q=${cityName}&appid=${apiKey}`;
        const response = await fetch(fullApiURL);

        // Validate if response is in 200's range
        if (!response.ok) {
            if (response.status === 404) {
                inputCityEl.value = '';
            }
            displayErrorData(errorDisplayEl);
            throw new Error(`API request failed with status: ${response.status}`);
        } else {
            const weatherData = await response.json();
            displayWeatherData(weatherData);
            // Asign certain weatherData.weather[0].main attribute in order to access weather state from response
            const weatherState = weatherData.weather[0].main;
            displayWeatherIcons(weatherState);

            calculateTime(weatherData);
            console.log(weatherData);
        }
    } catch (error) {
        throw error;
    }
}
// Function handle icon changes according to response data(weather state at given moment)
function displayWeatherIcons(weatherState) {
    // Making object to store icons paths
    const weatherIconPath = {
        Rain: "images/rain.png",
        Clear: "images/clear.png",
        Drizzle: "images/drizzle.png",
        Mist: "images/mist.png",
        Snow: "images/snow.png",
        Smoke: "images/smoke.png",
        Clouds: "images/clouds.png",
        Haze: "images/humidity.png"
    }
    const weatherIconEl = document.getElementById('weatherIcon');
    validateElementExist(weatherIconEl) && (weatherIconEl.src = weatherIconPath[weatherState]);
}
//  Using response data to asign basic temperature data and display it on UI
function displayWeatherData(weatherData) {
    const tempEl = document.getElementById('temp');
    const cityNameEl = document.getElementById('city');
    const humidityEl = document.getElementById('humidity');
    const windEl = document.getElementById('wind');
    tempEl && (tempEl.innerText = `${Math.round(weatherData.main.temp)}°C`);
    cityNameEl && (cityNameEl.innerText = `${weatherData.name}`);
    humidityEl && (humidityEl.innerText = `${weatherData.main.humidity}%`);
    windEl && (windEl.innerText = `${weatherData.wind.speed}km/h`);
    weatherDisplayEl?.classList.remove("weather-hidden");
    if (validateElementExist(errorDisplayEl)) {
        errorDisplayEl.classList.add("error-hidden");
        errorDisplayEl.classList.remove("error");
    }
    inputCityEl.value = '';
}
// Using function in order to display error on UI
function displayErrorData(errorDisplayEl) {
    if (validateElementExist(weatherDisplayEl)) {
        weatherDisplayEl.classList.remove("weather");
        weatherDisplayEl.classList.add("weather-hidden");
    }
    if (validateElementExist(errorDisplayEl)) {
        errorDisplayEl.classList.add("error");
        errorDisplayEl.classList.remove("error-hidden");
    }
}
function validateElementExist(el) {
    if (el) {
        return true;
    }
}
/**
 * 
 * @param {*} weatherData -- data from the API
 * @param weatherData.timezone - timezone shift in seconds from UTC
 * @param currentUtcInHours - current hours in UTC
 * @param currentUtcInMinutes - current minutes in UTC
 * @param differenceFromUtcInHour -- number represent the difference from UTC in hours
 * @returns 
 * localTimeInHours - number, difference from UTC and current UTC hours
 * currentUtcInMinutes - number
 * differenceFromUtcInHour - number
 */
function GetLocalTime(weatherData) {
    // new Date() returns date format as GMT+1(represents milliseconds since the midnight at the beginning of January 1, 1970, UTC)
    const currentTimeGmt = new Date();
    // Calculate UTC hours and minutes based on current time in GMT+1
    const currentUtcInHours = currentTimeGmt.getUTCHours();
    const currentUtcInMinutes = currentTimeGmt.getUTCMinutes();
    const differenceFromUtcInHour = Math.floor(weatherData.timezone / 3600);

    let localTimeInHours = differenceFromUtcInHour + currentUtcInHours;

    return {
        localTimeInHours,
        currentUtcInMinutes,
        differenceFromUtcInHour
    }
}
/**
 * 
 * @param {*} sunrise - value in seconds according to API data
 * @param {*} sunriseMs - sunrise value in milliseconds
 * @param differenceFromUtcInHour -- number represent the difference from UTC in hours
 * @returns 
 * sunriseLocalMinutes - number
 * sunriseLocalMinutes - number
 * sunriseLocalTimeDate - Date
 */
function GetSunriseLocalTime(weatherData, differenceFromUtcInHour) {
    const { sunrise } = weatherData.sys;
    const sunriseMs = sunrise * 1000;
    const sunriseGmtDate = new Date(sunriseMs);
    // Using hours from sunrise date object in GMT+1 and adding difference and substract 1 because it will provide differencte 
    // from UTC however we need it to be in GMT+1 because Date object returns GMT+1
    let sunriseLocalTimeDate = new Date();
    sunriseLocalTimeDate.setHours(sunriseGmtDate.getHours() + differenceFromUtcInHour - 1);
    // Declaring a new variable with usage of .getHours because if line above declared as variable will return value in milliseconds
    let sunriseLocalHours = sunriseLocalTimeDate.getHours();
    sunriseLocalTimeDate.setMinutes(sunriseGmtDate.getMinutes());
    let sunriseLocalMinutes = sunriseLocalTimeDate.getMinutes();

    return {
        sunriseLocalHours,
        sunriseLocalMinutes,
        sunriseLocalTimeDate
    }
}
/**
 * 
 * @param {*} sunset - value in seconds according to API data
 * @param {*} sunsetMs - sunset value in milliseconds
 * @param differenceFromUtcInHour -- number represent the difference from UTC in hours
 * @returns 
 * sunsetLocalHours - number
 * sunsetLocalMinutes - number
 * sunsetLocalTimeDate - Date
 */
function GetSunsetLocalTime(weatherData, differenceFromUtcInHour) {
    // same logic as for sunrise local time
    const { sunset } = weatherData.sys;
    const sunsetMs = sunset * 1000;
    const sunsetGmtDate = new Date(sunsetMs);
    let sunsetLocalTimeDate = new Date();
    sunsetLocalTimeDate.setHours(sunsetGmtDate.getHours() + differenceFromUtcInHour - 1);
    let sunsetLocalHours = sunsetLocalTimeDate.getHours();
    sunsetLocalTimeDate.setMinutes(sunsetGmtDate.getMinutes());
    let sunsetLocalMinutes = sunsetLocalTimeDate.getMinutes();

    return {
        sunsetLocalHours,
        sunsetLocalMinutes,
        sunsetLocalTimeDate
    }
}
function calculateTime(weatherData) {

    const { localTimeInHours, currentUtcInMinutes, differenceFromUtcInHour } = GetLocalTime(weatherData);
    const currentLocalTimeDisplayEl = document.getElementById('currentLocalTimeDisplay');
    const localTimeOutput = getFormatedTime(localTimeInHours, currentUtcInMinutes);
    renderTime(localTimeOutput, currentLocalTimeDisplayEl);

    const { sunriseLocalHours, sunriseLocalMinutes, sunriseLocalTimeDate } = GetSunriseLocalTime(weatherData, differenceFromUtcInHour);
    const sunriseTimeDisplayEl = document.getElementById('sunriseTimeDisplay');
    const sunriseLocalTimeOutput = getFormatedTime(sunriseLocalHours, sunriseLocalMinutes);
    renderTime(sunriseLocalTimeOutput, sunriseTimeDisplayEl);

    const { sunsetLocalHours, sunsetLocalMinutes, sunsetLocalTimeDate } = GetSunsetLocalTime(weatherData, differenceFromUtcInHour);
    const sunsetTimeDisplayEl = document.getElementById('sunsetTimeDisplay');
    const sunsetLocalTimeOutput = getFormatedTime(sunsetLocalHours, sunsetLocalMinutes);
    renderTime(sunsetLocalTimeOutput, sunsetTimeDisplayEl);

    const dayTime = getDayOrNight(localTimeInHours, sunriseLocalTimeDate, sunsetLocalTimeDate);
    card && (card.className = `card mode-${dayTime}`);

}
/**
 * 
 * @param {*} localTimeInHours - difference from UTC and current UTC hours
 * @param {*} sunriseLocalTimeDate - Date params of sunrise
 * @param {*} sunsetLocalTimeDate - Date params of sunset
 * @param {*} localTimeInMinutes - local time converted to minutes
 * @param {*} localSunriseInMinutes - sunrise local time converted to minutes
 * @param {*} localSunsetInMinutes - sunset local time converted to minutes
 * @returns 
 * dayTime - 'day' for day state, 'night' for night state
 */
function getDayOrNight(localTimeInHours, sunriseLocalTimeDate, sunsetLocalTimeDate) {

    // Making new Date object(time at GMT +1 at the moment) 
    let localTimeDate = new Date();
    // Using setHours() in order to asign the obtained value and override local time at GMT +1
    // Reson: to be able to compare it later with sunrise and sunset as a Date
    localTimeDate.setHours(localTimeInHours);

    // Declaring local time, local sunrise time and local sunset time all in minutes
    // using .getHours() in order to get hours, times that by 60 to get minutes and add with .getMinutes()
    const localTimeInMinutes = (localTimeDate.getHours() * 60) + localTimeDate.getMinutes();
    const localSunriseInMinutes = (sunriseLocalTimeDate.getHours() * 60) + sunriseLocalTimeDate.getMinutes();
    const localSunsetInMinutes = (sunsetLocalTimeDate.getHours() * 60) + sunsetLocalTimeDate.getMinutes();

    dayTime = "night";
    // Set condition by comparing minutes in order to determine if it is dark at current location, if yes change to dark color 
    if (localTimeInMinutes >= localSunriseInMinutes && localTimeInMinutes <= localSunsetInMinutes) {
        dayTime = "day";
    }
    return dayTime;
}
// Function to convert time format by adding 0 if hour/minutes less than 10 and make valid time format by adding prefix "0"
function getFormatedTime(hours, minutes) {
    let minutesPrefix = "";
    let hoursPrefix = "";
    // Using modulo operation to make sure hours are in a valid 24-hour format
    if (hours > 23) {
        hours = (hours + 24) % 24;
    }
    if (hours <= 9) {
        hoursPrefix = "0";
        hours = `${hoursPrefix + hours}`;
    }
    if (minutes <= 9) {
        minutesPrefix = "0";
        minutes = `${minutesPrefix + minutes}`;
    }
    return `${hours}:${minutes}`;
}

function renderTime(time, el) {
    el.innerText = time;
}



