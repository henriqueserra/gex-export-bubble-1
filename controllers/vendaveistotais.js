const vendavel = require('../bibliotecas/vendavel');
const { controla } = require('../bibliotecas/diversos');
const modeloVendasTotais = require('../models/model.vendaveis');
const main = require('../main');

async function getDados() {
    const dados = modeloVendasTotais.find({});
    return (dados);
};

async function trataProdutos(registros) {
    return new Promise(async (resolve, reject) => {
        var indice = 0;
        var produtos = new Array();
        do {
            produtos.push({
                'produto': registros.produto[indice],
                'codigoproduto': registros.codigoproduto[indice],
                'produtoexistente': vendavel.vendavelExiste(registros.produto[indice])
            })
            indice++;
        } while (indice < Object.keys(registros.produto).length);
        resolve(produtos);
    });

};
 
async function cadastraProdutos(produtos) {
    var indice = 0;
    var produtoscadastrados = new Array();
    const quantidade = Object.keys(produtos).length
    do {
        if (produtos[indice].produtoexistente===false) {
            var resultado = await vendavel.criaVendavel(produtos[indice].produto, produtos[indice].codigoproduto,false)
            produtoscadastrados.push({
                'produtocadastrado': produtos[indice].produto,
                'id': resultado
            });
            console.log('Produto ' + produtos[indice].produto + ' cadastrado');
        }
        indice++;
        console.log('restam '+(quantidade-indice));
    } while (indice < quantidade);
    return (produtoscadastrados);
 };


module.exports = app => {
    app.get('/populavendaveis', async (requisicao, resposta) => {
        // Carrega informações
        await main.inicio();
        // Obtem dados
        const registros = await getDados();
        const produtos = await trataProdutos(registros[0]);
        controla({ 'Produtos Abertos': produtos });
        const produtoscomid = await cadastraProdutos(produtos);
        controla({ 'Produtos Cadastrados': produtoscomid });
        resposta.status(200).json(globalRESULTADOATUALIZA);
     });

 };