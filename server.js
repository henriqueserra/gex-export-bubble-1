require('dotenv/config');

// Declaração de variáveis globais
global.golbalCNPJ = process.env.ESTABELECIMENTO_CNPJ;
global.globalUSUARIO = process.env.BUBBLE_USUARIO;
global.globalESTABELECIMENTO ={};
global.globalVENDAVEIS=[];
global.globalMEIOSDEPAGAMENTO=[];
global.globalRESULTADOATUALIZA=[];
global.globalIDNOTAFISCAL='';


// ===============================================
//              Abre conexão com o Banco de Dados
const connectDB = require('./config/database');
connectDB();
// ===============================================


