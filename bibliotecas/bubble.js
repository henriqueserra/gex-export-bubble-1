const axios = require('axios');
const diversos = require('./diversos');

async function apagaBubble() {
    return new Promise((resolve, reject)=>{
        console.log('Apagando Registros do Bubble');
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/apaganotasfiscais/')
        .then((resposta)=>{
            globalRESULTADOATUALIZA.push({ "Apagados registros do Bubble ": resposta.data.status });
            diversos.loga('Registros Bubble Apagados');
            resolve(resposta.data)})
        .catch((erro)=>{reject(erro)})
    });
};

module.exports = {
    apagaBubble,
};
