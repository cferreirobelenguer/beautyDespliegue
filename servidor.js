 'use strict'

//Cargar modulos de node para crear el servidor
//Cargamos el módulo de node js Express

var express=require('express');
//Variable para recibir las peticiones
var bodyParser= require('body-parser');


//Ejecutar Express para poder ejecutar http
//Creo la variable app que va a ser express
var app=express();

//Cargar ficheros y rutas
var clientes_rutas= require('./rutas/cliente');

//Cargar middlewares
//Cargo el bodyParser para utilizarlo
app.use(bodyParser.urlencoded({extended:false}));
//Vamos a convertir cualquier petición que me llegue a json
app.use(bodyParser.json());



//Activar el CORS para permitir peticiones desde el frontend
// Configurar cabeceras y cors
//middleware que se ejecuta antes de las rutas que tengamos
app.use((req, res, next) => {
    //Configuramos el control de acceso para que cualquier cliente pueda hacer peticiones ajax
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    //permitimos métodos http 
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadir prefijos a las rutas /Cargar rutas
app.use('/api',clientes_rutas);


//Exportar módulo que es el fichero actual para usarlo fuera y lanzar el servidor
//Me permite usar el objeto que he creado fuera de este fichero
module.exports=app;

