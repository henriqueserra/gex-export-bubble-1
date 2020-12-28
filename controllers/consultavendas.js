const VendasBubble = require("../models/model.vendasbubble");
const { ObjectId } = require("mongodb");

module.exports = (app) => {
  // ====================GET======================

  app.get("/vendasbubble", (req, res) => {
    const agg = [
      {
        $addFields: {
          criado: "$createdAt",
          cNPJ: "$CFe.infCFe.emit.CNPJ",
          nCFe: "$CFe.infCFe.ide.nCFe",
          numeroCaixa: "$CFe.infCFe.ide.numeroCaixa",
          destCPF: "$CFe.infCFe.dest.CPF",
          destCNPJ: "$CFe.infCFe.dest.CPNJ",
          produto: "$CFe.infCFe.det.prod.xProd",
          preco: "$CFe.infCFe.det.prod.vItem",
          valortotal: "$CFe.infCFe.total.vCFe",
          meiopagamento: "$CFe.infCFe.pgto.MP.cMP",
          valormeiopagamento: "$CFe.infCFe.pgto.MP.vMP",
        },
      },
      {
        $project: {
          criado: 1,
          cNPJ: 1,
          nCFe: 1,
          numeroCaixa: 1,
          destCPF: 1,
          destCNPJ: 1,
          produto: 1,
          preco: 1,
          valortotal: 1,
          meiopagamento: 1,
          valormeiopagamento: 1,
        },
      },
      {
        $limit: 10,
      },
      {
        $sort: {
          criado: 1,
        },
      },
    ];

    VendasBubble.aggregate(agg).exec((erro, resultados) => {
      if (erro) {
        console.log("Erro lendo Vendas " + erro);
      } else {
        res.status(200).json(resultados);
      }
    });
  });

  app.get("/vendasbubble/:id", (req, res) => {
    const agg = [
      {
        $addFields: {
          criado: "$createdAt",
          cNPJ: "$CFe.infCFe.emit.CNPJ",
          nCFe: "$CFe.infCFe.ide.nCFe",
          numeroCaixa: "$CFe.infCFe.ide.numeroCaixa",
          destCPF: "$CFe.infCFe.dest.CPF",
          destCNPJ: "$CFe.infCFe.dest.CPNJ",
          produto: "$CFe.infCFe.det.prod.xProd",
          preco: "$CFe.infCFe.det.prod.vItem",
          valortotal: "$CFe.infCFe.total.vCFe",
          meiopagamento: "$CFe.infCFe.pgto.MP.cMP",
          valormeiopagamento: "$CFe.infCFe.pgto.MP.vMP",
        },
      },
      {
        $project: {
          criado: 1,
          cNPJ: 1,
          nCFe: 1,
          numeroCaixa: 1,
          destCPF: 1,
          destCNPJ: 1,
          produto: 1,
          preco: 1,
          valortotal: 1,
          meiopagamento: 1,
          valormeiopagamento: 1,
        },
      },
      {
        $limit: 10,
      },
      {
        $sort: {
          criado: 1,
        },
      },
      {
        $match: {
          _id: new ObjectId(req.params.id),
        },
      },
    ];

    VendasBubble.aggregate(agg).exec((erro, resultados) => {
      if (erro) {
        console.log("Erro lendo Vendas " + erro);
      } else {
        res.status(200).json(resultados);
      }
    });
  });
};
