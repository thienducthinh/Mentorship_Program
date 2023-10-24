const express = require('express');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const port = 3000;

const db_config = {
    host: '107.180.1.16',
    user: 'fall2023team8',
    password: 'fall2023team8',
    database: 'fall2023team8'
};

const pool = mysql.createPool(db_config);

app.use(bodyParser.json());

app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM users';

    pool.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json(results);
    });
});


app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });