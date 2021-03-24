const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Entry = require('./models/entry');

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
    Entry.find({}).then(entries => {
        res.json(entries);
    })
})

app.get('/api/persons/:id', (req, res) => {
    Entry.findById(req.params.id).then(entry => {
        if (entry) {
            res.json(entry);
        } else {
            res.status(404).end();
        }
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
    Entry.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end();
        }).catch(error => {
            next(error);
    })
})

app.get('/info', (req, res) => {
    Entry.count().then(count => {
        let out = `<p>Phonebook has info for ${count} people</p><p>${new Date().toString()}</p>`;
        res.send(out);
    })
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    const entry = new Entry({
        name: body.name,
        number: body.number
    });

    entry.save()
        .then(savedEntry => {
        res.json(savedEntry);
    })
        .catch(err => next(err));
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;

    Entry.findByIdAndUpdate(req.params.id, {number: body.number}, {new: true, runValidators: true})
        .then(updatedEntry => {
            res.json(updatedEntry);
        }).catch(err => {
            next(err);
    })
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message});
    }

    next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})