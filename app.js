const apiKey = "8fea8bdd58feccca5a783a2028dd9b9d"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric"

async function checkWeather(cityName) {
    const response = await fetch(apiUrl + `&q=${cityName}` + `&appid=${apiKey}`)
    const data = await response.json()

    temp.innerHTML = Math.round(data.main.temp) + "°C";
    city.innerHTML = data.name;
    humidity.innerHTML = data.main.humidity + "%";
    wind.innerHTML = data.wind.speed + "km/h";

    console.log(data)
}

checkWeather("Belgrade");