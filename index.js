const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 8080;

app.listen(port, () => console.log(`imposter listening on ${port}`));

app.post('/', (req, res) => {
  console.log('body', req.body);
  const { text } = req.body;
  const data = {
    form: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code: req.query.code
    }};

  const slackResponse = {
    "attachments": [
        {
            "fallback": "Required plain-text summary of the attachment.",
            "color": "#36a64f",
            "pretext": "Hope you feel inspired!",
            "author_name": "insposter",
            "image_url": "https://www.telegraph.co.uk/content/dam/Pets/spark/pets-at-home-2017/fluffy-white-puppy.jpg?imwidth=450",
        }
    ]
  };
  res.send(slackResponse);
});
