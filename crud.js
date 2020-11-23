const axios = require('axios');

async function registraNotaFiscalBubble(jsonresult) {
    return new Promise ((resolve, reject) =>{
        axios.post('https://gex-onboarding.bubbleapps.io/version-test/api/1.1/wf/vendas/', jsonresult)
        .then((respostaBubble)=>{
            console.log('Registro '+respostaBubble.data.response._id+' gravado no Bubble');
            resolve(respostaBubble.data.response)})
        .catch((erroBubble)=>{
            console.log('Erro de lançamento no Bubble');
            reject(erroBubble)})
    });
}


module.exports = {
    registraNotaFiscalBubble : registraNotaFiscalBubble,
}