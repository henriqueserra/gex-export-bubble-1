

function loga(texto) { 
    console.log(new Date()+' => '+texto);
};

function controla(texto) { 
    globalRESULTADOATUALIZA.push(texto);
};

function logacomtempo(texto, valor) { 
    console.log(new Date()+ ' => '+texto+' / '+valor );
};

module.exports = {
    loga,
    controla,
    logacomtempo,
};