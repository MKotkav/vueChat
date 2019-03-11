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

  //Heroku tricks
  const server = express()
  .use((req, res) => res.sendFile(__dirname + '/public/index.html'))
  .listen(PORT, () => console.log(`Listening Socket on ${ PORT }`));
}
else {
  const server = express()
  .use(app)
  .listen(PORT, () => console.log(`Listening Socket on ${ PORT }`));
}


const io = socketIO(server);

routes(app);
controller.handleSocket(io);
