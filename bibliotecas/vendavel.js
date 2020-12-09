const axios = require('axios');
const diversos = require('./diversos');
const { controla } = require('./diversos');
const callerid = require('caller-id');


function qtdVendaveis(registropassado) {
    controla({ 'qtdVendaveis chamado': new Date() });
    const qtd = Object.keys(registropassado.produto).length;
    controla({ 'Quantidade de Vendaveis': qtd });
    return(qtd);
}
function vendavelExiste(produto) {
    // controla({ 'vendavelExiste Chamado': new Date() });
    const existe = globalVENDAVEIS.find(element => element.produto_text === produto);
    if (existe === undefined) {
        // controla({ 'Vendavel Existe ?': false });
        // controla({ 'vendavelExiste Resolvido': new Date() });
    return false;
    } else {
        // controla({ 'Vendavel Existe ?': true });
        // controla({ 'vendavelExiste Chamado': new Date() });
     return true;   
    };

};

async function trataVendaveis(registro) {
    controla({ 'trataVendaveis Chamado': new Date() });
    var index = 0;
    const teste = JSON.parse(JSON.stringify(registro));
    do {
        if (qtdVendaveis(teste) === 1) {
            var codigo = teste.codigoproduto
        } else {
            var codigo = teste.codigoproduto[index]
        };
        if (!vendavelExiste(teste.produto[index])) {
            const promise1 = await criaVendavel(teste.produto[index], codigo.toString());
            Promise.all([promise1]);
        };
        idProduto = await idVendavel(teste.produto[index]);
        index++;
    } while (index < qtdVendaveis(teste));
    controla({ 'trataVendaveis Resolvido': new Date() });
};

async function idVendavel(produto){
    return new Promise((resolve, reject)=>{
        const existe = globalVENDAVEIS.find(element => element.produto_text === produto);
        // const idProduto = JSON.parse(JSON.stringify(existe));

        resolve(existe._id)
    });

};

async function buscaVendaveis() {
    controla({ 'Busca Vendaveis Chamado': new Date() });
    controla({ 'Busca Vendaveis Chamado por': callerid.getData() });
    return new Promise((resolve, reject) => {
        estabelecimento = globalESTABELECIMENTO;
        const rota = process.env.API_GEX+process.env.API_VENDAVEIS
        axios.post(rota, estabelecimento)
            .then((resposta) => {
                globalVENDAVEIS = resposta.data.response.Vendavel;
                controla({ 'Busca Vendaveis Resolvido': new Date() });
                resolve(resposta.data.response.Vendavel);
            })
            .catch((erro) => { reject(erro) });
    });
};

async function criaVendavel(produto, codigo, atualiza) {
    controla({ 'criaVendavel Chamado': new Date() });
    if (atualiza !== false) {
        atualiza = true;
    }
    const novoVendavel = {
        "produto": produto,
        "estabelecimento": globalESTABELECIMENTO.Estabelecimento,
        "codigo": codigo
    };
    controla({ 'postvendavel Chamado': new Date() });
    controla({ 'postvendavel': novoVendavel });
    const promise1 = await axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postvendavel/', novoVendavel);
    if (atualiza) {
        const promise2 = await buscaVendaveis();
        Promise.all([promise1, promise2]).then((valores) => { 
            controla({ 'postvendavel resposta': valores[0].data });
        });
    } else {
        Promise.all([promise1]).then((valores) => { 
            controla({ 'postvendavel resposta': valores[0].data });
        });
    }
    controla({ 'criaVendavel Resolvido': new Date() });
    return (promise1.data.response.vendavel);
};


module.exports={
    qtdVendaveis,
    buscaVendaveis,
    criaVendavel,
    trataVendaveis,
    idVendavel,
    vendavelExiste,
}