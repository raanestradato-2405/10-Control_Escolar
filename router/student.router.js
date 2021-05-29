const router = require('express').Router();

const mongoose = require('mongoose');
var status = require('http-status');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/students', {
    useNewUrlParser: true,
   useUnifiedTopology: true
});

const Student = require('../models/student.model');
const { BAD_REQUEST } = require('http-status');

module.exports = () => {

   /* Funcion de Insertar un Alumno */
     router.post('/', (req, res) => {
        student = req.body;
       
        Student.create(student)
            .then(
                (data) => {
                    //console.log(data);
                    res.json(
                        {
                            code: status.OK,
                            msg: 'Se insertó correctamente',
                            data: data
                        }
                    )
                    //console.log(res);
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json(
                            {
                                code: status.BAD_REQUEST,
                                msg: 'Ocurrió un error',
                                err: err.name,
                                detal: err.message
                            }
                        )
                }
            );
       
    });  

    /*Funcion de Consulta por Eliminar por numero de Control */
    router.delete('/:controlnumber', (req, res) => {
        controlnumber = req.params.controlnumber;

       Student.findOneAndDelete(controlnumber)
       .then(
           (data) => {
               if(data)
                   res.json({
                       code: status.OK,
                       msg: 'Se elimino Correctamente',
                       data: Student
                   })
               else 
               res.status(status.NOT_FOUND)
               .json({
                   code: status.NOT_FOUND,
                   msg: 'No se encontro el elemento'
               })
           }
       )
       .catch(
           (err) => {
               res.status(status.BAD_REQUEST)
                   .json({
                       code:status.BAD_REQUEST,
                       msg: 'Error en la petición',
                       err: err.name,
                       detail: err.message
                   })
           }
       )
   });

    /* Funcion Consulta General*/
    router.get('/', (req, res) => {
        Student.find({})
        .then(
            (students) => {
                res.json({
                    code: status.OK,
                    msg: 'Consulta correcta',
                    data: students
                })
            }
        )
        .catch(
            (err) => {
                res.status(status.BAD_REQUEST)
                    .json({
                        code:status.BAD_REQUEST,
                        msg: 'Error en la petición',
                        err: err.name,
                        detail: err.message
                    })
            }
        )
    });


    /* Funcion Consulta por Numero de Control */
    router.get('/:controlnumber', (req, res) => {

        const controlnumber = req.params.controlnumber;

        Student.findOne({controlnumber: controlnumber})
        .then(
            (student) => {
                if(student)
                    res.json({
                        code: status.OK,
                        msg: 'Consulta correcta',
                        data: student
                    });
                else
                    res.status(status.NOT_FOUND)
                    .json({
                        code: status.NOT_FOUND,
                        msg: 'No se encontró el elemento'
                    });

            }
        )
        .catch(
            (err) => {
                res.status(status.BAD_REQUEST)
                    .json({
                        code:status.BAD_REQUEST,
                        msg: 'Error en la petición',
                        err: err.name,
                        detail: err.message
                    })
            }
        )
    });

    /*Actualizacion de la Calificacion de un estudiante */
    router.put("/:controlnumber", (req, res) => {
        Student.updateOne(
          { controlnumber: req.params.controlnumber },
          { $set: { grade: req.body.grade } },
          { new: true }
        )
          .then((Student) => {
            if (Student)
              res.json({
                code: status.OK,
                msg: "Actualizacion correcta",
                data: Student,
              });
            else
              res.status(status.BAD_REQUEST).json({
                code: status.BAD_REQUEST,
                msg: "Actualizacion Incorrecta",
              });
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            });
          });
      });

    /* Estadistica Estudiantes Aprobados por carrera*/ 

      router.get("/Estudiantes/Aprobados", (req, res) => {
        Student.aggregate([
          {
            $match: { grade: { $gte: 70 } },
          },
          {
            $group: {
              _id: "$carrer",
              count: { $sum: 1 },
            },
          },
        ])
          .then((aprobado) => {
            Student.aggregate([
              {
                $match: { grade: { $lt: 70 } },
              },
              {
                $group: {
                  _id: "$carrer",
                  count: { $sum: 1 },
                },
              },
            ])
              .then((reprobado) => {
                res.json({
                  code: status.OK,
                  msg: "Datos",
                  reprobados: reprobado,
                  aprobados: aprobado,
                })
              })
              .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                  code: status.BAD_REQUEST,
                  msg: "Error en la petición",
                  err: err.name,
                  detail: err.message,
                })
              })
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            })
          })
      });

    /* Estadistica Estudiantes Por genero (Hombre/Mujer)*/

      router.get("/Estudiantes/Genero", (req, res) => {
        Student.aggregate([
          {
            $match: { curp: /^.{10}[h,H].*/ },
          },
          {
            $group: {
              _id: "$carrer",
              count: { $sum: 1 },
            },
          },
        ])
          .then((hombre) => {
            Student.aggregate([
              {
                $match: { curp: /^.{10}[m,M].*/ },
              },
              {
                $group: {
                  _id: "$carrer",
                  count: { $sum: 1 },
                },
              },
            ])
              .then((mujer) => {
                res.json({
                  code: status.OK,
                  msg: "Datos",
                  hombres: hombre,
                  mujeres: mujer,
                });
              })
              .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                  code: status.BAD_REQUEST,
                  msg: "Error en la petición",
                  err: err.name,
                  detail: err.message,
                });
              });
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            })
          })
      });

    /* Estadistica Estudiantes Foraneos por Carrera */
      router.get("/Estudiantes/Foraneos", (req, res) => {
        Student.aggregate([
          {
            $match: { curp: /^.{11}nt.*/ig },
          },
          {
            $group: {
              _id: "$carrer",
              count: { $sum: 1 },
            },
          },
        ])
          .then((local) => {
            Student.aggregate([
              {
                $match: { curp: /^.{11}(?!(nt)).*/ig },
              },
              {
                $group: {
                  _id: "$carrer",
                  count: { $sum: 1 },
                },
              },
            ])
              .then((foraneo) => {
                res.json({
                  code: status.OK,
                  msg: "Datos",
                  locales: local,
                  foraneos: foraneo,
                })
              })
              .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                  code: status.BAD_REQUEST,
                  msg: "Error en la petición",
                  err: err.name,
                  detail: err.message,
                })
              })
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            })
          })
      });


      /* Estadistica Estudiantes Menores y Mayores de Edar*/
      router.get("/Estudiantes/Edad", (req, res) => {
        Student.aggregate([
        { $match: { curp: /(.{4}[0-9][0-9][0-9][0-9][0-9][0-9].{6}[0-9][0-9])|(.{4}[0][0-3][0-9][0-9][0-9][0-9].{6}[A-Z,a-z][0-9])/ } },
          { $group: { _id: "$carrer", count: { $sum: 1 } } },
        ])
          .then((mayor) => {
            Student.aggregate([
              { $match: { curp: /^(?!((.{4}[0-9][0-9][0-9][0-9][0-9][0-9].{6}[0-9][0-9])|(.{4}[0][0-3][0-9][0-9][0-9][0-9].{6}[A-Z,a-z][0-9])))/ } },
              { $group: { _id: "$carrer", count: { $sum: 1 } } },
            ])
              .then((menor) => {
                res.json({
                  code: status.OK,
                  msg: "Mayores",
                  Mayores: mayor,
                  Menores: menor,
                });
              })
              .catch((err) => {
                res.status(status.BAD_REQUEST).json({
                  code: status.BAD_REQUEST,
                  msg: "Error en la petición",
                  err: err.name,
                  detail: err.message,
                });
              });
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            });
          });
      });


    return router;
}