const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();



app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }


        if (err) {
            console.log(body.email);
            console.log(usuarioDB);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Para validar la contraseña
        if (!bcryptjs.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});
module.exports = app;