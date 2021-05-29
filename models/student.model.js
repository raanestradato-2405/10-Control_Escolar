const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            uppercase:true,
            maxLength: 50
        },
        lastname: {
            type: String,
            required: true,
            uppercase: true,
            maxLength: 50
        },
        curp: {
            type: String,
            required: [true, "Falta la curp"],
            uppercase: [true, "Curp en mayusculas porfavor"],
            match: [
              /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
              "Curp no valida",
            ],
          },
        create_date:{
            type: Date,
            default: Date.now
           
        },
        controlnumber: {
            type: String,
            required:true,
            unique:true
        },
        grade: {
            type:Number,
            required:true,
            min: 0,
            max: 100

        },
        carrer: {
            type: String,
            required: [true, "Falta la carrera"],
            enum: {
              values: ["ISC", "IM", "IGE", "IC"],
              message: "Carrera {VALUE} no soportada",
            },
          },
        }
);

const studentModel = mongoose.model('Student', schema, 'student');

module.exports = studentModel;