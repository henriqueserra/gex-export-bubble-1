const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timeZone = require('mongoose-timezone');
mongoose.set('useCreateIndex', true);


const VendaveisTotais = new Schema({
    produto: [String],
    codigoproduto: [String]
}, {
    collection: 'Export-bubble-vendaveis'
});
VendaveisTotais.plugin(timeZone, { paths: ['criado'] });

module.exports = mongoose.model('modelvendaveistotais', VendaveisTotais);