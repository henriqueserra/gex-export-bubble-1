const moment = require('moment');
const ExportVisao = require('../models/model.exportavisao');
const VendasBubble = require('../models/model.vendasbubble');
const axios = require('axios');
const { json } = require('body-parser');
const crud = require('../crud');
const notafiscal = require('../bibliotecas/notafiscal.js');
const meiodepagamento = require('../bibliotecas/meiodepagamento');
const { now } = require('moment');
const vendas = require('../bibliotecas/vendas');
const bubble = require('../bibliotecas/bubble');
const vendavel = require('../bibliotecas/vendavel');
const biblioteca = require('../biblioteca.js');
const diversos = require('../bibliotecas/diversos');
const main = require('../main.js');
const { controla } = require('../bibliotecas/diversos');


// Obtem os dados do MongoDb.
// Faz uma busca pela data mais antiga da realização da venda e que possui o status processado = false
async function  getDados (limit){
    const dados = await ExportVisao.find({}).limit(limit).sort({'criado': -1});

    globalRESULTADOATUALIZA.push({"Registros ": Object.keys(dados).length}); 
    // globalRESULTADOATUALIZA.push({"dados obtidos": dados});

    return (dados);


}
// 

// Atualiza Dados no MongoDB
async function updateMongoDb(idMongo) {
    return new Promise((resole, reject) => {
        controla({ 'updateMongoDb Chamado': new Date() });
    VendasBubble.updateOne({_id: idMongo},{processado : true},{upsert: false})
    .then ((respostamongo)=>{
        controla({ 'updateMongoDb Resultado': respostamongo });
        controla({ 'updateMongoDb Resolvido': new Date() });
        resole(respostamongo)
    }).catch((erroBubble)=>{
        console.log(idMongo+' Erro ao atualizar no Mongo');
        reject(erroMongo);
    });

    });
}
// 


async function zeraStatusProcessado(){
    return new Promise((resolve, reject) => {
        controla({'zeraStatusProcessado no Mongo ': new Date() });
         VendasBubble.updateMany({}, { $set: { processado: false } }, { upsert: false }).then((correto) => {
             diversos.loga('Registros MongoDB resetados');
             resolve(correto);
         }).catch((errado) => reject(errado));
     })
}


module.exports = app => {
    // ====================GET======================
    app.get('/atualiza', async (requisicao, resposta) => {
        main.inicio();

        globalRESULTADOATUALIZA=[];
        // Inicializa o parâmetro limit
        let limit = null;
        limit = requisicao.query.limit || 1
        limit = parseInt(limit);
        if (requisicao.query.apaga === "true") {
            const promise1 = await bubble.apagaBubble();
            const promise2 = await zeraStatusProcessado();

            Promise.all([promise1, promise2]).then((valores) => {
                controla({ 'Fim das Promisses': new Date() });
                controla({ 'Resultado Apaga Bubble': valores[0] });
                controla({ 'Resultado zeraStatusProcessado': valores[1] });
            });
        }
        // 
        globalINICIO=now();
        var executados = [];
        var i=0;
        // Inicializa variável resultadodoposto
        var resultadodopost;
        // 
        
        // Busca os dados no MongoDb
        const jsonresult = await getDados(limit);
        // 

        do {
            controla({ '=======================================INÍCIO DE PROCESSAMENTO======================': new Date() });

            // Obtem o registro que será processado.
            const registro = JSON.parse(JSON.stringify(jsonresult[i]));
            // 
            // Gera JSON para NotaFiscal
            controla({ '=======================================NOTA FISCAL======================': new Date() });
            const notaFiscalExtraida = await notafiscal.extraiNotaFiscal(registro);
            // 
            // Grava NotaFiscal no Bubbe=le
            const idNotaFiscal = await notafiscal.registraNotaFiscalBubble(notaFiscalExtraida);
            // 
            // **** Trata Meio de Pagamento
            // 
            controla({ '=======================================MEIO DE PAGAMENTO======================': new Date() });
            const promise1 = await meiodepagamento.trataMeiodepagamento(registro);
            // 
            // **** Trata Vendaveis
            controla({ '=======================================VENDAVEIS======================': new Date() });
            const promise2 = await vendavel.trataVendaveis(registro)
            // 
            //  Resolve todas as Promises anteriores
            Promise.all([notaFiscalExtraida, idNotaFiscal, promise1, promise2]);
            // 
            controla({ '================================================ VENDAS ======================': new Date() });
            // Gera JSON para Vendas
            const promise3 = await vendas.tratavendas(registro, idNotaFiscal);
            controla({ '================================================ ATUALIZA MONGODB ======================': new Date() });
            // Atualiza o registro no MongoDB 
            const resultadoDoUpdate = await updateMongoDb(registro._id);
            if (resultadoDoUpdate.ok == 1) {
                console.log('Update no MongoDB "success"');
            }
            // 
            
            i=i+1;
            console.log('Faltam '+ (limit-i)+' registros a serem processados');
        } while (i<limit);
        // resposta.status(200).json(executados) 
        globalFINAL = now();
        globalRESULTADOATUALIZA.unshift({"Tempo total de Processamento ": (globalFINAL-globalINICIO)/1000});
        globalRESULTADOATUALIZA.unshift({"Tempo total de Processamento por registro  ": (globalFINAL-globalINICIO)/1000/limit});
        
        resposta.status(200).json(globalRESULTADOATUALIZA) 
    });


    app.get('/apaga', async (req, res) => {
        const resultado = await zeraStatusProcessado();
        var mensagemfinal = {'Total de registros': resultado.n,
        'Registros modificados': resultado.nModified}
        console.clear();
        console.log(mensagemfinal)
        res.send(mensagemfinal)

    });



};