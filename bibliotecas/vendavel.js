const axios = require('axios');
const crud = require('../crud.js');

function qtdVendaveis(registro) {
    const qtd = Object.keys(registro.produto).length;
    globalRESULTADOATUALIZA.push({"Quantidade de Vendáveis na Nota Fiscal": qtd});
    console.log('Total de produtos na nota ',qtd);
    return(qtd);
}




module.exports={
    qtdVendaveis,
}