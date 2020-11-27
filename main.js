const crud = require('./crud');
const biblioteca = require('./biblioteca');
const meiodepagamento = require('./bibliotecas/meiodepagamento');


async function  inicio() {
    console.clear();
    console.log('Sistema disponível');

    // Carrega Estabelecimento
    console.log('Carregando Estabelecimento');
    await biblioteca.buscaEstabalecimentoBubble()
    // 

    // Carrega tabela de Vendáveis
    console.log('Carregando Vendaveis');
    vendaveis = await crud.buscaVendaveis();
    console.log('Vendaveis carregados');

    console.log('Carregando Meios de Pagamento');
    await meiodepagamento.baixaMeiosdepagamento();
    console.log('Meios de pagamento carregados');

    
};

module.exports = {
    inicio : inicio,
}