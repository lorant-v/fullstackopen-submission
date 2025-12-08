import { useEffect } from 'react'
import { useState } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

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

const Countries = ({ countriesToShow, setSearchTerm }) => {
  const countriesToShowLen = countriesToShow.length

  if (countriesToShowLen > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  } else if (countriesToShowLen > 1) {
    return (
      <div>
        {countriesToShow.map((c, i) =>
          <p key={i}>
            {c.name.common}
            <button onClick={() => setSearchTerm(c.name.common)}>Show</button>
          </p>
        )}
      </div>
    )
  } else if (countriesToShowLen == 1) {
    const country = countriesToShow[0]
    const capital = country.capital[0]
    return (
      <div>
        <h1>{country.name.common}</h1>
        <div>
          <p>Capital {capital}</p>
          <p>Area {country.area}</p>
        </div>
        <h2>Languages</h2>
        <ul>
          {Object.entries(country.languages).map(([code, name]) => (
            <li key={code}>{name}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} />

        <h2>Weather in {capital}</h2>
        <Weather city={capital} />

      </div>
    )
  } else { // <= 0
    return null
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [countries, setCountries] = useState([])
  const [countriesToShow, setCountriesToShow] = useState([])

  // load countries on first render
  useEffect(() => {
    countryService
      .getAllCountries()
      .then(cs => setCountries(cs))
  }, [])

  useEffect(() => {
    console.log(`effect executed, search term is ${searchTerm}`);
    if (searchTerm) {
      const matchingCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setCountriesToShow(matchingCountries)
    } else {
      setCountriesToShow([])
    }
  }, [searchTerm, countries])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <>
      <p>
        find countries
        <input value={searchTerm} onChange={handleSearchChange} />
      </p>

      <Countries countriesToShow={countriesToShow} setSearchTerm={setSearchTerm} />

    </>
  )
}

export default App
