const bubble = require("../bibliotecas/bubble");

module.exports = (app) => {
  app.get("/estabelecimentos", async (requisicao, resposta) => {
    resposta.status(200).json(await bubble.getEstabelecimentos());
  });

  app.get("/estabelecimentoid", async (requisicao, resposta) => {
    resposta.status(200).json(await bubble.getEstabelecimentoId());
  });
};
