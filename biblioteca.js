const axios = require('axios');
const crud = require('./crud');


async function buscaEstabalecimentoBubble() {
    if (globalESTABELECIMENTO.Estabelecimento==undefined) {
        return new Promise((resolve, reject)=>{
            axios.post(process.env.API_GEX+process.env.API_ESTABELECIMENTO,{'CNPJ' : golbalCNPJ})
            .then((resposta)=>{
                globalESTABELECIMENTO = resposta.data.response
                resolve(resposta)})
            .catch((erro)=>{reject(erro)})
        });
    }
};



async function extraiVendas(registro, idNotaFiscal) {
    let registroJson=[]
    let registroTemporario={};
    const quantidade = Object.keys(registro.produto).length;
    // console.log(registro);
    for (let index = 0; index < quantidade; index++) {
        registroTemporario={};
        idVendavel = await trataVendavel(registro.produto[index])
        registroTemporario=({
            "Estabelecimento" : globalESTABELECIMENTO.Estabelecimento,
            "Preco_Unitario": registro.preco[index],
            "Processado" : false,
            "Produto": registro.produto[index],
            "Valor_Venda": registro.preco[index],
            "Quantidade": 1,
            "Nota_Fiscal": idNotaFiscal
        })
        registroJson.push(registroTemporario)

    }
    return(registroJson)
}

async function trataVendavel (produto){
    id='';
    vendavel = globalVENDAVEIS.find(element => element.produto_text === produto)
    if (vendavel === undefined) {
        resultadoCriacaoVendavel = await crud.criaVendavel(produto)
        console.log(produto+' criado '+ resultadoCriacaoVendavel.status);
        console.log('Carregando Vendaveis');
       await crud.buscaVendaveis();
       console.log('Vendaveis carregados');
    } else{
        id=vendavel._id;
    }

    return (id);
}



module.exports = {
    buscaEstabalecimentoBubble : buscaEstabalecimentoBubble,
    extraiVendas : extraiVendas,
    trataVendavel : trataVendavel,
}
