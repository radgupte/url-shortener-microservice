require('dotenv').config();
let express = require('express');
let app = express();
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
const shortid = require('shortid');

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

let URL;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'Connection error: '));
connection.once('open', () => {
  console.log('Successfully establishd connction with MongoDB database');
});

const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
  },
});
URL = mongoose.model('URL', urlSchema);

const urlregex =
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

const createNewUrl = async (url) => {
  const urlCode = shortid.generate(url);

  if (!urlregex.test(url)) {
    return { error: 'invalid url' };
  } else {
    try {
      let existing = await URL.findOne({
        original_url: url,
      });

      if (existing) {
        return {
          original_url: existing.original_url,
          short_url: existing.short_url,
        };
      } else {
        const new_url = new URL({
          original_url: url,
          short_url: urlCode,
        });
        await new_url.save();
        return {
          original_url: new_url.original_url,
          short_url: new_url.short_url,
        };
      }
    } catch (err) {
      return { error: 'Bad Request' };
    }
  }
};

exports.URLModel = URL;
exports.createNewUrl = createNewUrl;
