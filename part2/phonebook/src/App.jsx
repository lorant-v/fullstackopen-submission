import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personsService
      .getAllPersons()
      .then(persons => {
        setPersons(persons)
      })
  }, [])


  const handleNewNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const person = persons.find(p => p.name === newName)
    if (person) {
      if (confirm(`${person.name} is already added to phonebook, replace the old number with the new one?`)) {
        const updatePerson = {
          ...person,
          number: newNumber
        }

        personsService
          .updatePerson(updatePerson)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person))
          })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      }

      personsService
        .createPerson(newPerson)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson))
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const handleDelete = (id) => {
    const personToDelete = persons.find(person => person.id === id)

    if (confirm(`Delete ${personToDelete.name}?`)) {
      personsService
        .deletePerson(id)
        .then(() => {
          setPersons(
            persons.filter(person => person.id !== id)
          )
        })
    }
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h2>Add a new</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        handleNewNameChange={handleNewNameChange}
        newNumber={newNumber}
        handleNewNumberChange={handleNewNumberChange}
      />

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App