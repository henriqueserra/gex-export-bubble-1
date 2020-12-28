const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

async function conexaoMongo() {
  return new Promise((resolve, reject) => {
    const opcoesDeConexao = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    MongoClient.connect(
      globalCONNECTIONSTRING,
      opcoesDeConexao,
      (erro, conexao) => {
        if (erro) {
          console.log("Conexão com Mongo mal sucedida..." + new Date());
          reject(erro);
        } else {
          console.log("Conexão com Mongo bem sucedida..." + new Date());
          resolve(conexao);
        }
      }
    );
  });
}

async function obtemMeiosdepagamentoMongo() {
  return new Promise(async (resolve, reject) => {
    var resultado = {};
    const client = await conexaoMongo();
    client
      .db("api")
      .collection("vendas")
      .distinct("CFe.infCFe.pgto.MP.cMP", function (erro, result) {
        if (erro) {
          reject(erro);
        } else {
          resultado = result;
          client.close();
          resolve(resultado);
        }
      });
  });
}

async function obtemVendaveisMongo() {
  return new Promise(async (resolve, reject) => {
    var resultado = {};
    const client = await conexaoMongo();
    client
      .db("api")
      .collection("vendas")
      .distinct("CFe.infCFe.pgto.MP.cMP", function (erro, result) {
        assert.strictEqual(erro, null, "Erro na busca do bando");
        if (erro) {
          reject(erro);
        } else {
          resultado = result;
          client.close();
          resolve(resultado);
        }
      });
  });
}

async function obtemNotasfiscaisMongo(limite) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await conexaoMongo();
      const comandoAggregate = [
        {
          $match: {
            processado: false,
          },
        },
        {
          $addFields: {
            criado: {
              $dateFromParts: {
                year: {
                  $add: [
                    {
                      $year: "$createdAt",
                    },
                    1,
                  ],
                },
                month: {
                  $month: "$createdAt",
                },
                day: {
                  $dayOfMonth: "$createdAt",
                },
                hour: {
                  $hour: "$createdAt",
                },
                minute: {
                  $minute: "$createdAt",
                },
                second: {
                  $second: "$createdAt",
                },
              },
            },
            cNPJ: "$CFe.infCFe.emit.CNPJ",
            nCFe: "$CFe.infCFe.ide.nCFe",
            hEmi: "$CFe.infCFe.ide.hEmi",
            dEmi: "$CFe.infCFe.ide.dEmi",
            numeroCaixa: "$CFe.infCFe.ide.numeroCaixa",
            destCPF: "$CFe.infCFe.dest.CPF",
            destCNPJ: "$CFe.infCFe.dest.CPNJ",
            produto: "$CFe.infCFe.det.prod.xProd",
            vunitproduto: "$CFe.infCFe.det.prod.vUnCom",
            codigoproduto: "$CFe.infCFe.det.prod.cProd",
            preco: "$CFe.infCFe.det.prod.vItem",
            valortotal: "$CFe.infCFe.total.vCFe",
            meiopagamento: "$CFe.infCFe.pgto.MP.cMP",
            valormeiopagamento: "$CFe.infCFe.pgto.MP.vMP",
            arquivo: "$arquivo",
            troco: "$CFe.infCFe.pgto.vTroco",
          },
        },
        {
          $project: {
            criado: 1,
            hEmi: 1,
            dEmi: 1,
            cNPJ: 1,
            nCFe: 1,
            numeroCaixa: 1,
            destCPF: 1,
            destCNPJ: 1,
            produto: 1,
            codigoproduto: 1,
            vunitproduto: 1,
            preco: 1,
            valortotal: 1,
            meiopagamento: 1,
            valormeiopagamento: 1,
            arquivo: 1,
            troco: 1,
          },
        },
        {
          $match: {
            criado: {
              $lte: new Date(),
            },
          },
        },
        {
          $sort: {
            criado: -1,
          },
        },
        {
          $limit: limite,
        },
      ];
      var resultadofinal = [];
      // chama o  aggregate
      const resultado = await client
        .db("api")
        .collection("vendas")
        .aggregate(comandoAggregate)
        .toArray();
      resultadofinal = resultado;

      // await resultado.forEach((element) => {
      //   console.log(element);
      //   resultadofinal.push(element);
      // });
      resolve(resultadofinal);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  obtemMeiosdepagamentoMongo,
  obtemVendaveisMongo,
  obtemNotasfiscaisMongo,
};
