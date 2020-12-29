const express = require("express");
const cors = require("cors");
const consign = require("consign");
const bodyParser = require("body-parser");
const morgan = require("morgan");

module.exports = () => {
  const app = express();
  app.use(morgan("combined"));
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  consign().include("./controllers").into(app);

  return app;
};
