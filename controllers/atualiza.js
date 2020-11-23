const moment = require('moment');
// const momenttz = require('moment-timezone');
const ExportVisao = require('../models/model.exportavisao');
const VendasBubble = require('../models/model.vendasbubble');
const axios = require('axios');


// Obtem os dados do MongoDb.
// Faz uma busca pela data mais antiga da realização da venda e que possui o status processado = false
async function  getDados (){
    const dados = await ExportVisao.find({}).limit(1);    return (dados);


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


async function enviaBubble (resltado) {
    // return new Promise((resolve, reject)=>{
    //     // Converte o resultado que é um objeto para JSON
    //     var jsonresult = transformaEmJson(resultado)
    //     // 
    //     // Inicializa variável resultadodoposto
    //     var resultadodopost;
    //     // 
    //     // Envia registro para o Bubble
    //     const resultadodopost = await enviaDadosBubble(jsonresult);
    //     // 
    //     // Atualiza o registro no MongoDB 
    //     const resultadoDoUpdate = await updateMongoDb(resultadodopost._id);
    //     // 

        // Anterior
        // axios.post('https://gex-onboarding.bubbleapps.io/version-test/api/1.1/wf/vendas/', jsonresult)
        //     .then(function (responseaxios) {
        //         // console.log(responseaxios.data.response);
        //         resultadodopost = responseaxios.data.response;
        //         console.log('Dados gravados no Bubble');
        //         }).then (()=>{
        //             VendasBubble.updateOne({_id: resultadodopost._id},{processado: true}, {upsert: false}, (erroupdate, resultadoupdate)=>{
        //                 if(erroupdate) {console.log ('erro'+ erroupdate)
        //             reject (erroupdate)
        //         };
        //                 if(resultadoupdate){
        //                     console.log('Dados atualizados no MongoDB')
        //                     resolve(resultadodopost)

        //                 };
        //         })
        //       })
        //       .catch(error => {
        //         console.error(error);
        // })

    // })
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
        let limit = null;
        limit = requisicao.query.limit || 1
        console.log('Limit '+limit);
        var executados = [];
        var i=0;
        // Inicializa variável resultadodoposto
        var resultadodopost;
        // 

        do {
            const dados = await getDados();
            // const dados2 = await enviaBubble(dados);
            // Converte o resultado que é um objeto para JSON
            var jsonresult = transformaEmJson(dados)
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
        resposta.status(200).json(executados) 
    });


    app.get('/apaga', async (req, res) => {
        const resultado = await zeraStatusProcessado();
        console.log(resultado)
        var mensagemfinal = {'Total de registros': resultado.n,
        'Registros modificados': resultado.nModified}
        res.send(mensagemfinal)

    });



};