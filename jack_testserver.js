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

    if (isNaN(amount) || amount <= 0) {
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


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

http.listen(8080, () => {
    console.log('\nThe Web server is alive!!!\n' +
        'It\'s listening on http://127.0.0.1:8080 or http://localhost:8080');
});


// Creating your own Web server with nodejs and conencting to mySQL database

/*
var http = require('http');     
var fs = require('fs');         
var url = require('url');       
var path = require('path');     
var mysql = require("mysql");
var fileExtensions = {
     ".html":    "text/html",
     ".css":     "text/css",
     ".js":      "text/javascript",
     ".jpeg":    "image/jpeg",
     ".jpg":     "image/jpeg",
     ".png":     "image/png"
 };

//replace the below parameters with your own

var con = mysql.createConnection({
    host: "107.180.1.16",
    user: "fall2023team8",
    password: "fall2023team8",
    database: "fall2023team8"
});
con.connect();

var server = http.createServer(function(request, response) { 

//console.log(request.url);
//console.log(request.headers.host);
var base = "http://" + request.headers.host;
//console.log(base);
var completeurl = new URL(request.url, base);
// console.log(completeurl);
//console.log(completeurl.href);

var table = completeurl.searchParams.get("tableName");
// console.log(table);
if (table == "mentorize_users") {
    // get into sql
var MyQuery = "SELECT * from mentorize_users";
con.query(MyQuery, function(err, result, fields){
    // console.log(result);
    response.end(JSON.stringify(result));

}); 

}

else {

    var pathname = url.parse(request.url).pathname;
    var filename;
    if(pathname === "/") {
        // change the 'filename' to the homepage of your website (if other than "index.html") 
        filename = "index.html"; 
    }
    else
        filename = path.join(process.cwd(), pathname);

    try {
        fs.accessSync(filename, fs.F_OK);
        var fileStream = fs.createReadStream(filename);
        var typeAttribute = fileExtensions[path.extname(filename)];
        response.writeHead(200, {'Content-Type': typeAttribute});
        fileStream.pipe(response);
    }
    catch(e) {
            console.log("\n\n");
            console.log('File does not exist: ' + filename);
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write('404 - File Not Found (' + filename + ')');
            response.end();
    }
} // end for else
}); // var server = http.createServer

server.listen(8080);
console.log("\nThe Web server is alive!!!\n"  + 
    "It's listening on http://127.0.0.1:8080 or http://localhost:8080");

    */