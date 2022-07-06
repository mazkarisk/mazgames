const express = require('express');
const http = require('http');
const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.Server(app);

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/src/index.html')))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
