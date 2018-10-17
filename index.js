const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const _ = require('lodash');
const bodyParser = require('body-parser');

const { womenPioneers, quotes, videos, gifs } = require('./data')

dotenv.config();

const app = express();

// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 8080;

app.listen(port, () => console.log(`imposter listening on ${port}`));

app.post('/', (req, res) => {
  // console.log('body', req.body);
  const { text } = req.body;
  const data = {
    form: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code: req.query.code
    }
  };
  const slackResponse = {
    // "text": 'Hope you feel inspired!',
    "attachments": [
        {
            "fallback": "Required plain-text summary of the attachment.",
            "color": "#ff9999",
            "pre_text": 'Hope you feel inspired!',
            "author_name": "insposter",
            // "image_url": "https://cdn.dribbble.com/users/2050962/screenshots/4414477/dog.gif"
        }
    ]
  };  

  if (text === 'quotes') {
    // const slackResponse = {
    //   "text" : _.sample(quotes)['quote'],
    //   "author_name" : _.sample(quotes)['author']
    // }
    slackResponse.text = _.sample(quotes)['quote'];
    slackResponse.attachments[0].author_name = _.sample(quotes)['author'];
    res.send(slackResponse);
  } else if (text === 'videos') {
    slackResponse.text = _.sample(videos);
    res.send(slackResponse);
  } else if (text === 'gif') {
    slackResponse.attachments[0].image_url = 'https://cdn.dribbble.com/users/2050962/screenshots/4414477/dog.gif';
    res.send(slackResponse);
  } else {
    axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${_.sample(womenPioneers)}`)
    .then(response => {
      slackResponse.text = response.data[3][0];
      res.send(slackResponse);
    })
  }
});
