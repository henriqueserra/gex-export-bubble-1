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
    var existe = false;
    existe = globalVENDAVEIS.find(element => element.produto_text === produto);
    if (existe) {
    return true;
    } else {
     return false;   
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
        const existe = globalVENDAVEIS.find(element => element.produto_text == produto);
        // const idProduto = JSON.parse(JSON.stringify(existe));

        resolve(existe._id)
    });

};

async function buscaVendaveis() {
    controla({ 'Busca Vendaveis Chamado': new Date() });
    // controla({ 'Busca Vendaveis Chamado por': callerid.getData() });
    return new Promise(async (resolve, reject) => {
        estabelecimento = globalESTABELECIMENTO;
        globalVENDAVEIS = new Array();
        var cursor = 0;
        var remaining = 10;
        var qtd = 0;
        do {
            const rota = 'https://copiagexsyt.bubbleapps.io/version-test/api/1.1/obj/vendavel';
            params = new URLSearchParams([['cursor', cursor]]);
            teste = '[{"key":"Estabelecimento","constraint_type":"equals","value":"' + estabelecimento.Estabelecimento + '"}]';
            params.append('constraints',teste);
            resposta = await axios.get(rota, { params });
            qtd = resposta.data.response.results.length;
            resposta.data.response.results.forEach(element => {
                globalVENDAVEIS.push(element);
            });
            remaining = resposta.data.response.remaining;
            cursor = cursor + 100;
        } while (remaining>0);
        resolve('ok');
    });
};

async function criaVendavel(produto, codigo, atualiza) {
    // controla({ 'criaVendavel Chamado': new Date() });
    if (atualiza !== false) {
        atualiza = true;
    }
    const novoVendavel = {
        "produto_text": produto,
        "estabelecimento_custom_unidade": globalESTABELECIMENTO.Estabelecimento,
        "c_digo_text": codigo,
        "pre_o_number": 0,
        "estoque_number": 0,
        "valor_estoque_number": 0
    };
    const novoVendavelJSON = JSON.stringify(novoVendavel);
    // controla({ 'postvendavel': novoVendavel });
        const promise1 = await axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/obj/vendavel', novoVendavel);
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
    return (promise1.data.id);
};


module.exports={
    qtdVendaveis,
    buscaVendaveis,
    criaVendavel,
    trataVendaveis,
    idVendavel,
    vendavelExiste,
}