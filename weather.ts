import { ForecastImages, LocationData, WeatherData, AllWeatherData } from './interfaces'
//weather app that displays the High, Low, Forecast and Humidity based on the zipcode provided


// function to get the location info based on zipcode
const getLocation = async (zipcode: number): Promise<LocationData> => {
    // variable to send request to get location data for given zipcode
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${zipcode}&appid=${apiKey}`)
    // variable for returned promise
    const data = await response.json()
    // variable for location associated with the zipcode
    const location =  data.name
    // variable for lattitude associated with the zipcode
    const lattitude = data.lat
    // variable for longitude associated with the zipcode
    const longitude = data.lon
    //return the values
    return {location, lattitude, longitude}
} 
//function to get weather stats based on lattitude and longitude 
const getWeather = async (lat: number, lon: number): Promise <WeatherData> => {
    //variable to send request to get weather forcast based on lattitude and longitude
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    //variable for returned promise
    const data = await response.json()
    //variable for the high temp
    const high = data.main.temp_max
    //varibale for the low temp
    const low = data.main.temp_min
    //variable for the humidity
    const humidity = data.main.humidity
    //variable for forecast
    const forecast = data.weather[0].main
    //variable for forecast description
    const description = data.weather[0].description
    // return the values
    return {high, low, humidity, forecast, description}
}
//function to get the all of the weather data needed
const getWeatherData = async (zipcode: number): Promise <AllWeatherData> => {
    //variable that waits for the data from getLocation function
    const locationData = await getLocation(zipcode)
    //variable for the lattitude
    const lat = locationData.lattitude
    //variable for the longitude
    const lon = locationData.longitude
    //variable for the location
    const location = locationData.location
    // wait for the data from to be grabbed from the getWeather function
    const weatherData = await getWeather(lat, lon)
    // variable for the predicted high temp
    const high = weatherData.high
    // variable for the predicted low temp
    const low = weatherData.low
    //variable for the humidity
    const humidity = weatherData.humidity
    //variable for the forecast
    const forecast = weatherData.forecast
    //variable that describes the forecast
    const description = weatherData.description
    //return the values
    return {location, lattitude: lat, longitude: lon, high, low, humidity, forecast, description}
}

//object for background images
const forecastImages: ForecastImages = {
    'Thunderstorm': 'thunderstorm.jpg',
    'Drizzle': 'drizzle.jpg',
    'Mist': 'mist.jpg',
    'Smoke': 'smoke.jpg',
    'Haze': 'haze.jpg',
    'Dust': 'dust.jpg',
    'Fog': 'fog.jpg',
    'Sand': 'sand.jpg',
    'Ash': 'ash.jpg',
    'Squall': 'squall.jpg',
    'Tornado': 'tornado.jpg',
    'Clear': 'clear.jpg',
    'Clouds': 'cloudy.jpg',
    'Rain': 'rain.jpg',
    'Snow': 'snow.jpg'
}   

//function to get background image
const getBackgroundImage = (forecast: keyof ForecastImages) => {
    const backgroundImage: string = forecastImages[forecast]
    return `url(css/images/${backgroundImage})`
}

// reference the submit button
let submitBtn: HTMLInputElement | null = document.querySelector('.submit-btn')
//variable to refrence the weather card
let weatherCard : (string | HTMLDivElement)
//variable for created cards
let cardCreated = false
// add eventlistener to the button
if (submitBtn){
    submitBtn.addEventListener('click', () => {
        // get the zipcode
        const zipcode : number = +(document.querySelector('#floatingInput') as HTMLInputElement).value
        //call getWeatherData with the user input zipcode
        getWeatherData(zipcode)
            .then(data => {
                //change the background image based on the forecast
                const background = getBackgroundImage(data.forecast)
                document.querySelector('.bg').style.backgroundImage = background
                // check to see if the card was created already
                if (!cardCreated) {
                    //if the card wasn't created make a new div
                    weatherCard = document.createElement('div')
                    //append new card to the weather container
                    const weatherContainer = document.querySelector('.weather-container')
                    weatherContainer.appendChild(weatherCard)
                    // recoginize that a card has been created
                    cardCreated = true
                }
    
                    //make a new card element that contains the weather data
                    weatherCard.innerHTML = `
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="location">Current Weather Report</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <ul class="list-group">
                                <li class=list-group-item>Location: ${data.name}</li>
                                <li class=list-group-item>${data.high}°F</li>
                                <li class=list-group-item>${data.low}°F</li>
                                <li class=list-group-item>Humidity: ${data.humidity}%</li>
                                <li class=list-group-item>Expected: ${data.forecast}</li>
                                <li class=list-group-item>${data.description}</li>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary submit-btn" data-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                    </div>
                `
                // initialize the modal
                $('#exampleModalCenter').modal('show')
                // append weather card to weather container
                const weatherContainer = document.querySelector('.weather-container')
                weatherContainer.replaceChild(weatherCard, weatherContainer.firstChild)
            })
            .catch(error => console.log(error))
    })
} 
