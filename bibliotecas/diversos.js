

function loga(texto) { 
    console.log(new Date()+' => '+texto);
};

function controla(texto) { 
    globalRESULTADOATUALIZA.push(texto);
};

module.exports = {
    loga,
    controla,
};