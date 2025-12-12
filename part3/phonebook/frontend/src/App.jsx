import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState(null)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null);

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

  const resetNotification = (time) => {
    setTimeout(() => setNotification(null), time)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const person = persons.find(p => p.name === newName)
    if (person) {
      // Update
      if (confirm(`${person.name} is already added to phonebook, replace the old number with the new one?`)) {
        const updatePerson = {
          ...person,
          number: newNumber
        }

        personsService
          .updatePerson(updatePerson)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person))
            setNotification({
              success: true,
              message: `Updated ${updatedPerson.name}`
            })
            resetNotification(3000)
          })
          .catch(error => {
            setNotification({
              success: false,
              message: `Information of ${updatePerson.name} has already been removed from the server`
            })
            setPersons(
              persons.filter(person => person.id !== updatePerson.id)
            )
          })
      }
    } else {
      // Create
      const newPerson = {
        name: newName,
        number: newNumber,
      }

      personsService
        .createPerson(newPerson)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson))
          setNotification({
            success: true,
            message: `Added ${createdPerson.name}`
          })
          resetNotification(3000)
        })
        .catch(error => {
          setNotification({
            success: false,
            message: `Error: ${error.response.data.error}`
          })
        })
      setNewName('')
      setNewNumber('')
    }
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
          setNotification({
            success: true,
            message: `Deleted ${personToDelete.name}`
          })
          resetNotification(5000)
        })
    }
  }

  const personsToShow =
    persons
      ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
      : []

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
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