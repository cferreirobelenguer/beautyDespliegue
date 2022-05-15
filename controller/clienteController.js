'use strict'
//Importamos validator para validar cualquier tipo de dato
var validator= require('validator');
const { geoSearch } = require('../models/cliente');
const cliente = require('../models/cliente');
//Importo el modelo
var ClienteModelo=require('../models/cliente')


//Creamos un controlador
var controller={
    //Métodos de prueba
    /*
    datosCurso:(req,res)=>{
        var hola=req.body.hola;
        return res.status(200).send({
            prueba: 'Prueba para configurar el servidor en proyecto',
            autor: 'Carolina',
            hola
        });
    },
    test:(req,res)=>{
        return res.status(200).send({
            message:'Soy la acción test de mi controlador de clientes'
        });
    },*/
    //Métodos útiles

    //MÉTODO PARA GUARDAR DATOS EN LA BASE DE DATOS clientesCitas DE MONGODB
    save:(req,res)=>{
        //Recoger los parámetros por post
        var params=req.body;
        console.log(params);
        //Validar datos (validator) de los parámetros
        try{
            //Se comprueba si params.nombre no está vacío para validarlo, en caso de que no muestra mensaje de error
            var validate_nombre=!validator.isEmpty(params.nombre);
            //Se comprueba si params.apellidos no está vacío para validarlo, en caso de que no muestra mensaje de error
            var validate_apellidos=!validator.isEmpty(params.apellidos);
            //Se comprueba si params.tratamiento no está vacío para validarlo, en caso de que no muestra mensaje de error
            var validate_tratamiento=!validator.isEmpty(params.tratamiento);
            //Se comprueba si params.fecha no está vacío para validarlo, en caso de que no muestra mensaje de error
            var validate_fecha=!validator.isEmpty(params.fecha);
            //Se comprueba si params.hora no está vacío para validarlo, en caso de que no muestra mensaje de error
            var validate_hora=!validator.isEmpty(params.hora);
        }catch(err){
            return res.status(200).send({
                status:'error',
                message:'Faltan datos por enviar'
            });
        }
        //Si los parámetros están validados se realiza la búsqueda en la bbdd si existe una cita de esa persona en la misma fecha y a la misma hora
        //En ese caso no se podrá efectuar la reserva
        if(validate_nombre && validate_apellidos && validate_tratamiento && validate_fecha && validate_hora){
            cliente.find(
                //Si searchString está incluido dentro de nombre me saca los articulos
                //Se realiza la búsqueda por fecha y hora
                //Si hay citas en esa fecha y hora no se puede pedir cita porque ya está la cita ocupada
                { "fecha":params.fecha,"hora":params.hora},
            
            //Ordeno de manera descendente
            ).sort()
            .exec((err,resultados)=>{
    
                if(err){
                    //Error de servidor
                    return res.status(500).send({
                        status:'error',
                        message:'Error en la petición'
                    });
                }
                //Si no hay resultados, el cliente puede efectuar la reserva
                if(resultados==""){
                    var datosCliente=new cliente();
                    //Asignar valores al objeto
                    datosCliente.nombre= params.nombre;
                    datosCliente.apellidos=params.apellidos;
                    datosCliente.tratamiento=params.tratamiento;
                    datosCliente.fecha=params.fecha;
                    datosCliente.hora=params.hora;
        
                    
                    datosCliente.save((err,clienteGuardado)=>{
                        //Mensaje de error en caso de que los datos no se guarden correctamente
                        if(err || !clienteGuardado){
                            return res.status(404).send({
                                status:'error',
                                message: 'Los datos del cliente no se han guardado'
                            });
                        
                        }
                        //Se guardan los datos del cliente para la reserva
                        //Devolver respuesta en caso de que los datos se guarden correctamente en clienteGuardado
        
                        return res.status(200).send({
                            status:'success',
                            datosCliente:clienteGuardado
                        });
                    });
                }else{
                    //En caso de que se encuentren resultados no se puede efectuar la reserva porque la clienta ya tiene una reserva ese dia a esa hora
                    return res.status(200).send({
                        status:'error',
                        message:'No podemos procesar su solicitud, ya existe un servicio reservado en la fecha y hora solicitada '
                    });
                }
                
            });
    
        }else{
            //Error en caso de que falten parámetros o los datos que el cliente rellena en el formulario no son correctos
            return res.status(404).send({
                status:'error',
                message:'Los datos no son validos'
            });
        }
    
    
    },
     //MÉTODO BUSCADOR DE DATOS DE LAS CITAS POR FECHA Y HORA
    //MÉTODO NECESARIO PARA SAVE Y UPDATE
    /*search:(req,res)=>{
        //Sacar el String a buscar fecha y hora
        
        var buscarHora=req.params.hora;
        var buscarFecha=req.params.fecha;

        console.log(buscarNombre);
        console.log(buscarApellidos);
        console.log(buscarHora);
        console.log(buscarFecha);
        
        //Find
        cliente.find(
            //Si searchString está incluido dentro de nombre me saca los articulos
            { "fecha":buscarFecha, "hora":buscarHora},
        
        //Ordeno de manera descendente
        ).sort()
        .exec((err,resultados)=>{

            if(err){
                return res.status(500).send({
                    status:'error',
                    message:'Error en la petición'
                });
            }
            if(resultados==""){
                return res.status(404).send({
                    status:'error',
                    message:'No hay resultados en la búsqueda'
                });
            }
            return res.status(200).send({
                status:'success',
                resultados
            });
        });

    
    },*/
    
    //MÉTODO PARA ELIMINAR POR ID
    delete:(req,res)=>{
        //Recoger el id
        var clienteId=req.params.id;
        console.log(clienteId);
        //Find and delete
        cliente.findOneAndDelete({_id:clienteId}, (err,clienteRemove)=>{
            if(err){
                //Error
                return res.status(200).send({
                    status:'error',
                    message:'Error al borrar'
                });
            }
                if(!clienteRemove){
                    //Error en borrado
                    return res.status(200).send({
                        status:'error',
                        message:'No se ha podido borrar'
                    });
            }
            return res.status(200).send({
                status:'success',
                cliente:clienteRemove
            });
        });
    
    },
    //MÉTODO PARA BUSCAR POR NOMBRE Y APELLIDOS TODAS LAS CITAS DE LA CLIENTA
    getCitas:(req,res)=>{
        //Sacar el String a buscar nombre, apellidos
        var buscarNombre2=req.params.nombre;
        var buscarApellidos2=req.params.apellidos;

        console.log(buscarNombre2);
        console.log(buscarApellidos2);
        
        //Find
        cliente.find(
            //Si searchString está incluido dentro de nombre me saca los articulos
            { "nombre":buscarNombre2, "apellidos":buscarApellidos2},
        
        //Ordeno de manera descendente
        ).sort()
        .exec((err,resultados2)=>{
            if(err){
                return res.status(500).send({
                    status:'error',
                    message:'Error en la petición'
                });
            }
            
            return res.status(200).send({
                status:'success',
                resultados2
            });
    
    
        });    
    },
    //MÉTODO PARA MODIFICAR CITAS POR ID
    update:(req,res)=>{
        //Recoger el id del cliente por la url
        //id del cliente que me llega por url
        var clienteId=req.params.id;

        //Recoger los datos que llegan por put
        //Recojo todo el body de la petición que me llegue
        var params=req.body;

        //Validar datos (validator) de los parámetros
        try{
            //Se comprueba si params.nombre no está vacío para validarlo, en caso de que no muestra mensaje de error
            var validate_nombre=!validator.isEmpty(params.nombre);
            //Se comprueba si params.apellidos no está vacío para validarlo, en caso de que no muestra mensaje de error
            var validate_apellidos=!validator.isEmpty(params.apellidos);
            //Se comprueba si params.tratamiento no está vacío para validarlo, en caso de que no muestra mensaje de error
            var validate_tratamiento=!validator.isEmpty(params.tratamiento);
            //Se comprueba si params.fecha no está vacío para validarlo, en caso de que no muestra mensaje de error
            var validate_fecha=!validator.isEmpty(params.fecha);
            //Se comprueba si params.hora no está vacío para validarlo, en caso de que no muestra mensaje de error
            var validate_hora=!validator.isEmpty(params.hora);
        }catch(err){
            return res.status(200).send({
                status:'error',
                message:'Faltan datos por enviar'
            });
        }
        //Si los parámetros están validados se realiza la búsqueda en la bbdd si existe una cita de esa persona en la misma fecha y a la misma hora
        //En ese caso no se podrá efectuar la reserva
        if(validate_nombre && validate_apellidos && validate_tratamiento && validate_fecha && validate_hora){
            cliente.find(
                //Si searchString está incluido dentro de nombre me saca los articulos
                //Se realiza la búsqueda por fecha y hora
                //Si hay citas en esa fecha y hora no se puede pedir cita porque ya está la cita ocupada
                { "fecha":params.fecha,"hora":params.hora},
            
            //Ordeno de manera descendente
            ).sort()
            .exec((err,resultados)=>{
    
                if(err){
                    //Error de servidor
                    return res.status(500).send({
                        status:'error',
                        message:'Error en la petición'
                    });
                }
                //Si no hay resultados, el cliente puede efectuar la reserva
                if(resultados==""){
                    //Recoger los datos que llegan por put
                    //Recojo todo el body de la petición que me llegue
                    var params=req.body;
        //Validar datos
        try{
            //Se comprueba si params.nombre no está vacío para validarlo, en caso de que no muestra mensaje de error
            var validate_nombre=!validator.isEmpty(params.nombre);
            //Se comprueba si params.apellidos no está vacío para validarlo, en caso de que no muestra mensaje de error
            var validate_apellidos=!validator.isEmpty(params.apellidos);
            //Se comprueba si params.tratamiento no está vacío para validarlo, en caso de que no muestra mensaje de error
            var validate_tratamiento=!validator.isEmpty(params.tratamiento);
            //Se comprueba si params.fecha no está vacío para validarlo, en caso de que no muestra mensaje de error
            var validate_fecha=!validator.isEmpty(params.fecha);
            //Se comprueba si params.hora no está vacío para validarlo, en caso de que no muestra mensaje de error
            var validate_hora=!validator.isEmpty(params.hora);
        }catch(err){
            //En caso de que de error es que faltan datos por enviar
            return res.status(200).send({
                status:'error',
                message:'Faltan datos por enviar'
            });
        }
        //En ese caso no se podrá efectuar la modificación
        if(validate_nombre && validate_apellidos && validate_tratamiento && validate_fecha && validate_hora){
        //Find and update
        //Me va a actualizar el cliente que yo le pase por url
        cliente.findOneAndUpdate({_id: clienteId},params,{new:true},(err,clienteUpdate)=>{
            if(err){
               //Error de servidor
                return res.status(200).send({
                    status:'error',
                    message:'Error en servidor'
                });
            }
            //Si no tenemos objeto modificado es que no se ha encontrado el id del documento a modificar
            if(!clienteUpdate){
               //Error en caso de que no exista el artículo que queremos modificar
                return res.status(200).send({
                    status:'error',
                    message:'No existe el artículo'
                    });
                }
                return res.status(200).send({
                    status:'success',
                    cliente:clienteUpdate
                    });
                });
        }else{
            return res.status(200).send({
                status:'error',
                message:'La validación no es correcta'
            });
        }
                }else{
                    //En caso de que se encuentren resultados no se puede efectuar la reserva porque la clienta ya tiene una reserva ese dia a esa hora
                    return res.status(200).send({
                        status:'error',
                        message:'No podemos procesar su solicitud, ya existe un servicio reservado en la fecha y hora solicitada '
                    });
                }
                
            });
    
        }else{
            //Error en caso de que falten parámetros o los datos que el cliente rellena en el formulario no son correctos
            return res.status(200).send({
                status:'error',
                message:'Los datos no son validos'
            });
        }

    }

    
};//end controller
//exporto controller
module.exports=controller;