const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log("Please provide the password");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.cnkom.mongodb.net/phonebookDatabase?retryWrites=true&w=majority`;

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true, useCreateIndex: true});

const entrySchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Entry = mongoose.model('Entry', entrySchema);

// Return all entries if no new entry data provided
if (process.argv.length === 3) {
    Entry.find({}).then(result => {
        console.log("phonebook:");
        result.forEach(entry => {
            console.log(entry);
        })
        mongoose.connection.close();
    })
}

if (process.argv.length === 5) {
    const entry = new Entry({
        name: process.argv[3],
        number: process.argv[4],
    })
    entry.save().then(result => {
        console.log(`added ${entry.name} number ${entry.number} to phonebook`);
        mongoose.connection.close();
    })
}