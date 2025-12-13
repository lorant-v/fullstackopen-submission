const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log(`connecting to ${url}`)
mongoose.connect(url, { family: 4 })
  .then(() => {
    console.log('connected to mongodb')
  })
  .catch(error => {
    console.log('error connecting to mongodb: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: [
      {
        validator: n => n.length >= 8,
        message: props => `must have length >= 8, got ${props.value}`
      },
      {
        validator: n => /^\d{2,3}-\d+$/.test(n),
        message: props => `${props.value} is not a valid phone number`
      },
    ]
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)