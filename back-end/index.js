const express = require('express');
const app = express();
// const cors ??

// Home route
app.use('/', function(req, res) {
    res.send('Node Backend Server'); // you should send a response
}); // its just an random server running,not in use rn

// server side rendering
app.listen(4000, function() {
    console.log('Server Running on localhost:4000');
});
