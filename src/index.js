// Imports
const axios = require('axios').default;
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

// Library inits
const app = express();
app.use(express.json());
app.use(cors());

https.createServer({
  key: fs.readFileSync('./privkey.pem'),
  cert: fs.readFileSync('./cert.pem'),
}, app);

// variable inits
const uri = 'https://www.fireeye.com/content/dam/legacy/cyber-map/weekly_sanitized.min.js';
let data;

// download data
async function getData() {
  await axios.get(uri)
    .then((req) => {
      let idCounter = 0;
      const attacks = [];
      req.data.attacks.forEach((element) => {
        const tmpObj = element;
        tmpObj.id = idCounter;
        idCounter += 1;
        attacks.push(tmpObj);
        data = attacks;
      });
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

app.get('/countrys', async (req, res) => {
  let countrys = [];

  data.forEach((attack) => {
    countrys.push(attack.OriginCode);
    countrys.push(attack.Destination);
  });

  countrys = countrys.map((country) => country);
  countrys = countrys.filter((a, b) => countrys.indexOf(a) === b);
  countrys = countrys.sort();

  const output = { countrys };

  res.status(200).send(output);
});

// Server starten
app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('\n[INFO]: Example app listening on port 3000!\n');
});
