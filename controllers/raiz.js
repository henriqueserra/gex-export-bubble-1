// const momenttz = require('moment-timezone');
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

module.exports = (app) => {
  app.get("/", async (req, res) => {
    /*
     * Requires the MongoDB Node.js Driver
     * https://mongodb.github.io/node-mongodb-native
     */

    MongoClient.connect(
      "mongodb+srv://henrique:hrs830478@gex-db-cluster.zuow6.mongodb.net/test?authSource=admin&replicaSet=Gex-DB-Cluster-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (connectErr, client) {
        assert.strictEqual(null, connectErr);
        const coll = client.db("api").collection("Export-bubble-vendaveis");
        coll.find({}).toArray((err, resultado) => {
          res.send(resultado);
        });
      }
    );
    // client.close();
  });
  app.get("/log", (requisicao, resposta) => {
    const fs = require("fs");
    try {
      resposta.send(
        fs.readFileSync("./log.txt", { encoding: "utf8", flag: "r" })
      );
    } catch (error) {
      resposta.send(error);
    }
  });
};
