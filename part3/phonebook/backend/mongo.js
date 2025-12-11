const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Usage: node mongo.js <db_password> [<name> <number>]');
  process.exit(1)
}

const pwd = encodeURIComponent(process.argv[2])
const url = `mongodb+srv://lorantvrinceanu_db_user:${pwd}@cluster0.ibz7bmm.mongodb.net/phonebook?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = new mongoose.model('Person', personSchema)

if (process.argv.length == 5) {
  // Add to db
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log('Person saved');
    console.log(result);
    mongoose.connection.close()
  })
} else {
  // Display all
  console.log('phonebook:');

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
