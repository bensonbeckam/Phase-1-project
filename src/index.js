const cityInput =document.querySelector('.city-input')
const searchBtn =document.querySelector('.search-btn')

const weatherInfoSection =document.querySelector('.weather-info')
const notFoundSection =document.querySelector('.not-found')
const searchCitySection =document.querySelector('.search-city')

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
    
    showDisplaySection(weatherInfoSection)
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
    .forEach(section => section.style.display ='none')

    section.style.display = 'flex'
}