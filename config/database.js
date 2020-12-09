const mongoose = require('mongoose');


// ==========================================================
// Conexão com o Banco de Dados
// ==========================================================

mongoose.connection.on('error', err => {
    console.log('Erro capturado pelo connection.om => ' + err);
});
mongoose.connection.on('connecting', function() {
    console.log("Tentando espabelecer conexão com o Banco de Dados");
});
mongoose.connection.on('connected', function() {
    console.log("Conexão com o Banco de Dados estabalecida");
    // ================== Inicializa Web Server =====================
    const webServer = require('./webserver');
    webServer();
    // ==============================================================
});
mongoose.connection.on('disconnected', function() {
    console.log("Desconectado do Banco de Dados");
});

const connectDB = async() => {
    try {
        const URI = 'mongodb+srv://henrique:hrs830478@gex-db-cluster.zuow6.mongodb.net/api?authSource=admin&replicaSet=Gex-DB-Cluster-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
        await mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true });
    } catch (error) {
        console.log('=====================================');
        console.log('           Erro ao conectar com o Banco ' + error);
        console.log('=====================================');
    }
};


module.exports = connectDB;