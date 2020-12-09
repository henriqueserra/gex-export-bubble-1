const crud = require('./crud');
const biblioteca = require('./biblioteca');
const meiodepagamento = require('./bibliotecas/meiodepagamento');
const vendavel = require('./bibliotecas/vendavel')
const diversos = require('./bibliotecas/diversos.js');


async function  inicio() {
    console.clear();
    const promise1 = await biblioteca.buscaEstabalecimentoBubble();
    const promise2 = await vendavel.buscaVendaveis();
    const promise3 = await meiodepagamento.baixaMeiosdepagamento();
    Promise.all([promise1, promise2, promise3]).then(function (valores) {
        console.clear();
        global.globalRESULTADOATUALIZA = [];
        diversos.loga('Sistema disponível');
    });
    globalRESULTADOATUALIZA = null;
    globalRESULTADOATUALIZA = [];

    
};

module.exports = {
    inicio : inicio,
}