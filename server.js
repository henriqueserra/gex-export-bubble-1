require('dotenv/config');

// Declaração de variáveis globais
global.golbalCNPJ = process.env.ESTABELECIMENTO_CNPJ;
global.globalESTABELECIMENTO ='';
global.globalVENDAVEIS=[];


// ===============================================
//              Abre conexão com o Banco de Dados
const connectDB = require('./config/database');
connectDB();
// ===============================================