const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


 async function conexaoMongo() {
     return new Promise((resolve, reject) => {
         const opcoesDeConexao = {
             useNewUrlParser: true,
             useUnifiedTopology: true
         };
         MongoClient.connect(globalCONNECTIONSTRING, opcoesDeConexao, ((erro, conexao) => {
             if (erro) {
                 console.log('Conexão com Mongo mal sucedida...'+ new Date());
                 reject(erro);
             } else {
                 console.log('Conexão com Mongo bem sucedida...'+ new Date());
                 resolve(conexao);
              };
         }));
      });
};

async function obtemMeiosdepagamentoBubbble() {
    return new Promise(async (resolve, reject) => {
        var resultado = {};
        const client = await conexaoMongo();
        client.db('api').collection('vendas').distinct('CFe.infCFe.pgto.MP.cMP', function (erro, result) {
            if (erro) {
                reject(erro);
            } else {
                resultado = result;
                client.close();
                resolve(resultado);
            };
        });
    });
};
     
 
module.exports = {
    obtemMeiosdepagamentoBubbble,
}
