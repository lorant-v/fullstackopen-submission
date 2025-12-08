import { useEffect } from 'react'
import { useState } from 'react'
import countryService from './services/countries'
import Countries from './components/Countries'

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
