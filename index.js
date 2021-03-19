const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();


app.use(morgan('tiny'))
app.use(cors());
app.use(express.static('build'));
app.use(express.json());

let phonebook = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(phonebook);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const entry = phonebook.find(entry => entry.id === id);
    if (entry) {
        res.json(entry);
    } else {
        res.status(404).end();
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    phonebook = phonebook.filter(entry => entry.id !== id);
    res.status(204).end();
})

app.get('/info', (req, res) => {
    let out = `<p>Phonebook has info for ${phonebook.length} people</p><p>${new Date().toString()}</p>`;
    res.send(out);
})

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    if (phonebook.find(entry => entry.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const newId = Math.floor(Math.random() * 10000);

    const entry = {
        name: body.name,
        number: body.number,
        id: newId
    }

    phonebook = phonebook.concat(entry);

    res.json(phonebook);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})