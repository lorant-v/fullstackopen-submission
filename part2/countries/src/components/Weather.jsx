import weatherService from '../services/weather'
import { useEffect } from 'react'
import { useState } from 'react'

const Weather = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    console.log(`loading weather for ${city}`);

    weatherService
      .getWeather(city)
      .then(data => {
        setWeatherData(data)
      })
  }, [])

  if (weatherData) {
    const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
    return (
      <div>
        <p>Temperature {weatherData.main.temp} Celsius</p>
        <img src={iconUrl} alt={weatherData.weather[0].description} />
        <p>Wind {weatherData.wind.speed} m/s</p>
      </div>
    )
  }

  return (
    <div>
      Loading weather
    </div>
  )
}

export default Weather