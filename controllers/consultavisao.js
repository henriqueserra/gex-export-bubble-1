const moment = require('moment');
// const momenttz = require('moment-timezone');
const ExportVisao = require('../models/model.exportavisao');


module.exports = app => {
    // ====================GET======================

    app.get('/export-bubble', (req, res) => {

        ExportVisao.find({}).limit(50)
          .exec((erro, resultados) => {
            if (erro) {
                console.log('Erro lendo Vendas ' + err);
            } else {
                res.status(200).json(resultados)
            }
        });
    });

    app.get('/export-bubble/data/:data', (req, res) => {
        console.log(req.params.data);
        ExportVisao.find({criado: {$gt: new Date(req.params.data)}}).sort({'criado': 1}).limit(5)
          .exec((erro, resultados) => {
            if (erro) {
                console.log('Erro lendo Vendas ' + err);
            } else {
                res.status(200).json(resultados)
            }
        });
    });

};