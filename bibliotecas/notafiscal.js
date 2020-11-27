const axios = require('axios');
const crud = require('../crud.js');
const vendavel = require('./vendavel');



function extraiNotaFiscal(registro) {
    const quantidadeItens = vendavel.qtdVendaveis(registro);
    const NotaFiscalJson = {
        "CPF Cliente": registro.destCPF,
        "Data": registro.criado,
        "Estabelecimento" : globalESTABELECIMENTO.Estabelecimento,
        "Itens": quantidadeItens,
        "Meio_Pagamento": registro.meiopagamento[0],
        "NFe": registro.nCFe,
        "Numero_Caixa": registro.numeroCaixa,
        "Valor total" : registro.valortotal,
        "Venda_Manual": false,
    }
    globalRESULTADOATUALIZA.push({"JSON da nota fiscal a ser criada": NotaFiscalJson});

    return (NotaFiscalJson);
}

async function registraNotaFiscalBubble(jsonNotaFiscal) {
    return new Promise ((resolve, reject) =>{
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postnotafiscal/', jsonNotaFiscal)
        .then((respostaBubble)=>{
            globalRESULTADOATUALIZA.push({"Resposta do POSTNOTAFISCAL": respostaBubble.data});
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