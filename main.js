const biblioteca = require("./biblioteca");
const meiodepagamento = require("./bibliotecas/meiodepagamento");
const vendavel = require("./bibliotecas/vendavel");
const diversos = require("./bibliotecas/diversos.js");

async function inicio() {
  return new Promise(async (resolve, reject) => {
    console.clear();
    const promise1 = await biblioteca.buscaEstabalecimentoBubble();
    const promise2 = await vendavel.buscaVendaveis();
    const promise3 = await meiodepagamento.baixaMeiosdepagamento();
    Promise.all([promise1, promise2, promise3])
      .then(function () {
        console.clear();
        global.globalRESULTADOATUALIZA = [];
        diversos.loga("Sistema disponível");
        globalRESULTADOATUALIZA = null;
        globalRESULTADOATUALIZA = [];
        resolve("ok");
      })
      .catch((erro) => {
        reject(erro);
      });
  });
}

module.exports = {
  inicio: inicio,
};
