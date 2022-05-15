'use strict'
//Llamamos a mongoose
var mongoose=require('mongoose');
//importamos servidor.js
var app=require('./servidor');
require('dotenv').config()


//Conexión a la base de datos clientesCitas en mongoDB
mongoose.Promise=global.Promise;
mongoose.connect('mongodb+srv://carol:user@mern.pilzx.mongodb.net/clientesCitas?retryWrites=true&w=majority',{useNewUrlParser: true}).then(()=>{
    console.log('La conexión a la bbdd se ha realizado bien');

    //Crear el servidor y ponerse a escuchar peticiones HTTP
    //Hacemos cambios en el puerto de escucha para adaptarlo a heroku
    app.listen(process.env.PORT || 3900, '0.0.0.0',()=>{
        console.log('Servidor corriendo');
    });

})

