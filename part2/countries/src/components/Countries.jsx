import Weather from "./Weather"

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

export default Countries