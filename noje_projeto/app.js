const express = require('express');
const { engine } = require('express-handlebars');
const app = express()
const path = require('path');
const db = require('./db/connection');
const bodyParser = require('body-parser');
const Job = require('./models/Job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const PORT = 3000;

app.listen(PORT, function () {
    console.log(`Server running on port ${PORT}`);
});

app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

db
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%'+search+'%';

    if(!search){
        Job.findAll({ order: [['createdAt', 'DESC']] })   
    .then(jobs => {
        res.render('index', {
            jobs
        });
    })
    .catch(err => console.log(err));
    } else {
        Job.findAll({ 
            where: {title: {[Op.like]: query}},
            order: [['createdAt', 'DESC']] })   
        .then(jobs => {
            res.render('index', {
                jobs
            });
        }) 
        .catch(err => console.log(err));
    }
    
});


app.use('/jobs', require('./routes/jobs'));