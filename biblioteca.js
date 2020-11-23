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

function extraiNotaFiscal(registro) {
    const quantidadeItens = Object.keys(registro.produto).length;
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
    return (NotaFiscalJson);
}

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
            "Produto": idVendavel,
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
        console.log(produto+' novo vendavel');
        id = await crud.criaVendavel(produto)
        console.log(produto+' criado '+ id);
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
    extraiNotaFiscal : extraiNotaFiscal,
    extraiVendas : extraiVendas,
    trataVendavel : trataVendavel,
}
