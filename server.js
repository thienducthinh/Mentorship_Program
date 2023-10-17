const express = require('express');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const port = 3000;

var db_config = {
    host: '107.180.1.16',
    user: 'fall2023team8',
    password: 'fall2023team8',
    database: 'fall2023team8'
};

var con;

function handleDisconnect() {
    con = mysql.createConnection(db_config); 
    con.connect(function (err) {              
        if (err) {                             
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }                                  
    });                                    
    con.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 
            handleDisconnect();                        
        } else {      
            throw err;
        }
    });
}

handleDisconnect();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });