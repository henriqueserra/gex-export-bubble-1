const axios = require('axios');
const { loga } = require('./diversos');
const { controla } = require('../bibliotecas/diversos');


async function apagaBubble() {
    return new Promise((resolve, reject) => {
        controla({ 'apagaBubble()': new Date() });
        loga('Apagando Registros do Bubble');
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/apaganotasfiscais/')
            .then((resposta) => {
            loga('Registros apagados');
            resolve(resposta.data)})
        .catch((erro)=>{reject(erro)})
    });
};

module.exports = {
    apagaBubble,
};
