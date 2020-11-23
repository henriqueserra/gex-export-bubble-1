const moment = require('moment');
// const momenttz = require('moment-timezone');
const ExportVisao = require('../models/model.exportavisao');
const VendasBubble = require('../models/model.vendasbubble');
const axios = require('axios');
const { json } = require('body-parser');
const biblioteca = require('../biblioteca');
const crud = require('../crud');


// Obtem os dados do MongoDb.
// Faz uma busca pela data mais antiga da realização da venda e que possui o status processado = false
async function  getDados (){
    const dados = await ExportVisao.find({}).limit(1);    
    return (dados[0]);


}
// 
// Transforma em Json o Array retornado pela função getDados()
function transformaEmJson(origem) {

    return origem[0];
}
// 


async function enviaDadosBubble(jsonresult) {
    return new Promise ((resolve, reject) =>{
        axios.post('https://gex-onboarding.bubbleapps.io/version-test/api/1.1/wf/vendas/', jsonresult)
        .then((respostaBubble)=>{
            console.log('Registro '+respostaBubble.data.response._id+' gravado no Bubble');
            resolve(respostaBubble.data.response)})
        .catch((erroBubble)=>{
            console.log('Erro de lançamento no Bubble');
            reject(erroBubble)})
    });
    
}

// Atualiza Dados no MongoDB
async function updateMongoDb(idMongo) {
    return new Promise ((resole, reject)=>{
    VendasBubble.updateOne({_id: idMongo},{processado : true},{upsert: false})
    .then ((respostaBubble)=>{
        console.log(idMongo+' Atualizado no Mongo');
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
        // Limpa a tela de console
        console.clear();
        // await buscaEstabalecimentoBubble(golbalCNPJ);
        await biblioteca.buscaEstabalecimentoBubble();
        // Inicializa o parâmetro limit
        let limit = null;
        limit = requisicao.query.limit || 1
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
            notaFiscalExtraida = biblioteca.extraiNotaFiscal(jsonresult);
            // 
            // Grava NotaFiscal no Bubbe=le
            idNotaFiscal = await crud.registraNotaFiscalBubble(JSON.stringify(notaFiscalExtraida));
            // 

            // Gera JSON para Vendas
            vendasExtraida = await biblioteca.extraiVendas(jsonresult,idNotaFiscal);
            const quantidadeItensVendas = Object.keys(vendasExtraida).length;
            console.log('Vendas');
            console.log(vendasExtraida);
            console.log(quantidadeItensVendas);
            for (let index = 0; index < quantidadeItensVendas; index++) {
              vendaCriada =   await crud.registraVendaBubble(JSON.stringify(vendasExtraida[index]))
              console.log('Venda Criada '+ JSON.stringify(vendaCriada).id);
                
            }
            // 



            // Envia registro para o Bubble
            resultadodopost = await enviaDadosBubble(jsonresult);
            // 
            
            // Atualiza o registro no MongoDB 
            const resultadoDoUpdate = await updateMongoDb(resultadodopost._id);
            // 
            executados.push(resultadodopost._id)
            i=i+1;
        } while (i<limit);
        // resposta.status(200).json(executados) 
        resposta.status(200).json(globalESTABELECIMENTO) 
    });


    app.get('/apaga', async (req, res) => {
        const resultado = await zeraStatusProcessado();
        console.log(resultado)
        var mensagemfinal = {'Total de registros': resultado.n,
        'Registros modificados': resultado.nModified}
        res.send(mensagemfinal)

    });



};