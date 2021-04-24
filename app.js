const express = require('express');
const config = require('config');
const mongoose = require('mongoose');



const app = express();

app.set("view engine", "hbs");

app.use('/api/auth', require("./router/authRouter"));

app.use('/contact', (req, res)=>{
    res.render('contacs.hbs', {
        title: "Мои контакты",
        email: "mail1234",
        phone: "+1234567890"
    });
})

app.use('/register', require("./router/authRouter"), (req,res)=>{
    res.render('auth')
})

const PORT = process.env.PORT || config.get('port');

async function start() {
    try{
       await mongoose.connect(config.get('mongoURL'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(PORT, ()=>{
            console.log('Server run, PORT:' + config.get('port'));
        });
    }
    catch(error){
        console.log('--ERROR-- '+ error)
        process.exit()
    }
}

start();





