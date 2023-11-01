const apiKey = "8fea8bdd58feccca5a783a2028dd9b9d"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric"

const inputCity = document.getElementById('inputCity')
const inputBtn = document.getElementById('inputBtn')
const weatherIcon = document.getElementById('weatherIcon')
let weatherDisplay = document.getElementById('weather')
let errorDisplay = document.getElementById('error')

const temp = document.getElementById('temp')
const city = document.getElementById('city')
const currentLocalTime = document.getElementById('currentLocalTime')
const humidity = document.getElementById('humidity')
const wind = document.getElementById('wind')
const card = document.getElementById('card')

// UTC timezone
const currentTime = new Date();

async function checkWeather(cityName) {
    const response = await fetch(apiUrl + `&q=${cityName}` + `&appid=${apiKey}`)

    try {
        const data = await response.json()

        temp.innerHTML = Math.round(data.main.temp) + "°C";
        city.innerHTML = data.name;
        humidity.innerHTML = data.main.humidity + "%";
        wind.innerHTML = data.wind.speed + "km/h";
        const latitude = data.coord.lon;
        const longitude = data.coord.lat;
        const sunrise = data.sys.sunrise;
        const sunset = data.sys.sunset;
        // Convert sunrise and sunset times to Date objects
        const sunriseTime = new Date(sunrise * 1000);
        const sunsetTime = new Date(sunset * 1000);

        if (currentTime < sunriseTime && currentTime < sunsetTime) {
            card.style.background = "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(28,1,62,1) 31%, rgba(0,212,255,1) 100%)"
        }
        // console.log(currentTime, sunriseTime, sunsetTime)
        // calculate local time, based on time zone user's entered city
        let localTimeHoursTimeZone = Math.floor(data.timezone / 3600)
        let localTimeHours = localTimeHoursTimeZone + currentTime.getUTCHours()
        let localTime = `${localTimeHours}:${currentTime.getUTCMinutes()}`

        if (localTimeHours <= 9) {
            currentLocalTime.innerText = `0${localTimeHours}:${currentTime.getUTCMinutes()}`
        } else if (currentTime.getUTCMinutes() <= 9) {
            currentLocalTime.innerText = `${localTimeHours}:0${currentTime.getUTCMinutes()}`
        } else if (localTimeHours <= 9 && currentTime.getUTCMinutes() <= 9) {
            currentLocalTime.innerText = `0${localTimeHours}:0${currentTime.getUTCMinutes()}`
        } else {
            currentLocalTime.innerText = `${localTime}`
        }

        // code block to update img according to response data
        data.weather[0].main = "Clouds"
        switch (data.weather[0].main) {
            case 'Clouds':
                weatherIcon.src = "images/clouds.png"
                break;
            case 'Clear':
                weatherIcon.src = "images/clear.png"
                break;
            case 'Drizzle':
                weatherIcon.src = "images/drizzle.png"
                break
            case 'Mist':
                weatherIcon.src = "images/mist.png"
                break;
            case 'Snow':
                weatherIcon.src = "images/snow.png"
                break;

            default:
                weatherIcon.src = "images/rain.png"
                break;
        }

        errorDisplay.style.display = "none";
        weatherDisplay.style.display = "block"
        inputCity.value = ''
        console.log(data)

    } catch (err) {
        errorDisplay.style.display = "block";
        weatherDisplay.style.display = "none";
        inputCity.value = ''
        console.log(err)
    }

}

inputBtn.addEventListener('click', () => {
    checkWeather(inputCity.value.toLocaleLowerCase());
})
