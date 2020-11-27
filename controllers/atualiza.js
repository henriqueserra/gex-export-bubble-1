const moment = require('moment');
// const momenttz = require('moment-timezone');
const ExportVisao = require('../models/model.exportavisao');
const VendasBubble = require('../models/model.vendasbubble');
const axios = require('axios');
const { json } = require('body-parser');
const biblioteca = require('../biblioteca');
const crud = require('../crud');
const notafiscal = require('../bibliotecas/notafiscal.js');
const meiodepagamento = require('../bibliotecas/meiodepagamento');


// Obtem os dados do MongoDb.
// Faz uma busca pela data mais antiga da realização da venda e que possui o status processado = false
async function  getDados (){
    const dados = await ExportVisao.find({}).limit(1);    
    globalRESULTADOATUALIZA.push({"dados obtidos": dados[0]});

    return (dados[0]);


}
// 

// Atualiza Dados no MongoDB
async function updateMongoDb(idMongo) {
    return new Promise ((resole, reject)=>{
    VendasBubble.updateOne({_id: idMongo},{processado : true},{upsert: false})
    .then ((respostaBubble)=>{
        resole(respostaBubble)
    }).catch((erroBubble)=>{
        console.log(idMongo+' Erro ao atualizar no Mongo');
        reject(erroBubble);
    });

    });
}
// 


async function zeraStatusProcessado(){
     return new Promise ((resolve, reject)=>{
        VendasBubble.updateMany({},{$set : {processado : false}}, {upsert: false}).then((correto)=> resolve(correto)).catch((errado)=>reject(errado));
     })
}


module.exports = app => {
    // ====================GET======================
    app.get('/atualiza', async (requisicao, resposta) => {
        globalRESULTADOATUALIZA=[];
        // Inicializa o parâmetro limit
        let limit = null;
        limit = requisicao.query.limit || 1
        globalRESULTADOATUALIZA.push({"limit": limit});
        // 
        var executados = [];
        var i=0;
        // Inicializa variável resultadodoposto
        var resultadodopost;
        // 

        do {
            // Busca os dados no MongoDb
            const jsonresult = await getDados();
            // 
            // Gera JSON para NotaFiscal
            notaFiscalExtraida = notafiscal.extraiNotaFiscal(jsonresult);
            // 
            // Grava NotaFiscal no Bubbe=le
            idNotaFiscal = await notafiscal.registraNotaFiscalBubble(notaFiscalExtraida);
            // 
            // **** Trata Meio de Pagamento
            // 
            meiodepagamento.trataMeiodepagamento(jsonresult);
            // 
            // ****

            // Gera JSON para Vendas
            vendasExtraida = await biblioteca.extraiVendas(jsonresult,idNotaFiscal);
            const quantidadeItensVendas = Object.keys(vendasExtraida).length;
            let index = 0
            do {
                // vendasExtraidaJson = JSON.stringify(vendasExtraida[index])
                vendasExtraidaJson = vendasExtraida[index];
                vendaCriada =   await crud.registraVendaBubble(vendasExtraidaJson);
                console.log('Venda Criada '+ JSON.stringify(vendaCriada.status));

                index++;
            } while (index<quantidadeItensVendas);
            // 
            // Atualiza o registro no MongoDB 
            const resultadoDoUpdate = await updateMongoDb(jsonresult._id);
            if (resultadoDoUpdate.ok == 1) {
                console.log('Update no MongoDB "success"');
            } else {
                
            }
            // 
            executados.push(jsonresult)
            i=i+1;
        } while (i<limit);
        // resposta.status(200).json(executados) 
        resposta.status(200).json(globalRESULTADOATUALIZA) 
    });


    app.get('/apaga', async (req, res) => {
        const resultado = await zeraStatusProcessado();
        console.log(resultado)
        var mensagemfinal = {'Total de registros': resultado.n,
        'Registros modificados': resultado.nModified}
        res.send(mensagemfinal)

    });



};