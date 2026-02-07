const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give pwd as arg');
  process.exit(1)
}

const pwd = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://lorantvrinceanu_db_user:${pwd}@cluster0.ibz7bmm.mongodb.net/noteAppTest?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'Lorant bad',
  important: false
})

note.save().then(result => {
  console.log('note saved');
  console.log(result);
  mongoose.connection.close()
})