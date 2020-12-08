const axios = require('axios');
const { controla, loga } = require('./diversos');
const { logacomtempo } = require('./diversos');
const vendavel = require('./vendavel');

async function registraVendaBubble(jsonVenda) {
    return new Promise((resolve, reject) => {
        controla({ 'registraVendaBubble Chamado': new Date() });
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postvenda/', jsonVenda)
            .then((respostaBubble) => {
                controla({ 'Venda gravada no Bubble': respostaBubble.data });
                controla({ 'registraVendaBubble Resolvido': new Date() });
                resolve(respostaBubble.data);
            }).catch((erroBubble) => {
                console.log('Erro de lançamento no Bubble');
                reject(erroBubble);
            });
    });
}

async function extraiVendas(registropassado, idNotaFiscal) {
    // registro = JSON.parse(JSON.stringify(registro));
    controla({ 'extraiVendas Chamado': new Date() });
    controla({ 'registro Passado': registropassado });
    let registroJson = [];
    let registroTemporario = {};
    const quantidade = vendavel.qtdVendaveis(registropassado);
    for (let index = 0; index < quantidade; index++) {
        registroTemporario={};
        idVendavel = await vendavel.idVendavel(registropassado.produto[index]);
        registroTemporario=({
            "Estabelecimento" : globalESTABELECIMENTO.Estabelecimento,
            "Preco_Unitario": registropassado.preco[index],
            "Processado" : false,
            "Produto": idVendavel,
            "Valor_Venda": registropassado.preco[index],
            "Quantidade": 1,
            "Nota_Fiscal": idNotaFiscal._id
        })
        registroJson.push(registroTemporario)
    }
    controla({ 'extraiVendas Resultado': registroJson });
    controla({ 'extraiVendas Resolvido': new Date() });
    return(registroJson)
}

function qtdVendas(vendastotais) {
    controla({ 'qtdVendas chamado': new Date() });
    const qtd = Object.keys(vendastotais).length;
    controla({ 'Quantidade de Vendas': qtd });
    return(qtd);
}

async function tratavendas(registro, idnotafiscal) { 
    controla({ 'TrataVendas Chamada': new Date() });
    vendasExtraida = await extraiVendas(registro, idnotafiscal);
    controla({ 'vendasExtraida': vendasExtraida });
    const quantidadeItensVendas = qtdVendas(vendasExtraida);
    var index = 0;
    do {
        await registraVendaBubble(vendasExtraida[index]);
        index++;
    } while (index < quantidadeItensVendas);

    controla({ 'TrataVendas Resolvido': new Date() });
};

module.exports={
    registraVendaBubble,
    extraiVendas,
    qtdVendas,
    tratavendas,
}