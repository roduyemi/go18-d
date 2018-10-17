const express = require('express');
const dotenv = require('dotenv');
const _ = require('lodash');
const fetch = require('node-fetch');

const { womenPioneers, quotes, videos } = require('./data')

dotenv.config();

const app = express();

app.use(express.json())

const port = 8080;

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next();
}

app.use(allowCrossDomain)

app.listen(port, () => console.log(`imposter listening on ${port}`));

app.post('/', (req, res) => {
  console.log('body', JSON.stringify(req.body));
  const data = {
    form: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code: req.query.code
    }};

  res.send(fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${_.sample(womenPioneers)}`)
    .then(res => res.json())
    .then(console.log))
});
