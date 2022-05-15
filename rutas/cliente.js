'use strict'
//Cargo el módulo de express
var express= require('express');
//Cargo el controlador
var clienteController=require('../controller/clienteController');
//Llamo a Router de express
var router=express.Router();

//Rutas de prueba
//router.post('/datos-curso', clienteController.datosCurso);
//router.get('/test', clienteController.test);

//Rutas útiles
//Ruta para guardar los datos de las citas de los clientes

//Ruta para añadir datos de reserva
router.post('/save',clienteController.save);

//Ruta para borrar datos por id
router.delete('/delete/:id', clienteController.delete);

//Ruta para modificar datos por id
router.put('/update/:id', clienteController.update);

//Ruta para mostrar todos los datos de las citas por nombre y apellidos del cliente
router.get('/ver/:nombre&:apellidos', clienteController.getCitas);
module.exports= router;