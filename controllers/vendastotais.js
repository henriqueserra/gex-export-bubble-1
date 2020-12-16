const mongo = require("../bibliotecas/mongo.js");
const diversos = require("../bibliotecas/diversos.js");

module.exports = (app) => {
  app.get("/populavendas", async (requisicao, resposta) => {
    const limite = diversos.trataLimite(requisicao.query.limit);
    const resultado = await mongo.obtemNotasfiscaisMongo(limite);
    resposta.status(200).json(resultado);
  });
};
