const axios = require('axios');
const crud = require('../crud.js');
const vendavel = require('./vendavel');
const notafiscal = require('./notafiscal');
const diersos = require('./diversos');
const diversos = require('./diversos');
const { controla } = require('./diversos');

// 
// 
// 
async function trataMeiodepagamento(registro) {
    controla({ 'trataMeiodepagamento chamado': new Date() });
    const quantidade = qtdMeiosdepagamento(registro);
    index = 0;
    do {
        const meioDePagamentoExiste = meiodepagamentoCadastrado(registro.meiopagamento[index]);
        if (meioDePagamentoExiste === null) {
            diversos.loga('criando meio de pagamento');
            respostaCriacaoMeiodepagamento = await criaMeiodepagamento(registro.meiopagamento[index]);
            Promise.all([respostaCriacaoMeiodepagamento]);
            diversos.loga('criado meio de pagamento');
        } 
        idMeiodepagamento = meiodepagamentoCadastrado(registro.meiopagamento[index]);   
        idPagamento = await criaPagamento(idMeiodepagamento, registro.valormeiopagamento[index])
        index ++;
    } while (index < quantidade);
    controla({ 'trataMeiodepagamento resolvido': new Date() });
    return ('ok');
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
        .then((resposta)=>{
            // baixaMeiosdepagamento();
            globalRESULTADOATUALIZA.push({"Pagamento criado ": resposta.data});
        resolve(resposta.data.response.Pagamento)})
        .catch((erroBubble)=>{
            console.log('Erro de lançamento no Bubble');
            reject(erroBubble)})
    });

};
// 
// 





async function criaMeiodepagamento (codigoMeiodepagamento){
    return new Promise((resolve, reject) => {
        controla({'criaMeiodepagamento chamado': new Date()})
        novoMeiodepagamemto={
            "Estabelecimento" : globalESTABELECIMENTO.Estabelecimento,
            "CodMeiodepagamento" : codigoMeiodepagamento
        };
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postmeiodepagamento/', novoMeiodepagamemto)
            .then(async (resposta) => {
                controla({ 'Meio de pagamento criado': resposta.data });
                diversos.loga('Meio de Pagamento Criado');
                await baixaMeiosdepagamento();
                controla({ 'criaMeiodepagamento Resolvido': new Date() });
        resolve(resposta.data)})
        .catch((erroBubble)=>{
            console.log('Erro de lançamento no Bubble');
            reject(erroBubble)})
    });

};


async function baixaMeiosdepagamento() {
    return new Promise((resolve, reject) => {
        controla({ 'baixaMeiosdepagamento chamado': new Date() });
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/getmeiosdepagamento/', globalESTABELECIMENTO)
            .then((resposta) => {
                controla({ 'Meios de Pagamento Baixados': resposta.data });
                globalMEIOSDEPAGAMENTO = resposta.data.response.Meiosdepagamento;
                diersos.loga('Meios de Pagamento carregados => ' + Object.keys(resposta.data.response.Meiosdepagamento).length);
                controla({ 'baixaMeiosdepagamento resolvido': new Date() });
                resolve(resposta.data)
            })
            .catch((erroBubble) => {
                console.log('Erro de lançamento no Bubble');
                reject(erroBubble)
            });
    });
}

function qtdMeiosdepagamento(registro){
    const qtd = Object.keys(registro.meiopagamento).length;
    return(qtd);
};

function meiodepagamentoCadastrado(codigo) {
    controla({ 'meiodepagamentoCadastrado chamado': new Date() });
    
    localizado = globalMEIOSDEPAGAMENTO.find(element => element.codigo_text === codigo)
    if (localizado === undefined) {
        // globalRESULTADOATUALIZA.push({"Meio de pagamento consultado":codigo});
        // globalRESULTADOATUALIZA.push({"Meio de pagamento cadastrado":false});
        controla({ 'Resultado se meio de pagamento existe': null });
        controla({ 'meiodepagamentoCadastrado resolvido': new Date() });
        return (null)
    } else {
        // globalRESULTADOATUALIZA.push({"Meio de pagamento cadastrado":true});
        // globalRESULTADOATUALIZA.push({"Meio de pagamento":localizado});
        controla({ 'Resultado se meio de pagamento existe': localizado._id });
        controla({ 'meiodepagamentoCadastrado resolvido': new Date() });
        return(localizado._id);
    }
};

module.exports = {
    baixaMeiosdepagamento,
    trataMeiodepagamento,
};