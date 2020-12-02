const axios = require('axios');

async function apagaBubble() {
    return new Promise((resolve, reject)=>{
        console.log('Apagando Registros do Bubble');
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/apaganotasfiscais/')
        .then((resposta)=>{
            globalRESULTADOATUALIZA.push({"Apagados registros do Bubble ": resposta.data.status});
            resolve(resposta.data.status)})
        .catch((erro)=>{reject(erro)})
    });
};

module.exports = {
    apagaBubble,
};
