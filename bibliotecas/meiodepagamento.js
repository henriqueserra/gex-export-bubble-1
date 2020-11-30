const axios = require('axios');
const crud = require('../crud.js');
const vendavel = require('./vendavel');
const notafiscal = require('./notafiscal');

// 
// 
// 
async function trataMeiodepagamento(registro){
    const quantidade = qtdMeiosdepagamento(registro);
    index = 0;
    do {
        const meioDePagamentoExiste = meiodepagamentoCadastrado(registro.meiopagamento[index]);
        globalRESULTADOATUALIZA.push({"Variavel meioDePagamentoExiste? ": meioDePagamentoExiste});
        if (meioDePagamentoExiste === null) {
            respostaCriacaoMeiodepagamento = await criaMeiodepagamento(registro.meiopagamento[index])
            globalRESULTADOATUALIZA.push({"id do novo meio de pagamento ": respostaCriacaoMeiodepagamento.response.meiodepagamento._id});
            idMeiodepagamento = respostaCriacaoMeiodepagamento.response.meiodepagamento._id
        } else {
            idMeiodepagamento =  meioDePagamentoExiste
        };
        idPagamento = await  criaPagamento(idMeiodepagamento,registro.valormeiopagamento[index])
        index ++;
    } while (index<quantidade);
};
// 
// 
// 

// Cria Pagamento
async function criaPagamento (idMeiodepagamento, valor){
    return new Promise ((resolve, reject) =>{
        novoPagamemto={
            "Estabelecimento" : globalESTABELECIMENTO.Estabelecimento,
            "NotaFiscal" : globalIDNOTAFISCAL,
            "idMeiodepagamento" : idMeiodepagamento,
            "valor" : valor
        };
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postpagamento/', novoPagamemto)
        .then((respostaBubble)=>{
            baixaMeiosdepagamento();
            globalRESULTADOATUALIZA.push({"JSON enviado para criação de Pagamento ": novoPagamemto});
            globalRESULTADOATUALIZA.push({"Pagamento criado ": respostaBubble.data});
        resolve(respostaBubble.data.response.Pagamento)})
        .catch((erroBubble)=>{
            console.log('Erro de lançamento no Bubble');
            reject(erroBubble)})
    });

};
// 
// 





async function criaMeiodepagamento (codigoMeiodepagamento){
    return new Promise ((resolve, reject) =>{
        novoMeiodepagamemto={
            "Estabelecimento" : globalESTABELECIMENTO.Estabelecimento,
            "CodMeiodepagamento" : codigoMeiodepagamento
        };
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postmeiodepagamento/', novoMeiodepagamemto)
        .then((respostaBubble)=>{
            baixaMeiosdepagamento();
            globalRESULTADOATUALIZA.push({"JSON enviado para criação de meio de pagamento ": novoMeiodepagamemto});
            globalRESULTADOATUALIZA.push({"Meio de pagamento criado ": respostaBubble.data});
        resolve(respostaBubble.data)})
        .catch((erroBubble)=>{
            console.log('Erro de lançamento no Bubble');
            reject(erroBubble)})
    });

};


async function baixaMeiosdepagamento() {
    return new Promise ((resolve, reject) =>{
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/getmeiosdepagamento/', globalESTABELECIMENTO)
        .then((respostaBubble)=>{
        globalMEIOSDEPAGAMENTO = respostaBubble.data.response.Meiosdepagamento
        globalRESULTADOATUALIZA.push({"Meios de pagamento no Bubble ": globalMEIOSDEPAGAMENTO});
        resolve(respostaBubble.data)})
        .catch((erroBubble)=>{
            console.log('Erro de lançamento no Bubble');
            reject(erroBubble)})
    });
}

function qtdMeiosdepagamento(registro){
    const qtd = Object.keys(registro.meiopagamento).length;
    globalRESULTADOATUALIZA.push({"Quantidade de Meios de Pagamento na Nota Fiscal": qtd});
    console.log('Quantidade de Meios de Pagamento na Nota Fiscal ',qtd);
    return(qtd);
};

function meiodepagamentoCadastrado(codigo){
    localizado = globalMEIOSDEPAGAMENTO.find(element => element.codigo_text === codigo)
    if (localizado === undefined) {
        globalRESULTADOATUALIZA.push({"Meio de pagamento consultado":codigo});
        globalRESULTADOATUALIZA.push({"Meio de pagamento cadastrado":false});
        return(null)
    } else {
        globalRESULTADOATUALIZA.push({"Meio de pagamento cadastrado":true});
        globalRESULTADOATUALIZA.push({"Meio de pagamento":localizado});
        return(localizado._id);
    }
};

module.exports = {
    baixaMeiosdepagamento,
    trataMeiodepagamento,
};