const apiKey = "8fea8bdd58feccca5a783a2028dd9b9d"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric"

const inputCity = document.getElementById('inputCity')
const inputBtn = document.getElementById('inputBtn')
const weatherIcon = document.getElementById('weatherIcon')
let weatherDisplay = document.getElementById('weather')
let errorDisplay = document.getElementById('error')

async function checkWeather(cityName) {
    const response = await fetch(apiUrl + `&q=${cityName}` + `&appid=${apiKey}`)

    try {
        const data = await response.json()

        temp.innerHTML = Math.round(data.main.temp) + "°C";
        city.innerHTML = data.name;
        humidity.innerHTML = data.main.humidity + "%";
        wind.innerHTML = data.wind.speed + "km/h";
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
                break;
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
