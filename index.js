const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();

app.use(express.json())

const port = 8080;

// const allowCrossDomain = (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
//   res.header('Access-Control-Allow-Headers', 'Content-Type')
//   next();
// }

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
    res.send('hi')
  // axios.post('https://slack.com/api/oauth.access', data, (error, response, body) => {
      
  //     if (!error) {
          
  //     console.log('response', JSON.stringify(response.body));
  //     let token = JSON.parse(body).access_token;
  //     let team = JSON.parse(body).team.domain;
  //     res.redirect('http://' +team+ '.slack.com');
  //     }
  // });
});
