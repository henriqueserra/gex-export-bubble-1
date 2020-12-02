const crud = require('./crud');
const biblioteca = require('./biblioteca');
const meiodepagamento = require('./bibliotecas/meiodepagamento');
const vendavel = require('./bibliotecas/vendavel')


async function  inicio() {
    console.clear();
    // Carrega Estabelecimento
    await biblioteca.buscaEstabalecimentoBubble()
    console.log('Estabelecimentos carregados');
    // 
    // Carrega tabela de Vendáveis
    vendaveis = await vendavel.buscaVendaveis();
    console.log('Vendaveis carregados');
    
    await meiodepagamento.baixaMeiosdepagamento();
    console.log('Meios de pagamento carregados');
    console.log('Sistema disponível');

    
};

module.exports = {
    inicio : inicio,
}