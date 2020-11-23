const moment = require('moment');
// const momenttz = require('moment-timezone');
const ExportVisao = require('../models/model.exportavisao');
const VendasBubble = require('../models/model.vendasbubble');
const axios = require('axios');
const { json } = require('body-parser');
const biblioteca = require('../biblioteca');
const crud = require('../crud');



module.exports = app => {
    app.get('/', async (req, res) => {  
        res.json(globalVENDAVEIS);
    });


};