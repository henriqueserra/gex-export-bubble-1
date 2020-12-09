const moment = require('moment');
// const momenttz = require('moment-timezone');
const ExportVisao = require('../models/model.exportavisao');
const VendasBubble = require('../models/model.vendasbubble');
const axios = require('axios');
const { json } = require('body-parser');
const biblioteca = require('../biblioteca');
const crud = require('../crud');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');



module.exports = app => {
  app.get('/', async (req, res) => {
    /*
* Requires the MongoDB Node.js Driver
* https://mongodb.github.io/node-mongodb-native
*/

    const agg = [
      {
        '$unwind': {
          'path': '$produto'
        }
      }, {
        '$unwind': {
          'path': '$codigoproduto'
        }
      }, {
        '$group': {
          '_id': null,
          'produto': {
            '$addToSet': '$produto'
          },
          'codigoproduto': {
            '$addToSet': '$codigoproduto'
          }
        }
      }
    ];
  
    MongoClient.connect(
      'mongodb+srv://henrique:hrs830478@gex-db-cluster.zuow6.mongodb.net/test?authSource=admin&replicaSet=Gex-DB-Cluster-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (connectErr, client) {
        assert.strictEqual(null, connectErr);
        const coll = client.db('api').collection('Export-bubble-vendaveis');
        coll.find({}).toArray((err, resultado) => {
          res.send(resultado);
        });
      });
    // client.close();
  });


};