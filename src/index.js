const cityInput =document.querySelector('.city-input')
const searchBtn =document.querySelector('.search-btn')

const weatherInfoSection =document.querySelector('.weather-info')
const notFoundSection =document.querySelector('.not-found')
const searchCitySection =document.querySelector('.search-city')

const countryTxt =document.querySelector('.country-txt')
const tempTxt =document.querySelector('.temp-txt')
const conditionTxt =document.querySelector('.condition-txt')
const humidityValuTxt =document.querySelector('.humidity-value')
const windValueTxt =document.querySelector('.wind-speed-value')
const weatherSummaryImg =document.querySelector('.weather-summary-img')
const currentDateTxt =document.querySelector('.current-date-txt')

const apiKey = '3679550d98adfc87181430b62457f5ac'

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != ''){
            updateWeatherInfo(cityInput.value)
            cityInput.value=''
            cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (event) =>{
    if (event.key == 'Enter' && cityInput.value.trim() != ''){
          updateWeatherInfo(cityInput.value)
            cityInput.value=''
            cityInput.blur()
    }
})

async function getFetchData(endPoint, city) {
    const apiUrl =`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

async function updateWeatherInfo(city) {
    const weatherData =await getFetchData('weather', city)

    if (weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return
    }
    console.log(weatherData)

    const {
        name: country,
        main: { temp, humidity},
        weather: [{ id, main}],
        wind: {speed}
    } =weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionTxt.textContent = main
    humidityValuTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + 'M/s'

    weatherSummaryImg.src=`css/weather/${getWeatherIcon(id)}`

    showDisplaySection(weatherInfoSection)
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
    .forEach(section => section.style.display ='none')

    section.style.display = 'flex'
}