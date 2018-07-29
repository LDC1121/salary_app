var express = require('express');
var app = express();

const sqlite3 = require('sqlite3').verbose();

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', function(req, res){
    res.render('home');
});

app.get('/search', (req, res) => {
    let db = new sqlite3.Database('salaries.db', (err) => {
        if(err) {
            throw err;
        }
    });

    var name = '%' + req.query.fullname + '%';

    db.all('SELECT DISTINCT Name name, University university, PositionTitle position, BargainingUnit unit FROM Salaries WHERE Name LIKE ?', 
    [name], (err, rows) => {
        if(err) {
            throw err;
        }
        res.render('search_results', { data: rows });
        db.close();
    });
});

app.get('/everyone', (req, res) => {
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
