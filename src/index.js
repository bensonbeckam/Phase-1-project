//DOM element selectors
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

const forecastItemContainer =document.querySelector('.forecast-item-container')

//API key
const apiKey = '3679550d98adfc87181430b62457f5ac'


//Search Button Click Event
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != ''){
            updateWeatherInfo(cityInput.value)
            cityInput.value=''
            cityInput.blur()
    }
})

//Enter key search Event
cityInput.addEventListener('keydown', (event) =>{
    if (event.key == 'Enter' && cityInput.value.trim() != ''){
          updateWeatherInfo(cityInput.value)
            cityInput.value=''
            cityInput.blur()
    }
})


//fetch weather data function
async function getFetchData(endPoint, city) {
    const apiUrl =`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

//weather icon mapping
function getWeatherIcon(id){
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321 ) return 'drizzle.svg'
    if (id <= 531 ) return 'rain.svg'
    if (id <= 622 ) return 'snow.svg'
    if (id <= 781 ) return 'atmosphere.svg'
    if (id <= 800 ) return 'clear.svg'
    else return 'clouds.svg'
}

//get current data function
function getCurrentDate(){
    const currentDate = new Date()
    const options ={
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }

    return currentDate.toLocaleDateString('en-GB', options)
}

//update weather info
async function updateWeatherInfo(city) {
    const weatherData =await getFetchData('weather', city)


//if city not found show error
    if (weatherData.cod !== 200){
        showDisplaySection(notFoundSection)
        return
    }

//destructure weather data
    const {
        name: country,
        main: { temp, humidity},
        weather: [{ id, main}={}],
        wind: {speed},
    } =weatherData


 //Update UI with weather data   
    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionTxt.textContent = main
    humidityValuTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + 'M/s'

    currentDateTxt.textContent =getCurrentDate()

    weatherSummaryImg.src = `../assets/weather/${getWeatherIcon(id)}`

//fetch forecast
    await updateForecastInfo(city)
    showDisplaySection(weatherInfoSection)
}

async function updateForecastInfo(city){
    const forecastsData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

//clear previous forecast items
    forecastItemContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken)&&
            !forecastWeather.dt_txt.includes(todayDate)){ 
                updateForecastItems(forecastWeather)
        }
    })
}

//display forecast for current time
function updateForecastItems(weatherData){

const {
    dt_txt: date,
    weather: [{ id }],
    main: {temp}
} = weatherData

const dateTaken = new Date(date)
const dateOption = {
    day: '2-digit',
    month: 'short'
}

const  dateResult = dateTaken.toLocaleDateString('en-US', dateOption)


//build forecast item HTML
const forecastItem =`
            <div class="forecast-item">
                <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
                <img src="assets/weather/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
                <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
            </div>
` 

forecastItemContainer.insertAdjacentHTML('beforeend', forecastItem)
}

//show one section at a time
function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
    .forEach(section => section.style.display ='none')

    section.style.display = 'flex'
}