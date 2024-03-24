const express = require('express');
const app = require('./app');
const port = 3002;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

