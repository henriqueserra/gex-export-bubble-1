const moment = require('moment');
// const momenttz = require('moment-timezone');
const ExportVisao = require('../models/model.exportavisao');

module.exports = app => {
    // ====================GET======================

    app.get('/export-bubble', (req, res) => {

        ExportVisao.find({})
          .exec((erro, resultados) => {
            if (erro) {
                console.log('Erro lendo Vendas ' + err);
            } else {
                res.status(200).json(resultados)
            }
        });
    });

};