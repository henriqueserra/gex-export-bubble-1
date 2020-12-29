const vendavel = require("../bibliotecas/vendavel");
const { controla } = require("../bibliotecas/diversos");
const modeloExportavisao = require("../models/model.exportavisao");
const main = require("../main");
const Axios = require("axios");

async function getDados() {
  const dados = await modeloExportavisao.find({}).distinct("produto");
  const dadossorteados = dados.sort();
  return dadossorteados;
}

async function trataProdutos(registros) {
  return new Promise(async (resolve, reject) => {
    try {
      var indice = 0;
      var produtos = [];
      do {
        produtos.push({
          produto: registros[indice],
          produtoexistente: vendavel.vendavelExiste(registros[indice]),
        });
        indice++;
      } while (indice < Object.keys(registros).length);
      resolve(produtos);
    } catch (error) {
      reject(error);
    }
  });
}
async function checaCodigo(produto) {
  const dados = await modeloExportavisao.findOne({ produto: produto });
  var produtosbruto = dados._doc.produto;
  var codigobruto = dados._doc.codigoproduto;
  var quantidadedeprodutosbrutos = Object.keys(produtosbruto).length;
  var index = 0;
  var indice = 0;
  do {
    if (produtosbruto[index] === produto) {
      indice = index;
    }
    index++;
  } while (index < quantidadedeprodutosbrutos);
  var codigoproduto = codigobruto[indice];
  return codigoproduto;
}

async function cadastraProdutos(produtos) {
  var indice = 0;
  var produtoscadastrados = [];
  globalNOVOSVENDAVEIS = null;
  var resultadobulk;
  const quantidade = Object.keys(produtos).length;
  do {
    if (produtos[indice].produtoexistente === false) {
      let codigo = await checaCodigo(produtos[indice].produto);
      var resultado = await vendavel.criaVendavel(
        produtos[indice].produto,
        codigo,
        false
      );
      produtoscadastrados.push({
        "produto cadastrando": produtos[indice].produto,
        id: resultado,
      });
      console.log("Produto " + produtos[indice].produto + " cadastrando");
    }
    indice++;
    console.log("restam " + (quantidade - indice));
  } while (indice < quantidade);
  if (globalNOVOSVENDAVEIS) {
    resultadobulk = await vendavel.gravaVendavelBulk(globalNOVOSVENDAVEIS);
  }
  return resultadobulk;
}

module.exports = (app) => {
  app.get("/populavendaveis", async (requisicao, resposta) => {
    // Carrega informações
    await main.inicio();
    await vendavel.buscaVendaveis();
    // Obtem dados
    const registros = await getDados();
    // const produtos = await trataProdutos(registros[0]);
    const produtos = await trataProdutos(registros);
    controla({ "Produtos Abertos": produtos });
    const produtoscomid = await cadastraProdutos(produtos);
    controla({ "Produtos Cadastrados": produtoscomid });
    resposta.status(200).json(globalRESULTADOATUALIZA);
    await main.inicio();
  });

  app.delete("/apagavendaveis", async (requisicao, resposta) => {
    // Carrega informações
    await main.inicio();
    // Obtem dados
    await vendavel.buscaVendaveis();
    var index = 0;
    globalRESULTADOATUALIZA = [];
    do {
      let respostadelete = await Axios.delete(
        "https://copiagexsyt.bubbleapps.io/version-test/api/1.1/obj/vendavel/" +
          globalVENDAVEIS[index]._id
      );
      controla({ "Resposta delete": globalVENDAVEIS[index].produto_text });
      console.log("Resposta Delete -> " + respostadelete.status);
      console.log("Apagando " + globalVENDAVEIS[index].produto_text);
      index++;
    } while (index < Object.keys(globalVENDAVEIS).length);
    resposta.status(200).json(globalRESULTADOATUALIZA);
    await main.inicio();
  });
};
