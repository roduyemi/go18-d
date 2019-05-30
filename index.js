const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const _ = require('lodash');
const bodyParser = require('body-parser');
const slackEventsAPI = require('@slack/events-api');
const { WebClient } = require('@slack/client');

const { womenPioneers, quote, video, gif } = require('./data')

dotenv.config();

const app = express();

// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 8080;

app.listen(port, () => console.log(`imposter listening on ${port}`));

// Initialize a Slack Event Adapter for easy use of the Events API
// See: https://github.com/slackapi/node-slack-events-api
const slackEvents = slackEventsAPI.createEventAdapter(process.env.SLACK_SIGNING_SECRET);

// Initialize a Web Client
const slack = new WebClient(process.env.SLACK_CLIENT_ID);

// Handle the event from the Slack Events API
slackEvents.on('link_shared', (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
  // Call a helper that transforms the URL into a promise for an attachment suitable for Slack
  Promise.all(event.links.map(messageAttachmentFromLink))
    // Transform the array of attachments to an unfurls object keyed by URL
    .then(attachments => keyBy(attachments, 'url'))
    .then(unfurls => mapValues(unfurls, attachment => omit(attachment, 'url')))
    // Invoke the Slack Web API to append the attachment
    .then(unfurls => slack.chat.unfurl(event.message_ts, event.channel, unfurls))
    .catch(console.error);
});

app.use('/slack/events', slackEvents.expressMiddleware());

// app.post('/slack/events', (req, res) => {
//   const { challenge } = req.body;
//   res.send(challenge);
//   console.log(req.body)
// });

app.post('/', (req, res) => {
  const { text } = req.body;
  const data = {
    form: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code: req.query.code
    }
  };
  
  const slackResponse = {
    "unfurl_links": true,
    "unfurl_media": true,
    "attachments": [
        {
            "fallback": "Required plain-text summary of the attachment.",
            "color": "#ff9999",
            "pre_text": 'Hope you feel inspired!',
            "author_name": "💖 insposter",
        }
    ]
  };  

  if (text === 'quote') {
    slackResponse.text = _.sample(quote)['quote'];
    slackResponse.attachments[0].author_name = _.sample(quote)['author'];
    res.send(slackResponse);
  } else if (text === 'video') {
    slackResponse.text = _.sample(video);
    res.send(slackResponse);
  } else if (text === 'gif') {
    slackResponse.attachments[0].image_url = _.sample(gif);
    res.send(slackResponse);
  } else {
    axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${_.sample(womenPioneers)}`)
    .then(response => {
      slackResponse.text = response.data[3][0];
      res.send(slackResponse);
    })
    .catch(err => {
      console.log(err);
    });
  }
});
