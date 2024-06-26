const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');
const usersRouter = require('./routes/api/users');

app.use(express.json())
app.use('/api/users', usersRouter)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// general messages for errors 404 and 500
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