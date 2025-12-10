import axios from 'axios'
const baseUrl = '/api/persons'

const getAllPersons = () => {
  return axios.get(baseUrl)
    .then(response => response.data)
}

const createPerson = newPerson => {
  return axios.post(baseUrl, newPerson)
    .then(response => response.data)
}

const updatePerson = (updatedPerson) => {
  return axios.put(`${baseUrl}/${updatedPerson.id}`, updatedPerson)
    .then(response => response.data)
}

const deletePerson = id => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default {
  getAllPersons,
  createPerson,
  updatePerson,
  deletePerson,
}