const express = require('express');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

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

app.get('/api/users', (req, res) => {
    const email = req.query.email;
    let query = 'SELECT * FROM mentorize_users';

    if (email) {
        query += ` WHERE email = '${email}'`;
    }

    con.query(query, (err, result, fields) => {
        if (err) {
            console.log('\n\n');
            console.log('Error fetching users: ' + err);
            res.status(500).send('Error fetching users');
        } else {
            res.send(result);
        }
    });
});

app.post('/api/transfer', (req, res) => {
    console.log(req.body)
    const senderEmail = req.body.senderEmail;
    const receiverEmail = req.body.receiverEmail;
    const amount = parseFloat(req.body.amount);

    if (isNaN(amount)) {
        res.status(400).send({ error: 'Invalid amount. Please enter a positive number.' });
        return;
    }
    
    // Update the receiver's balance
    const updateReceiverQuery = `
        UPDATE mentorize_users
        SET points = points + ?
        WHERE email = ?
    `;

    con.query(updateReceiverQuery, [amount, receiverEmail], (err, result) => {
        if (err) {
            console.log('\n\n');
            console.log('Error updating receiver balance: ' + err);
            res.status(500).send({ error: 'Error updating receiver balance.' });
            return;
        }

        // Balance updated successfully
        res.send({ message: 'Balance updated successfully.' });
    });
});


app.post('/api/transfer2', (req, res) => {
    console.log(req.body)
    const senderEmail = req.body.senderEmail;
    const receiverEmail = req.body.receiverEmail;
    const role = parseFloat(req.body.role);

    if (isNaN(role)) {
        res.status(400).send({ error: 'Invalid amount. Please enter a positive number.' });
        return;
    }
    
    // Update the receiver's balance
    const updateReceiverQuery = `
        UPDATE mentorize_users
        SET role = role + ?
        WHERE email = ?
    `;

    con.query(updateReceiverQuery, [role, receiverEmail], (err, result) => {
        if (err) {
            console.log('\n\n');
            console.log('Error updating role: ' + err);
            res.status(500).send({ error: 'Error updating role.' });
            return;
        }

        // Balance updated successfully
        res.send({ message: 'role updated successfully.' });
    });
});

app.get('/api/events', (req, res) => {
    let query = 'SELECT * FROM Event_Log';

    con.query(query, (err, result, fields) => {
        if (err) {
            console.log('\n\n');
            console.log('Error fetching log: ' + err);
            res.status(500).send('Error fetching log');
        } else {
            res.send(result);
        }
    });
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

http.listen(8080, () => {
    console.log('\nThe Web server is alive!!!\n' +
        'It\'s listening on http://127.0.0.1:8080 or http://localhost:8080');
});
