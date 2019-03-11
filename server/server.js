const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const routes = require('./routes/routes');
const controller = require('./routes/controllers/restController');
const socketIO = require('socket.io');

app.use(bodyParser.json());
app.use(cors());


const PORT = process.env.PORT || 8000;

if(process.env.NODE_ENV === 'production'){
  //Static folder
  app.use(express.static(__dirname + '/public/'));
  
  //Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const server = express()
.use(app)
.listen(PORT, () => console.log(`Listening Socket on ${ PORT }`));

routes(app);
const io = socketIO(server);
controller.handleSocket(io);

