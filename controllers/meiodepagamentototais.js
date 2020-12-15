const main = require('../main');
const { default: Axios } = require('axios');
const { controla } = require('../bibliotecas/diversos');
const mongo = require('../bibliotecas/mongo.js');
const meiodepagamento = require('../bibliotecas/meiodepagamento.js');

module.exports = app => {
    app.get('/populameiodepagamento', async (requisicao, resposta) => {
        globalRESULTADOATUALIZA = new Array();
        const registros = await mongo.obtemMeiosdepagamentoBubbble();
        controla({ 'Meios de pagamento': registros });
        await meiodepagamento.baixaMeiosdepagamento();
        controla({ 'Meios de Pagamento no Bubble': globalMEIOSDEPAGAMENTO });
        novosvendaveis = await meiodepagamento.trataMeiodepagamentoBulk(registros);
        console.log(Object.keys(novosvendaveis).length);
        controla({ 'Novos Vendaveis': novosvendaveis });
        resposta.status(200).json(globalRESULTADOATUALIZA);
     });
};
