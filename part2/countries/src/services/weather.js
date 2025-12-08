import axios from 'axios'
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather'

const getWeather = (location) => {
  const config = {
    params: {
      q: location,
      units: "metric",
      APPID: import.meta.env.VITE_WEATHER_APPID
    }
  }
  return axios.get(`${baseUrl}`, config)
    .then(response => response.data)
}


export default {
  getWeather,
}