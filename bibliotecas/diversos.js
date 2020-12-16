function loga(texto) {
  console.log(new Date() + " => " + texto);
}

function controla(texto) {
  globalRESULTADOATUALIZA.push(texto);
}

function logacomtempo(texto, valor) {
  console.log(new Date() + " => " + texto + " / " + valor);
}

function trataLimite(querystring) {
  var limit = querystring || 1;
  limit = parseInt(limit);
  return limit;
}

module.exports = {
  loga,
  controla,
  logacomtempo,
  trataLimite,
};
