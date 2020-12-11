const vendavel = require('../bibliotecas/vendavel');
const { controla } = require('../bibliotecas/diversos');
const modeloVendasTotais = require('../models/model.vendaveis');
const modeloExportavisao = require('../models/model.exportavisao');
const main = require('../main');

async function getDados() {
    const dados = await modeloExportavisao.find({}).distinct('produto');
    const dadossorteados = dados.sort();
    return (dadossorteados);
    // const dados = modeloVendasTotais.find({});
    // return (dados);
};

async function trataProdutos(registros) {
    return new Promise(async (resolve, reject) => {
        var indice = 0;
        var produtos = new Array();
        do {
            // produtos.push({
            //     'produto': registros.produto[indice],
            //     'codigoproduto': registros.codigoproduto[indice],
            //     'produtoexistente': vendavel.vendavelExiste(registros.produto[indice])
            // });
            produtos.push({
                'produto': registros[indice],
                'produtoexistente': vendavel.vendavelExiste(registros[indice])
            });
            indice++;
        } while (indice < Object.keys(registros).length);
        resolve(produtos);
    });

};
async function checaCodigo(produto) {
    const dados = await modeloExportavisao.findOne({ "produto": produto })
    var produtosbruto = dados._doc.produto;
    var codigobruto = dados._doc.codigoproduto;
    var quantidadedeprodutosbrutos = Object.keys(produtosbruto).length;
    var index = 0;
    var indice = 0;
    do {
        if (produtosbruto[index]===produto) {
            indice = index;
        }
        index++;
    } while (index < quantidadedeprodutosbrutos);
    var codigoproduto = codigobruto[indice];
    return (codigoproduto);

 };
 
async function cadastraProdutos(produtos) {
    var indice = 0;
    var produtoscadastrados = new Array();
    const quantidade = Object.keys(produtos).length
    do {
        if (produtos[indice].produtoexistente===false) {
            codigo = await checaCodigo(produtos[indice].produto);
            var resultado = await vendavel.criaVendavel(produtos[indice].produto, codigo, false)
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
        // const produtos = await trataProdutos(registros[0]);
        const produtos = await trataProdutos(registros);
        controla({ 'Produtos Abertos': produtos });
        const produtoscomid = await cadastraProdutos(produtos);
        controla({ 'Produtos Cadastrados': produtoscomid });
        resposta.status(200).json(globalRESULTADOATUALIZA);
        await main.inicio();
     });

 };