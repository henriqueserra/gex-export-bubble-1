const moment = require('moment');
// const momenttz = require('moment-timezone');
const ExportVisao = require('../models/model.exportavisao');
const VendasBubble = require('../models/model.vendasbubble');


const axios = require('axios');

async function  getDados (){
    const dados = await ExportVisao.find({}).limit(1);
    console.log('Dados Lidos');
    return (dados);


}

async function enviaBubble (resltado) {
    return new Promise((resolve, reject)=>{
        var resultadoconvertido = JSON.stringify(resltado)
        var jsonresult = resultadoconvertido.substring(1, resultadoconvertido.length-1);
        var resultadodopost;
        console.log('Dados Convertidos')
        // Envia dados para o Bubble
        axios.post('https://gex-onboarding.bubbleapps.io/version-test/api/1.1/wf/vendas/', JSON.parse(jsonresult))
            .then(function (responseaxios) {
                // console.log(responseaxios.data.response);
                resultadodopost = responseaxios.data.response;
                console.log('Dados gravados no Bubble');
                }).then (()=>{
                    VendasBubble.updateOne({_id: resultadodopost._id},{processado: true}, {upsert: false}, (erroupdate, resultadoupdate)=>{
                        if(erroupdate) {console.log ('erro'+ erroupdate)
                    reject (erroupdate)
                };
                        if(resultadoupdate){
                            console.log('Dados atualizados no MongoDB')
                            resolve(resultadodopost)

                        };
                })
              })
              .catch(error => {
                console.error(error);
        })

    })
}

async function zeraStatusProcessado(){
     return new Promise ((resolve, reject)=>{
        VendasBubble.updateMany({},{$set : {processado : false}}, {upsert: false}).then((correto)=> resolve(correto)).catch((errado)=>reject(errado));
     })
}


module.exports = app => {
    // ====================GET======================
    app.get('/atualiza', async (requisicao, resposta) => {
        console.clear();
        var limit = requisicao
        .query.limit
        if (limit === undefined) {
            limit = 1
        }
        var executados = [];
        var i=0;
        do {
            const dados = await getDados();
            const dados2 = await enviaBubble(dados);
            executados.push(dados2)
            i=i+1;
        } while (i<limit);
        resposta.status(200).json(executados) 
    });

    app.get('/atualiza2', (req, res) => {
        var limit = req.query.limit
        console.log(typeof limit)
        if (limit === undefined) {
            limit = 1
        }
        console.log(typeof limit)
        const limite = {'limite': limit}
        res.send(limite)
    });

    app.get('/apaga', async (req, res) => {
        const resultado = await zeraStatusProcessado();
        console.log(resultado)
        var mensagemfinal = {'Total de registros': resultado.n,
        'Registros modificados': resultado.nModified}
        res.send(mensagemfinal)

    });



};