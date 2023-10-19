require('dotenv').config();
let mongoose = require('mongoose');

let URL;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
