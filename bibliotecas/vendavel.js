const axios = require('axios');
const diversos = require('./diversos');


function qtdVendaveis(registro) {
    const qtd = Object.keys(registro.produto).length;
    return(qtd);
}
function vendavelExiste(produto){
    const existe = globalVENDAVEIS.find(element => element.produto_text === produto)
    if (existe === undefined) {
        return false;
    } else {
     return true;   
    }

};

async function trataVendaveis(registro){
   var index=0;
    const teste = JSON.parse(JSON.stringify(registro))
    do {
        if (qtdVendaveis(teste)===1) {
            var codigo = teste.codigoproduto
        } else {
            var codigo = teste.codigoproduto[index]
        }

        
        if (!vendavelExiste(teste.produto[index])) {

            const promise1 = await criaVendavel(teste.produto[index], codigo.toString());
            const promise2 = await buscaVendaveis();

            Promise.all([promise1, promise2]).then((valores) => { console.log(valores);});
            
            
        } 
        idProduto = await idVendavel(teste.produto[index]);
        console.log('id de ' + teste.produto[index] + ' => ' + idProduto);
        index++;
    } while (index<qtdVendaveis(teste));

};

async function idVendavel(produto){
    return new Promise((resolve, reject)=>{
        const existe = globalVENDAVEIS.find(element => element.produto_text === produto);
        const idProduto = JSON.parse(JSON.stringify(existe));

        resolve(idProduto._id)
    });

};

async function buscaVendaveis() {
    return new Promise((resolve, reject)=>{
        estabelecimento = globalESTABELECIMENTO;
        const rota = process.env.API_GEX+process.env.API_VENDAVEIS
        axios.post(rota,estabelecimento)
        .then((resposta)=>{
            globalVENDAVEIS = resposta.data.response.Vendavel;
            diversos.loga('Vendaveis carregados => ' + Object.keys(resposta.data.response.Vendavel).length);
            resolve(resposta.data.response.Vendavel);
        })
        .catch((erro)=>{reject(erro)})
    });
}

async function criaVendavel(produto,codigo) {
    return new Promise ((resolve, reject) =>{
        const novoVendavel = {
            "produto": produto,
            "estabelecimento": globalESTABELECIMENTO.Estabelecimento,
            "codigo": codigo
        }
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postvendavel/', novoVendavel)
        .then((respostaBubble)=>{
            globalRESULTADOATUALIZA.push({ "Vendavel Criado ": respostaBubble.data });
            diversos.loga('Vendavel novo criado')
            resolve(respostaBubble.data)})
        .catch((erroBubble)=>{
            console.log(erroBubble);
            console.log('Não foi possivel criar o produto');
            reject(erroBubble)})
    });
}


module.exports={
    qtdVendaveis,
    buscaVendaveis,
    criaVendavel,
    trataVendaveis,
}