const express = require('express');
const cors = require('cors');
const consign = require('consign');
const bodyParser = require('body-parser');

module.exports = () => {
    const app = express()
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    consign()
        .include('./controllers')
        .into(app)

    return app;
};