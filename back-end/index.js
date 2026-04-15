const express = require('express');
const app = express();

// Home route
app.use('/', function(req, res) {
    res.send('Node Backend Server'); // you should send a response
});

// server side rendering
app.listen(4000, function() {
    console.log('Server Running on localhost:4000');
});
