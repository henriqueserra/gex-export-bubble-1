const axios = require('axios');
const { loga } = require('./diversos');
const { controla } = require('../bibliotecas/diversos');


async function apagaBubble() {
    controla({ 'apagaBubble Chamado': new Date() });
    return new Promise((resolve, reject) => {
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/apaganotasfiscais/')
            .then((resposta) => {
                loga('Registros apagados');
                controla({ 'resultado do apagaBubble': resposta.data });
                controla({ 'apagaBubble Resolvido': new Date() });
            resolve(resposta.data)})
        .catch((erro)=>{reject(erro)})
    });
};

module.exports = {
    apagaBubble,
};
