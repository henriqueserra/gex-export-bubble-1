const axios = require('axios');


async function registraVendaBubble(jsonVenda) {
    return new Promise ((resolve, reject) =>{
        globalRESULTADOATUALIZA.push({"Venda enviada ao Bubble  ": jsonVenda});
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postvenda/', jsonVenda)
        .then((respostaBubble)=>{
            globalRESULTADOATUALIZA.push({"Resposta da criação de nova Venda  ": respostaBubble.data});
            resolve(respostaBubble.data)})
        .catch((erroBubble)=>{
            console.log('Erro de lançamento no Bubble');
            reject(erroBubble)})
    });
}

async function buscaVendaveis() {
    return new Promise((resolve, reject)=>{
        estabelecimento = globalESTABELECIMENTO;
        const rota = process.env.API_GEX+process.env.API_VENDAVEIS
        axios.post(rota,estabelecimento)
        .then((resposta)=>{
            globalVENDAVEIS = resposta.data.response.Vendavel;
            globalRESULTADOATUALIZA.push({"Vendaveis no Bubble": resposta.data});
            resolve(resposta.data.response.Vendavel)})
        .catch((erro)=>{reject(erro)})
    });
}

async function criaVendavel(produto) {
    return new Promise ((resolve, reject) =>{
        novoVendavel = {
            "produto": produto,
            "estabelecimento": globalESTABELECIMENTO.Estabelecimento
        }
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postvendavel/', novoVendavel)
        .then((respostaBubble)=>{
            resolve(respostaBubble.data)})
        .catch((erroBubble)=>{
            console.log(erroBuble);
            console.log('Não foi possivel criar o produto');
            reject(erroBubble)})
    });
}

async function criaMeiodepagamento(meiodepagamento) {
    return new Promise ((resolve, reject) =>{
        novoMeiodepagamento = {
            "codmeiodepagamento": meiodepagamento,
            "estabelecimento": globalESTABELECIMENTO.Estabelecimento
        }
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postmeiodepagamento/', novoMeiodepagamento)
        .then((respostaBubble)=>{
            resolve(respostaBubble.data)})
        .catch((erroBubble)=>{
            console.log(erroBuble);
            console.log('Não foi possivel criar o produto');
            reject(erroBubble)})
    });
}

module.exports = {
    registraVendaBubble : registraVendaBubble,
    buscaVendaveis : buscaVendaveis,
    criaVendavel : criaVendavel,
    criaMeiodepagamento : criaMeiodepagamento,
}