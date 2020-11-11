module.exports = app => {
    app.get('/', (req, res) => res.send(`tudo ok !`));
    app.post('/', (req, res) => {
        res.status(200).json(req.body);
        console.log(req.body);
    });

};