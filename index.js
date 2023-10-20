require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(express.json());

// Route for creating a short URL
const createNewUrl = require('./myApp.js').createNewUrl;
app.post('/api/shorturl', async (req, res) => {
  const url = req.body.url;
  console.log(url);
  let newUrl = createNewUrl(url);

  newUrl.then(function (newUrl) {
    console.log(newUrl);
    res.send(newUrl);
  });
});

// Route for redirecting to the original URL
const redirectToOriginal = require('./myApp.js').redirectToOriginal;
app.get('/api/shorturl/:short_url?', async (req, res) => {
  const shorturl = req.params.short_url;
  const search = redirectToOriginal(shorturl);
  if (search.body === Error) {
    search.then(function (search) {
      console.log(search);
      res.send(search);
    });
  } else {
    search.then(function (search) {
      res.redirect(search);
    });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
