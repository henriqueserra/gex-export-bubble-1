const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timeZone = require('mongoose-timezone');
mongoose.set('useCreateIndex', true);


const VendasBubbleSchema = new Schema({
    criado: Date,
    cNPJ: String,
    nCFe: String,
    numeroCaixa: Number,
    destCPF: String,
    destCNPJ: String,
    produto: [String],
    preco: [Number],
    valortotal: Number,
    meiopagamento: [String],
    valormeiopagamento: [Number]
}, {
    collection: 'vendas'
});
VendasBubbleSchema.plugin(timeZone, { paths: ['criado'] });

module.exports = mongoose.model('modelvendas', VendasBubbleSchema);