const axios = require("axios");
const diversos = require("./bibliotecas/diversos");

async function buscaEstabalecimentoBubble() {
  if (globalESTABELECIMENTO.Estabelecimento == undefined) {
    return new Promise((resolve, reject) => {
      axios
        .post(process.env.API_GEX + process.env.API_ESTABELECIMENTO, {
          CNPJ: golbalCNPJ,
        })
        .then((resposta) => {
          globalESTABELECIMENTO = resposta.data.response;
          diversos.loga(
            "Estabelecimentos carregados => " +
              Object.keys(resposta.data.response).length
          );
          resolve(resposta);
        })
        .catch((erro) => {
          reject(erro);
        });
    });
  }
}

module.exports = {
  buscaEstabalecimentoBubble: buscaEstabalecimentoBubble,
};
