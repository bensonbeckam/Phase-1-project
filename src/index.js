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

function getWeatherIcon(id){
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321 ) return 'drizzle.svg'
    if (id <= 531 ) return 'rain.svg'
    if (id <= 622 ) return 'snow.svg'
    if (id <= 781 ) return 'atmosphere.svg'
    if (id <= 800 ) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate(){
    const currentDate = new Date()
    const options ={
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }

    return currentDate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city) {
    const weatherData =await getFetchData('weather', city)

    if (weatherData.cod !== 200){
        showDisplaySection(notFoundSection)
        return
    }

    const {
        name: country,
        main: { temp, humidity},
        weather: [{ id, main}={}],
        wind: {speed},
    } =weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionTxt.textContent = main
    humidityValuTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + 'M/s'

    currentDateTxt.textContent =getCurrentDate()

    weatherSummaryImg.src = `../assets/weather/${getWeatherIcon(id)}`

    await updateForecastInfo(city)
    showDisplaySection(weatherInfoSection)
}

async function updateForecastInfo(city){
    const forecastsData = await getFetchData('forecast', city)
    console.log(forecastsData)
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
    .forEach(section => section.style.display ='none')

    section.style.display = 'flex'
}