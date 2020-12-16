const axios = require("axios");
const { loga } = require("./diversos");
const { controla } = require("../bibliotecas/diversos");

async function apagaBubble() {
  controla({ "apagaBubble Chamado": new Date() });
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/apaganotasfiscais/"
      )
      .then((resposta) => {
        loga("Registros apagados");
        controla({ "resultado do apagaBubble": resposta.data });
        controla({ "apagaBubble Resolvido": new Date() });
        resolve(resposta.data);
      })
      .catch((erro) => {
        reject(erro);
      });
  });
}

async function getEstabelecimentoId() {
  controla({ "getEstabelecimentoId chamado": new Date() });
  const parametros = montaConstraints("cnpj_text", "equals", golbalCNPJ);
  const resposta = await axios.get(
    "https://copiagexsyt.bubbleapps.io/version-test/api/1.1/obj/estabelecimento" +
      parametros
  );
  return resposta.data.response.results;
}

async function getEstabelecimentos() {
  controla({ "getEstabelecimento chamado": new Date() });
  const resposta = await axios.get(
    "https://copiagexsyt.bubbleapps.io/version-test/api/1.1/obj/estabelecimento"
  );
  return resposta.data.response.results;
}

function montaConstraints(key, constrainttype, valor) {
  params =
    '?constraints=[{"key":"' +
    key +
    '","constraint_type":"' +
    constrainttype +
    '","value":"' +
    valor +
    '"}]';
  return params;
}

module.exports = {
  apagaBubble,
  getEstabelecimentos,
  getEstabelecimentoId,
};
