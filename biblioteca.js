const axios = require('axios');


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

function extraiVendas(registro) {
    let registroJson=[]
    let registroTemporario={};
    const quantidade = Object.keys(registro.produto).length;
    // console.log(registro);
    for (let index = 0; index < quantidade; index++) {
        registroTemporario={};
        registroTemporario=({
            "Estabelecimento" : globalESTABELECIMENTO.Estabelecimento,
            "Preco_Unitario": registro.preco[index],
            "Processado" : false,
            "Produto": registro.produto[index],
            "Valor_Venda": registro.preco[index],
            "Quantidade": 1,
            "Nota_Fiscal": "Incluir o dado Novo"
        })
        registroJson.push(registroTemporario)

    }
    return(registroJson);
}

module.exports = {
    buscaEstabalecimentoBubble : buscaEstabalecimentoBubble,
    extraiNotaFiscal : extraiNotaFiscal,
    extraiVendas : extraiVendas,
}
