const axios = require('axios');






async function criaMeiodepagamento(meiodepagamento) {
    return new Promise ((resolve, reject) =>{
        novoMeiodepagamento = {
            "codmeiodepagamento": meiodepagamento,
            "estabelecimento": globalESTABELECIMENTO.Estabelecimento
        }
        axios.post('https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postmeiodepagamento/', novoMeiodepagamento)
        .then((respostaBubble)=>{
            resolve(respostaBubble.data)})
        .catch((erroBubble)=>{
            console.log(erroBuble);
            console.log('Não foi possivel criar o produto');
            reject(erroBubble)})
    });
}

module.exports = {
    criaMeiodepagamento : criaMeiodepagamento,
}