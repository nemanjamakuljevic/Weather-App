const apiKey = "8fea8bdd58feccca5a783a2028dd9b9d"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric"

const inputCity = document.getElementById('inputCity')
const inputBtn = document.getElementById('inputBtn')
const weatherIcon = document.getElementById('weatherIcon')
let weatherDisplay = document.getElementById('weather')

async function checkWeather(cityName) {
    const response = await fetch(apiUrl + `&q=${cityName}` + `&appid=${apiKey}`)

    const data = await response.json()

    temp.innerHTML = Math.round(data.main.temp) + "°C";
    city.innerHTML = data.name;
    humidity.innerHTML = data.main.humidity + "%";
    wind.innerHTML = data.wind.speed + "km/h";
    // code block to update img according to response data
    if (data.weather[0].main == "Clouds") {
        weatherIcon.src = "images/clouds.png"
    } else if (data.weather[0].main == "Clear") {
        weatherIcon.src = "images/clear.png"
    } else if (data.weather[0].main == "Drizzle") {
        weatherIcon.src = "images/drizzle.png"
    } else if (data.weather[0].main == "Mist") {
        weatherIcon.src = "images/mist.png"
    } else if (data.weather[0].main == "Snow") {
        weatherIcon.src = "images/snow.png"
    } else {
        weatherIcon.src = "images/rain.png"
    }




    console.log(data)
}

inputBtn.addEventListener('click', () => {
    checkWeather(inputCity.value.toLocaleLowerCase());
})
