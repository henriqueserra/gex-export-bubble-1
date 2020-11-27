const axios = require('axios');


async function registraVendaBubble(jsonVenda) {
    return new Promise ((resolve, reject) =>{
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postvenda/', jsonVenda)
        .then((respostaBubble)=>{
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
        // console.log(estabelecimento);
        // console.log(rota);
        axios.post(rota,estabelecimento)
        .then((resposta)=>{
            // console.log(resposta.data.response);
            globalVENDAVEIS = resposta.data.response.Vendavel;
            globalVENDAVEIS.forEach(element => {
                console.log(element.produto_text)
            });
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
            console.log(novoVendavel);
            console.log(respostaBubble.data);
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
            console.log(novoMeiodepagamento);
            console.log(respostaBubble.data);
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