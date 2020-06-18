// Imports
const axios = require('axios').default;
const express = require('express');
const cors = require('cors');

// Library inits
const app = express();
app.use(express.json());
app.use(cors());

// variable inits
const uri = 'https://www.fireeye.com/content/dam/legacy/cyber-map/weekly_sanitized.min.js';
let data;

// download data
async function getData() {
  await axios.get(uri)
    .then((req) => {
      data = req.data;
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log('[ERROR]: Error with downloading data:');
      // eslint-disable-next-line no-console
      console.log(`[ERROR]: ${err}`);
    });
}
getData();
setInterval(getData, 1000000);

// webserver endpoints
app.get('/', async (req, res) => {
  res.status(200).send(data);
});

// Server starten
app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('\n[INFO]: Example app listening on port 3000!\n');
});
