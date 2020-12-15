const mongo = require("../bibliotecas/mongo.js");

module.exports = (app) => {
  app.get("/populavendas", async (requisicao, resposta) => {
    const resultado = await mongo.obtemNotasfiscaisMongo();
    resposta.status(200).json(resultado);
  });
};
