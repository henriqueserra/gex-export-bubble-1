const axios = require('axios');


function qtdVendaveis(registro) {
    const qtd = Object.keys(registro.produto).length;
    globalRESULTADOATUALIZA.push({'Quantidade de Vendáveis na Nota Fiscal' : qtd})
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
        console.log('Produto -> '+ teste.produto[index] + ' index '+index);
        if (!vendavelExiste(teste.produto[index])) {

            await criaVendavel(teste.produto[index], codigo.toString()).then(
                await buscaVendaveis()
            )
            
        } else {
            console.log(teste.produto[index]);
            console.log(vendavelExiste(teste.produto[index]));
        }
        produto = teste.produto[index];
        idProduto = await idVendavel(teste.produto[index])
        // console.log('Produto '+ produto+ ' ID '+ idProduto._id);


        globalRESULTADOATUALIZA.push({'Produto ' : teste.produto[index]})
        globalRESULTADOATUALIZA.push({'id ' : idProduto.produto_text})
        index++;
    } while (index<qtdVendaveis(teste));

};

async function idVendavel(produto){
    return new Promise((resolve, reject)=>{
      let existe = globalVENDAVEIS.find(element => element.produto_text === produto)
      existeStringfy=JSON.stringify(existe);
      globalRESULTADOATUALIZA.push({'idVendavel' : existe});
      globalRESULTADOATUALIZA.push({'GlobalVendaveis' : globalVENDAVEIS})
      console.log('ID Vendavel '+existe);
      resolve(existe)
    });

};

async function buscaVendaveis() {
    return new Promise((resolve, reject)=>{
        estabelecimento = globalESTABELECIMENTO;
        const rota = process.env.API_GEX+process.env.API_VENDAVEIS
        axios.post(rota,estabelecimento)
        .then((resposta)=>{
            console.log('Typeof de BuscaVendaveis '+ typeof resposta);
            globalVENDAVEIS = resposta.data.response.Vendavel;
            resolve(resposta.data.response.Vendavel)})
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
            globalRESULTADOATUALIZA.push({"JSON Criação de produto ": novoVendavel});
            globalRESULTADOATUALIZA.push({"Produto Criado ": respostaBubble.data});
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