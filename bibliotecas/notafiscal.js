const axios = require('axios');
const vendavel = require('./vendavel');
const { controla } = require('./diversos');



async function extraiNotaFiscal(registro) {
    return new Promise((resolve, reject) => {
        controla({ 'extraiNotaFiscal chamada': new Date() });
        const quantidadeItens = vendavel.qtdVendaveis(registro);
        data = new Date(registro.criado);
        data.setHours(data.getHours()-3);
        const NotaFiscalJson = {
            "CPF Cliente": registro.destCPF,
            "Data": data,
            "Estabelecimento" : globalESTABELECIMENTO.Estabelecimento,
            "Itens": quantidadeItens,
            "NFe": registro.nCFe,
            "Numero_Caixa": registro.numeroCaixa,
            "Valor total" : registro.valortotal,
            "Venda_Manual": false,
        }
        controla({ 'NotaFiscalJson': NotaFiscalJson });
        controla({ 'extraiNotaFiscal resolvida': new Date() });
        resolve (NotaFiscalJson);
     });
}

async function registraNotaFiscalBubble(jsonNotaFiscal) {
    return new Promise((resolve, reject) => {
        controla({ 'registraNotaFiscalBubble chamada': new Date() });
        
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postnotafiscal/', jsonNotaFiscal)
        .then((respostaBubble)=>{
            globalIDNOTAFISCAL = respostaBubble.data.response.NotaFiscal;
            controla({ 'registraNotaFiscalBubble': respostaBubble.data });
            controla({ 'registraNotaFiscalBubble resolvida': new Date() });
            resolve(respostaBubble.data.response.NotaFiscal)})
        .catch((erroBubble)=>{
            console.log('Erro de lançamento no Bubble');
            reject(erroBubble)})
    });
}


module.exports={
    extraiNotaFiscal,
    registraNotaFiscalBubble,

}