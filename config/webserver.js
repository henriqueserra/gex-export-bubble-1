module.exports = () => {
    // ===============================================
    // ===============================================
    //              Cria Servidor Web
    const customExpress = require('./express.js');
    const app = customExpress();
    app.listen(3000, () => console.log('servidor rodando na porta 3000'));
    // ===============================================
    // ===============================================
};