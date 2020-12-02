const axios = require('axios');

async function registraVendaBubble(jsonVenda) {
    return new Promise ((resolve, reject) =>{
        // globalRESULTADOATUALIZA.push({"Venda enviada ao Bubble  ": jsonVenda});
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postvenda/', jsonVenda)
        .then((respostaBubble)=>{
            globalRESULTADOATUALIZA.push({"Resposta da criação de nova Venda  ": respostaBubble.data});
            resolve(respostaBubble.data)})
        .catch((erroBubble)=>{
            console.log('Erro de lançamento no Bubble');
            reject(erroBubble)})
    });
}

async function extraiVendas(registro, idNotaFiscal) {
    let registroJson=[]
    let registroTemporario={};
    const quantidade = Object.keys(registro.produto).length;
    for (let index = 0; index < quantidade; index++) {
        registroTemporario={};
        idVendavel = await trataVendavel(registro.produto[index])
        registroTemporario=({
            "Estabelecimento" : globalESTABELECIMENTO.Estabelecimento,
            "Preco_Unitario": registro.preco[index],
            "Processado" : false,
            "Produto": idVendavel,
            "Valor_Venda": registro.preco[index],
            "Quantidade": 1,
            "Nota_Fiscal": idNotaFiscal
        })
        registroJson.push(registroTemporario)

    }
    return(registroJson)
}

module.exports={
    registraVendaBubble,
    extraiVendas,
}