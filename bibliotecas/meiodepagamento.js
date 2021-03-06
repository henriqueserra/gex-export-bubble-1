const axios = require("axios");
const diversos = require("./diversos");
const { controla } = require("./diversos");

//
//
//

async function trataMeiodepagamentoBulk(meiosdepagamento) {
  var novosMeiosdepagamento = [];
  meiosdepagamento.forEach((codigo) => {
    let localizado = globalMEIOSDEPAGAMENTO.find(
      (element) => element === codigo
    );
    console.log("Localizado " + localizado);
    if (!localizado) {
      novosMeiosdepagamento.push({
        codigo_text: codigo.toString(),
        estabelecimento_custom_unidade: globalESTABELECIMENTO.Estabelecimento,
      });
    }
  });
  const qtd = Object.keys(novosMeiosdepagamento).length;
  if (qtd > 0) {
    const resultado = await gravaMeiodePagamentoBulk(novosMeiosdepagamento);
    controla({ "Resultado do Bulk ": resultado });
  }
  return novosMeiosdepagamento;
}

async function gravaMeiodePagamentoBulk(registros) {
  var registrosformatados = "";
  registros.forEach((element) => {
    registrosformatados =
      registrosformatados + JSON.stringify(element) + "\r\n";
  });
  const resultado = await axios.post(
    "https://copiagexsyt.bubbleapps.io/version-test/api/1.1/obj/meiodepagamento/bulk",
    registrosformatados,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
  return resultado.data;
}

async function trataMeiodepagamento(registro) {
  controla({ "trataMeiodepagamento chamado": new Date() });
  const quantidade = qtdMeiosdepagamento(registro);
  var index = 0;
  do {
    const meioDePagamentoExiste = meiodepagamentoCadastrado(
      registro.meiopagamento[index]
    );
    if (meioDePagamentoExiste == null) {
      diversos.loga("criando meio de pagamento");
      let respostaCriacaoMeiodepagamento = await criaMeiodepagamento(
        registro.meiopagamento[index]
      );
      Promise.all([respostaCriacaoMeiodepagamento]);
      diversos.loga("criado meio de pagamento");
    }
    let idMeiodepagamento = meiodepagamentoCadastrado(
      registro.meiopagamento[index]
    );
    let idPagamento = await criaPagamento(
      idMeiodepagamento,
      registro.valormeiopagamento[index]
    );
    index++;
  } while (index < quantidade);
  controla({ "trataMeiodepagamento resolvido": new Date() });
  return "ok";
}
//
//
//

// Cria Pagamento
async function criaPagamento(idMeiodepagamento, valor) {
  controla({ "Cria pagamento Chamado": new Date() });
  return new Promise((resolve, reject) => {
    const novoPagamemto = {
      Estabelecimento: globalESTABELECIMENTO.Estabelecimento,
      NotaFiscal: globalIDNOTAFISCAL._id,
      idMeiodepagamento: idMeiodepagamento,
      valor: valor,
    };
    controla({ "Novo pagamento": novoPagamemto });
    axios
      .post(
        "https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postpagamento/",
        novoPagamemto
      )
      .then((resposta) => {
        // baixaMeiosdepagamento();
        controla({ "Pagamento criado ": resposta.data });
        controla({ "Cria pagamento Resolvido": new Date() });
        resolve(resposta.data.response.Pagamento);
      })
      .catch((erroBubble) => {
        console.log("Erro de lançamento no Bubble");
        reject(erroBubble);
      });
  });
}
//
//

async function criaMeiodepagamento(codigoMeiodepagamento) {
  controla({ "criaMeiodepagamento chamado": new Date() });
  return new Promise((resolve, reject) => {
    const novoMeiodepagamemto = {
      Estabelecimento: globalESTABELECIMENTO.Estabelecimento,
      CodMeiodepagamento: codigoMeiodepagamento,
    };
    controla({ NovoMeiodePagamento: novoMeiodepagamemto });
    axios
      .post(
        "https://copiagexsyt.bubbleapps.io/version-test/api/1.1/wf/postmeiodepagamento/",
        novoMeiodepagamemto
      )
      .then(async (resposta) => {
        controla({ "Meio de pagamento criado": resposta.data });
        await baixaMeiosdepagamento();
        controla({ "criaMeiodepagamento Resolvido": new Date() });
        resolve(resposta.data);
      })
      .catch((erroBubble) => {
        console.log("Erro de lançamento no Bubble");
        reject(erroBubble);
      });
  });
}

async function baixaMeiosdepagamento() {
  controla({ "Busca Meios de Pagamento Chamado": new Date() });
  return new Promise(async (resolve, reject) => {
    try {
      const estabelecimento = globalESTABELECIMENTO;
      globalMEIOSDEPAGAMENTO = [];
      var cursor = 0;
      var remaining = 10;
      do {
        const rota =
          "https://copiagexsyt.bubbleapps.io/version-test/api/1.1/obj/meiodepagamento";
        let params = new URLSearchParams([["cursor", cursor]]);
        let teste =
          '[{"key":"Estabelecimento","constraint_type":"equals","value":"' +
          estabelecimento.Estabelecimento +
          '"}]';
        params.append("constraints", teste);
        let resposta = await axios.get(rota, { params });
        resposta.data.response.results.forEach((element) => {
          globalMEIOSDEPAGAMENTO.push(element);
        });
        remaining = resposta.data.response.remaining;
        cursor = cursor + 100;
      } while (remaining > 0);
      resolve("ok");
    } catch (error) {
      reject(error);
    }
  });
}

function qtdMeiosdepagamento(registro) {
  const qtd = Object.keys(registro.meiopagamento).length;
  return qtd;
}

function meiodepagamentoCadastrado(codigo) {
  controla({ "meiodepagamentoCadastrado chamado": new Date() });

  const localizado = globalMEIOSDEPAGAMENTO.find(
    (element) => element.codigo_text === codigo
  );
  if (localizado === undefined) {
    // globalRESULTADOATUALIZA.push({"Meio de pagamento consultado":codigo});
    // globalRESULTADOATUALIZA.push({"Meio de pagamento cadastrado":false});
    controla({ "Resultado se meio de pagamento existe": null });
    controla({ "meiodepagamentoCadastrado resolvido": new Date() });
    return null;
  } else {
    // globalRESULTADOATUALIZA.push({"Meio de pagamento cadastrado":true});
    // globalRESULTADOATUALIZA.push({"Meio de pagamento":localizado});
    controla({ "Resultado se meio de pagamento existe": localizado });
    controla({ "meiodepagamentoCadastrado resolvido": new Date() });
    return localizado._id;
  }
}

module.exports = {
  baixaMeiosdepagamento,
  trataMeiodepagamento,
  trataMeiodepagamentoBulk,
};
