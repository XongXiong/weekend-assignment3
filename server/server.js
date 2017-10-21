var express = require('express');
var app = express();
var pg = require('pg');
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;
var router = require('./routes/router.js')

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

app.use('/tasks', router);

app.listen(port, function(){
    console.log('listening on port', port);
});