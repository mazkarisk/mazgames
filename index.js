const express = require('express');
const http = require('http');
const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.Server(app);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html');
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
