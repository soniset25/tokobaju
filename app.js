const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();


const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'dbbaju'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected');
});

//set view file
app.set('views', path.join(__dirname, 'views'));

//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.get('/',(req, res) => {
    //res.send('Data Baju');
    let sql = "SELECT * FROM baju";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index' ,{
            title: 'Data Baju',
            baju :rows
        });
    });
});


app.get('/add',(req, res) => {
    res.render('add_baju' ,{
        title: 'Data Baju'
    });

});

app.post('/save', (req, res) => {
    let data = {id: req.body.id, Merek: req.body.Merek, Bahan: req.body.Bahan, 
        Ukuran: req.body.Ukuran, Warna: req.body.Warna, Stok: req.body.Stok, }
    let sql = "INSERT INTO baju SET ?";
    let query = connection.query(sql, data,(err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.get('/edit/(:id)',(req, res) => {
    var query = connection.query('SELECT * FROM baju where id='+req.params.id, function(err, rows){
        if(err){
            var err = ("Error Selecting : %s ", err);
            res.redirect('/');
        } else{
            if(rows.length <= 0){
                req.flash('msg_error', "Event can't be find!");
                res.redirect('/');
            } else{
                console.log(rows);
                res.render('edit_baju', {
                    title : 'Edit Data Baju',
                    baju: rows[0]
                });
            }
        }
    });
});

app.post('/update', (req, res) => {
    const id = req.body.id;
    let sql = "update baju SET id='"+req.body.id+"',  Merek='"+req.body.Merek+"',  Bahan='"+req.body.Bahan+"', Ukuran='"+req.body.Ukuran+"',  Warna='"+req.body.Warna+"',  Stok='"+req.body.Stok+"' where id ="+id;
    let query = connection.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.get('/delete/(:id)',(req, res) => {
    var todo = {
        id: req.params.id,
    }
    var delete_sql = 'DELETE FROM baju WHERE ?';       
    var query = connection.query(delete_sql, todo, function(err, result){
        if(err) throw err;
        res.redirect('/');
    });
});

//server listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});