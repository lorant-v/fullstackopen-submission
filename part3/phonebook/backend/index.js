require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token(
  'body',
  (req, res) => {
    if (req.method === 'POST')
      return JSON.stringify(req.body)
  }
)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res, next) => {
  Person
    .find({})
    .then(people => {
      res.json(people)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndDelete(req.params.id)
    .then(result => {
      console.log(result);
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  const person = new Person({
    name: name,
    number: number,
  })

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person
    .findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).send({ error: "Person not found" })
      }

      person.name = name
      person.number = number

      return person
        .save()
        .then(updatedPerson => {
          res.json(updatedPerson)
        })
    })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person
    .countDocuments({})
    .then(count => {
      content = `
      <p>Phonebook has info for ${count} ${count === 1 ? 'person' : 'people'}</p>
      <p>${new Date()}</p>`

      res.send(content)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})