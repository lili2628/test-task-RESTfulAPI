const express = require('express');
const app = express();

const usersRouter = require('./routes/api/users');

app.use(express.json())
app.use('/api/users', usersRouter)

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Server error' } = err;

    res.status(status).json({
        message,
    })
})


module.exports = app;