const moment = require('moment');
// const momenttz = require('moment-timezone');
const ExportVisao = require('../models/model.exportavisao');
const VendasBubble = require('../models/model.vendasbubble');


const axios = require('axios');


module.exports = app => {
    // ====================GET======================

    app.get('/atualiza', (req, res) => {
for (let index = 0; index < 1; index++) {
    ExportVisao.find({}).limit(1)
      .exec((erro, resultados) => {
        if (erro) {
            console.log('Erro lendo Vendas ' + err);
        } else {
            console.clear();
            var resultadoconvertido = JSON.stringify(resultados)
            var jsonresult = resultadoconvertido.substring(1, resultadoconvertido.length-1);
            var resultadodopost;
            axios
            .post('https://gex-onboarding.bubbleapps.io/version-test/api/1.1/wf/vendas/', JSON.parse(jsonresult))
            .then(function (responseaxios) {
                console.log(responseaxios.data.response);
                resultadodopost = responseaxios.data.response;
                res.status(200).json(resultadodopost);
                VendasBubble.updateOne({_id: resultadodopost._id},{processado: true}, {upsert: false}, (erroupdate, resultadoupdate)=>{
                    if(erroupdate) {console.log ('erro'+ erroupdate)};
                })
              })
              .catch(error => {
                console.error(error);
              })
        }
        
    });
        }
    });

    app.get('/atualiza/data/:data', (req, res) => {
        console.log(req.params.data);
        ExportVisao.find({criado: {$gt: new Date(req.params.data)}}).sort({'criado': 1}).limit(200)
          .exec((erro, resultados) => {
            if (erro) {
                console.log('Erro lendo Vendas ' + err);
            } else {
                res.status(200).json(resultados)
            }
        });
    });

};