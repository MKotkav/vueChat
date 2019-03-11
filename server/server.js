const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const http  = require('http').Server(app);
const PORT = 8000;
const routes = require('./routes/routes');
const controller = require('./routes/controllers/restController');

app.use(bodyParser.json());
app.use(cors());

const socketIO = require('socket.io');

if(process.env.NODE_ENV === 'production'){
  //Static folder
  app.use(express.static(__dirname + '/public/'));

  //Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));

}

const server = express()
.use(app)
.listen(PORT, () => console.log(`Listening Socket on ${ PORT }`));

const io = socketIO(server);

routes(app);
controller.handleSocket(io);
