
const axios = require('axios');


module.exports = app => {
    // Busca _id do estabelecimento
    app.get('/buscaestabelecimento', async (requisicao, resposta) =>{
        dados = await buscaEstabalecimentoBubble({'CNPJ' : golbalCNPJ})
        resposta.status(200)
        resposta.json(globalESTABELECIMENTO)
    })



    // Busca lista de vendaveis
    app.get('/buscavendaveis', async (requisicao, resposta) =>{
        await buscaEstabalecimentoBubble({'CNPJ' : golbalCNPJ})
        dados = await buscaVendaveis()
        console.log(globalVENDAVEIS)
        resposta.status(200)
        resposta.send(dados)

    })
};

async function buscaEstabalecimentoBubble(cnpj) {
    return new Promise((resolve, reject)=>{
        axios.post(process.env.API_GEX+process.env.API_ESTABELECIMENTO,cnpj)
        .then((resposta)=>{
            globalESTABELECIMENTO = resposta.data.response
            resolve(resposta)})
        .catch((erro)=>{reject(erro)})
    });
};

async function buscaVendaveis() {
    return new Promise((resolve, reject)=>{
        estabelecimento = globalESTABELECIMENTO;
        const rota = process.env.API_GEX+process.env.API_VENDAVEIS
        // console.log(estabelecimento);
        // console.log(rota);
        axios.post(rota,estabelecimento)
        .then((resposta)=>{
            // console.log(resposta.data.response);
            globalVENDAVEIS = resposta.data.response.Vendavel;
            resolve(resposta.data.response.Vendavel)})
        .catch((erro)=>{reject(erro)})
    });
}