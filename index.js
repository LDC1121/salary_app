var express = require('express');
var app = express();
var async = require('async');

const sqlite3 = require('sqlite3').verbose();

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', function(req, res){
    var responseRows = "";
    
    let db = new sqlite3.Database('salaries.db', (err) => {
        if(err) {
            throw err;
        }
    });

    db.each('SELECT DISTINCT Name name FROM Salaries;', [], (err, row) =>{
        if (err) {
            throw err;
        }
        responseRows += row.name;
    }, (err, number) => {
        res.send(responseRows);
        db.close();
    });
});

app.get('/first_template', (req, res) => {
    let db = new sqlite3.Database('salaries.db', (err) => {
        if(err) {
            throw err;
        }
    });

    db.all('SELECT DISTINCT Name name, MAX(Annualsalary) salary FROM Salaries GROUP BY Annualsalary ORDER BY salary DESC;', [], (err, rows) => {
        if(err) {
            throw err;
        }
        res.render('everyone', { data: rows });
        db.close();
    });
});

app.listen(3000);
