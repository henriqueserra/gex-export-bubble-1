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
        if (!meioDePagamentoExiste) {
            idMeiodepagamento = criaMeiodepagamento(registro.meiopagamento[index])
        } 
        index ++;
    } while (index<quantidade);
};
// 
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