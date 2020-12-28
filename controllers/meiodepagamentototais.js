const { controla } = require("../bibliotecas/diversos");
const mongo = require("../bibliotecas/mongo.js");
const meiodepagamento = require("../bibliotecas/meiodepagamento.js");

module.exports = (app) => {
  app.get("/populameiodepagamento", async (requisicao, resposta) => {
    globalRESULTADOATUALIZA = [];
    const registros = await mongo.obtemMeiosdepagamentoMongo();
    controla({ "Meios de pagamento": registros });
    await meiodepagamento.baixaMeiosdepagamento();
    controla({ "Meios de Pagamento no Bubble": globalMEIOSDEPAGAMENTO });
    const novosvendaveis = await meiodepagamento.trataMeiodepagamentoBulk(
      registros
    );
    console.log(Object.keys(novosvendaveis).length);
    controla({ "Novos Vendaveis": novosvendaveis });
    resposta.status(200).json(globalRESULTADOATUALIZA);
  });
};
